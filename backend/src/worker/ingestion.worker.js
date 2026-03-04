import dotenv from "dotenv";
dotenv.config();
import {Worker} from "bullmq";
import redis from "../shared/config/redis.config.js";

const worker = new Worker(
    "ingestion-queue",
    async (job) => {
        if (job.name === "ingest-job") {
            console.log("[STARTED INGESTION JOB]");
            const {url} = job.data;
            console.log({url})
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

worker.on("failed", (job, err) => {
    console.log(`[INGESTION WORKER] Job ${job.id} failed:`, err);
});
