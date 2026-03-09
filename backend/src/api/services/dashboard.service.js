import Listing from "../../shared/models/listing.model.js";
import CustomError from "../../shared/utils/custom-error.util.js";

class DashboardService {
    async getDashboardOverview(userId) {
        if (!userId) throw new CustomError("User id is required", 400);

        const [recentListings, completed, failed, rejected, activeJobs] = await Promise.all([
            Listing.find({guestId: userId, processingStatus:"COMPLETED"}).sort({createdAt: -1}).limit(5),
            Listing.countDocuments({guestId: userId, processingStatus: "COMPLETED"}),
            Listing.countDocuments({guestId: userId, processingStatus: "FAILED"}),
            Listing.countDocuments({guestId: userId, processingStatus: "REJECTED"}),
            Listing.find({
                guestId: userId,
                processingStatus: {$nin: ["COMPLETED", "REJECTED", "FAILED"]},
            }).select("sourceUrl createdAt processingStatus jobId"),
        ]);

        return {recentListings, activeJobs, completed, failed, rejected};
    }
}

export default DashboardService;
