class IngestionController {
    #ingestionService;

    constructor(ingestionService) {
        this.#ingestionService = ingestionService;
    }

    upload = async (req, res, next) => {
        try {
            const {url} = req.body;
            const listing = await this.#ingestionService.addIngestionJob(url);
            res.status(200).json({success: true, message: "Ingestion job queued", data: listing});
        } catch (err) {
            next(err);
        }
    };
}

export default IngestionController;
