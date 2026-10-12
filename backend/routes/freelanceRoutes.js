import express from "express";
import {
  getFreelanceModulesPublic,
  submitFreelanceApplication,
  getAdminFreelanceModules,
  createFreelanceModule,
  updateFreelanceModule,
  deleteFreelanceModule,
  createFreelanceLesson,
  updateFreelanceLesson,
  deleteFreelanceLesson,
  getAdminFreelanceApplications,
  updateApplicationStatus,
  getFreelanceTestimonials,
  submitFreelanceTestimonial,
  getAdminFreelanceTestimonials,
  createAdminFreelanceTestimonial,
  updateAdminFreelanceTestimonial,
  deleteAdminFreelanceTestimonial,
} from "../controllers/freelanceController.js";

const router = express.Router();

// Public / Student endpoints
router.get("/modules", getFreelanceModulesPublic);
router.post("/apply", submitFreelanceApplication);
router.get("/testimonials", getFreelanceTestimonials);
router.post("/testimonials", submitFreelanceTestimonial);

// Superadmin endpoints
router.get("/admin/modules", getAdminFreelanceModules);
router.post("/admin/modules", createFreelanceModule);
router.put("/admin/modules/:id", updateFreelanceModule);
router.delete("/admin/modules/:id", deleteFreelanceModule);

router.post("/admin/lessons", createFreelanceLesson);
router.put("/admin/lessons/:id", updateFreelanceLesson);
router.delete("/admin/lessons/:id", deleteFreelanceLesson);

router.get("/admin/applications", getAdminFreelanceApplications);
router.put("/admin/applications/:id/status", updateApplicationStatus);

// Superadmin Testimonials
router.get("/admin/testimonials", getAdminFreelanceTestimonials);
router.post("/admin/testimonials", createAdminFreelanceTestimonial);
router.put("/admin/testimonials/:id", updateAdminFreelanceTestimonial);
router.delete("/admin/testimonials/:id", deleteAdminFreelanceTestimonial);

export default router;
