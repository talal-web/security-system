// server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";

import connectDB from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

import morganMiddleware from "./middleware/morganMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./config/logger.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

connectDB();

app.use(helmet());

// Allowed CORS origins
const allowedOrigins = (process.env.FRONTEND_URLS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

console.log("✅ Allowed Origins:", allowedOrigins);

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

app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Server Running...");
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

app.listen(PORT, () => {
  logger.info({
    message: "Server started successfully",
    url: `http://localhost:${PORT}`,
  });
});
