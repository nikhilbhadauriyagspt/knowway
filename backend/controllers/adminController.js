import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

// Helper to generate Admin JWT Token
const generateAdminToken = (admin) => {
  return jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role || "superadmin" },
    process.env.JWT_SECRET || "knowway_default_secret",
    { expiresIn: "7d" }
  );
};

// ==========================================
// POST /api/admin/login (Super Admin Login)
// ==========================================
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find admin in MySQL database
    const [admins] = await pool.query(
      "SELECT * FROM admins WHERE email = ? LIMIT 1",
      [email]
    );

    if (!admins || admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const admin = admins[0];

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const token = generateAdminToken(admin);

    return res.status(200).json({
      success: true,
      message: "Super Admin login successful!",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Super Admin Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during admin login.",
      error: error.message,
    });
  }
};

// ==========================================
// GET /api/admin/me (Verify & Fetch Current Admin)
// ==========================================
export const getAdminProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized. Token missing." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "knowway_default_secret");

    const [admins] = await pool.query("SELECT id, name, email, role, created_at FROM admins WHERE id = ? LIMIT 1", [
      decoded.id,
    ]);

    if (!admins || admins.length === 0) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }

    return res.status(200).json({
      success: true,
      admin: admins[0],
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token.", error: error.message });
  }
};

// ==========================================
// GET /api/admin/stats (Dashboard Analytics)
// ==========================================
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Total users count
    let totalUsers = 0;
    try {
      const [countResult] = await pool.query("SELECT COUNT(*) as total FROM users");
      totalUsers = countResult[0]?.total || 0;
    } catch {
      totalUsers = 0;
    }

    // 2. Recent registrations (last 5)
    let recentUsers = [];
    try {
      const [users] = await pool.query(
        "SELECT id, name, email, phone, address, referral_code, created_at FROM users ORDER BY created_at DESC LIMIT 5"
      );
      recentUsers = users || [];
    } catch {
      recentUsers = [];
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents: totalUsers,
        totalPackages: 4,
        totalRevenue: totalUsers * 1999, // estimated demo metric
        activeCourses: 28,
        conversionRate: "14.8%",
        recentUsers,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch dashboard stats", error: error.message });
  }
};

// ==========================================
// GET /api/admin/users (All Registered Users)
// ==========================================
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email, phone, address, referral_code, created_at FROM users ORDER BY created_at DESC"
    );

    return res.status(200).json({
      success: true,
      users: users || [],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
};

// ==========================================
// DELETE /api/admin/users/:id (Delete User)
// ==========================================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete user", error: error.message });
  }
};
