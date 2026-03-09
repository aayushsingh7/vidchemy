import {ingestionQueue} from "../../shared/config/queue.config.js";
import redis from "../../shared/config/redis.config.js";
import CustomError from "../../shared/utils/custom-error.util.js";
import {randomUUID} from "crypto";

class IngestionService {
    #listingService;
    constructor(listingService) {
        this.#listingService = listingService;
    }

    async addIngestionJob({url, productType, userId, primarySourceUrl}) {
        if (!url || !productType || !userId) throw new CustomError("Url, product type and user id is required", 400);
        if (!/^https:\/\/(www\.)?instagram\.com\/reel\//.test(url)) {
            throw new CustomError("Only instagram reels are supported", 400);
        }
        try {
            const activeJobCount = parseInt((await redis.get(`user:${userId}:active-jobs`)) || "0");
            if (activeJobCount === 2) throw new CustomError("Only 2 concurrent processes are allowed, try again later");
            await redis.incr(`user:${userId}:active-jobs`);

            const jobId = randomUUID();
            const newListing = await this.#listingService.createListing({
                guestId: userId,
                sourceUrl: url,
                processingStatus: "PENDING",
                jobId,
            });
            const job = await ingestionQueue.add(
                "ingest-job",
                {
                    url,
                    productType,
                    userId,
                    primarySourceUrl: primarySourceUrl || null,
                },
                {jobId}
            );
            console.log("new job added", job.id);

            return newListing;
        } catch (err) {
            throw err;
        }
    }
}

export default IngestionService;
