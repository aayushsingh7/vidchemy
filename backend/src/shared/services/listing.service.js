import Listing from "../models/listing.model.js";
import CustomError from "../utils/custom-error.util.js";

class ListingService {
    async getListingById(id) {
        const listing = await Listing.findById(id).lean();
        if (!listing) throw new CustomError("Listing not found", 404);
        return listing;
    }

    async getListings(userId, offset = 0) {
        if (!userId) throw new CustomError("User id is required");

        const [listings, listingCnt] = await Promise.all([
            Listing.find({user: userId}).skip(offset).limit(15),
            Listing.countDocuments({user: userId}),
        ]);

        return {
            listings,
            isMore: listingCnt - offset > 15,
            totalProductCnt: listingCnt,
        };
    }

    async updateListingById(id, updatedData) {
        if (!updatedData) throw new CustomError("Id and Data are required", 400);
        const update = await Listing.updateOne({_id: id}, {$set: updatedData});
        if (update.matchedCount === 0) throw new CustomError("Product not found", 404);
        if (!update.acknowledged) throw new CustomError("Update failed, try again later", 500);
    }

    async createListing(data) {
        if (!data) throw new CustomError("Product data is required", 400);
        const listing = new Listing(data);
        await listing.save();
        return listing;
    }

    async updateProcessingStatus(id, currentStatus) {
        if (!currentStatus) throw new CustomError("Id and status are required", 400);
        const update = await Listing.updateOne({_id: id}, {$set: {processingStatus: currentStatus}});
        if (update.matchedCount === 0) throw new CustomError("Product not found", 404);
        if (!update.acknowledged) throw new CustomError("Update failed, try again later", 500);
    }

    async deleteListing(id) {
        const delListing = await Listing.deleteOne({_id: id});
        if (delListing.deletedCount == 0) throw new CustomError("Product not found", 404);
    }
}

export default ListingService;
