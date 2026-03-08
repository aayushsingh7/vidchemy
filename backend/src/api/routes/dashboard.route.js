import {Router} from "express"
import DashboardService from "../services/dashboard.service.js";
import DashboardController from "../controllers/dashboard.controller.js";

const router = Router();
const dashboardService = new DashboardService();
const dashboardController = new DashboardController(dashboardService)
router.get("/overview", dashboardController.getDashboardOverview)

export default router;