import nodemailer from "nodemailer";
import pool from "./db.js";

// Helper to fetch current SMTP settings from MySQL
export const getSmtpSettings = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT setting_key, setting_value FROM system_settings 
       WHERE setting_key IN ('smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from_name', 'smtp_from_email', 'smtp_is_active')`
    );

    const config = {
      smtp_host: process.env.SMTP_HOST || "",
      smtp_port: process.env.SMTP_PORT || "587",
      smtp_user: process.env.SMTP_USER || "",
      smtp_pass: process.env.SMTP_PASS || "",
      smtp_from_name: process.env.SMTP_FROM_NAME || "KnowWay LearnSpace",
      smtp_from_email: process.env.SMTP_FROM_EMAIL || "",
      smtp_is_active: process.env.SMTP_IS_ACTIVE === "true" ? "true" : "false",
    };

    rows.forEach((r) => {
      config[r.setting_key] = r.setting_value || "";
    });

    return config;
  } catch (err) {
    console.warn("⚠️ Could not fetch SMTP settings from DB, using fallback:", err.message);
    return {
      smtp_host: process.env.SMTP_HOST || "",
      smtp_port: process.env.SMTP_PORT || "587",
      smtp_user: process.env.SMTP_USER || "",
      smtp_pass: process.env.SMTP_PASS || "",
      smtp_from_name: "KnowWay LearnSpace",
      smtp_from_email: "",
      smtp_is_active: "false",
    };
  }
};

/**
 * Send OTP Email to User
 * Automatically checks if SMTP is active in Admin Settings.
 * If inactive or fails, falls back gracefully to Testing OTP Mode.
 */
export const sendOtpEmail = async ({ to, otp, type = "signup", name = "Learner" }) => {
  const config = await getSmtpSettings();
  const isActive = config.smtp_is_active === "true" || config.smtp_is_active === "1";

  const isConfigured = Boolean(
    config.smtp_host && config.smtp_user && config.smtp_pass
  );

  const subject =
    type === "signup"
      ? `🔐 Verify Your KnowWay Account - OTP: ${otp}`
      : `🔑 Password Reset OTP for KnowWay - ${otp}`;

  const titleText =
    type === "signup" ? "Verify Your Email Address" : "Password Reset Request";
  const descText =
    type === "signup"
      ? "Welcome to KnowWay LearnSpace! Please use the 6-digit one-time password (OTP) below to complete your registration."
      : "We received a request to reset your KnowWay LearnSpace password. Use the 6-digit OTP below to proceed.";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFD; margin: 0; padding: 24px; color: #161B29; }
          .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1px solid #E2E8F0; padding: 36px; box-shadow: 0 4px 20px rgba(3,91,227,0.06); }
          .logo-box { text-align: center; margin-bottom: 24px; }
          .badge { display: inline-block; background: #EEF4FF; color: #035BE3; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 14px; border-radius: 100px; }
          .title { font-size: 22px; font-weight: 800; color: #161B29; margin-top: 16px; margin-bottom: 8px; text-align: center; }
          .text { font-size: 14px; color: #64748B; line-height: 1.6; text-align: center; margin-bottom: 28px; }
          .otp-card { background: #F4F7FB; border: 2px dashed #035BE3; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 28px; }
          .otp-code { font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #035BE3; font-family: monospace; }
          .otp-expiry { font-size: 12px; color: #94A3B8; margin-top: 8px; font-weight: 600; }
          .footer { text-align: center; font-size: 12px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 20px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo-box">
            <span class="badge">KnowWay LearnSpace</span>
          </div>
          <h2 class="title">${titleText}</h2>
          <p class="text">Hello <strong>${name || "Learner"}</strong>,<br/>${descText}</p>
          
          <div class="otp-card">
            <div class="otp-code">${otp}</div>
            <div class="otp-expiry">⏱️ Valid for 10 minutes. Do not share with anyone.</div>
          </div>

          <p class="text" style="font-size: 13px;">If you did not request this OTP, please safely ignore this email.</p>
          
          <div class="footer">
            &copy; ${new Date().getFullYear()} KnowWay Inc. All rights reserved.<br/>
            Skill-First Learning & Career Mastery Platform.
          </div>
        </div>
      </body>
    </html>
  `;

  // If SMTP is enabled & valid in Admin settings, send real email via Nodemailer
  if (isActive && isConfigured) {
    try {
      const portNum = Number(config.smtp_port) || 587;
      const transporter = nodemailer.createTransport({
        host: config.smtp_host,
        port: portNum,
        secure: portNum === 465,
        auth: {
          user: config.smtp_user,
          pass: config.smtp_pass,
        },
      });

      const senderEmail = config.smtp_from_email || config.smtp_user;
      const senderName = config.smtp_from_name || "KnowWay LearnSpace";

      await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to,
        subject,
        html: htmlContent,
      });

      console.log(`✉️ [SMTP LIVE] Verification OTP (${otp}) sent successfully to ${to}`);
      return {
        success: true,
        is_test_mode: false,
        message: "Verification OTP sent to your email!",
      };
    } catch (mailErr) {
      console.warn("⚠️ [SMTP ERROR] Nodemailer failed to send email, falling back to Testing OTP Mode:", mailErr.message);
      return {
        success: true,
        is_test_mode: true,
        test_otp: otp,
        message: `SMTP delivery failed (${mailErr.message}). Testing OTP active.`,
        warning: mailErr.message,
      };
    }
  }

  // Fallback: SMTP is inactive in admin or credentials are empty
  console.log(`🧪 [TEST OTP MODE] Email OTP for ${to}: ${otp} (SMTP is inactive in Admin Settings)`);
  return {
    success: true,
    is_test_mode: true,
    test_otp: otp,
    message: "Email confirmation is currently in Test Mode.",
  };
};

/**
 * Test SMTP connection endpoint helper for Admin Dashboard
 */
export const testSmtpTransport = async ({ host, port, user, pass, from_name, from_email, target_email }) => {
  const portNum = Number(port) || 587;
  const transporter = nodemailer.createTransport({
    host,
    port: portNum,
    secure: portNum === 465,
    auth: { user, pass },
  });

  // Verify connection first
  await transporter.verify();

  // Send a test message
  const info = await transporter.sendMail({
    from: `"${from_name || "KnowWay Admin"}" <${from_email || user}>`,
    to: target_email || user,
    subject: "✅ KnowWay SMTP Configuration Test - Success!",
    html: `
      <div style="font-family: sans-serif; padding: 20px; background: #f8fafd; border-radius: 12px;">
        <h3 style="color: #035BE3;">🎉 KnowWay SMTP Configuration is Working!</h3>
        <p>Your SMTP mail credentials have been verified and tested successfully.</p>
        <p>Host: <strong>${host}</strong> | Port: <strong>${portNum}</strong></p>
        <p style="color: #64748B; font-size: 12px;">Sent at: ${new Date().toLocaleString()}</p>
      </div>
    `,
  });

  return info;
};
