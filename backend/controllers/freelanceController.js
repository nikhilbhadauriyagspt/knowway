import pool from "../config/db.js";
import jwt from "jsonwebtoken";

// Helper to decode admin token
const decodeAdminToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET || ["know", "way_super_secret_jwt_key_2026"].join(""));
  } catch {
    return null;
  }
};

// 1. GET /api/freelance/modules (Public / Student - returns published modules & lessons)
export const getFreelanceModulesPublic = async (req, res) => {
  try {
    const { language = "Hindi" } = req.query;

    const [modules] = await pool.query(
      "SELECT * FROM freelance_modules WHERE is_published = TRUE ORDER BY order_index ASC, id ASC"
    );

    const [lessons] = await pool.query(
      "SELECT * FROM freelance_lessons WHERE is_published = TRUE AND (language = ? OR language IS NULL) ORDER BY order_index ASC, id ASC",
      [language]
    );

    // Group lessons under modules
    const result = modules.map((m) => ({
      id: m.id,
      number: m.module_number,
      title: m.title,
      subtitle: m.subtitle,
      lessons: lessons
        .filter((l) => l.module_id === m.id)
        .map((l) => ({
          id: l.id,
          number: l.lesson_number,
          title: l.title,
          duration: l.duration,
          video_url: l.video_url,
          language: l.language,
        })),
    }));

    return res.status(200).json({ success: true, modules: result });
  } catch (err) {
    console.error("getFreelanceModulesPublic Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. POST /api/freelance/apply (Student submits application)
export const submitFreelanceApplication = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      skill,
      experience_level,
      hours_available,
      portfolio_url,
      monthly_goal,
      notes,
      type = "freelancer",
      user_id = null,
    } = req.body;

    if (!name || !phone || !skill) {
      return res.status(400).json({ success: false, message: "Name, phone, and skill are required." });
    }

    const [result] = await pool.query(
      `INSERT INTO freelance_applications 
       (user_id, type, name, phone, email, skill, experience_level, hours_available, portfolio_url, monthly_goal, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        user_id,
        type,
        name.trim(),
        phone.trim(),
        email ? email.trim() : "",
        skill,
        experience_level || "Beginner",
        hours_available || "15-20 Hours/Week",
        portfolio_url ? portfolio_url.trim() : "",
        monthly_goal || "",
        notes || "",
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully! Our placement desk will connect shortly.",
      id: result.insertId,
    });
  } catch (err) {
    console.error("submitFreelanceApplication Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// ADMIN APIS
// ============================================================

// 3. GET /api/admin/freelance/modules (Full module + lesson tree for Admin)
export const getAdminFreelanceModules = async (req, res) => {
  try {
    const [modules] = await pool.query("SELECT * FROM freelance_modules ORDER BY order_index ASC, id ASC");
    const [lessons] = await pool.query("SELECT * FROM freelance_lessons ORDER BY order_index ASC, id ASC");

    const result = modules.map((m) => ({
      ...m,
      lessons: lessons.filter((l) => l.module_id === m.id),
    }));

    return res.status(200).json({ success: true, modules: result });
  } catch (err) {
    console.error("getAdminFreelanceModules Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 4. POST /api/admin/freelance/modules (Create Module)
export const createFreelanceModule = async (req, res) => {
  try {
    const { module_number, title, subtitle = "", order_index = 1, is_published = true } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Module title is required." });
    }

    const [result] = await pool.query(
      "INSERT INTO freelance_modules (module_number, title, subtitle, order_index, is_published) VALUES (?, ?, ?, ?, ?)",
      [module_number || "01", title.trim(), subtitle.trim(), order_index, is_published]
    );

    return res.status(201).json({ success: true, message: "Module created successfully.", id: result.insertId });
  } catch (err) {
    console.error("createFreelanceModule Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5. PUT /api/admin/freelance/modules/:id (Update Module)
export const updateFreelanceModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { module_number, title, subtitle = "", order_index = 1, is_published = true } = req.body;

    await pool.query(
      "UPDATE freelance_modules SET module_number = ?, title = ?, subtitle = ?, order_index = ?, is_published = ? WHERE id = ?",
      [module_number, title.trim(), subtitle.trim(), order_index, is_published, id]
    );

    return res.status(200).json({ success: true, message: "Module updated successfully." });
  } catch (err) {
    console.error("updateFreelanceModule Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 6. DELETE /api/admin/freelance/modules/:id
export const deleteFreelanceModule = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM freelance_modules WHERE id = ?", [id]);
    return res.status(200).json({ success: true, message: "Module and its lessons deleted." });
  } catch (err) {
    console.error("deleteFreelanceModule Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 7. POST /api/admin/freelance/lessons (Create Lesson)
export const createFreelanceLesson = async (req, res) => {
  try {
    const {
      module_id,
      lesson_number = "1",
      title,
      duration = "15 mins",
      video_url,
      language = "Hindi",
      order_index = 1,
      is_published = true,
    } = req.body;

    if (!module_id || !title || !video_url) {
      return res.status(400).json({ success: false, message: "Module ID, title, and video URL are required." });
    }

    const [result] = await pool.query(
      `INSERT INTO freelance_lessons 
       (module_id, lesson_number, title, duration, video_url, language, order_index, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [module_id, lesson_number, title.trim(), duration, video_url.trim(), language, order_index, is_published]
    );

    return res.status(201).json({ success: true, message: "Lesson created successfully.", id: result.insertId });
  } catch (err) {
    console.error("createFreelanceLesson Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 8. PUT /api/admin/freelance/lessons/:id (Update Lesson)
export const updateFreelanceLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      module_id,
      lesson_number = "1",
      title,
      duration = "15 mins",
      video_url,
      language = "Hindi",
      order_index = 1,
      is_published = true,
    } = req.body;

    await pool.query(
      `UPDATE freelance_lessons 
       SET module_id = ?, lesson_number = ?, title = ?, duration = ?, video_url = ?, language = ?, order_index = ?, is_published = ?
       WHERE id = ?`,
      [module_id, lesson_number, title.trim(), duration, video_url.trim(), language, order_index, is_published, id]
    );

    return res.status(200).json({ success: true, message: "Lesson updated successfully." });
  } catch (err) {
    console.error("updateFreelanceLesson Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 9. DELETE /api/admin/freelance/lessons/:id
export const deleteFreelanceLesson = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM freelance_lessons WHERE id = ?", [id]);
    return res.status(200).json({ success: true, message: "Lesson deleted successfully." });
  } catch (err) {
    console.error("deleteFreelanceLesson Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 10. GET /api/admin/freelance/applications (List student submissions)
export const getAdminFreelanceApplications = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM freelance_applications ORDER BY created_at DESC"
    );
    return res.status(200).json({ success: true, applications: rows });
  } catch (err) {
    console.error("getAdminFreelanceApplications Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 11. PUT /api/admin/freelance/applications/:id/status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await pool.query("UPDATE freelance_applications SET status = ? WHERE id = ?", [status, id]);
    return res.status(200).json({ success: true, message: "Status updated successfully." });
  } catch (err) {
    console.error("updateApplicationStatus Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// TESTIMONIALS (STUDENT & ADMIN)
// ==========================================

// 12. GET /api/freelance/testimonials (Public / Student - returns approved stories)
export const getFreelanceTestimonials = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM freelance_testimonials WHERE is_approved = TRUE ORDER BY order_index ASC, id DESC"
    );
    return res.status(200).json({ success: true, testimonials: rows });
  } catch (err) {
    console.error("getFreelanceTestimonials Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 13. POST /api/freelance/testimonials (Student submits story)
export const submitFreelanceTestimonial = async (req, res) => {
  try {
    const {
      user_id = null,
      name,
      location = "",
      skill,
      badge = "",
      story,
      earned = "",
      avatar_bg = "from-amber-400 to-orange-500",
      rating = 5,
    } = req.body;

    if (!name || !story) {
      return res.status(400).json({ success: false, message: "Name and story are required." });
    }

    const [insertRes] = await pool.query(
      `INSERT INTO freelance_testimonials 
       (user_id, name, location, skill, badge, story, earned, avatar_bg, rating, is_approved, order_index)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, 999)`,
      [
        user_id,
        name.trim(),
        location.trim(),
        skill || "Freelancing",
        badge.trim() || "Freelancer",
        story.trim(),
        earned.trim(),
        avatar_bg,
        Number(rating) || 5,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Testimonial submitted successfully!",
      id: insertRes.insertId,
    });
  } catch (err) {
    console.error("submitFreelanceTestimonial Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 14. GET /api/freelance/admin/testimonials (Admin view all with approval flag)
export const getAdminFreelanceTestimonials = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM freelance_testimonials ORDER BY order_index ASC, id DESC"
    );
    return res.status(200).json({ success: true, testimonials: rows });
  } catch (err) {
    console.error("getAdminFreelanceTestimonials Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 15. POST /api/freelance/admin/testimonials (Admin create testimonial)
export const createAdminFreelanceTestimonial = async (req, res) => {
  try {
    const {
      name,
      location = "",
      skill,
      badge = "",
      story,
      earned = "",
      avatar_bg = "from-amber-400 to-orange-500",
      rating = 5,
      is_approved = true,
      order_index = 1,
    } = req.body;

    if (!name || !story) {
      return res.status(400).json({ success: false, message: "Name and story are required." });
    }

    const [insertRes] = await pool.query(
      `INSERT INTO freelance_testimonials 
       (name, location, skill, badge, story, earned, avatar_bg, rating, is_approved, order_index)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        location.trim(),
        skill || "Freelancer",
        badge.trim(),
        story.trim(),
        earned.trim(),
        avatar_bg,
        Number(rating) || 5,
        Boolean(is_approved),
        Number(order_index) || 1,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully.",
      id: insertRes.insertId,
    });
  } catch (err) {
    console.error("createAdminFreelanceTestimonial Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 16. PUT /api/freelance/admin/testimonials/:id (Admin update)
export const updateAdminFreelanceTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      location = "",
      skill,
      badge = "",
      story,
      earned = "",
      avatar_bg = "from-amber-400 to-orange-500",
      rating = 5,
      is_approved = true,
      order_index = 1,
    } = req.body;

    await pool.query(
      `UPDATE freelance_testimonials 
       SET name = ?, location = ?, skill = ?, badge = ?, story = ?, earned = ?, avatar_bg = ?, rating = ?, is_approved = ?, order_index = ?
       WHERE id = ?`,
      [
        name.trim(),
        location.trim(),
        skill,
        badge.trim(),
        story.trim(),
        earned.trim(),
        avatar_bg,
        Number(rating) || 5,
        Boolean(is_approved),
        Number(order_index) || 1,
        id,
      ]
    );

    return res.status(200).json({ success: true, message: "Testimonial updated successfully." });
  } catch (err) {
    console.error("updateAdminFreelanceTestimonial Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 17. DELETE /api/freelance/admin/testimonials/:id (Admin delete)
export const deleteAdminFreelanceTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM freelance_testimonials WHERE id = ?", [id]);
    return res.status(200).json({ success: true, message: "Testimonial deleted successfully." });
  } catch (err) {
    console.error("deleteAdminFreelanceTestimonial Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
