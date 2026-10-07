import express from "express";
import {
  adminLogin,
  getAdminProfile,
  getDashboardStats,
  getAllUsers,
  deleteUser,
} from "../controllers/adminController.js";

const router = express.Router();

// Super Admin Public Auth Route
router.post("/login", adminLogin);

// Super Admin Protected Routes
router.get("/me", getAdminProfile);
router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

export default router;
