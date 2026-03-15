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
                emitter
                .to(userId)
                .emit("job-status", {jobId: job.id, status: "INGESTING_AND_VERIFYING", errorMessage: null});

                await listingService.updateProcessingStatus({
                    currentStatus: "INGESTING_AND_VERIFYING",
                    jobId,
                });

                const postData = await scraperSerivce.fetchInstagramReel(url);
                const result = await aiService.analyzeVideoContent({
                    s3Key: postData.s3Key,
                    title: postData.title,
                    description: postData.description,
                    productType,
                });

                if (result.isRejected) {
                    await redis.decr(`user:${userId}:active-jobs`);
                    const errorMessage = result.response.join("\n");
                    await listingService.updateProcessingStatus({
                        currentStatus: jobStatus,
                        jobId,
                        errorMessage,
                    });
                    emitter.to(userId).emit("job-status", {jobId, status: "REJECTED", errorMessage});
                } else {
                    await listingService.updateProcessingStatus({
                        currentStatus: "QUEUED",
                        jobId,
                    });
                    emitter.to(userId).emit("job-status", {jobId, status: "QUEUED", errorMessage:""});
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
                }
                console.log("[STATUS]: Ingestion Job Completed");
            } catch (err) {
                await redis.decr(`user:${userId}:active-jobs`);
                await listingService.updateProcessingStatus({
                    currentStatus: "FAILED",
                    jobId: job.id,
                    errorMessage: err.customMessage || "Something went wrong",
                });

                emitter.to(job.data.userId).emit("job-status", {
                    jobId: job.id,
                    status: "FAILED",
                    errorMessage: err.customMessage || "Something went wrong",
                });

                console.log(`[INGESTION WORKER] Job ${job.id} failed:`, err.customMessage);
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
