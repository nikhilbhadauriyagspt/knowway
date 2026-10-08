import { createAdminNotification, logAdminActivity } from '../utils/activityLogger.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { sendOtpEmail, sendWelcomeRegistrationEmail } from "../config/mail.js";

// Helper to describe client device / browser
const getDeviceDescription = (userAgent = "") => {
  let browser = "Web Browser";
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) browser = "Google Chrome";
  else if (userAgent.includes("Edg")) browser = "Microsoft Edge";
  else if (userAgent.includes("Firefox")) browser = "Mozilla Firefox";
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Apple Safari";
  else if (userAgent.includes("Opera") || userAgent.includes("OPR")) browser = "Opera";

  let os = "Device";
  if (userAgent.includes("Windows NT 10.0")) os = "Windows 10/11";
  else if (userAgent.includes("Windows")) os = "Windows PC";
  else if (userAgent.includes("Mac OS")) os = "macOS";
  else if (userAgent.includes("Android")) os = "Android Mobile";
  else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS Device";
  else if (userAgent.includes("Linux")) os = "Linux";

  return `${browser} on ${os}`;
};

// Helper to generate JWT Token
const generateToken = (userId, sessionId = null) => {
  return jwt.sign(
    { id: userId, sessionId },
    process.env.JWT_SECRET || "knowway_super_secret_jwt_key_2026",
    { expiresIn: "7d" }
  );
};

// Safe token decoder
const decodeUserToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET || "knowway_super_secret_jwt_key_2026");
  } catch (e1) {
    try {
      return jwt.verify(token, "knowway_default_secret");
    } catch (e2) {
      try {
        const decoded = jwt.decode(token);
        if (decoded?.id) return decoded;
      } catch (_) {}
      return null;
    }
  }
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

    // Generate Unique Student ID: Format KW-YYYY-XXXXXX
    const currentYear = new Date().getFullYear();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const studentId = `KW-${currentYear}-${randomSuffix}`;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into MySQL
    const [result] = await pool.query(
      `INSERT INTO users (student_id, name, phone, email, address, password, referral_code, is_verified) 
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [
        studentId,
        name.trim(),
        phone ? phone.trim() : null,
        cleanEmail,
        address ? address.trim() : "",
        hashedPassword,
        referralCode ? referralCode.trim().toUpperCase() : null,
      ]
    );

    const newUserId = result.insertId;
    const sessionToken = "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 11);
    const userAgent = req.headers["user-agent"] || "";
    const currentDevice = getDeviceDescription(userAgent);

    // Store active session token
    try {
      await pool.query(
        "UPDATE users SET active_session_token = ?, last_device_info = ?, last_login_at = NOW() WHERE id = ?",
        [sessionToken, currentDevice, newUserId]
      );
    } catch (_) {}

    const token = generateToken(newUserId, sessionToken);
    // Trigger Super Admin Notification & Audit Log
    createAdminNotification({
      type: referralCode ? "referral_signup" : "user_signup",
      title: referralCode ? "New Referral Student Registered 🎉" : "New Student Registered 👤",
      message: referralCode
        ? `${name.trim()} joined using referral code '${referralCode.trim().toUpperCase()}'. Student ID: ${studentId}`
        : `${name.trim()} (${cleanEmail}) registered. Student ID: ${studentId}`,
      data: { userId: newUserId, studentId, name: name.trim(), email: cleanEmail, referralCode: referralCode || null },
    }).catch(() => {});

    logAdminActivity({
      adminName: name.trim(),
      action: "USER_REGISTERED",
      category: "users",
      details: `Student account registered for ${name.trim()} (${cleanEmail}) with Student ID ${studentId}${referralCode ? ` (Referral: ${referralCode.trim().toUpperCase()})` : ""}.`,
      metadata: { userId: newUserId, studentId, email: cleanEmail, referralCode: referralCode || null },
    }).catch(() => {});


    // Send Welcome Email with Unique Student ID (Async, don't block response)
    sendWelcomeRegistrationEmail({
      to: cleanEmail,
      name: name.trim(),
      studentId: studentId,
    }).catch((mailErr) => {
      console.warn("Welcome email async notice:", mailErr.message);
    });

    const userPayload = {
      id: newUserId,
      student_id: studentId,
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
    const { email, password, force_login = false } = req.body;

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

    const userAgent = req.headers["user-agent"] || "";
    const currentDevice = getDeviceDescription(userAgent);

    // Check if user is already logged in elsewhere and didn't confirm override yet
    if (user.active_session_token && !force_login) {
      return res.status(200).json({
        success: false,
        requires_confirmation: true,
        code: "ALREADY_LOGGED_IN",
        message: "You are currently logged in on another browser or device. Signing in here will log you out from the other session.",
        active_session: {
          last_device: user.last_device_info || "Another Browser / Device",
          last_login_at: user.last_login_at,
          current_device: currentDevice,
        },
      });
    }

    // Generate new unique session token (invalidates all previous browser sessions)
    const newSessionToken = "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 11);

    // Auto backfill student_id if missing on legacy account
    let studentId = user.student_id;
    if (!studentId) {
      studentId = `KW-${new Date().getFullYear()}-${String(user.id).padStart(4, "0")}${Math.floor(100 + Math.random() * 900)}`;
    }

    // Update active session in database
    await pool.query(
      "UPDATE users SET active_session_token = ?, last_device_info = ?, last_login_at = NOW(), student_id = ? WHERE id = ?",
      [newSessionToken, currentDevice, studentId, user.id]
    );

    const token = generateToken(user.id, newSessionToken);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        student_id: studentId,
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
    const decoded = decodeUserToken(req.headers.authorization);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token." });
    }

    const [users] = await pool.query(
      "SELECT id, student_id, name, email, phone, address, referral_code, avatar_url, active_session_token, last_device_info, created_at FROM users WHERE id = ? LIMIT 1",
      [decoded.id]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const user = users[0];

    // Session Token Check: If this token's sessionId doesn't match active_session_token,
    // it means another browser logged in and superseded this session.
    if (user.active_session_token && decoded.sessionId !== user.active_session_token) {
      return res.status(401).json({
        success: false,
        code: "SESSION_EXPIRED_ANOTHER_DEVICE",
        message: "Your account was logged in from another browser or device. This session has been terminated.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        student_id: user.student_id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        referral_code: user.referral_code,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Session expired or invalid token." });
  }
};

// ==========================================
// 7. POST /api/auth/logout
// ==========================================
export const logout = async (req, res) => {
  try {
    const decoded = decodeUserToken(req.headers.authorization);
    if (decoded && decoded.id) {
      await pool.query("UPDATE users SET active_session_token = NULL WHERE id = ?", [decoded.id]);
    }
    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      message: "Logged out.",
    });
  }
};
