import {ingestionQueue} from "../../shared/config/queue.config.js";
import CustomError from "../../shared/utils/custom-error.util.js";
import {randomUUID} from "crypto";

class IngestionService {
    #listingService;
    constructor(listingService) {
        this.#listingService = listingService;
    }

    async addIngestionJob({url, productType, userId, primarySourceUrl}) {
        if (!url || !productType || !userId) throw new CustomError("Url, product type and user id is required", 400);
        if (!url.startsWith("https://www.instagram.com"))
            throw new CustomError("Only instagram post url are supported", 400);
        try {
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
