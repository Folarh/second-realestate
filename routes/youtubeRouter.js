import { Router } from "express";
const router = Router();

import {
  createYoutube,
  getAllYoutube,
  deleteYoutube,
} from "../controllers/youtubeController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

router.route("/").get(getAllYoutube).post(authenticateToken, createYoutube);
router.route("/:id").delete(authenticateToken, deleteYoutube);

export default router;
