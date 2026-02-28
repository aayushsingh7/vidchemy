import {Router} from "express"
import ProductController from "../controllers/product.controller.js";
import ProductService from "../services/product.service.js";

const router = Router();
const productController = new ProductController(new ProductService());

router.get("/:id", productController.getProduct);
router.get("/", productController.getProducts);
router.put("/:id", productController.updateProduct);
router.post("/", productController.createProduct);
router.patch("/:id/status", productController.updateStatus);
router.delete("/:id", productController.deleteProduct);

export default router;