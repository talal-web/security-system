import express from "express";
import { getMe, login, logout } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../validators/validate.js";
import { loginSchema } from "../validators/authSchemas.js";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
