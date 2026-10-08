import express from "express";
import {
  getAllPackages,
  getPackageBySlugOrId,
  createPackage,
  updatePackage,
  deletePackage,
} from "../controllers/packageController.js";

const router = express.Router();

// Public Routes
router.get("/", getAllPackages);
router.get("/:slugOrId", getPackageBySlugOrId);

// Admin / Management Routes
router.post("/", createPackage);
router.put("/:id", updatePackage);
router.delete("/:id", deletePackage);

export default router;
