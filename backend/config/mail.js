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

/**
 * Send Welcome Registration Email with Unique Student ID
 */
export const sendWelcomeRegistrationEmail = async ({ to, name = "Learner", studentId, loginUrl }) => {
  const config = await getSmtpSettings();
  const isActive = config.smtp_is_active === "true" || config.smtp_is_active === "1";
  const isConfigured = Boolean(config.smtp_host && config.smtp_user && config.smtp_pass);

  const finalLoginUrl = loginUrl || process.env.FRONTEND_URL || "https://knowway.in/login";
  const subject = `🎉 Welcome to KnowWay LearnSpace! Your Student ID: ${studentId}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F7FB; margin: 0; padding: 24px; color: #161B29; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 28px; border: 1px solid #E2E8F0; padding: 40px; box-shadow: 0 10px 30px rgba(3,91,227,0.08); }
          .logo-box { text-align: center; margin-bottom: 24px; }
          .badge { display: inline-block; background: #EEF4FF; color: #035BE3; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; padding: 6px 16px; border-radius: 100px; border: 1px solid #D9E6FE; }
          .title { font-size: 24px; font-weight: 900; color: #0F172A; margin-top: 16px; margin-bottom: 8px; text-align: center; letter-spacing: -0.02em; }
          .text { font-size: 14px; color: #475569; line-height: 1.65; text-align: center; margin-bottom: 24px; }
          
          .id-card { background: linear-gradient(135deg, #035BE3 0%, #155DFC 100%); border-radius: 20px; padding: 24px; text-align: center; color: #ffffff; margin-bottom: 28px; box-shadow: 0 8px 24px rgba(3,91,227,0.25); }
          .id-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #DBEAFE; margin-bottom: 6px; }
          .id-number { font-size: 26px; font-weight: 900; letter-spacing: 3px; font-family: monospace; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); padding: 8px 18px; border-radius: 12px; display: inline-block; margin-top: 4px; }
          .id-sub { font-size: 12px; color: #EFF6FF; margin-top: 10px; font-weight: 500; }

          .details-box { background: #F8FAFD; border: 1px solid #E2E8F0; border-radius: 16px; padding: 18px 22px; margin-bottom: 28px; }
          .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px solid #EDF2F7; font-size: 13px; }
          .detail-row:last-child { border-bottom: none; }
          .detail-key { color: #64748B; font-weight: 600; }
          .detail-val { color: #0F172A; font-weight: 700; }

          .btn-container { text-align: center; margin: 32px 0 20px; }
          .btn { display: inline-block; background: #035BE3; color: #ffffff !important; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 34px; border-radius: 100px; box-shadow: 0 4px 14px rgba(3,91,227,0.35); }
          
          .steps-box { text-align: left; background: #FAFCFF; border-left: 4px solid #035BE3; padding: 16px 20px; border-radius: 0 14px 14px 0; margin-bottom: 28px; }
          .steps-title { font-size: 13px; font-weight: 800; color: #0F172A; margin-bottom: 8px; }
          .steps-list { font-size: 12px; color: #475569; line-height: 1.6; margin: 0; padding-left: 18px; }

          .footer { text-align: center; font-size: 11px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 20px; margin-top: 24px; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo-box">
            <span class="badge">KnowWay LearnSpace</span>
          </div>

          <h1 class="title">Welcome, ${name}! 🎉</h1>
          <p class="text">
            Your student account has been successfully created. You are now part of the modern digital skill and career mastery community.
          </p>
          
          <!-- Unique Student ID Card -->
          <div class="id-card">
            <div class="id-label">Official Student Identifier</div>
            <div class="id-number">${studentId}</div>
            <div class="id-sub">Keep this ID safe for certifications, courses & student support.</div>
          </div>

          <!-- Account Details -->
          <div class="details-box">
            <div class="detail-row">
              <span class="detail-key">Student Name:</span>
              <span class="detail-val">${name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-key">Registered Email:</span>
              <span class="detail-val">${to}</span>
            </div>
            <div class="detail-row">
              <span class="detail-key">Account Status:</span>
              <span class="detail-val" style="color: #16A34A;">● Active & Verified</span>
            </div>
            <div class="detail-row">
              <span class="detail-key">Registration Date:</span>
              <span class="detail-val">${new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>

          <!-- Quick Steps -->
          <div class="steps-box">
            <div class="steps-title">What you can do next:</div>
            <ol class="steps-list">
              <li>Log in to your <strong>Student Dashboard</strong> to explore enrolled courses.</li>
              <li>Learn with practical video lectures and take assessments.</li>
              <li>Earn verifiable, accredited skill certificates upon completion.</li>
            </ol>
          </div>

          <!-- CTA Button -->
          <div class="btn-container">
            <a href="${finalLoginUrl}" class="btn" target="_blank">Access Your Dashboard &rarr;</a>
          </div>
          
          <div class="footer">
            &copy; ${new Date().getFullYear()} KnowWay Inc. All rights reserved.<br/>
            Need assistance? Reach out to support@knowway.in
          </div>
        </div>
      </body>
    </html>
  `;

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

      console.log(`✉️ [WELCOME EMAIL LIVE] Welcome email with Student ID (${studentId}) sent to ${to}`);
      return { success: true, is_test_mode: false, message: "Welcome email sent successfully!" };
    } catch (mailErr) {
      console.warn("⚠️ [WELCOME EMAIL ERROR] Nodemailer failed to send welcome email:", mailErr.message);
      return { success: false, error: mailErr.message };
    }
  }

  console.log(`🧪 [TEST WELCOME EMAIL] Student ID (${studentId}) generated for ${to} (SMTP inactive in Settings)`);
  return { success: true, is_test_mode: true, message: "Welcome email logged (Test Mode)." };
};

