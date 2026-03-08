import {Router} from "express";
import ListingController from "../controllers/listing.controller.js";
import ListingService from "../../shared/services/listing.service.js";

const router = Router();
const listingService = new ListingService();
const listingController = new ListingController(listingService);

router.get("/:id", listingController.getListing);
router.get("/", listingController.getListings);
router.put("/:id", listingController.updateListing);
router.post("/", listingController.createListing);
router.delete("/:id", listingController.deleteListing);

export default router;
