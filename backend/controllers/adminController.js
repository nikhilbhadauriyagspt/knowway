import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { testSmtpTransport } from "../config/mail.js";

const JWT_SECRET = process.env.JWT_SECRET || "knowway_super_secret_jwt_key_2026";

// 1. Super Admin Login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter both admin email and password.",
    });
  }

  try {
    const [admins] = await pool.query(
      "SELECT * FROM admins WHERE email = ? LIMIT 1",
      [email.trim().toLowerCase()]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully!",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Admin Login Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during admin authentication.",
    });
  }
};

// 2. Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const [admins] = await pool.query("SELECT id, name, email, role FROM admins LIMIT 1");
    if (admins.length === 0) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }
    return res.status(200).json({ success: true, admin: admins[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const [[{ totalStudents }]] = await pool.query("SELECT COUNT(*) AS totalStudents FROM users");
    const [[{ totalCourses }]] = await pool.query("SELECT COUNT(*) AS totalCourses FROM courses");
    const [[{ totalMentors }]] = await pool.query("SELECT COUNT(*) AS totalMentors FROM mentors");
    
    return res.status(200).json({
      success: true,
      stats: {
        totalStudents: totalStudents || 0,
        totalPackages: 4,
        totalCourses: totalCourses || 0,
        totalMentors: totalMentors || 0,
        totalRevenue: (totalStudents || 0) * 1999,
        conversionRate: "14.8%",
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email, phone, address, referral_code, created_at FROM users ORDER BY id DESC"
    );
    return res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5. Delete User
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return res.status(200).json({ success: true, message: `Student #${id} deleted successfully.` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// MENTORS MANAGEMENT CONTROLLERS
// ============================================================

export const getMentors = async (req, res) => {
  try {
    const [mentors] = await pool.query("SELECT * FROM mentors ORDER BY id DESC");
    return res.status(200).json({ success: true, count: mentors.length, mentors });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createMentor = async (req, res) => {
  const { name, role_title, photo_url, bio, experience_badge, expertise, social_linkedin, social_instagram, social_youtube } = req.body;
  
  if (!name || !role_title) {
    return res.status(400).json({ success: false, message: "Mentor name and role are required." });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO mentors (name, role_title, photo_url, bio, experience_badge, expertise, social_linkedin, social_instagram, social_youtube)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        role_title.trim(),
        photo_url || null,
        bio || "",
        experience_badge || "Mentor",
        expertise || "",
        social_linkedin || null,
        social_instagram || null,
        social_youtube || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Mentor created successfully!",
      mentorId: result.insertId,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteMentor = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM mentors WHERE id = ?", [id]);
    return res.status(200).json({ success: true, message: "Mentor removed successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// COURSES MANAGEMENT CONTROLLERS
// ============================================================

export const getCourses = async (req, res) => {
  try {
    const [courses] = await pool.query(`
      SELECT c.*, m.name AS mentor_name_ref, m.photo_url AS mentor_photo,
      (SELECT COUNT(*) FROM course_lectures WHERE course_id = c.id) AS lectures_count
      FROM courses c
      LEFT JOIN mentors m ON c.mentor_id = m.id
      ORDER BY c.id DESC
    `);
    return res.status(200).json({ success: true, count: courses.length, courses });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const [courses] = await pool.query(
      `SELECT c.*, m.name AS mentor_name_ref, m.photo_url AS mentor_photo, m.role_title AS mentor_role, m.bio AS mentor_bio, m.experience_badge AS mentor_exp, m.expertise AS mentor_expertise
       FROM courses c
       LEFT JOIN mentors m ON c.mentor_id = m.id
       WHERE c.id = ? OR c.slug = ?`,
      [id, id]
    );

    if (!courses || courses.length === 0) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const course = courses[0];

    // Safely parse what_you_will_learn JSON
    let learnPoints = [];
    try {
      learnPoints = typeof course.what_you_will_learn === "string" ? JSON.parse(course.what_you_will_learn) : (course.what_you_will_learn || []);
    } catch {
      learnPoints = [];
    }
    course.what_you_will_learn_parsed = Array.isArray(learnPoints) ? learnPoints : [];

    // Fetch lectures for this course
    const [lectures] = await pool.query(
      `SELECT * FROM course_lectures WHERE course_id = ? ORDER BY lecture_order ASC, id ASC`,
      [course.id]
    );

    course.lectures = lectures;

    return res.status(200).json({ success: true, course });
  } catch (err) {
    console.error("Get Course By ID Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createCourse = async (req, res) => {
  const {
    title,
    mentor_id,
    mentor_name,
    category,
    languages,
    duration,
    regular_price,
    promo_price,
    promo_code,
    thumbnail_url,
    description,
    what_you_will_learn,
    software_required,
    lectures = [],
  } = req.body;

  if (!title || !category) {
    return res.status(400).json({ success: false, message: "Course title and category are required." });
  }

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-") + "-" + Date.now();

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [courseResult] = await connection.query(
      `INSERT INTO courses (title, slug, mentor_id, mentor_name, category, languages, duration, regular_price, promo_price, promo_code, thumbnail_url, description, what_you_will_learn, software_required, total_lectures)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        slug,
        mentor_id ? Number(mentor_id) : null,
        mentor_name || null,
        category.trim(),
        Array.isArray(languages) ? languages.join(", ") : (languages || "Hindi"),
        duration || "1 Hour",
        regular_price ? Number(regular_price) : 2999.00,
        promo_price ? Number(promo_price) : 499.00,
        promo_code || "KNOWWAY50",
        thumbnail_url || null,
        description || "",
        JSON.stringify(what_you_will_learn || []),
        software_required || "",
        lectures.length || 0,
      ]
    );

    const courseId = courseResult.insertId;

    // Insert Lectures if provided
    if (Array.isArray(lectures) && lectures.length > 0) {
      for (let i = 0; i < lectures.length; i++) {
        const l = lectures[i];
        await connection.query(
          `INSERT INTO course_lectures (course_id, section_name, lecture_order, title, duration, video_url, is_free_preview)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            courseId,
            l.section_name || "Module 1",
            i + 1,
            l.title || `Lecture ${i + 1}`,
            l.duration || "5m",
            l.video_url || "",
            Boolean(l.is_free_preview),
          ]
        );
      }
    }

    await connection.commit();
    connection.release();

    return res.status(201).json({
      success: true,
      message: "Course created successfully with lectures and pricing!",
      courseId,
      slug,
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("Create Course Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    category,
    languages,
    duration,
    regular_price,
    promo_price,
    promo_code,
    thumbnail_url,
    description,
    mentor_id,
    mentor_name,
  } = req.body;

  try {
    const [existing] = await pool.query("SELECT id FROM courses WHERE id = ? LIMIT 1", [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    await pool.query(
      `UPDATE courses SET 
        title = COALESCE(?, title),
        category = COALESCE(?, category),
        languages = COALESCE(?, languages),
        duration = COALESCE(?, duration),
        regular_price = COALESCE(?, regular_price),
        promo_price = COALESCE(?, promo_price),
        promo_code = COALESCE(?, promo_code),
        thumbnail_url = COALESCE(?, thumbnail_url),
        description = COALESCE(?, description),
        mentor_id = COALESCE(?, mentor_id),
        mentor_name = COALESCE(?, mentor_name)
       WHERE id = ?`,
      [
        title ? title.trim() : null,
        category ? category.trim() : null,
        languages ? (Array.isArray(languages) ? languages.join(", ") : languages) : null,
        duration || null,
        regular_price !== undefined ? Number(regular_price) : null,
        promo_price !== undefined ? Number(promo_price) : null,
        promo_code || null,
        thumbnail_url || null,
        description || null,
        mentor_id ? Number(mentor_id) : null,
        mentor_name || null,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Course details & pricing updated successfully!",
    });
  } catch (err) {
    console.error("Update Course Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM courses WHERE id = ?", [id]);
    return res.status(200).json({ success: true, message: "Course deleted successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// SYSTEM SETTINGS CONTROLLERS (CLOUDINARY & CREDENTIALS)
// ============================================================

export const getSystemSettings = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT setting_key, setting_value FROM system_settings");
    const settings = {};
    rows.forEach((r) => {
      settings[r.setting_key] = r.setting_value;
    });
    return res.status(200).json({ success: true, settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveSystemSettings = async (req, res) => {
  const { settings = {} } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    for (const [key, value] of Object.entries(settings)) {
      await connection.query(
        `INSERT INTO system_settings (setting_key, setting_value) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE setting_value = ?`,
        [key, value, value]
      );
    }

    await connection.commit();
    connection.release();
    return res.status(200).json({ success: true, message: "Settings saved successfully!" });
  } catch (err) {
    await connection.rollback();
    connection.release();
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const testSmtpSettings = async (req, res) => {
  const { host, port, user, pass, from_name, from_email, target_email } = req.body;
  if (!host || !user || !pass) {
    return res.status(400).json({
      success: false,
      message: "SMTP Host, Username, and Password/App Pass are required to test.",
    });
  }

  try {
    await testSmtpTransport({
      host,
      port,
      user,
      pass,
      from_name,
      from_email,
      target_email,
    });

    return res.status(200).json({
      success: true,
      message: `Test email sent successfully to ${target_email || user}! SMTP is configured properly.`,
    });
  } catch (err) {
    console.error("Test SMTP Error:", err);
    return res.status(500).json({
      success: false,
      message: `SMTP Connection test failed: ${err.message}`,
    });
  }
};

