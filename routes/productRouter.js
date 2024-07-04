import { Router } from "express";
const router = Router();
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { validateProductInput } from "../middleware/validMid.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

import upload from "../middleware/multerMiddleware.js";

// ALTERNATE METHOD
router
  .route("/")
  .get(getAllProducts)

  .post(
    upload.array("imageUrls", 15),
    validateProductInput,
    authenticateToken,
    createProduct
  );
router
  .route("/:id")
  .get(getSingleProduct)

  .patch(
    upload.array("imageUrls"),
    validateProductInput,

    authenticateToken,
    updateProduct
  )

  .delete(authenticateToken, deleteProduct);

export default router;
