import Razorpay from "razorpay";
import pool from "./db.js";

// Helper to fetch Razorpay credentials from system_settings or .env
export const getRazorpayConfig = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT setting_key, setting_value FROM system_settings 
       WHERE setting_key IN ('razorpay_key_id', 'razorpay_key_secret', 'razorpay_is_active')`
    );

    const config = {
      razorpay_key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_knowway2026",
      razorpay_key_secret: process.env.RAZORPAY_KEY_SECRET || "",
      razorpay_is_active: process.env.RAZORPAY_IS_ACTIVE === "true" ? "true" : "true",
    };

    rows.forEach((r) => {
      config[r.setting_key] = r.setting_value || "";
    });

    return config;
  } catch (err) {
    console.warn("⚠️ Could not fetch Razorpay settings from DB:", err.message);
    return {
      razorpay_key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_knowway2026",
      razorpay_key_secret: process.env.RAZORPAY_KEY_SECRET || "",
      razorpay_is_active: "true",
    };
  }
};

// Helper to initialize Razorpay instance
export const getRazorpayInstance = async () => {
  const config = await getRazorpayConfig();
  if (!config.razorpay_key_id || !config.razorpay_key_secret) {
    // Return test instance or fallback
    return new Razorpay({
      key_id: config.razorpay_key_id || "rzp_test_knowway2026",
      key_secret: config.razorpay_key_secret || "test_secret_key_2026",
    });
  }

  return new Razorpay({
    key_id: config.razorpay_key_id,
    key_secret: config.razorpay_key_secret,
  });
};
