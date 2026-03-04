import dotenv from "dotenv";
dotenv.config();
import { Worker } from "bullmq";
import redis from "../shared/config/redis.config.js";

const worker = new Worker(
    "processing-queue",
    async (job) => {
        if (job.name === "process-video") {
            console.log("[STARTED PROCESSING JOB]");
            const {fileKey, bucketName} = job.data;
            console.log({fileKey, bucketName});
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
