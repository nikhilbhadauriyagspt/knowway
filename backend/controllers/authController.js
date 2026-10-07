import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { sendOtpEmail } from "../config/mail.js";

// Helper to generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "knowway_default_secret",
    { expiresIn: "7d" }
  );
};

// ==========================================
// 1. POST /api/auth/send-signup-otp
// ==========================================
export const sendSignupOtp = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Valid email address is required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if account already exists
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [cleanEmail]
    );

    if (existingUsers && existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in instead.",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in email_otps table (Valid for 10 minutes)
    await pool.query(
      `INSERT INTO email_otps (email, otp, type, is_verified, expires_at) 
       VALUES (?, ?, 'signup', FALSE, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
      [cleanEmail, otp]
    );

    // Send email or fallback to test OTP
    const mailResult = await sendOtpEmail({
      to: cleanEmail,
      otp,
      type: "signup",
      name: name || "Learner",
    });

    return res.status(200).json({
      success: true,
      message: mailResult.message || "Verification code sent successfully!",
      is_test_mode: mailResult.is_test_mode,
      test_otp: mailResult.is_test_mode ? mailResult.test_otp : undefined,
    });
  } catch (error) {
    console.error("Send Signup OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not send verification OTP. Please try again.",
      error: error.message,
    });
  }
};

// ==========================================
// 2. POST /api/auth/register (Verify OTP & Create User)
// ==========================================
export const register = async (req, res) => {
  try {
    const { name, phone, email, address, password, referralCode, otp } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verify OTP if provided or required
    if (otp) {
      const [otpRows] = await pool.query(
        `SELECT id FROM email_otps 
         WHERE email = ? AND otp = ? AND type = 'signup' AND is_verified = FALSE AND expires_at > NOW() 
         ORDER BY id DESC LIMIT 1`,
        [cleanEmail, otp.toString().trim()]
      );

      if (!otpRows || otpRows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification OTP code.",
        });
      }

      // Mark OTP as verified
      await pool.query("UPDATE email_otps SET is_verified = TRUE WHERE id = ?", [otpRows[0].id]);
    }

    // Check duplicate
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [cleanEmail]
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
      `INSERT INTO users (name, phone, email, address, password, referral_code, is_verified) 
       VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
      [
        name.trim(),
        phone ? phone.trim() : null,
        cleanEmail,
        address ? address.trim() : "",
        hashedPassword,
        referralCode ? referralCode.trim().toUpperCase() : null,
      ]
    );

    const newUserId = result.insertId;
    const token = generateToken(newUserId);

    const userPayload = {
      id: newUserId,
      name: name.trim(),
      email: cleanEmail,
      phone: phone || "",
      address: address || "",
      referralCode: referralCode || null,
      avatar_url: null,
    };

    return res.status(201).json({
      success: true,
      message: "Account verified and registered successfully!",
      token,
      user: userPayload,
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
// 3. POST /api/auth/login
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

    const cleanEmail = email.trim().toLowerCase();

    // Find user in MySQL
    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [cleanEmail]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "No account found with this email address.",
      });
    }

    const user = users[0];

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password. Please check your credentials.",
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
        phone: user.phone || "",
        address: user.address || "",
        referralCode: user.referral_code || null,
        avatar_url: user.avatar_url || null,
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

// ==========================================
// 4. POST /api/auth/forgot-password-otp
// ==========================================
export const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists
    const [users] = await pool.query(
      "SELECT id, name FROM users WHERE email = ? LIMIT 1",
      [cleanEmail]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No account found registered with this email.",
      });
    }

    const user = users[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in email_otps table
    await pool.query(
      `INSERT INTO email_otps (email, otp, type, is_verified, expires_at) 
       VALUES (?, ?, 'forgot_password', FALSE, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
      [cleanEmail, otp]
    );

    // Send email or fallback to test OTP
    const mailResult = await sendOtpEmail({
      to: cleanEmail,
      otp,
      type: "forgot_password",
      name: user.name,
    });

    return res.status(200).json({
      success: true,
      message: mailResult.message || "Password reset OTP sent to your email!",
      is_test_mode: mailResult.is_test_mode,
      test_otp: mailResult.is_test_mode ? mailResult.test_otp : undefined,
    });
  } catch (error) {
    console.error("Forgot Password OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not send reset OTP. Please try again.",
      error: error.message,
    });
  }
};

// ==========================================
// 5. POST /api/auth/reset-password
// ==========================================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP code, and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verify OTP
    const [otpRows] = await pool.query(
      `SELECT id FROM email_otps 
       WHERE email = ? AND otp = ? AND type = 'forgot_password' AND is_verified = FALSE AND expires_at > NOW() 
       ORDER BY id DESC LIMIT 1`,
      [cleanEmail, otp.toString().trim()]
    );

    if (!otpRows || otpRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code. Please request a new one.",
      });
    }

    // Mark OTP verified
    await pool.query("UPDATE email_otps SET is_verified = TRUE WHERE id = ?", [otpRows[0].id]);

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    await pool.query("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      cleanEmail,
    ]);

    return res.status(200).json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not reset password. Please try again.",
      error: error.message,
    });
  }
};

// ==========================================
// 6. GET /api/auth/me (Get profile from token)
// ==========================================
export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "knowway_default_secret");

    const [users] = await pool.query(
      "SELECT id, name, email, phone, address, referral_code, avatar_url, created_at FROM users WHERE id = ? LIMIT 1",
      [decoded.id]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      user: users[0],
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Session expired or invalid token." });
  }
};
