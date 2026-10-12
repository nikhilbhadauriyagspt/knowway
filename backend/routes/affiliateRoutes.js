import express from "express";
import {
  getAffiliateStats,
  getAffiliateIncomeAnalytics,
  getAffiliateReferrals,
  getAffiliateWallet,
  requestPayout,
  getAffiliateLeaderboard,
  getCommissionRates,
  getAffiliateConfig,
  getPayoutMethods,
  savePayoutMethod,
  deletePayoutMethod,
  setDefaultPayoutMethod,
  getAffiliateAnnouncements,
} from "../controllers/affiliateController.js";

const router = express.Router();

// Student Affiliate Routes
router.get("/stats", getAffiliateStats);
router.get("/income-analytics", getAffiliateIncomeAnalytics);
router.get("/referrals", getAffiliateReferrals);
router.get("/wallet", getAffiliateWallet);
router.post("/withdraw", requestPayout);
router.get("/leaderboard", getAffiliateLeaderboard);
router.get("/commission-rates", getCommissionRates);
router.get("/config", getAffiliateConfig);
router.get("/announcements", getAffiliateAnnouncements);

// Saved Payout Methods
router.get("/payout-methods", getPayoutMethods);
router.post("/payout-methods", savePayoutMethod);
router.delete("/payout-methods/:id", deletePayoutMethod);
router.put("/payout-methods/:id/default", setDefaultPayoutMethod);

export default router;
