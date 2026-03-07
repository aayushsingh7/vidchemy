import {Schema, model} from "mongoose";

const listingSchema = new Schema(
    {
        guestId: {type: String, required: true, index: true},
        sourceUrl: {type: String, required: [true, "Source url is required"]},
        s3FileKey: {type: String},
        cdnUrl: {type: String},
        title: {type: String},
        description: {type: String},
        bulletPoints: [{type: String}],
        searchTerms: [{type: String}],
        suggestedCategory: {type: String},
        specifications: [
            {
                key: {type: String},
                value: {type: String},
            },
        ],
        attributes: {
            brand: {type: String},
            color: {type: String},
            material: {type: String},
            targetAudience: {type: String},
            estimatedOriginalPriceINR: {type: Number},
            estimatedPriceINR: {type: Number},
            estimatedDiscountPercent: {type: Number},
        },
        medias: [{type: String}],
        processingStatus: {
            type: String,
            enum: [
                "PENDING",
                "INGESTING_AND_VERIFYING",
                "QUEUED",
                "PROCESSING",
                "FINALIZING",
                "COMPLETED",
                "FAILED",
                "REJECTED",
            ],
            default: "PENDING",
        },
        jobId: {type: String, index: true, required: [true, "Job Id is Required"]},
        errorMessage: {type: String},
    },
    {timestamps: true}
);

const Listing = model("Listing", listingSchema);

export default Listing;
