class ProductController {
    constructor(productService) {
        this.productService = productService;
    }

     getProduct = async(req, res, next)=>  {
        try {
            const {id} = req.params;
            const product = await this.productService.getProductById(id);
            res.status(200).json({status: "success", data: product, message:"Product fetched successfully"});
        } catch (err) {
            next(err);
        }
    }

    getProducts = async(req,res,next)=> {
        try{
          const {userId, offset} = req.query;
          const products = await this.productService.getProducts(userId, offset);
          res.status(200).json({status:"success", data:products, messge:"Products fetched successfully"})
        }catch(err){
            next(err);
        }
    }
    

     updateProduct = async(req, res, next)=>  {
        try {
            const {id} = req.params;
            const updatedData = req.body;
            await this.productService.updateProductById(id, updatedData);
            res.status(200).json({status: "success", message: "Product updated successfully"});
        } catch (err) {
            next(err);
        }
    }

     createProduct = async(req, res, next)=>  {
        try {
            const productData = req.body;
            const product = await this.productService.createProduct(productData);
            res.status(201).json({status: "success", data: product, message:"Product created successfully"});
        } catch (err) {
            next(err);
        }
    }

     updateStatus = async(req, res, next)=>  {
        try {
            const {id} = req.params;
            const {currentStatus} = req.body;
            await this.productService.updateProcessingStatus(id, currentStatus);
            res.status(200).json({status: "success", message: "Processing status updated"});
        } catch (err) {
            next(err);
        }
    }

     deleteProduct= async(req, res, next)=>  {
        try {
            const {id} = req.params;
            await productService.deleteProduct(id);
            res.status(200).send({status: "success", message:"Product deleted successfully"})
        } catch (err) {
            next(err);
        }
    }
}

export default ProductController;
