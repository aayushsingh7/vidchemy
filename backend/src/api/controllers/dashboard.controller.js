class DashboardController {
    #dashboardService;
    constructor(dashboardService) {
        this.#dashboardService = dashboardService;
    }

    getDashboardOverview = async (req, res, next) => {
        try {
            const {userId} = req.query;
            const overview = await this.#dashboardService.getDashboardOverview(userId);
            res.status(200).send({
                status: "success",
                message: "Dashboard overview fetched successfully",
                data: overview,
            });
        } catch (err) {
            console.log(err)
            next(err);
        }
    };
}

export default DashboardController;
