import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import affiliateRoutes from "./routes/affiliateRoutes.js";
import freelanceRoutes from "./routes/freelanceRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root & Health Check Routes for GoDaddy / Cloud Load Balancers
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "KnowWay Backend API",
    message: "🚀 KnowWay Node.js Express backend is live and healthy!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Knowway Node.js Express backend is running successfully!",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/affiliate", affiliateRoutes);
app.use("/api/freelance", freelanceRoutes);

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found.",
  });
});

// Start Server & Connect to MySQL
app.listen(PORT, "0.0.0.0", async () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
  await initDB();
});
