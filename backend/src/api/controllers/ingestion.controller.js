class IngestionController {
    #ingestionService;

    constructor(ingestionService) {
        this.#ingestionService = ingestionService;
    }

    upload = async (req, res, next) => {
        try {
            const {url, productType, primarySourceUrl, guestId, currencyCode} = req.body;
            const listing = await this.#ingestionService.addIngestionJob({
                url,
                productType,
                userId: guestId,
                primarySourceUrl, 
                currencyCode,
            });
            res.status(200).json({success: true, message: "Ingestion job queued", data: listing});
        } catch (err) {
            next(err);
        }
    };
}

export default IngestionController;
