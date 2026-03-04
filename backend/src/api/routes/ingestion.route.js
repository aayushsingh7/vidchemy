import { Router } from "express";
import ListingService from "../../shared/services/listing.service.js";
import IngestionService from "../services/ingestion.service.js";
import IngestionController from "../controllers/ingestion.controller.js";

const router = Router();
const listingService = new ListingService();
const ingestionService = new IngestionService(listingService);
const ingestionController = new IngestionController(ingestionService);

router.post("/", ingestionController.upload);

export default router;