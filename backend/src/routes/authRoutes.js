import express from "express";
import { getMe, login, logout } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
