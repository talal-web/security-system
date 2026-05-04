// server.js

import express from "express";
import connectDB from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import cors from "cors";

const app = express();
const PORT = 5000;

// Connect Database
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/employees", employeeRoutes);

app.get("/", (req, res) => {
  res.send("Server Running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
