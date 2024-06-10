import { Router } from "express";
const router = Router();
import { getProductsByCategory } from "../controllers/productController.js";

router.route("/").get(getProductsByCategory);

export default router;
