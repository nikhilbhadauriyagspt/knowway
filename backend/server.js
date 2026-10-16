import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool, { initDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import affiliateRoutes from "./routes/affiliateRoutes.js";
import freelanceRoutes from "./routes/freelanceRoutes.js";

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = fs.existsSync(path.resolve(__dirname, "public"))
  ? path.resolve(__dirname, "public")
  : path.resolve(__dirname, "../dist");

const app = express();
const PORT = process.env.PORT || 3000;

// Helper to escape HTML entities safely
const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Info Route
app.get("/api", (req, res) => {
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

// Dynamic Favicon Redirect if Admin uploaded a custom favicon in DB
app.get(["/favicon.ico", "/favicon.svg"], async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT setting_value FROM system_settings WHERE setting_key = 'site_favicon' LIMIT 1"
    );
    const customFavicon = rows?.[0]?.setting_value;
    if (customFavicon && customFavicon !== "/favicon.svg" && customFavicon !== "/favicon.ico") {
      res.setHeader("Cache-Control", "no-cache");
      return res.redirect(302, customFavicon);
    }
  } catch (_) {}
  next();
});

// Serve static frontend build if present (with index: false so index.html gets dynamic DB meta/favicon injection)
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, { index: false }));

  app.get("*", async (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    const indexPath = path.join(distPath, "index.html");
    if (!fs.existsSync(indexPath)) {
      return next();
    }

    try {
      let html = fs.readFileSync(indexPath, "utf8");
      const [rows] = await pool.query(
        "SELECT setting_key, setting_value FROM system_settings WHERE setting_key IN ('site_name', 'site_title', 'site_description', 'site_favicon')"
      );
      const dbSettings = {};
      rows.forEach((r) => {
        if (r.setting_value && r.setting_value.trim() !== "") {
          dbSettings[r.setting_key] = r.setting_value.trim();
        }
      });

      const siteTitle = dbSettings.site_title || dbSettings.site_name;
      const siteDesc = dbSettings.site_description;
      const siteFavicon = dbSettings.site_favicon;

      if (siteFavicon) {
        html = html.replace(/href="\/favicon\.svg"/g, `href="${escapeHtml(siteFavicon)}"`);
      }
      if (siteTitle) {
        html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(siteTitle)}</title>`);
      }
      if (siteDesc) {
        html = html.replace(
          /<meta name="description" content=".*?" \/>/,
          `<meta name="description" content="${escapeHtml(siteDesc)}" />`
        );
      }

      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      return res.status(200).type("html").send(html);
    } catch (err) {
      return res.sendFile(indexPath);
    }
  });
}

// 404 Route handler for API endpoints
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
