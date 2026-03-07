import dotenv from "dotenv";
dotenv.config();
import {Worker} from "bullmq";
import redis from "../shared/config/redis.config.js";
import {Emitter} from "@socket.io/redis-emitter";
import AWSService from "../shared/services/aws.service.js";
import AIService from "./services/ai.service.js";
import FfmpegService from "./services/ffmpeg.service.js";
import formatLabels from "./utils/label-formatter.util.js";
import ScraperService from "./services/scraper.service.js";
import ListingService from "../shared/services/listing.service.js";

const emitter = new Emitter(redis);
const awsService = new AWSService();
const aiService = new AIService(awsService);
const ffmpegService = new FfmpegService(awsService);
const scraperSerivce = new ScraperService(awsService);
const listingService = new ListingService();

const worker = new Worker(
    "processing-queue",
    async (job) => {
        if (job.name === "process-video") {
            console.log("[STARTED PROCESSING JOB]");
            const {s3Key, userId, primarySourceUrl, videoAnalysisResult, postMetadata} = job.data;
            const jobId = job.id;

            try {
                emitter.to(userId).emit("job-status", {jobId, status: "INGESTING_AND_VERIFYING", errorMessage: ""});
                await listingService.updateProcessingStatus({
                    currentStatus: "PROCESSING",
                    jobId,
                });

                const videoTranscription = await aiService.transcribeS3Video({
                    bucketName: process.env.AWS_S3_BUCKET_NAME,
                    s3Key,
                });

                const productName = videoAnalysisResult.brand + " " + videoAnalysisResult.productModel;

                const additionalContext = {
                    title: postMetadata.title,
                    description: postMetadata.description,
                    transcription: videoTranscription,
                };

                const p1 = aiService.researchProductDetails({
                    productName,
                    website: primarySourceUrl,
                    additionalContext,
                });
                const p2 = scraperSerivce.searchAmazonProducts({query: videoAnalysisResult.productLabel});
                const p3 = ffmpegService.extractProductFramesBatched({
                    s3Key,
                    frameData: videoAnalysisResult.topProductMoments,
                    batchSize: 3,
                });
                const [researchResponse, amazonSearchResponse, ffmpegResponse] = await Promise.all([p1, p2, p3]);

                const productDetails = await scraperSerivce.fetchAmazonProductBatched({
                    searchResults: amazonSearchResponse.slice(0, 3), // top 3 products
                    batchSize: 3,
                });

                const listingGenerationPromise = aiService.draftOptimizedListing({
                    originalProduct: researchResponse,
                    referenceProducts: productDetails,
                });

                const backgroundRemovalPromise = aiService.backgroundRemoval(ffmpegResponse);

                emitter.to(userId).emit("job-status", {jobId, status: "FINALIZING", errorMessage: ""});
                await listingService.updateProcessingStatus({
                    currentStatus: "FINALIZING",
                    jobId,
                });

                const [listingGenerationResponse, backgroundRemovalResponse] = await Promise.all([
                    listingGenerationPromise,
                    backgroundRemovalPromise,
                ]);

                const listing = await listingService.updateListingById({
                    jobId,
                    updatedData: {
                        ...listingGenerationResponse,
                        processingStatus: "COMPLETED",
                        medias: backgroundRemovalResponse,
                    },
                });
                emitter.to(userId).emit("job-status", {jobId, status: "COMPLETED", errorMessage: "", data: listing});
            } catch (err) {
                await listingService.updateProcessingStatus({
                    currentStatus: "FAILED",
                    jobId: job.id,
                    errorMessage: "Something Went Wrong",
                });

                emitter
                .to(job.data.userId)
                .emit("job-status", {jobId: job.id, status: "FAILED", errorMessage: "Something Went Wrong"});

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
    console.log("[PROCESSING WORKER] worker is ready ✅");
});

worker.on("completed", (job) => {
    console.log(`[PROCESSING WORKER] Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.log(`[PROCESSING WORKER] Job ${job.id} failed:`, err);
});
