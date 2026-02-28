import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import hisabRoutes from "./routes/hisabRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   🏠 Home Route
================================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Welcome to HisabPro API Server",
    
  });
});

/* ===============================
   🔗 API Routes
================================= */
app.use("/api/auth", authRoutes);
app.use("/api/hisab", hisabRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;