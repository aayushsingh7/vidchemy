import {ingestionQueue} from "../../shared/config/queue.config.js";
import CustomError from "../../shared/utils/custom-error.util.js";

class IngestionService {
    #listingService;
    constructor(listingService) {
        this.#listingService = listingService;
    }

    async addIngestionJob(url) {
        if (!url) throw new CustomError("Url is required", 400);
        try {
            const job = await ingestionQueue.add("ingest-job", {url});
            const newListing = await this.#listingService.createListing({
                user: "",
                sourceUrl: url,
                processingStatus: "pending",
                jobId: job.id,
            });

            return newListing;
        } catch (err) {
            throw err;
        }
    }
}

export default IngestionService;
