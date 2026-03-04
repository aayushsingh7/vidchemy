import { Queue } from "bullmq";
import redis from "./redis.config.js";

const processingQueue = new Queue("processing-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: true,
    removeOnFail: false,
  },
});

const ingestionQueue = new Queue("ingestion-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export { processingQueue, ingestionQueue };