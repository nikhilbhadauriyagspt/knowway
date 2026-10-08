import pool from "../config/db.js";

/**
 * Log an administrative / system event to admin_activity_logs
 */
export const logAdminActivity = async ({
  adminId = null,
  adminName = "System",
  action,
  category = "general",
  details,
  metadata = null,
  ipAddress = null,
}) => {
  try {
    const metaJson = metadata ? JSON.stringify(metadata) : null;
    await pool.query(
      `INSERT INTO admin_activity_logs (admin_id, admin_name, action, category, details, metadata, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [adminId, adminName, action, category, details, metaJson, ipAddress]
    );
  } catch (err) {
    console.error("Failed to log admin activity:", err.message);
  }
};

/**
 * Create a live Super Admin notification in admin_notifications
 */
export const createAdminNotification = async ({
  type,
  title,
  message,
  data = null,
}) => {
  try {
    const dataJson = data ? JSON.stringify(data) : null;
    await pool.query(
      `INSERT INTO admin_notifications (type, title, message, data, is_read)
       VALUES (?, ?, ?, ?, FALSE)`,
      [type, title, message, dataJson]
    );
  } catch (err) {
    console.error("Failed to create admin notification:", err.message);
  }
};
