// server.js
import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import sectorRoutes from "./routes/sectorRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import employeeSalaryRoutes from "./routes/employeeSalaryRoutes.js";
import advanceRoutes from "./routes/advanceRoutes.js";
import fineRoutes from "./routes/fineRoutes.js";
import deductionRoutes from "./routes/deductionRoutes.js";
import bonusRoutes from "./routes/bonusRoutes.js";

import morganMiddleware from "./middleware/morganMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./config/logger.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { validateEnv } from "./config/env.js";
import { protect } from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

validateEnv();

app.use(helmet());

// ======================================
// API CACHE CONTROL
// ======================================

app.disable("etag");

app.use("/api", (req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  next();
});

// ======================================
// CORS
// ======================================

const allowedOrigins = (process.env.FRONTEND_URLS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

logger.info({ message: "Allowed CORS origins", origins: allowedOrigins });

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no Origin (Postman, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.trim().replace(/\/$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      logger.warn({
        message: "Blocked by CORS",
        origin: normalizedOrigin,
      });

      // Reject without throwing a server error
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ======================================
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(morganMiddleware);

app.use("/api/employees", protect, employeeRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", protect, userRoutes);
app.use("/api/locations", protect, locationRoutes);
app.use("/api/sectors", protect, sectorRoutes);
app.use("/api/attendance", protect, attendanceRoutes);
app.use("/api/upload", protect, uploadRoutes);
app.use("/api/employee-salaries", protect, employeeSalaryRoutes);
app.use("/api/advances", protect, advanceRoutes);
app.use("/api/fines", protect, fineRoutes);
app.use("/api/deductions", protect, deductionRoutes);
app.use("/api/bonuses", protect, bonusRoutes);

// Health check routes
app.get("/", (req, res) => {
  res.send("Server Running...");
});

app.get("/healthz", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "unavailable",
    service: "security-company-api",
    database: databaseConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  logger.warn({
    message: "Route not found",
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

app.use(errorHandler);

process.on("unhandledRejection", (err) => {
  logger.error({
    message: "Unhandled Promise Rejection",
    error: err.message,
  });
});

process.on("uncaughtException", (err) => {
  logger.error({
    message: "Uncaught Exception",
    error: err.message,
  });

  process.exit(1);
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    logger.info({
      message: "Server started successfully",
      url: `http://0.0.0.0:${PORT}`,
    });
  });
};

startServer().catch((error) => {
  logger.error({
    message: "Server startup failed",
    error: error.message,
  });
  process.exit(1);
});
