import express from "express";
import {
  getRazorpayKey,
  createPaymentOrder,
  verifyPayment,
  getMyPackages,
  getMyCourses,
} from "../controllers/paymentController.js";

const router = express.Router();

// Public / Student Payment Routes
router.get("/razorpay-key", getRazorpayKey);
router.post("/create-order", createPaymentOrder);
router.post("/verify-payment", verifyPayment);
router.get("/my-packages", getMyPackages);
router.get("/my-courses", getMyCourses);

export default router;
