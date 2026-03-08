import dotenv from "dotenv";
dotenv.config();
import {Worker} from "bullmq";
import redis from "../shared/config/redis.config.js";
import {Emitter} from "@socket.io/redis-emitter";
import AWSService from "../shared/services/aws.service.js";
import AIService from "./services/ai.service.js";
import FfmpegService from "./services/ffmpeg.service.js";
import ScraperService from "./services/scraper.service.js";
import ListingService from "../shared/services/listing.service.js";
import path from "path";
import {fileURLToPath} from "url";
import fs from "fs";
import connectMongo from "../shared/config/mongo.config.js";

connectMongo();
const emitter = new Emitter(redis);
const awsService = new AWSService();
const aiService = new AIService(awsService);
const ffmpegService = new FfmpegService(awsService);
const scraperService = new ScraperService(awsService);
const listingService = new ListingService();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, "process-worker-output");
fs.mkdirSync(dir, {recursive: true});

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

                console.log("[STATUS]: Start Video Transcribing...");
                const videoTranscription = await aiService.transcribeS3Video({
                    bucketName: process.env.AWS_S3_BUCKET_NAME,
                    s3Key,
                });

                console.log("[STATUS]: Transcribed video successfully");
                fs.writeFileSync(path.join(dir, "transcribe.json"), JSON.stringify(videoTranscription, null, 2));

                const productName = videoAnalysisResult.brand + " " + videoAnalysisResult.productModel;

                const additionalContext = {
                    title: postMetadata.title,
                    description: postMetadata.description,
                    transcription: videoTranscription,
                };

                console.log("[STATUS]: Starting the main pipeline [PART 1]...");
                const p1 = aiService.researchProductDetails({
                    productName,
                    website: primarySourceUrl,
                    additionalContext,
                });
                const p2 = scraperService.searchAmazonProducts({query: videoAnalysisResult.productLabel});
                const p3 = ffmpegService.extractProductFramesBatched({
                    s3Key,
                    frameData: videoAnalysisResult.topProductMoments,
                    batchSize: 3,
                });
                const [researchResponse, amazonSearchResponse, ffmpegResponse] = await Promise.all([p1, p2, p3]);

                fs.writeFileSync(path.join(dir, "research.json"), researchResponse);
                fs.writeFileSync(path.join(dir, "amazonSearch.json"), JSON.stringify(amazonSearchResponse, null, 2));
                fs.writeFileSync(path.join(dir, "ffmpegResponse.json"), JSON.stringify(ffmpegResponse, null, 2));

                console.log("[STATUS]: Main Pipeline [PART 1] Executed successfully", {
                    researchResponse,
                    amazonSearchResponse,
                    ffmpegResponse,
                });
                console.log("[STATUS]: Started Scraping Detailed Product Data...");
                const productDetails = await scraperService.fetchAmazonProducts({
                    searchResults: amazonSearchResponse.slice(0, 3), // top 3 products
                });

                fs.writeFileSync(path.join(dir, "productDetails.json"), JSON.stringify(productDetails, null, 2));
                console.log("[STATUS]: Scraped top 3 products data successfully", productDetails);

                const listingGenerationPromise = aiService.draftOptimizedListing({
                    originalProduct: JSON.parse(researchResponse),
                    referenceProducts: productDetails,
                });

                const backgroundRemovalPromise = aiService.backgroundRemoval(ffmpegResponse.filter(Boolean));

                emitter.to(userId).emit("job-status", {jobId, status: "FINALIZING", errorMessage: ""});
                await listingService.updateProcessingStatus({
                    currentStatus: "FINALIZING",
                    jobId,
                });

                console.log("[STATUS]: Starting main pipeline [PART 2]");
                const [listingGenerationResponse, backgroundRemovalResponse] = await Promise.all([
                    listingGenerationPromise,
                    backgroundRemovalPromise,
                ]);

                fs.writeFileSync(
                    path.join(dir, "backgroundRemoval.json"),
                    JSON.stringify(backgroundRemovalResponse, null, 2)
                );

                console.log("[STATUS]: Main pipeline [PART 2] executed successfully");
                console.log("[STATUS]: Saving The generated listing into the DB");
                const listing = await listingService.updateListingById({
                    jobId,
                    updatedData: {
                        ...listingGenerationResponse,
                        processingStatus: "COMPLETED",
                        medias: backgroundRemovalResponse,
                    },
                });
                emitter.to(userId).emit("job-status", {jobId, status: "COMPLETED", errorMessage: "", data: listing});
                fs.writeFileSync(path.join(dir, "FINAL.json"), JSON.stringify(listing, null, 2));
                console.log("[STATUS]: Listing Saved Successfully [JOB COMPLETED]", {listing});
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
