import pool from "../config/db.js";

const parsePoints = (rawPoints) => {
  if (!rawPoints) return [];
  if (Array.isArray(rawPoints)) return rawPoints.filter(Boolean);
  if (typeof rawPoints === "string") {
    try {
      const parsed = JSON.parse(rawPoints);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch (_) {
      return rawPoints
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const formatServiceRow = (row) => ({
  ...row,
  points: parsePoints(row.points),
  is_published: Boolean(row.is_published),
});

// ============================================================
// PUBLIC ENDPOINTS (/api/services)
// ============================================================

export const getPublicServices = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM digital_services WHERE is_published = TRUE ORDER BY order_index ASC, id ASC"
    );
    return res.status(200).json({
      success: true,
      services: rows.map(formatServiceRow),
    });
  } catch (err) {
    console.error("getPublicServices error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load services.",
    });
  }
};

export const submitServiceInquiry = async (req, res) => {
  try {
    const { name, phone, email, service_id, service_title, message } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, phone number, and email are required.",
      });
    }

    const finalServiceTitle = service_title || "Digital Marketing Service";

    const [result] = await pool.query(
      `INSERT INTO service_inquiries
        (name, phone, email, service_id, service_title, message, status)
       VALUES (?, ?, ?, ?, ?, ?, 'new')`,
      [
        String(name).trim(),
        String(phone).trim(),
        String(email).trim(),
        service_id ? Number(service_id) : null,
        String(finalServiceTitle).trim(),
        message ? String(message).trim() : "",
      ]
    );

    // Optional: Add admin notification if admin_notifications table exists
    try {
      await pool.query(
        `INSERT INTO admin_notifications (type, title, message, is_read)
         VALUES ('contact_inquiry', ?, ?, FALSE)`,
        [
          `New Service Enquiry: ${finalServiceTitle}`,
          `${name} (${phone}) enquired about ${finalServiceTitle}.`,
        ]
      );
    } catch (_) {}

    return res.status(201).json({
      success: true,
      message: "Your service enquiry has been submitted successfully!",
      inquiryId: result.insertId,
    });
  } catch (err) {
    console.error("submitServiceInquiry error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to submit enquiry. Please try again.",
    });
  }
};

// ============================================================
// SUPER ADMIN ENDPOINTS (/api/services/admin/...)
// ============================================================

export const getAdminServices = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM digital_services ORDER BY order_index ASC, id ASC"
    );
    return res.status(200).json({
      success: true,
      services: rows.map(formatServiceRow),
    });
  } catch (err) {
    console.error("getAdminServices error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin services.",
    });
  }
};

export const createAdminService = async (req, res) => {
  try {
    const {
      service_number = "01",
      category = "Digital Marketing",
      title,
      description,
      points = [],
      image_url = "",
      vector_type = "ads",
      theme_color = "blue",
      button_text = "Enquire About This Service",
      order_index = 1,
      is_published = true,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Service title and description are required.",
      });
    }

    const cleanPoints = Array.isArray(points)
      ? points.map((p) => String(p).trim()).filter(Boolean)
      : parsePoints(points);

    const [result] = await pool.query(
      `INSERT INTO digital_services
        (service_number, category, title, description, points, image_url, vector_type, theme_color, button_text, order_index, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(service_number).trim() || "01",
        String(category).trim() || "Digital Marketing",
        String(title).trim(),
        String(description).trim(),
        JSON.stringify(cleanPoints),
        image_url ? String(image_url).trim() : "",
        vector_type || "ads",
        theme_color || "blue",
        button_text || "Enquire About This Service",
        Number(order_index) || 1,
        Boolean(is_published),
      ]
    );

    const [createdRows] = await pool.query(
      "SELECT * FROM digital_services WHERE id = ?",
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Service created successfully!",
      service: createdRows[0] ? formatServiceRow(createdRows[0]) : null,
    });
  } catch (err) {
    console.error("createAdminService error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create service: " + err.message,
    });
  }
};

export const updateAdminService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      service_number = "01",
      category = "Digital Marketing",
      title,
      description,
      points = [],
      image_url = "",
      vector_type = "ads",
      theme_color = "blue",
      button_text = "Enquire About This Service",
      order_index = 1,
      is_published = true,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Service title and description are required.",
      });
    }

    const cleanPoints = Array.isArray(points)
      ? points.map((p) => String(p).trim()).filter(Boolean)
      : parsePoints(points);

    await pool.query(
      `UPDATE digital_services
       SET service_number = ?,
           category = ?,
           title = ?,
           description = ?,
           points = ?,
           image_url = ?,
           vector_type = ?,
           theme_color = ?,
           button_text = ?,
           order_index = ?,
           is_published = ?
       WHERE id = ?`,
      [
        String(service_number).trim() || "01",
        String(category).trim() || "Digital Marketing",
        String(title).trim(),
        String(description).trim(),
        JSON.stringify(cleanPoints),
        image_url ? String(image_url).trim() : "",
        vector_type || "ads",
        theme_color || "blue",
        button_text || "Enquire About This Service",
        Number(order_index) || 1,
        Boolean(is_published),
        Number(id),
      ]
    );

    const [updatedRows] = await pool.query(
      "SELECT * FROM digital_services WHERE id = ?",
      [Number(id)]
    );

    return res.status(200).json({
      success: true,
      message: "Service updated successfully!",
      service: updatedRows[0] ? formatServiceRow(updatedRows[0]) : null,
    });
  } catch (err) {
    console.error("updateAdminService error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update service: " + err.message,
    });
  }
};

export const deleteAdminService = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM digital_services WHERE id = ?", [Number(id)]);
    return res.status(200).json({
      success: true,
      message: "Service deleted successfully!",
    });
  } catch (err) {
    console.error("deleteAdminService error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete service.",
    });
  }
};

// ============================================================
// SERVICE INQUIRIES MANAGEMENT (SUPER ADMIN)
// ============================================================

export const getAdminServiceInquiries = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM service_inquiries ORDER BY created_at DESC, id DESC"
    );
    return res.status(200).json({
      success: true,
      inquiries: rows,
    });
  } catch (err) {
    console.error("getAdminServiceInquiries error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch service inquiries.",
    });
  }
};

export const updateAdminServiceInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status = "contacted", admin_notes = "" } = req.body;

    await pool.query(
      "UPDATE service_inquiries SET status = ?, admin_notes = ? WHERE id = ?",
      [status, admin_notes, Number(id)]
    );

    return res.status(200).json({
      success: true,
      message: "Inquiry status updated!",
    });
  } catch (err) {
    console.error("updateAdminServiceInquiryStatus error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update inquiry status.",
    });
  }
};

export const deleteAdminServiceInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM service_inquiries WHERE id = ?", [Number(id)]);
    return res.status(200).json({
      success: true,
      message: "Service inquiry deleted!",
    });
  } catch (err) {
    console.error("deleteAdminServiceInquiry error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete inquiry.",
    });
  }
};
