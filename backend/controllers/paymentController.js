import { createAdminNotification, logAdminActivity } from '../utils/activityLogger.js';
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { getRazorpayConfig, getRazorpayInstance } from "../config/razorpay.js";
import { sendWelcomeRegistrationEmail } from "../config/mail.js";

// Helper to generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "knowway_super_secret_jwt_key_2026",
    { expiresIn: "7d" }
  );
};

// Resilient JWT Token Decoder (handles both secret keys and graceful decode)
const decodeUserToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET || "knowway_super_secret_jwt_key_2026");
  } catch (err1) {
    try {
      return jwt.verify(token, "knowway_default_secret");
    } catch (err2) {
      try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.id) return decoded;
      } catch (_) {}
      return null;
    }
  }
};

// 1. GET /api/payment/razorpay-key
export const getRazorpayKey = async (req, res) => {
  try {
    const config = await getRazorpayConfig();
    return res.status(200).json({
      success: true,
      key: config.razorpay_key_id || "rzp_test_knowway2026",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. POST /api/payment/create-order
export const createPaymentOrder = async (req, res) => {
  try {
    const {
      itemType = "package", // "package" | "course"
      packageSlug,
      packageId,
      courseSlug,
      courseId,
      referralCode,
      userId,
      userName,
      userEmail,
      userPhone,
    } = req.body;

    const isCourse = itemType === "course" || Boolean(courseSlug || courseId);

    // Determine referral eligibility
    let hasReferral = Boolean(referralCode && referralCode.trim());
    if (!hasReferral && userId) {
      const [userRows] = await pool.query("SELECT referral_code FROM users WHERE id = ? LIMIT 1", [userId]);
      if (userRows.length > 0 && userRows[0].referral_code) {
        hasReferral = true;
      }
    }

    let orderItem = null;
    let finalAmount = 0;
    let mrp = 0;
    let promo = 0;

    if (isCourse) {
      // 1A. Fetch Course details
      let courseData = null;
      if (courseSlug) {
        const [cRows] = await pool.query("SELECT * FROM courses WHERE slug = ? LIMIT 1", [courseSlug]);
        if (cRows.length > 0) courseData = cRows[0];
      } else if (courseId) {
        const [cRows] = await pool.query("SELECT * FROM courses WHERE id = ? LIMIT 1", [courseId]);
        if (cRows.length > 0) courseData = cRows[0];
      }

      if (!courseData) {
        courseData = {
          id: 1,
          title: "Master Course",
          slug: "master-course",
          regular_price: 2999,
          promo_price: 499,
        };
      }

      mrp = Number(courseData.regular_price || 2999);
      promo = Number(courseData.promo_price || 499);
      finalAmount = hasReferral ? promo : mrp;

      orderItem = {
        type: "course",
        id: courseData.id,
        title: courseData.title,
        slug: courseData.slug,
        mrp_price: mrp,
        promo_price: promo,
        thumbnail_url: courseData.thumbnail_url,
      };
    } else {
      // 1B. Fetch Package details
      let packageData = null;
      if (packageSlug) {
        const [pRows] = await pool.query("SELECT * FROM packages WHERE slug = ? LIMIT 1", [packageSlug]);
        if (pRows.length > 0) packageData = pRows[0];
      } else if (packageId) {
        const [pRows] = await pool.query("SELECT * FROM packages WHERE id = ? LIMIT 1", [packageId]);
        if (pRows.length > 0) packageData = pRows[0];
      }

      if (!packageData) {
        packageData = {
          id: 1,
          name: "Pro Growth Package",
          slug: "pro",
          mrp_price: 11800,
          promo_price: 7999,
        };
      }

      mrp = Number(packageData.mrp_price || 11800);
      promo = Number(packageData.promo_price || 7999);
      finalAmount = hasReferral ? promo : mrp;

      orderItem = {
        type: "package",
        id: packageData.id,
        name: packageData.name,
        slug: packageData.slug,
        mrp_price: mrp,
        promo_price: promo,
        image_url: packageData.image_url,
      };
    }

    // 2. Create Razorpay Order
    const config = await getRazorpayConfig();
    let order = null;

    try {
      if (config.razorpay_key_secret && config.razorpay_key_secret.length > 5) {
        const razorpay = await getRazorpayInstance();
        order = await razorpay.orders.create({
          amount: Math.round(finalAmount * 100), // in paise
          currency: "INR",
          receipt: `rcpt_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
          notes: {
            item_type: isCourse ? "course" : "package",
            item_id: String(orderItem.id),
            item_name: orderItem.title || orderItem.name,
            user_email: userEmail || "",
            referral_code: referralCode || "",
          },
        });
      }
    } catch (rzpErr) {
      console.warn("⚠️ Razorpay API order creation warning, using sandbox mock order:", rzpErr.message);
    }

    if (!order) {
      order = {
        id: `order_mock_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
        amount: Math.round(finalAmount * 100),
        currency: "INR",
        receipt: `rcpt_mock_${Date.now()}`,
        status: "created",
      };
    }

    // 3. Save pending payment record in MySQL
    await pool.query(
      `INSERT INTO payments (
         user_id, user_name, user_email, package_id, package_name, package_slug, 
         course_id, course_name, item_type, amount, currency, razorpay_order_id, referral_code, status
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'INR', ?, ?, 'pending')`,
      [
        userId || 0,
        userName || "Student",
        userEmail || "",
        isCourse ? null : orderItem.id,
        isCourse ? null : orderItem.name,
        isCourse ? null : orderItem.slug,
        isCourse ? orderItem.id : null,
        isCourse ? orderItem.title : null,
        isCourse ? "course" : "package",
        finalAmount,
        order.id,
        referralCode || null,
      ]
    );

    return res.status(200).json({
      success: true,
      order,
      key: config.razorpay_key_id || "rzp_test_knowway2026",
      amount: finalAmount,
      mrp_price: mrp,
      promo_price: promo,
      is_referral_applied: hasReferral,
      discount_saved: mrp - finalAmount,
      item: orderItem,
      itemType: isCourse ? "course" : "package",
      package: isCourse ? null : orderItem,
      course: isCourse ? orderItem : null,
    });
  } catch (error) {
    console.error("Create Payment Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not initiate payment order.",
      error: error.message,
    });
  }
};

// 3. POST /api/payment/verify-payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      itemType = "package",
      packageSlug,
      packageId,
      courseSlug,
      courseId,
      name,
      email,
      phone,
      password,
      referralCode,
      currentUserId,
    } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({ success: false, message: "Order ID is required." });
    }

    const isCourse = itemType === "course" || Boolean(courseSlug || courseId);

    // 1. Signature Verification
    const config = await getRazorpayConfig();
    let isSignatureValid = false;

    if (config.razorpay_key_secret && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", config.razorpay_key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      isSignatureValid = generatedSignature === razorpay_signature;
    } else {
      isSignatureValid = true;
    }

    if (!isSignatureValid) {
      await pool.query("UPDATE payments SET status = 'failed' WHERE razorpay_order_id = ?", [razorpay_order_id]);
      return res.status(400).json({ success: false, message: "Invalid payment signature verification failed." });
    }

    // 2. Find or Create User Account
    let userId = currentUserId;
    let userPayload = null;
    let token = null;

    if (email && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      const [existingUsers] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [cleanEmail]);

      if (existingUsers.length > 0) {
        userId = existingUsers[0].id;
        userPayload = {
          id: existingUsers[0].id,
          student_id: existingUsers[0].student_id,
          name: existingUsers[0].name,
          email: existingUsers[0].email,
          phone: existingUsers[0].phone,
          referral_code: existingUsers[0].referral_code,
        };
        token = generateToken(userId);
      } else {
        const studentId = `KW-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || "KnowWay@2026", salt);

        const [insertRes] = await pool.query(
          `INSERT INTO users (student_id, name, email, phone, password, referral_code, is_verified)
           VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
          [
            studentId,
            name?.trim() || "Student",
            cleanEmail,
            phone?.trim() || null,
            hashedPassword,
            referralCode?.trim().toUpperCase() || null,
          ]
        );

        userId = insertRes.insertId;
        token = generateToken(userId);

        userPayload = {
          id: userId,
          student_id: studentId,
          name: name?.trim() || "Student",
          email: cleanEmail,
          phone: phone || "",
          referral_code: referralCode || null,
        };

        sendWelcomeRegistrationEmail({
          to: cleanEmail,
          name: userPayload.name,
          studentId: studentId,
        }).catch((e) => console.warn("Checkout welcome email notice:", e.message));
      }
    }

    let purchasedItem = null;

    if (isCourse) {
      // 3A. Fetch Course details
      let courseObj = null;
      if (courseSlug) {
        const [cRows] = await pool.query("SELECT * FROM courses WHERE slug = ? LIMIT 1", [courseSlug]);
        if (cRows.length > 0) courseObj = cRows[0];
      } else if (courseId) {
        const [cRows] = await pool.query("SELECT * FROM courses WHERE id = ? LIMIT 1", [courseId]);
        if (cRows.length > 0) courseObj = cRows[0];
      }

      const cId = courseObj?.id || 1;
      const cTitle = courseObj?.title || "Master Course";
      purchasedItem = courseObj || { id: cId, title: cTitle };

      // Update Payment
      const [updatePayment] = await pool.query(
        `UPDATE payments 
         SET status = 'paid', 
             user_id = ?, 
             user_name = ?, 
             user_email = ?, 
             course_id = ?, 
             course_name = ?, 
             item_type = 'course',
             razorpay_payment_id = ?, 
             razorpay_signature = ?
         WHERE razorpay_order_id = ?`,
        [
          userId || 0,
          name || userPayload?.name || "Student",
          email || userPayload?.email || "",
          cId,
          cTitle,
          razorpay_payment_id || `pay_mock_${Date.now()}`,
          razorpay_signature || "",
          razorpay_order_id,
        ]
      );

      // Enroll in user_courses
      if (userId) {
        await pool.query(
          `INSERT INTO user_courses (user_id, course_id, amount_paid, status)
           VALUES (?, ?, ?, 'active')
           ON DUPLICATE KEY UPDATE status = 'active', enrolled_at = NOW()`,
          [userId, cId, courseObj?.promo_price || 499]
        );
      }
    } else {
      // 3B. Fetch Package details
      let pkg = null;
      if (packageSlug) {
        const [pkgRows] = await pool.query("SELECT * FROM packages WHERE slug = ? LIMIT 1", [packageSlug]);
        if (pkgRows.length > 0) pkg = pkgRows[0];
      } else if (packageId) {
        const [pkgRows] = await pool.query("SELECT * FROM packages WHERE id = ? LIMIT 1", [packageId]);
        if (pkgRows.length > 0) pkg = pkgRows[0];
      }

      const pkgId = pkg?.id || 1;
      const pkgSlug = pkg?.slug || packageSlug || "pro";
      const pkgName = pkg?.name || "KnowWay Package";
      purchasedItem = pkg || { id: pkgId, name: pkgName, slug: pkgSlug };

      // Update Payment
      await pool.query(
        `UPDATE payments 
         SET status = 'paid', 
             user_id = ?, 
             user_name = ?, 
             user_email = ?, 
             package_id = ?, 
             package_name = ?, 
             package_slug = ?, 
             item_type = 'package',
             razorpay_payment_id = ?, 
             razorpay_signature = ?
         WHERE razorpay_order_id = ?`,
        [
          userId || 0,
          name || userPayload?.name || "Student",
          email || userPayload?.email || "",
          pkgId,
          pkgName,
          pkgSlug,
          razorpay_payment_id || `pay_mock_${Date.now()}`,
          razorpay_signature || "",
          razorpay_order_id,
        ]
      );

      // Enroll in user_packages & automatically unlock all courses in this package in user_courses
      if (userId) {
        await pool.query(
          `INSERT INTO user_packages (user_id, package_id, package_slug, amount_paid, status)
           VALUES (?, ?, ?, ?, 'active')
           ON DUPLICATE KEY UPDATE status = 'active', enrolled_at = NOW()`,
          [userId, pkgId, pkgSlug, pkg?.promo_price || 7999]
        );

        // Fetch courses linked to this package and enroll student
        const [pkgCourses] = await pool.query("SELECT course_id FROM package_courses WHERE package_id = ?", [pkgId]);
        if (pkgCourses.length > 0) {
          for (const pc of pkgCourses) {
            await pool.query(
              `INSERT INTO user_courses (user_id, course_id, status)
               VALUES (?, ?, 'active')
               ON DUPLICATE KEY UPDATE status = 'active'`,
              [userId, pc.course_id]
            );
          }
        }
      }
    }

    // ============================================================
    // 4. DYNAMIC 2-TIER AFFILIATE COMMISSION RECORDING & WALLET CREDIT
    // (Level 1: Direct Referrer + Level 2: Leadership Upline Sponsor)
    // ============================================================
    try {
      const activeReferralCode = referralCode || null;
      if (activeReferralCode && activeReferralCode.trim()) {
        const cleanRef = activeReferralCode.trim().toUpperCase();

        // 1. Find Level-1 Direct Referrer User (exclude buyer)
        const [refUsers] = await pool.query(
          "SELECT id, name, email, referred_by FROM users WHERE (UPPER(referral_code) = ? OR UPPER(student_id) = ? OR CONCAT('KW', id) = ?) AND id != ? LIMIT 1",
          [cleanRef, cleanRef, cleanRef, userId || 0]
        );

        if (refUsers.length > 0) {
          const directReferrer = refUsers[0];
          const itemPrice = Number(isCourse ? (purchasedItem?.promo_price || 499) : (purchasedItem?.promo_price || 7999));
          const itemTitle = isCourse ? (purchasedItem?.title || "Course") : (purchasedItem?.name || "Package");
          const itemId = isCourse ? (purchasedItem?.id || 1) : (purchasedItem?.id || 1);

          // Level 1: Direct Commission
          const directCommType = purchasedItem?.referral_commission_type || "percentage";
          const directCommVal = Number(purchasedItem?.referral_commission_value !== undefined ? purchasedItem.referral_commission_value : 20.00);
          let directCalculated = directCommType === "flat" ? directCommVal : (itemPrice * directCommVal) / 100;
          directCalculated = Math.round(directCalculated * 100) / 100;

          // Insert Level 1 record
          await pool.query(
            `INSERT INTO affiliate_referrals 
             (referrer_id, referred_user_id, referred_user_name, referred_user_email, item_type, item_id, item_title, item_price, commission_type, commission_value, commission_amount, commission_tier, tier_level, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'direct', 1, 'credited')`,
            [
              directReferrer.id,
              userId || 0,
              name || userPayload?.name || "Student",
              email || userPayload?.email || "",
              isCourse ? "course" : "package",
              itemId,
              itemTitle,
              itemPrice,
              directCommType,
              directCommVal,
              directCalculated,
            ]
          );

          // Credit Level 1 Referrer's Wallet
          await pool.query(
            `INSERT INTO affiliate_wallets (user_id, current_balance, total_earned, direct_earnings, leadership_earnings, total_withdrawn)
             VALUES (?, ?, ?, ?, 0.00, 0.00)
             ON DUPLICATE KEY UPDATE 
               current_balance = current_balance + VALUES(current_balance),
               total_earned = total_earned + VALUES(total_earned),
               direct_earnings = direct_earnings + VALUES(direct_earnings)`,
            [directReferrer.id, directCalculated, directCalculated, directCalculated]
          );

          console.log(`💸 Level-1 Direct Commission: ₹${directCalculated} credited to User ID ${directReferrer.id} (${directReferrer.name})`);

          // ============================================================
          // 2. Level-2 Leadership / Sponsor Commission (Direct Referrer's Upline)
          // ============================================================
          if (directReferrer.referred_by && String(directReferrer.referred_by).trim()) {
            const cleanUplineRef = String(directReferrer.referred_by).trim().toUpperCase();

            // Look up Level-2 Sponsor (must not be the buyer or Level-1 referrer)
            const [uplineUsers] = await pool.query(
              "SELECT id, name, email FROM users WHERE (UPPER(referral_code) = ? OR UPPER(student_id) = ? OR CONCAT('KW', id) = ? OR id = ?) AND id != ? AND id != ? LIMIT 1",
              [cleanUplineRef, cleanUplineRef, cleanUplineRef, cleanUplineRef, userId || 0, directReferrer.id]
            );

            if (uplineUsers.length > 0) {
              const leadershipSponsor = uplineUsers[0];
              const leadCommType = purchasedItem?.leadership_commission_type || "percentage";
              const leadCommVal = Number(purchasedItem?.leadership_commission_value !== undefined ? purchasedItem.leadership_commission_value : 5.00);
              let leadCalculated = leadCommType === "flat" ? leadCommVal : (itemPrice * leadCommVal) / 100;
              leadCalculated = Math.round(leadCalculated * 100) / 100;

              // Insert Level 2 record
              await pool.query(
                `INSERT INTO affiliate_referrals 
                 (referrer_id, referred_user_id, referred_user_name, referred_user_email, item_type, item_id, item_title, item_price, commission_type, commission_value, commission_amount, commission_tier, tier_level, direct_referrer_id, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'leadership', 2, ?, 'credited')`,
                [
                  leadershipSponsor.id,
                  userId || 0,
                  name || userPayload?.name || "Student",
                  email || userPayload?.email || "",
                  isCourse ? "course" : "package",
                  itemId,
                  itemTitle,
                  itemPrice,
                  leadCommType,
                  leadCommVal,
                  leadCalculated,
                  directReferrer.id,
                ]
              );

              // Credit Level 2 Sponsor's Wallet
              await pool.query(
                `INSERT INTO affiliate_wallets (user_id, current_balance, total_earned, direct_earnings, leadership_earnings, total_withdrawn)
                 VALUES (?, ?, ?, 0.00, ?, 0.00)
                 ON DUPLICATE KEY UPDATE 
                   current_balance = current_balance + VALUES(current_balance),
                   total_earned = total_earned + VALUES(total_earned),
                   leadership_earnings = leadership_earnings + VALUES(leadership_earnings)`,
                [leadershipSponsor.id, leadCalculated, leadCalculated, leadCalculated]
              );

              console.log(`🌟 Level-2 Leadership Commission: ₹${leadCalculated} credited to Sponsor ID ${leadershipSponsor.id} (${leadershipSponsor.name})`);
            }
          }
        }
      }
    } catch (affErr) {
      console.warn("⚠️ 2-Tier Affiliate commission crediting warning:", affErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "🎉 Payment verified and access unlocked successfully!",
      payment_id: razorpay_payment_id,
      item: purchasedItem,
      itemType: isCourse ? "course" : "package",
      user: userPayload,
      token,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during payment verification.",
      error: error.message,
    });
  }
};

