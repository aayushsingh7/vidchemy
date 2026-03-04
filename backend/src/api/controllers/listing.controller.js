class ListingController {
    #listingService;
    constructor(listingService) {
        this.#listingService = listingService;
    }

    getListing = async (req, res, next) => {
        try {
            const {id} = req.params;
            const listing = await this.#listingService.getProductById(id);
            res.status(200).json({status: "success", data: listing, message: "Product fetched successfully"});
        } catch (err) {
            next(err);
        }
    };

    getListings = async (req, res, next) => {
        try {
            const {userId, offset} = req.query;
            const listings = await this.#listingService.getProducts(userId, offset);
            res.status(200).json({status: "success", data: listings, messge: "Products fetched successfully"});
        } catch (err) {
            next(err);
        }
    };

    updateListing = async (req, res, next) => {
        try {
            const {id} = req.params;
            const updatedData = req.body;
            await this.#listingService.updateProductById(id, updatedData);
            res.status(200).json({status: "success", message: "Listing updated successfully"});
        } catch (err) {
            next(err);
        }
    };

    createListing = async (req, res, next) => {
        try {
            const productData = req.body;
            const product = await this.#listingService.createProduct(productData);
            res.status(201).json({status: "success", data: product, message: "Listing created successfully"});
        } catch (err) {
            next(err);
        }
    };

    updateStatus = async (req, res, next) => {
        try {
            const {id} = req.params;
            const {currentStatus} = req.body;
            await this.#listingService.updateProcessingStatus(id, currentStatus);
            res.status(200).json({status: "success", message: "Processing status updated"});
        } catch (err) {
            next(err);
        }
    };

    deleteListing = async (req, res, next) => {
        try {
            const {id} = req.params;
            await this.#listingService.deleteProduct(id);
            res.status(200).send({status: "success", message: "Listing deleted successfully"});
        } catch (err) {
            next(err);
        }
    };
}

export default ListingController;
