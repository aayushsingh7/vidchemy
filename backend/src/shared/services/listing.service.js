import Listing from "../models/listing.model.js";
import CustomError from "../utils/custom-error.util.js";

class ListingService {
    async getListingStatus({id, jobId}) {
        const params = id ? {_id: id} : {jobId};
        const data=  await Listing.findOne(params).select("processingStatus")
        if(!data) return null;
        return data.processingStatus;
    }

    async getListingById(id) {
        const listing = await Listing.findById(id).lean();
        if (!listing) throw new CustomError("Listing not found", 404);
        return listing;
    }

    async getListings({userId, offset = 0, limit = 15}) {
        if (!userId) throw new CustomError("User id is required");

        const [listings, listingCnt] = await Promise.all([
            Listing.find({guestId: userId, processingStatus: "COMPLETED"})
            .select(
                "_id title medias description attributes.estimatedOriginalPriceINR attributes.estimatedPriceINR attributes.estimatedDiscountPercent"
            )
            .skip(offset)
            .limit(limit)
            .sort({createdAt: -1}),

            Listing.countDocuments({guestId: userId}),
        ]);

        return {
            listings,
            isMore: listingCnt - offset > limit,
            totalProductCnt: listingCnt,
        };
    }

    async updateListingById({id, jobId, updatedData}) {
        const params = id ? {_id: id} : {jobId};
        if (!updatedData) throw new CustomError("Id and Data are required", 400);
        const updatedDocument = await Listing.findOneAndUpdate(params, {$set: updatedData}, {returnDocument: "after"});
        if (!updatedDocument) throw new CustomError("Product not found", 404);
        return updatedDocument;
    }

    async createListing(data) {
        if (!data) throw new CustomError("Product data is required", 400);
        const listing = new Listing(data);
        await listing.save();

        const obj = listing.toObject();
        return {
            guestId: obj.guestId,
            sourceUrl: obj.sourceUrl,
            processingStatus: obj.processingStatus,
            jobId: obj.jobId,
            _id: obj._id,
        };
    }

    async updateProcessingStatus({id, jobId, currentStatus, errorMessage}) {
        const params = id ? {_id: id} : {jobId};
        if (!currentStatus) throw new CustomError("Id and status are required", 400);
        const updateFields = {processingStatus: currentStatus};
        if (errorMessage) updateFields.errorMessage = errorMessage;
        const updatedDocument = await Listing.findOneAndUpdate(params, {$set: updateFields}, {returnDocument: "after"});
        if (!updatedDocument) throw new CustomError("Product not found", 404);
        return updatedDocument;
    }

    async deleteListing(id) {
        const delListing = await Listing.deleteOne({_id: id});
        if (delListing.deletedCount == 0) throw new CustomError("Product not found", 404);
    }
}

export default ListingService;
