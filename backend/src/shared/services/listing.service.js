import Listing from "../models/listing.model.js";
import CustomError from "../utils/custom-error.util.js";

class ListingService {
    async getListingById(id) {
        const listing = await Listing.findById(id).lean();
        if (!listing) throw new CustomError("Listing not found", 404);
        return listing;
    }

    async getListings({userId, offset = 0}) {
        if (!userId) throw new CustomError("User id is required");

        const [listings, listingCnt] = await Promise.all([
            Listing.find({guestId: userId}).skip(offset).limit(15),
            Listing.countDocuments({guestId: userId}),
        ]);

        return {
            listings,
            isMore: listingCnt - offset > 15,
            totalProductCnt: listingCnt,
        };
    }

    async updateListingById({id, jobId, updatedData}) {
        const params = id ? {_id: id} : {jobId};
        if (!updatedData) throw new CustomError("Id and Data are required", 400);
        const update = await Listing.updateOne(params, {$set: updatedData});
        if (update.matchedCount === 0) throw new CustomError("Product not found", 404);
        if (!update.acknowledged) throw new CustomError("Update failed, try again later", 500);
    }

    async createListing(data) {
        if (!data) throw new CustomError("Product data is required", 400);
        const listing = new Listing(data);
        await listing.save();
        return listing;
    }

    async updateProcessingStatus({id, jobId, currentStatus, errorMessage}) {
        const params = id ? {_id: id} : {jobId};
        if (!currentStatus) throw new CustomError("Id and status are required", 400);
        const updateFields = {processingStatus: currentStatus};
        if (errorMessage) updateFields.errorMessage = errorMessage;
        const update = await Listing.findOneAndUpdate(params, {$set: updateFields}, {new: true});
        if (!update) throw new CustomError("Product not found", 404);
        return update;
    }

    async deleteListing(id) {
        const delListing = await Listing.deleteOne({_id: id});
        if (delListing.deletedCount == 0) throw new CustomError("Product not found", 404);
    }
}

export default ListingService;
