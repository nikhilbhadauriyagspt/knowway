import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

// Helper to generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "knowway_default_secret",
    { expiresIn: "7d" }
  );
};

// ==========================================
// POST /api/auth/register (2-Step Form Signup)
// ==========================================
export const register = async (req, res) => {
  try {
    const { name, phone, email, address, password, referralCode } = req.body;

    // Basic validation
    if (!name || !phone || !email || !address || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields: name, phone, email, address, password",
      });
    }

    // Check if user with same email exists
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existingUsers && existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into MySQL
    const [result] = await pool.query(
      `INSERT INTO users (name, phone, email, address, password, referral_code) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, phone, email, address, hashedPassword, referralCode || null]
    );

    const token = generateToken(result.insertId);

    return res.status(201).json({
      success: true,
      message: "Account registered successfully!",
      token,
      user: {
        id: result.insertId,
        name,
        email,
        phone,
        address,
        referralCode: referralCode || null,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration.",
      error: error.message,
    });
  }
};

// ==========================================
// POST /api/auth/login
// ==========================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find user in MySQL
    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = users[0];

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login.",
      error: error.message,
    });
  }
};
