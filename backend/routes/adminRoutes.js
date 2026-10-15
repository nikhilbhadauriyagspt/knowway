import express from "express";
import multer from "multer";
import {
  adminLogin,
  getAdminProfile,
  changeAdminPassword,
  getDashboardStats,
  getAllUsers,
  getUserPurchases,
  getAllPayments,
  deleteUser,
  getMentors,
  createMentor,
  updateMentor,
  deleteMentor,
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getSystemSettings,
  saveSystemSettings,
  testSmtpSettings,
  getPublicSettings,
  getPublicPages,
  getPublicPageBySlug,
  getAdminPages,
  createAdminPage,
  updateAdminPage,
  deleteAdminPage,
  getAdminAffiliateStats,
  getAdminAffiliatePayouts,
  updateAdminAffiliatePayoutStatus,
  executeRazorpayxPayout,
  getAdminAffiliateUsers,
  getAdminAffiliateReferrals,
  updatePackageCommission,
  updateCourseCommission,
  updateBulkCommissions,
  getVideoSecuritySettings,
  saveVideoSecuritySettings,
  getAvailableModules,
  getAdminNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  clearAdminNotifications,
  submitContactInquiry,
  getContactInquiries,
  updateContactInquiryStatus,
  deleteContactInquiry,
  getAdminActivityLogs,
  getSubAdmins,
  createSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
} from "../controllers/adminController.js";
import {
  uploadImage,
  uploadVideo,
} from "../controllers/uploadController.js";
import {
  getAdminAffiliateAnnouncements,
  createAdminAffiliateAnnouncement,
  updateAdminAffiliateAnnouncement,
  deleteAdminAffiliateAnnouncement,
} from "../controllers/affiliateController.js";

const router = express.Router();

// Multer memory storage configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 250 * 1024 * 1024, // Up to 250MB for video uploads
  },
});

// Super Admin Public Auth Route
router.post("/login", adminLogin);

// Super Admin Protected Routes
router.get("/me", getAdminProfile);
router.post("/change-password", changeAdminPassword);
router.put("/password", changeAdminPassword);
router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/users/:id/purchases", getUserPurchases);
router.get("/payments", getAllPayments);
router.delete("/users/:id", deleteUser);

// Mentors Routes
router.get("/mentors", getMentors);
router.post("/mentors", createMentor);
router.put("/mentors/:id", updateMentor);
router.delete("/mentors/:id", deleteMentor);

// Public Website Settings & Pages (Accessible without admin token)
router.get("/public-settings", getPublicSettings);
router.get("/public-pages", getPublicPages);
router.get("/public-pages/:slug", getPublicPageBySlug);

// Custom Pages CMS (Admin Protected)
router.get("/pages", getAdminPages);
router.post("/pages", createAdminPage);
router.put("/pages/:id", updateAdminPage);
router.delete("/pages/:id", deleteAdminPage);

// Courses Routes
router.get("/courses", getCourses);
router.get("/courses/:id", getCourseById);
router.post("/courses", createCourse);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);

// Cloudinary Direct Upload Routes
router.post("/upload/image", upload.single("file"), uploadImage);
router.post("/upload/video", upload.single("file"), uploadVideo);

// System Settings (Cloudinary & SMTP config)
router.get("/settings", getSystemSettings);
router.post("/settings", saveSystemSettings);
router.post("/settings/test-smtp", testSmtpSettings);

// Affiliate & Payouts Management Routes
router.get("/affiliate/stats", getAdminAffiliateStats);
router.get("/affiliate/payouts", getAdminAffiliatePayouts);
router.put("/affiliate/payouts/:id/status", updateAdminAffiliatePayoutStatus);
router.post("/affiliate/payouts/:id/razorpayx", executeRazorpayxPayout);
router.get("/affiliate/users", getAdminAffiliateUsers);
router.get("/affiliate/referrals", getAdminAffiliateReferrals);

// Admin Affiliate Announcements Routes
router.get("/affiliate/announcements", getAdminAffiliateAnnouncements);
router.post("/affiliate/announcements", createAdminAffiliateAnnouncement);
router.put("/affiliate/announcements/:id", updateAdminAffiliateAnnouncement);
router.delete("/affiliate/announcements/:id", deleteAdminAffiliateAnnouncement);

// Dedicated Commission Rates Management Routes
router.put("/commission/package/:id", updatePackageCommission);
router.put("/commission/course/:id", updateCourseCommission);
router.put("/commission/bulk", updateBulkCommissions);

// Video Security & Anti-Piracy DRM Routes
router.get("/video-security", getVideoSecuritySettings);
router.post("/video-security", saveVideoSecuritySettings);


// Available System Modules (Dynamic Registry for RBAC)
router.get("/permissions-modules", getAvailableModules);

// Admin Live Notifications Routes
router.get("/notifications", getAdminNotifications);
router.put("/notifications/read-all", markAllNotificationsRead);
router.put("/notifications/:id/read", markNotificationRead);
router.delete("/notifications/clear", clearAdminNotifications);

// Public Contact Form Submission & Admin Inquiries Management
router.post("/contact/submit", submitContactInquiry);
router.get("/contact/inquiries", getContactInquiries);
router.put("/contact/inquiries/:id", updateContactInquiryStatus);
router.delete("/contact/inquiries/:id", deleteContactInquiry);

// Admin Activity Logs & Audit History Routes
router.get("/activity-logs", getAdminActivityLogs);

// Sub-Admin & Role Management Routes (RBAC)
router.get("/subadmins", getSubAdmins);
router.post("/subadmins", createSubAdmin);
router.put("/subadmins/:id", updateSubAdmin);
router.delete("/subadmins/:id", deleteSubAdmin);

export default router;
