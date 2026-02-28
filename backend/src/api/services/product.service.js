import Product from "../../shared/models/product.model.js";
import CustomError from "../../shared/utils/custom-error.util.js";

class ProductService {
    async getProductById(id) {
        const product = await Product.findById(id).lean();
        if (!product) throw new CustomError("Product not found", 404);
        return product;
    }

    async getProducts(userId, offset = 0) {
        if (!userId) throw new CustomError("User id is required");

        const [products, productCnt] = await Promise.all([
            Product.find({user: userId}).skip(offset).limit(15),
            Product.countDocuments({user: userId}),
        ]);

        return {
            products,
            isMore: productCnt - offset > 15,
            totalProductCnt: productCnt,
        };
    }

    async updateProductById(id, updatedData) {
        if (!updatedData) throw new CustomError("Id and Data are required", 400);
        const update = await Product.updateOne({_id: id}, {$set: updatedData});
        if (update.matchedCount === 0) throw new CustomError("Product not found", 404);
        if (!update.acknowledged) throw new CustomError("Update failed, try again later", 500);
    }

    async createProduct(productData) {
        if (!productData) throw new CustomError("Product data is required", 400);
        const product = new Product(productData);
        await product.save();
        return product;
    }

    async updateProcessingStatus(id, currentStatus) {
        if (!currentStatus) throw new CustomError("Id and status are required", 400);
        const update = await Product.updateOne({_id: id}, {$set: {processingStatus: currentStatus}});
        if (update.matchedCount === 0) throw new CustomError("Product not found", 404);
        if (!update.acknowledged) throw new CustomError("Update failed, try again later", 500);
    }

    async deleteProduct(id) {
        const delProduct = await Product.deleteOne({_id: id});
        if (delProduct.deletedCount == 0) throw new CustomError("Product not found", 404);
    }
}

export default ProductService;
