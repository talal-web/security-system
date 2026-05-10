// server.js

import express from "express";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"; // ✅ NEW

import morganMiddleware from "./middleware/morganMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./config/logger.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

connectDB();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(morganMiddleware);

app.use("/api/employees", employeeRoutes);

// ✅ NEW: Cloudinary upload routes
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
