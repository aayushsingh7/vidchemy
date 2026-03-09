class ListingController {
    #listingService;
    constructor(listingService) {
        this.#listingService = listingService;
    }

    getListingStatus = async(req,res,next)=> {
        try{
           const {id} = req.params;
           const status = await this.#listingService.getListingStatus({jobId:id});
           res.status(200).send({status:"success", data:status, message:"Status fetched successfuly"})
        }catch(err){
            next(err)
        }
    }

    getListing = async (req, res, next) => {
        try {
            const {id} = req.params;
            const listing = await this.#listingService.getListingById(id);
            res.status(200).json({status: "success", data: listing, message: "Product fetched successfully"});
        } catch (err) {
            next(err);
        }
    };

    getListings = async (req, res, next) => {
        try {
            const {userId, offset} = req.query;
            const listings = await this.#listingService.getListings({userId, offset});
            res.status(200).json({status: "success", data: listings, messge: "Products fetched successfully"});
        } catch (err) {
            next(err);
        }
    };

    updateListing = async (req, res, next) => {
        try {
            const {id} = req.params;
            const updatedData = req.body;
            await this.#listingService.updateListingById({id, updatedData});
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


    deleteListing = async (req, res, next) => {
        try {
            const {id} = req.params;
            await this.#listingService.deleteListing(id);
            res.status(200).send({status: "success", message: "Listing deleted successfully"});
        } catch (err) {
            next(err);
        }
    };
}

export default ListingController;
