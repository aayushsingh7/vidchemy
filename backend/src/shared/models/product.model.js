import {Schema, model} from "mongoose";

const productSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User Id is Required"],
        },
        s3FileKey: {
            type: String,
            required:[true, "S3 File Key is Required"]
        },
        cdnUrl:{
            type:String,
            required:[true, "CDN Url is Required"]
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        bulletPoints: [
            {
                type: String,
            },
        ],
        searchTerms: [
            {
                type: String,
            },
        ], // Backend search keywords the AI identified
        suggestedCategory: {
            type: String,
        }, // e.g., Home & Kitchen
        attributes: {
            brand: {type: String}, 
            color: {type: String}, // Primary colors detected
            material: {type: String}, // Inferred material (e.g., "Plastic", "Stainless Steel")
            targetAudience: {type: String}, // e.g., "Men", "Women", "Unisex", "Kids"
            estimatedPriceINR: {type: Number}, // AI suggested price point for the Indian market
        },
        media: {
            mainImageUrl: {
                type: String,
            },
            alternateImageUrls: [
                {
                    type: String,
                },
            ],
        },
        processingStatus: {
            type: String,
            enum: ["pending", "queued", "processing", "completed", "failed"],
            default: "pending",
        },
        jobId: {
            type: String,
            index: true,
            required:[true, "Job Id is Required"]
        },
        errorMessage: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Product = model("Product", productSchema);

export default Product;
