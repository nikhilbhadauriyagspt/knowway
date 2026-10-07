import express from "express";
import {
  sendSignupOtp,
  register,
  login,
  sendForgotPasswordOtp,
  resetPassword,
  getMe,
} from "../controllers/authController.js";
import {
  getCourseQuiz,
  submitCourseQuiz,
  getMyCertificates,
  getCertificateByNumber,
} from "../controllers/quizController.js";

const router = express.Router();

// Public Authentication & OTP Endpoints
router.post("/send-signup-otp", sendSignupOtp);
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password-otp", sendForgotPasswordOtp);
router.post("/reset-password", resetPassword);
router.get("/me", getMe);

// Course Quiz & Certification Endpoints
router.get("/courses/:courseId/quiz", getCourseQuiz);
router.post("/courses/:courseId/quiz/submit", submitCourseQuiz);
router.get("/my-certificates", getMyCertificates);
router.get("/certificates/:certificateNo", getCertificateByNumber);

export default router;