/**
 * Send Payout Paid / Approved Email to Student
 */
export const sendPayoutApprovedEmail = async ({
  to,
  name = "Student Partner",
  amount,
  payout_method = "UPI",
  destination = "",
  utr_number = "N/A",
  payout_mode = "Manual / RazorpayX",
  processed_at = new Date(),
}) => {
  const config = await getSmtpSettings();
  const isActive = config.smtp_is_active === "true" || config.smtp_is_active === "1";
  const isConfigured = Boolean(config.smtp_host && config.smtp_user && config.smtp_pass);

  const formattedAmount = Number(amount || 0).toLocaleString("en-IN");
  const formattedDate = new Date(processed_at).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const subject = `💸 Payout Processed: ₹${formattedAmount} Credited [UTR: ${utr_number}]`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFD; margin: 0; padding: 24px; color: #161B29; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 28px; border: 1px solid #E2E8F0; padding: 36px; box-shadow: 0 8px 30px rgba(3,91,227,0.06); }
          .logo-box { text-align: center; margin-bottom: 20px; }
          .badge { display: inline-block; background: #DCFCE7; color: #16A34A; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 14px; border-radius: 100px; }
          .title { font-size: 22px; font-weight: 800; color: #0F172A; margin-top: 14px; margin-bottom: 8px; text-align: center; }
          .text { font-size: 13.5px; color: #64748B; line-height: 1.6; text-align: center; margin-bottom: 24px; }
          .amount-card { background: linear-gradient(135deg, #035BE3 0%, #023E9B 100%); color: #ffffff; border-radius: 20px; padding: 24px; text-align: center; margin-bottom: 24px; }
          .amount-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.85; }
          .amount-val { font-size: 36px; font-weight: 900; margin: 6px 0; }
          .details-card { background: #F8FAFD; border: 1px solid #E2E8F0; border-radius: 18px; padding: 20px; margin-bottom: 24px; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #EDF2F7; font-size: 12.5px; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #64748B; font-weight: 600; }
          .detail-value { color: #0F172A; font-weight: 800; }
          .utr-pill { background: #EEF4FF; color: #035BE3; padding: 3px 8px; border-radius: 6px; font-family: monospace; font-size: 12px; }
          .footer { text-align: center; font-size: 11.5px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 20px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo-box">
            <span class="badge">KnowWay Affiliate Payout Settled</span>
          </div>
          <h2 class="title">Your Funds Have Been Transferred! 🚀</h2>
          <p class="text">Hello <strong>${name}</strong>,<br/>Your commission withdrawal request has been approved and successfully transferred to your destination account.</p>
          
          <div class="amount-card">
            <div class="amount-label">Amount Transferred</div>
            <div class="amount-val">₹${formattedAmount}</div>
            <div style="font-size: 11px; opacity: 0.9;">Settled to Bank / UPI Account</div>
          </div>

          <div class="details-card">
            <div class="detail-row">
              <span class="detail-label">Payment Method:</span>
              <span class="detail-value">${String(payout_method).toUpperCase()}</span>
            </div>
            ${destination ? `
            <div class="detail-row">
              <span class="detail-label">Destination Account:</span>
              <span class="detail-value">${destination}</span>
            </div>` : ""}
            <div class="detail-row">
              <span class="detail-label">Transaction Reference (UTR):</span>
              <span class="detail-value"><span class="utr-pill">${utr_number}</span></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Transfer Mode:</span>
              <span class="detail-value">${payout_mode === "razorpayx" ? "RazorpayX Instant Auto Payout" : "Direct Bank Transfer"}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Processed Date:</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
          </div>

          <p class="text" style="font-size: 12px; margin-bottom: 0;">It may take a few minutes for your bank statement to reflect this deposit depending on your bank's processing cycles.</p>
          
          <div class="footer">
            &copy; ${new Date().getFullYear()} KnowWay Inc. All rights reserved.<br/>
            Need assistance? Reach out to support@knowway.in
          </div>
        </div>
      </body>
    </html>
  `;

  if (isActive && isConfigured) {
    try {
      const portNum = Number(config.smtp_port) || 587;
      const transporter = nodemailer.createTransport({
        host: config.smtp_host,
        port: portNum,
        secure: portNum === 465,
        auth: { user: config.smtp_user, pass: config.smtp_pass },
      });

      const senderEmail = config.smtp_from_email || config.smtp_user;
      const senderName = config.smtp_from_name || "KnowWay Partner Hub";

      await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to,
        subject,
        html: htmlContent,
      });

      console.log(`✉️ [PAYOUT EMAIL LIVE] Payout paid email sent to ${to} (UTR: ${utr_number})`);
      return { success: true };
    } catch (err) {
      console.warn("⚠️ [PAYOUT EMAIL ERROR]:", err.message);
      return { success: false, error: err.message };
    }
  }

  console.log(`🧪 [TEST PAYOUT EMAIL] Payout paid notice logged for ${to} (₹${formattedAmount}, UTR: ${utr_number})`);
  return { success: true, is_test_mode: true };
};

/**
 * Send Payout Rejected & Refunded Email to Student
 */
export const sendPayoutRejectedEmail = async ({
  to,
  name = "Student Partner",
  amount,
  rejection_reason = "Account details verification issue",
  processed_at = new Date(),
}) => {
  const config = await getSmtpSettings();
  const isActive = config.smtp_is_active === "true" || config.smtp_is_active === "1";
  const isConfigured = Boolean(config.smtp_host && config.smtp_user && config.smtp_pass);

  const formattedAmount = Number(amount || 0).toLocaleString("en-IN");
  const formattedDate = new Date(processed_at).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const subject = `⚠️ Payout Request Update: ₹${formattedAmount} Refunded to Wallet`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFD; margin: 0; padding: 24px; color: #161B29; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 28px; border: 1px solid #E2E8F0; padding: 36px; box-shadow: 0 8px 30px rgba(220,38,38,0.06); }
          .logo-box { text-align: center; margin-bottom: 20px; }
          .badge { display: inline-block; background: #FEE2E2; color: #DC2626; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 14px; border-radius: 100px; }
          .title { font-size: 22px; font-weight: 800; color: #0F172A; margin-top: 14px; margin-bottom: 8px; text-align: center; }
          .text { font-size: 13.5px; color: #64748B; line-height: 1.6; text-align: center; margin-bottom: 24px; }
          .reason-card { background: #FFF5F5; border: 1px solid #FED7D7; border-radius: 18px; padding: 20px; margin-bottom: 24px; }
          .reason-title { font-size: 11.5px; font-weight: 700; color: #C53030; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
          .reason-text { font-size: 13.5px; font-weight: 600; color: #9B2C2C; }
          .refund-banner { background: #F0FDF4; border: 1px solid #DCFCE7; border-radius: 16px; padding: 16px; text-align: center; color: #166534; font-size: 13px; font-weight: 700; margin-bottom: 24px; }
          .footer { text-align: center; font-size: 11.5px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 20px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo-box">
            <span class="badge">Withdrawal Request Notice</span>
          </div>
          <h2 class="title">Payout Request Status Update</h2>
          <p class="text">Hello <strong>${name}</strong>,<br/>Your withdrawal request for <strong>₹${formattedAmount}</strong> could not be processed at this time.</p>
          
          <div class="reason-card">
            <div class="reason-title">Reason Provided by Admin / Payment Gateway:</div>
            <div class="reason-text">${rejection_reason}</div>
          </div>

          <div class="refund-banner">
            ✅ <strong>₹${formattedAmount} has been refunded immediately</strong> back to your KnowWay Affiliate Wallet balance.
          </div>

          <p class="text" style="font-size: 12.5px;">
            Please verify your Bank Account / UPI details in your Affiliate Hub and submit a new request anytime.
          </p>
          
          <div class="footer">
            &copy; ${new Date().getFullYear()} KnowWay Inc. All rights reserved.<br/>
            Need help updating your payout details? Contact us at support@knowway.in
          </div>
        </div>
      </body>
    </html>
  `;

  if (isActive && isConfigured) {
    try {
      const portNum = Number(config.smtp_port) || 587;
      const transporter = nodemailer.createTransport({
        host: config.smtp_host,
        port: portNum,
        secure: portNum === 465,
        auth: { user: config.smtp_user, pass: config.smtp_pass },
      });

      const senderEmail = config.smtp_from_email || config.smtp_user;
      const senderName = config.smtp_from_name || "KnowWay Partner Hub";

      await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to,
        subject,
        html: htmlContent,
      });

      console.log(`✉️ [PAYOUT REJECTED EMAIL LIVE] Sent to ${to}`);
      return { success: true };
    } catch (err) {
      console.warn("⚠️ [PAYOUT REJECTED EMAIL ERROR]:", err.message);
      return { success: false, error: err.message };
    }
  }

  console.log(`🧪 [TEST PAYOUT REJECTED EMAIL] Logged for ${to} (₹${formattedAmount})`);
  return { success: true, is_test_mode: true };
};

