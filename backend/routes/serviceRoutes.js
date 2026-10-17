import express from "express";
import {
  getPublicServices,
  submitServiceInquiry,
  getAdminServices,
  createAdminService,
  updateAdminService,
  deleteAdminService,
  getAdminServiceInquiries,
  updateAdminServiceInquiryStatus,
  deleteAdminServiceInquiry,
} from "../controllers/serviceController.js";

const router = express.Router();

// Public Endpoints
router.get("/", getPublicServices);
router.post("/inquire", submitServiceInquiry);

// Super Admin Endpoints
router.get("/admin/all", getAdminServices);
router.post("/admin", createAdminService);
router.put("/admin/:id", updateAdminService);
router.delete("/admin/:id", deleteAdminService);

// Super Admin Service Inquiries Endpoints
router.get("/admin/inquiries", getAdminServiceInquiries);
router.put("/admin/inquiries/:id", updateAdminServiceInquiryStatus);
router.delete("/admin/inquiries/:id", deleteAdminServiceInquiry);

export default router;
