import express from "express";
import { login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getMe } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);

router.get("/me", protect, getMe);

export default router;
