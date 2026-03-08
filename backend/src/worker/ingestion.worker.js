import dotenv from "dotenv";
dotenv.config();
import {Worker} from "bullmq";
import redis from "../shared/config/redis.config.js";
import AIService from "./services/ai.service.js";
import AWSService from "../shared/services/aws.service.js";
import ScraperService from "./services/scraper.service.js";
import {Emitter} from "@socket.io/redis-emitter";
import ListingService from "../shared/services/listing.service.js";
import {processingQueue} from "../shared/config/queue.config.js";
import connectMongo from "../shared/config/mongo.config.js";

connectMongo();
const emitter = new Emitter(redis);
const awsService = new AWSService();
const listingService = new ListingService();
const scraperSerivce = new ScraperService(awsService);
const aiService = new AIService(awsService);

const worker = new Worker(
    "ingestion-queue",
    async (job) => {
        if (job.name === "ingest-job") {
            console.log("[STARTED INGESTION JOB]");
            const {url, productType, userId, primarySourceUrl} = job.data;
            let jobId = job.id;
            try {
                await listingService.updateProcessingStatus({
                    currentStatus: "INGESTING_AND_VERIFYING",
                    jobId,
                });

                // setTimeout(()=> {
                //     emitter.to(userId).emit("job-status", {jobId, status: "REJECTED", errorMessage: "NFSW Content detected."});

                // }, 5000)
                // return;
                const postData = await scraperSerivce.fetchInstagramReel(url);
                const result = await aiService.analyzeVideoContent({
                    s3Key: postData.s3Key,
                    title: postData.title,
                    description: postData.description,
                    productType,
                });

                let jobStatus = "QUEUED",
                    errorMessage = "";
                if (result.isRejected) {
                    await redis.decr(`user:${userId}:active-jobs`);
                    jobStatus = "REJECTED";
                    errorMessage = result.response.join("\n");
                    await listingService.updateProcessingStatus({
                        currentStatus: jobStatus,
                        jobId,
                        errorMessage: result.reasons.join("\n"),
                    });
                } else {
                    await processingQueue.add(
                        "process-video",
                        {
                            s3Key: postData.s3Key,
                            userId,
                            primarySourceUrl,
                            videoAnalysisResult: result,
                            postMetadata: postData,
                        },
                        {jobId}
                    );
                    await listingService.updateProcessingStatus({
                        currentStatus: jobStatus,
                        jobId,
                    });
                }
                emitter.to(userId).emit("job-status", {jobId, status: jobStatus, errorMessage});
                console.log("[STATUS]: Ingestion Job Completed", {
                    s3Key: postData.s3Key,
                    userId,
                    primarySourceUrl,
                    videoAnalysisResult: result,
                    postMetadata: postData,
                });
            } catch (err) {
                await listingService.updateProcessingStatus({
                    currentStatus: "FAILED",
                    jobId: job.id,
                    errorMessage: "Something Went Wrong",
                });

                emitter
                .to(job.data.userId)
                .emit("job-status", {jobId: job.id, status: "FAILED", errorMessage: "Something Went Wrong"});
                await redis.decr(`user:${userId}:active-jobs`);

                console.log(`[INGESTION WORKER] Job ${job.id} failed:`, err);
            }
        }
    },
    {
        connection: redis,
        concurrency: 5,
    }
);

worker.on("ready", () => {
    console.log("[INGESTION WORKER] worker is ready ✅");
});

worker.on("completed", (job) => {
    console.log(`[INGESTION WORKER] Job ${job.id} completed`);
});
