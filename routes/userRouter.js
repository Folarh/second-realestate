import { Router } from "express";
const router = Router();

import { showLoggedInUser } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

// Show logged-in user
router.get("/current-user", authenticateToken, showLoggedInUser);

export default router;