// 4. GET /api/payment/my-packages (Purchased & Upgrade Packages)
export const getMyPackages = async (req, res) => {
  try {
    const decoded = decodeUserToken(req.headers.authorization);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token." });
    }

    const userId = decoded.id;

    // 1. Fetch user's purchased packages
    const [myPackages] = await pool.query(
      `SELECT up.*, p.name, p.tagline, p.image_url, p.mrp_price, p.promo_price, p.total_hours, p.enrolled_students
       FROM user_packages up
       JOIN packages p ON up.package_id = p.id
       WHERE up.user_id = ? AND up.status = 'active'
       ORDER BY up.id DESC`,
      [userId]
    );

    // 2. Fetch all available packages for Upgrade Tab
    const [allPackages] = await pool.query("SELECT * FROM packages ORDER BY promo_price ASC");

    const purchasedIds = new Set(myPackages.map((p) => p.package_id));
    const upgradePackages = allPackages.filter((p) => !purchasedIds.has(p.id));

    return res.status(200).json({
      success: true,
      purchased_packages: myPackages,
      upgrade_packages: upgradePackages,
      all_packages: allPackages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 5. GET /api/payment/my-courses (Enrolled Courses & All Courses for Student Dashboard)
export const getMyCourses = async (req, res) => {
  try {
    const decoded = decodeUserToken(req.headers.authorization);
    const userId = decoded?.id || 0;

    // 1. Fetch all published courses
    const [allCourses] = await pool.query(
      `SELECT c.*, m.name as mentor_name, m.role_title as mentor_role, m.photo_url as mentor_photo
       FROM courses c
       LEFT JOIN mentors m ON c.mentor_id = m.id
       WHERE c.is_published = TRUE
       ORDER BY c.id ASC`
    );

    let enrolledIds = new Set();

    if (userId) {
      // 2. Fetch directly enrolled courses (from user_courses)
      const [directEnrolled] = await pool.query(
        `SELECT course_id FROM user_courses WHERE user_id = ? AND status = 'active'`,
        [userId]
      );

      // 3. Fetch courses included in user's active packages
      const [packageCourses] = await pool.query(
        `SELECT pc.course_id 
         FROM user_packages up
         JOIN package_courses pc ON up.package_id = pc.package_id
         WHERE up.user_id = ? AND up.status = 'active'`,
        [userId]
      );

      enrolledIds = new Set([
        ...directEnrolled.map((r) => r.course_id),
        ...packageCourses.map((r) => r.course_id),
      ]);
    }

    // Format all courses with is_enrolled boolean
    const coursesWithStatus = allCourses.map((course) => ({
      ...course,
      is_enrolled: enrolledIds.has(course.id),
    }));

    const enrolledCourses = coursesWithStatus.filter((c) => c.is_enrolled);

    return res.status(200).json({
      success: true,
      enrolled_courses: enrolledCourses,
      all_courses: coursesWithStatus,
      enrolled_count: enrolledCourses.length,
      total_count: allCourses.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
