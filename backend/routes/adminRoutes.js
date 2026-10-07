import express from "express";
import multer from "multer";
import {
  adminLogin,
  getAdminProfile,
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getMentors,
  createMentor,
  deleteMentor,
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getSystemSettings,
  saveSystemSettings,
  testSmtpSettings,
} from "../controllers/adminController.js";
import {
  uploadImage,
  uploadVideo,
} from "../controllers/uploadController.js";

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
router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Mentors Routes
router.get("/mentors", getMentors);
router.post("/mentors", createMentor);
router.delete("/mentors/:id", deleteMentor);

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

export default router;
