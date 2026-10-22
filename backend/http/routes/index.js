// http/routes/index.js
//
// Single aggregation point for every domain router. Adding a new domain
// means one new line here, not a matching pair of edits in bin/server.js.

import express from "express";
import rateLimit from "express-rate-limit";

import { protect } from "../middlewares/authMiddleware.js";

import employeeRoutes from "./employeeRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import locationRoutes from "./locationRoutes.js";
import attendanceRoutes from "./attendanceRoutes.js";
import sectorRoutes from "./sectorRoutes.js";
import userRoutes from "./userRoutes.js";
import employeeSalaryRoutes from "./employeeSalaryRoutes.js";
import advanceRoutes from "./advanceRoutes.js";
import fineRoutes from "./fineRoutes.js";
import deductionRoutes from "./deductionRoutes.js";
import bonusRoutes from "./bonusRoutes.js";
import payrollRoutes from "./payrollRoutes.js";
import areaRoutes from "./areaRoutes.js";
import authRoutes from "./authRoutes.js";

const router = express.Router();

// Baseline limiter for every route - a basic circuit breaker against a
// single misbehaving or malicious client (buggy retry loop, compromised
// session, scripted abuse) degrading the app for everyone else.
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Tighter limiter for auth specifically, to blunt credential-stuffing /
// brute-force attempts against login. Stacks with globalLimiter above.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(globalLimiter);

router.use("/employees", protect, employeeRoutes);
router.use("/auth", authLimiter, authRoutes);
router.use("/users", protect, userRoutes);
router.use("/locations", protect, locationRoutes);
router.use("/sectors", protect, sectorRoutes);
router.use("/attendance", protect, attendanceRoutes);
router.use("/upload", protect, uploadRoutes);
router.use("/employee-salaries", protect, employeeSalaryRoutes);
router.use("/advances", protect, advanceRoutes);
router.use("/fines", protect, fineRoutes);
router.use("/deductions", protect, deductionRoutes);
router.use("/bonuses", protect, bonusRoutes);
router.use("/payroll", protect, payrollRoutes);
router.use("/area", protect, areaRoutes);

export default router;
