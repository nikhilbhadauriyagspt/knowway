import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Wallet,
  Users,
  Copy,
  Check,
  Share2,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Download,
  QrCode,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  CreditCard,
  Send,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Award,
  Layers3,
  Flame,
  Zap,
  Crown,
  Medal,
  Calendar,
  Percent,
} from "lucide-react";
import {
  getUserData,
  getAffiliateStatsApi,
  getAffiliateReferralsApi,
  getAffiliateWalletApi,
  requestAffiliatePayoutApi,
  getAffiliateLeaderboardApi,
  getAffiliateCommissionRatesApi,
  getAffiliateConfigApi,
  getPayoutMethodsApi,
  savePayoutMethodApi,
  deletePayoutMethodApi,
  setDefaultPayoutMethodApi,
} from "../services/api";
import AffiliateHeader from "./components/AffiliateHeader";
import AffiliateSidebar from "./components/AffiliateSidebar";

export default function AffiliateDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedTemplateIdx, setCopiedTemplateIdx] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem("knowway_theme") === "dark" ||
      (!("knowway_theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("knowway_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("knowway_theme", "light");
    }
  }, [darkMode]);

  // Load user
  useEffect(() => {
    const localUser = getUserData();
    if (!localUser) {
      navigate("/login", { replace: true });
      return;
    }
    setUser(localUser);
  }, [navigate]);

  const referralCode = user?.referral_code || (user?.id ? `KW${user.id}` : "KW1001");
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  // Referral metrics state
  const [referrals, setReferrals] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [lifetimeEarned, setLifetimeEarned] = useState(0);
  const [directEarnings, setDirectEarnings] = useState(0);
  const [leadershipEarnings, setLeadershipEarnings] = useState(0);
  const [directReferralsCount, setDirectReferralsCount] = useState(0);
  const [leadershipReferralsCount, setLeadershipReferralsCount] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [payouts, setPayouts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [commissionPackages, setCommissionPackages] = useState([]);
  const [commissionCourses, setCommissionCourses] = useState([]);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState("monthly"); // 'weekly' | 'monthly' | 'yearly'
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardSearch, setLeaderboardSearch] = useState("");

  const handleLeaderboardPeriodChange = async (period) => {
    setLeaderboardPeriod(period);
    setLeaderboardLoading(true);
    try {
      const res = await getAffiliateLeaderboardApi(period);
      if (res?.success) {
        setLeaderboard(res.leaderboard || []);
      }
    } catch (err) {
      console.error("Failed to switch leaderboard period:", err);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  // Fetch Live Data
  const loadAffiliateData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, refsRes, walletRes, lbRes, ratesRes, configRes, methodsRes] = await Promise.allSettled([
        getAffiliateStatsApi(),
        getAffiliateReferralsApi(),
        getAffiliateWalletApi(),
        getAffiliateLeaderboardApi(),
        getAffiliateCommissionRatesApi(),
        getAffiliateConfigApi(),
        getPayoutMethodsApi(),
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value?.success) {
        const s = statsRes.value.stats;
        setWalletBalance(s.currentBalance || 0);
        setLifetimeEarned(s.totalEarned || 0);
        setTotalWithdrawn(s.totalWithdrawn || 0);
        setDirectEarnings(s.directEarnings || 0);
        setLeadershipEarnings(s.leadershipEarnings || 0);
        setDirectReferralsCount(s.directReferralsCount || 0);
        setLeadershipReferralsCount(s.leadershipReferralsCount || 0);
      }

      if (refsRes.status === "fulfilled" && refsRes.value?.success) {
        setReferrals(refsRes.value.referrals || []);
      }

      if (walletRes.status === "fulfilled" && walletRes.value?.success) {
        setPayouts(walletRes.value.payouts || []);
      }

      if (lbRes.status === "fulfilled" && lbRes.value?.success) {
        setLeaderboard(lbRes.value.leaderboard || []);
      }

      if (ratesRes.status === "fulfilled" && ratesRes.value?.success) {
        setCommissionPackages(ratesRes.value.packages || []);
        setCommissionCourses(ratesRes.value.courses || []);
      }

      if (configRes?.status === "fulfilled" && configRes.value?.success) {
        if (configRes.value.minWithdrawal) {
          setMinWithdrawalAmount(Number(configRes.value.minWithdrawal));
        }
      }

      if (methodsRes?.status === "fulfilled" && methodsRes.value?.success) {
        const methods = methodsRes.value.methods || [];
        setSavedPayoutMethods(methods);
        const def = methods.find((m) => m.is_default);
        if (def) setSelectedSavedMethodId(def.id);
        else if (methods.length > 0) setSelectedSavedMethodId(methods[0].id);
      }
    } catch (err) {
      console.error("Failed to load affiliate data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAffiliateData();
    }
  }, [user]);

  // Withdrawal modal state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [minWithdrawalAmount, setMinWithdrawalAmount] = useState(500);
  const [savedPayoutMethods, setSavedPayoutMethods] = useState([]);
  const [selectedSavedMethodId, setSelectedSavedMethodId] = useState(null);
  const [saveForFuture, setSaveForFuture] = useState(true);
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [newMethodType, setNewMethodType] = useState("upi");
  const [newUpiId, setNewUpiId] = useState("");
  const [newBankDetails, setNewBankDetails] = useState({
    holderName: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
  });
  const [isSavingNewMethod, setIsSavingNewMethod] = useState(false);
  const [addMethodError, setAddMethodError] = useState("");

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifsc: "",
    holderName: user?.name || "",
    bankName: "",
  });
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);

  // Referrals filter & search
  const [referralSearch, setReferralSearch] = useState("");
  const [referralFilter, setReferralFilter] = useState("all");

  const filteredReferrals = referrals.filter((r) => {
    const name = r.referred_user_name || r.name || "";
    const idStr = String(r.id || "");
    const title = r.item_title || r.package || "";
    const matchesSearch =
      name.toLowerCase().includes(referralSearch.toLowerCase()) ||
      idStr.toLowerCase().includes(referralSearch.toLowerCase()) ||
      title.toLowerCase().includes(referralSearch.toLowerCase());
    const status = (r.status || "").toLowerCase();
    const matchesFilter =
      referralFilter === "all" ||
      status === referralFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyPromoTemplate = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplateIdx(idx);
    setTimeout(() => setCopiedTemplateIdx(null), 2500);
  };

  const handleSaveNewPayoutMethod = async (e) => {
    e.preventDefault();
    setAddMethodError("");
    if (newMethodType === "upi" && !newUpiId.trim()) {
      setAddMethodError("Please enter a valid UPI ID.");
      return;
    }
    if (newMethodType === "bank" && (!newBankDetails.accountNumber || !newBankDetails.ifsc)) {
      setAddMethodError("Please enter Account Number and IFSC Code.");
      return;
    }

    try {
      setIsSavingNewMethod(true);
      const res = await savePayoutMethodApi({
        type: newMethodType,
        upi_id: newUpiId.trim(),
        holder_name: newBankDetails.holderName.trim() || user?.name,
        account_number: newBankDetails.accountNumber.trim(),
        ifsc_code: newBankDetails.ifsc.trim().toUpperCase(),
        bank_name: newBankDetails.bankName.trim(),
        is_default: savedPayoutMethods.length === 0,
      });
      if (res?.success) {
        setShowAddMethodModal(false);
        setNewUpiId("");
        setNewBankDetails({ holderName: "", accountNumber: "", ifsc: "", bankName: "" });
        loadAffiliateData();
      } else {
        setAddMethodError(res?.message || "Failed to save account.");
      }
    } catch (err) {
      setAddMethodError(err.message || "Failed to save account.");
    } finally {
      setIsSavingNewMethod(false);
    }
  };

  const handleDeletePayoutMethod = async (methodId) => {
    try {
      const res = await deletePayoutMethodApi(methodId);
      if (res?.success) {
        loadAffiliateData();
      }
    } catch (err) {
      console.error("Delete method error:", err);
    }
  };

  const handleSetDefaultPayoutMethod = async (methodId) => {
    try {
      const res = await setDefaultPayoutMethodApi(methodId);
      if (res?.success) {
        loadAffiliateData();
      }
    } catch (err) {
      console.error("Set default method error:", err);
    }
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setWithdrawError("");
    const amountNum = Number(withdrawAmount);

    if (isNaN(amountNum) || amountNum < minWithdrawalAmount) {
      setWithdrawError(`Minimum withdrawal amount is ₹${minWithdrawalAmount.toLocaleString("en-IN")}.`);
      return;
    }

    if (amountNum > walletBalance) {
      setWithdrawError(`Requested amount exceeds available balance (₹${walletBalance}).`);
      return;
    }

    const isUsingSaved = selectedSavedMethodId && selectedSavedMethodId !== "custom";

    if (!isUsingSaved) {
      if (withdrawMethod === "upi" && !upiId.trim()) {
        setWithdrawError("Please provide a valid UPI ID (e.g. mobile@upi).");
        return;
      }
      if (withdrawMethod === "bank" && (!bankDetails.accountNumber || !bankDetails.ifsc)) {
        setWithdrawError("Please fill in account number and IFSC code.");
        return;
      }
    }

    try {
      setIsSubmittingWithdraw(true);
      const payload = isUsingSaved
        ? {
            amount: amountNum,
            saved_method_id: selectedSavedMethodId,
          }
        : {
            amount: amountNum,
            payout_method: withdrawMethod,
            upi_id: upiId.trim(),
            bank_name: bankDetails.bankName.trim(),
            account_number: bankDetails.accountNumber.trim(),
            ifsc_code: bankDetails.ifsc.trim().toUpperCase(),
            holder_name: bankDetails.holderName.trim() || user?.name,
            save_method: saveForFuture,
          };

      const res = await requestAffiliatePayoutApi(payload);

      if (res.success) {
        setWithdrawSuccess(true);
        setWalletBalance((prev) => prev - amountNum);
        loadAffiliateData(); // Refresh history & saved accounts
        setTimeout(() => {
          setWithdrawSuccess(false);
          setShowWithdrawModal(false);
          setWithdrawAmount("");
        }, 2000);
      } else {
        setWithdrawError(res.message || "Failed to process withdrawal request.");
      }
    } catch (err) {
      setWithdrawError(err.message || "Server error while requesting payout.");
    } finally {
      setIsSubmittingWithdraw(false);
    }
  };

  // Promo messages templates
  const promoTemplates = [
    {
      title: "🚀 Skill-Building & Career Growth Pitch",
      desc: "Perfect for sharing in student & freelance WhatsApp groups.",
      text: `Hey! 👋 If you want to learn high-demand digital skills like AI Automation, Full-Stack Web, Graphic Design & Digital Business, check out KnowWay Learning Platform! 🎓\n\nUse my exclusive discount link for direct savings on all packages:\n🔗 ${referralLink}\n\nReferral Code: ${referralCode}\nLet's grow together! 🚀`,
    },
    {
      title: "💡 Special Member Discount Access",
      desc: "Highlights the cut-price savings for enrolled students.",
      text: `🔥 Massive Discount Alert on KnowWay Learning Hub! 🔥\nUnlock Pro, Supreme & Premium packages with live mentor support and verified certificates at discounted rates.\n\nClaim your seat here:\n👉 ${referralLink}\nReferral Code: ${referralCode}`,
    },
    {
      title: "📱 Instagram & Telegram Short Caption",
      desc: "Concise and high-converting for bio or story stickers.",
      text: `Level up your digital skills with KnowWay 🌟 Tap the link to claim student discounts & get verified mentorship: ${referralLink} (Code: ${referralCode})`,
    },
  ];

  // Real Leaderboard from live database
  const displayLeaderboard = leaderboard;

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 relative isolate ${
        darkMode ? "bg-[#0B0F17] text-[#E2E8F0]" : "bg-[#FBFCFF] text-[#0F172A]"
      }`}
    >
      {/* Background Grid */}
      <div
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          backgroundImage: darkMode
            ? `linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)`
            : `linear-gradient(to right, rgba(91,111,150,.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(91,111,150,.07) 1px, transparent 1px)`,
          backgroundSize: "118px 108px",
        }}
      />

      {/* Affiliate Modular Sidebar */}
      <AffiliateSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        referralsCount={referrals.length}
        pendingPayoutCount={payouts.filter((p) => p.status === "In-Review").length}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        darkMode={darkMode}
      />

      {/* Main Container Offset by Sidebar */}
      <div className="lg:pl-[292px] min-h-screen flex flex-col transition-all duration-300 w-full">
        {/* Affiliate Sticky Header */}
        <AffiliateHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          setMobileOpen={setMobileOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Main Content Area - Full Width */}
        <main className="flex-1 pt-5 sm:pt-6 pb-16 px-4 sm:px-8 lg:px-10 w-full space-y-7">
        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW (HERO BANNER + QUICK METRICS + CHART) */}
        {/* ======================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-7 animate-in fade-in duration-200">
            {/* Top Earnings & Partner Hero Banner */}
            <div
              className={`
                rounded-[28px] border p-5 sm:p-7 relative overflow-hidden transition-all
                ${
                  darkMode
                    ? "bg-linear-to-br from-[#131926] via-[#161F33] to-[#131926] border-[#222B3D]"
                    : "bg-linear-to-br from-white via-amber-50/40 to-white border-[#E2E8F0]"
                }
              `}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500 border border-amber-500/25 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5" /> Affiliate Partner Hub
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        darkMode ? "bg-[#1E2638] text-[#94A3B8]" : "bg-gray-100 text-[#64748B]"
                      }`}
                    >
                      Commission Active
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Welcome back, {user?.name?.split(" ")[0] || "Partner"} 👋
                  </h1>
                  <p
                    className={`text-xs sm:text-sm mt-1 max-w-xl ${
                      darkMode ? "text-[#8A99AD]" : "text-[#64748B]"
                    }`}
                  >
                    Track your student referrals, manage your 2-tier commission wallet, and withdraw direct earnings anytime to your bank account or UPI.
                  </p>
                </div>

                {/* Quick Link Capsule Box */}
                <div
                  className={`
                    p-4 rounded-2xl border flex flex-col gap-2.5 sm:min-w-[320px]
                    ${
                      darkMode
                        ? "bg-[#0E1420] border-[#222B3D]"
                        : "bg-white border-[#E2E8F0] shadow-xs"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A99AD]">
                      Your Referral Code
                    </span>
                    <span className="text-xs font-mono font-black text-amber-500 px-2 py-0.5 rounded-md bg-amber-500/10">
                      {referralCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyLink}
                      className={`flex-1 h-10 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                        copiedLink
                          ? "bg-emerald-600 text-white"
                          : "bg-[#035BE3] text-white hover:bg-[#024ec2]"
                      }`}
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-4 h-4" /> Copied Link!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copy Referral Link
                        </>
                      )}
                    </button>

                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `Hey! Join KnowWay with my referral link to get special student discounts on top digital skill packages: ${referralLink}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="h-10 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                      title="Share on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Metrics Bar (2-Tier Breakdown) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mt-6 pt-6 border-t border-inherit">
                <div
                  className={`p-4 rounded-2xl border ${
                    darkMode ? "bg-[#131926]/70 border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[#8A99AD] mb-1">
                    <span className="text-[11px] font-bold uppercase">Total Lifetime</span>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-emerald-500">
                    ₹{lifetimeEarned.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-[#8A99AD] mt-0.5">All 2-tier payouts</p>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    darkMode ? "bg-emerald-950/20 border-emerald-900/40" : "bg-emerald-50/60 border-emerald-200/80"
                  }`}
                >
                  <div className="flex items-center justify-between text-[#8A99AD] mb-1">
                    <span className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">🟢 Direct (Tier 1)</span>
                    <Users className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    ₹{directEarnings.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-[#8A99AD] mt-0.5">{directReferralsCount} direct sales</p>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    darkMode ? "bg-amber-950/20 border-amber-900/40" : "bg-amber-50/60 border-amber-200/80"
                  }`}
                >
                  <div className="flex items-center justify-between text-[#8A99AD] mb-1">
                    <span className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400">⭐ Sponsor (Tier 2)</span>
                    <Award className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                    ₹{leadershipEarnings.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-[#8A99AD] mt-0.5">{leadershipReferralsCount} team sales</p>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    darkMode ? "bg-[#131926]/70 border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[#8A99AD] mb-1">
                    <span className="text-[11px] font-bold uppercase">Wallet Balance</span>
                    <Wallet className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-amber-500">
                    ₹{walletBalance.toLocaleString()}
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab("wallet");
                      setShowWithdrawModal(true);
                    }}
                    className="text-[10px] text-[#035BE3] hover:underline font-bold mt-0.5 inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    Withdraw Funds <ChevronRight className="w-2.5 h-2.5" />
                  </button>
                </div>

                <div
                  className={`p-4 rounded-2xl border col-span-2 sm:col-span-1 ${
                    darkMode ? "bg-[#131926]/70 border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[#8A99AD] mb-1">
                    <span className="text-[11px] font-bold uppercase">Withdrawn</span>
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-xl sm:text-2xl font-black">
                    ₹{totalWithdrawn.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-[#8A99AD] mt-0.5">Settled to bank</p>
                </div>
              </div>
            </div>

            {/* Visual Performance & Referral Link Generator Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Earnings Breakdown / Visual Graph Representation */}
              <div
                className={`lg:col-span-2 rounded-[28px] border p-6 ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-bold">Earnings Activity & Growth</h2>
                    <p className="text-xs text-[#8A99AD] mt-0.5">
                      Weekly affiliate revenue breakdown from 2-tier student conversions
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-500 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    +24.5% this month
                  </span>
                </div>

                {/* Simulated Chart Bars */}
                <div className="space-y-3 pt-2">
                  {[
                    { week: "Week 1 (Feb 01 - 07)", amount: "₹4,800", count: 3, fill: "60%" },
                    { week: "Week 2 (Feb 08 - 14)", amount: "₹6,400", count: 4, fill: "75%" },
                    { week: "Week 3 (Feb 15 - 21)", amount: "₹8,350", count: 5, fill: "90%" },
                    { week: "Week 4 (Feb 22 - 28)", amount: "₹8,900", count: 6, fill: "98%" },
                  ].map((w, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold">{w.week}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[#8A99AD]">{w.count} conversions</span>
                          <span className="font-bold text-emerald-500">{w.amount}</span>
                        </div>
                      </div>
                      <div
                        className={`h-2.5 rounded-full overflow-hidden ${
                          darkMode ? "bg-[#1E2638]" : "bg-gray-100"
                        }`}
                      >
                        <div
                          className="h-full rounded-full bg-linear-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                          style={{ width: w.fill }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-inherit flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-[#8A99AD]">
                    Next automated payout cycle: <span className="font-bold text-white">Every Sunday</span>
                  </div>
                  <button
                    onClick={() => setActiveTab("wallet")}
                    className="text-xs font-bold text-[#035BE3] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Wallet & History <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Quick Referral Invite Card */}
              <div
                className={`rounded-[28px] border p-6 flex flex-col justify-between ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-bold">Invite & Earn 2-Tiers</h3>
                  </div>

                  <p className="text-xs text-[#8A99AD] mb-4">
                    Share your unique link with students. Earn Tier 1 commission on direct sales and Tier 2 sponsor bonus on your team sales!
                  </p>

                  <div className={`p-3 rounded-xl border mb-4 space-y-1.5 ${
                    darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                  }`}>
                    <span className="text-[10px] uppercase font-bold text-[#8A99AD] block">Your Code</span>
                    <span className="font-mono text-sm font-black text-amber-500 block">{referralCode}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleCopyLink}
                    className="w-full h-10 rounded-xl bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedLink ? "Link Copied!" : "Copy Share Link"}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("promos")}
                    className={`w-full h-9 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      darkMode ? "border-[#222B3D] text-[#8A99AD] hover:text-white" : "border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]"
                    }`}
                  >
                    <Share2 size={13} />
                    <span>Marketing Templates</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MY REFERRALS NETWORK */}
        {/* ======================================================== */}
        {activeTab === "referrals" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div
              className={`rounded-[28px] border p-6 ${
                darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold">Referral Student Network</h2>
                  <p className="text-xs text-[#8A99AD] mt-0.5">
                    Full list of students enrolled using referral code:{" "}
                    <span className="font-mono font-bold text-amber-500">{referralCode}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Search input */}
                  <div
                    className={`h-10 rounded-full border px-3.5 flex items-center gap-2 ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                  >
                    <Search className="w-3.5 h-3.5 text-[#8A99AD]" />
                    <input
                      type="text"
                      value={referralSearch}
                      onChange={(e) => setReferralSearch(e.target.value)}
                      placeholder="Search student or package..."
                      className="bg-transparent text-xs outline-none placeholder-[#8A99AD] w-36 sm:w-48"
                    />
                  </div>

                  {/* Filter tabs */}
                  <select
                    value={referralFilter}
                    onChange={(e) => setReferralFilter(e.target.value)}
                    className={`h-10 rounded-full border px-3 text-xs font-semibold outline-none cursor-pointer ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  >
                    <option value="all">All Status</option>
                    <option value="credited">Credited</option>
                    <option value="processing">Processing</option>
                  </select>
                </div>
              </div>

              {/* Referrals Table */}
              <div className="overflow-x-auto rounded-2xl border border-inherit">
                <table className="w-full text-left text-xs">
                  <thead
                    className={`border-b ${
                      darkMode
                        ? "bg-[#0E1420] border-[#222B3D] text-[#8A99AD]"
                        : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]"
                    }`}
                  >
                    <tr>
                      <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-[10px]">Referral ID</th>
                      <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-[10px]">Tier / Level</th>
                      <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-[10px]">Student Details</th>
                      <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-[10px]">Item Enrolled</th>
                      <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-[10px]">Package Value</th>
                      <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-[10px]">Commission Earned</th>
                      <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-[10px]">Date</th>
                      <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-[10px]">Payout Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-inherit">
                    {filteredReferrals.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-xs text-[#8A99AD]">
                          No referral conversions match your filter.
                        </td>
                      </tr>
                    ) : (
                      filteredReferrals.map((r) => {
                        const isLeadership = r.commission_tier === "leadership" || Number(r.tier_level) === 2;
                        const studentName = r.referred_user_name || r.name || "Student";
                        const studentEmail = r.referred_user_email || r.email || "—";
                        const studentPhone = r.referred_user_phone || r.phone || "";
                        const itemTitle = r.item_title || r.package || "Course / Package";
                        const itemPrice = Number(r.item_price || r.packagePrice || 0);
                        const commissionAmount = Number(r.commission_amount || r.commission || 0);
                        const rateLabel =
                          r.commission_type === "flat"
                            ? `₹${r.commission_value} Flat`
                            : r.commission_value
                            ? `${r.commission_value}%`
                            : r.commissionRate || "20%";
                        const dateFormatted = r.created_at
                          ? new Date(r.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : r.date || "—";
                        const statusStr = r.status || "credited";
                        const isCredited = statusStr.toLowerCase() === "credited";

                        return (
                          <tr
                            key={r.id}
                            className={`transition-colors ${
                              darkMode ? "hover:bg-[#1A2234]/50" : "hover:bg-[#F8FAFC]"
                            }`}
                          >
                            <td className="py-3.5 px-5 font-mono text-[11px] font-bold text-[#8A99AD]">
                              #{r.id}
                            </td>
                            <td className="py-3.5 px-5">
                              {isLeadership ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                  ⭐ Level 2 (Leadership)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                  🟢 Level 1 (Direct)
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-5">
                              <p className="font-bold text-xs">{studentName}</p>
                              <p className="text-[10px] text-[#8A99AD]">
                                {studentEmail}{studentPhone ? ` • ${studentPhone}` : ""}
                              </p>
                              {isLeadership && r.direct_referrer_name && (
                                <p className="text-[9.5px] text-[#8A99AD] mt-0.5">
                                  ↳ Via Team Member: <span className="font-semibold text-amber-500">{r.direct_referrer_name}</span>
                                </p>
                              )}
                            </td>
                            <td className="py-3.5 px-5 font-semibold text-xs">
                              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-[11px] font-bold">
                                {itemTitle}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 font-medium">
                              ₹{itemPrice.toLocaleString("en-IN")}
                            </td>
                            <td className="py-3.5 px-5">
                              <span className="font-black text-emerald-500 text-xs">
                                ₹{commissionAmount.toLocaleString("en-IN")}
                              </span>
                              <span className="text-[10px] text-[#8A99AD] ml-1">({rateLabel})</span>
                            </td>
                            <td className="py-3.5 px-5 text-[#8A99AD]">{dateFormatted}</td>
                            <td className="py-3.5 px-5">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                  isCredited
                                    ? "bg-emerald-500/10 text-emerald-500"
                                    : "bg-amber-500/10 text-amber-500"
                                }`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {statusStr}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: WALLET & PAYOUTS */}
        {/* ======================================================== */}
        {activeTab === "wallet" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Wallet Balance Hero */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div
                className={`md:col-span-2 rounded-[28px] border p-6 flex flex-col justify-between ${
                  darkMode
                    ? "bg-gradient-to-br from-[#131926] to-[#172033] border-[#222B3D]"
                    : "bg-gradient-to-br from-white to-amber-50/30 border-[#E2E8F0] shadow-xs"
                }`}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8A99AD] block mb-1">
                    Available Withdrawable Balance
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-amber-500">
                      ₹{walletBalance.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-[#8A99AD]">Ready for instant transfer</span>
                  </div>
                  <p className="text-xs text-[#8A99AD] mt-2">
                    Minimum withdrawal threshold: <span className="font-bold text-amber-500">₹{minWithdrawalAmount.toLocaleString("en-IN")}</span>. Payouts are settled directly to UPI or Bank Account via RazorpayX / IMPS within 24-48 hours.
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-inherit flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setShowWithdrawModal(true);
                      setWithdrawError("");
                      setWithdrawSuccess(false);
                      setWithdrawAmount("");
                    }}
                    disabled={walletBalance < minWithdrawalAmount}
                    className="h-11 px-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs transition shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" /> Request Payout Now
                  </button>
                  <span className="text-[11px] text-[#8A99AD]">
                    {walletBalance >= minWithdrawalAmount
                      ? "✅ Balance eligible for payout"
                      : `⚠️ Minimum ₹${minWithdrawalAmount.toLocaleString("en-IN")} required`}
                  </span>
                </div>
              </div>

              <div
                className={`rounded-[28px] border p-6 flex flex-col justify-between ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                }`}
              >
                <div>
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#035BE3]" /> Settlement Summary
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-inherit">
                      <span className="text-[#8A99AD]">Lifetime Withdrawn:</span>
                      <span className="font-black text-emerald-500">₹{totalWithdrawn.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-inherit">
                      <span className="text-[#8A99AD]">Direct Earnings (L1):</span>
                      <span className="font-bold text-emerald-600">₹{directEarnings.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-inherit">
                      <span className="text-[#8A99AD]">Sponsor Earnings (L2):</span>
                      <span className="font-bold text-amber-500">₹{leadershipEarnings.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8A99AD]">Pending Payouts:</span>
                      <span className="font-bold">{payouts.filter((p) => p.status === "pending" || p.status === "In-Review").length}</span>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-[#8A99AD] mt-4 pt-3 border-t border-inherit">
                  ⚡ Dual Rail: RazorpayX 1-Click Auto Payout & Instant IMPS
                </p>
              </div>
            </div>

            {/* SAVED PAYOUT METHODS MANAGER SECTION */}
            <div
              className={`rounded-[28px] border p-6 ${
                darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#035BE3]" />
                    <span>Saved Payout Accounts</span>
                  </h3>
                  <p className="text-xs text-[#8A99AD] mt-0.5">
                    Save your Bank Account or UPI ID for 1-click seamless withdrawal requests.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMethodModal(true);
                    setAddMethodError("");
                  }}
                  className="px-4 py-2 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <span>+ Add New Account / UPI</span>
                </button>
              </div>

              {savedPayoutMethods.length === 0 ? (
                <div className={`p-6 rounded-2xl border text-center space-y-2 ${
                  darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-slate-50/70 border-slate-200"
                }`}>
                  <p className="text-xs font-semibold text-[#8A99AD]">No saved payout accounts found yet.</p>
                  <p className="text-[11px] text-[#8A99AD]">Add your UPI ID or Bank details once to enable 1-click payouts anytime.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {savedPayoutMethods.map((m) => (
                    <div
                      key={m.id}
                      className={`p-4 rounded-2xl border relative flex flex-col justify-between transition ${
                        m.is_default
                          ? "border-[#035BE3] bg-blue-500/5 dark:bg-blue-950/20"
                          : darkMode
                          ? "border-[#222B3D] bg-[#0E1420]"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            m.type === "upi"
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                              : "bg-blue-500/10 text-[#035BE3]"
                          }`}>
                            {m.type === "upi" ? "⚡ UPI ID" : "🏦 Bank Account"}
                          </span>
                          {m.is_default && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              Default
                            </span>
                          )}
                        </div>

                        {m.type === "upi" ? (
                          <div className="pt-1">
                            <p className="font-mono text-xs font-black text-slate-900 dark:text-white truncate">{m.upi_id}</p>
                            <p className="text-[11px] text-[#8A99AD] mt-0.5">{m.holder_name || user?.name || "Student Partner"}</p>
                          </div>
                        ) : (
                          <div className="pt-1 space-y-0.5">
                            <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                              {m.bank_name || "Bank Account"}
                            </p>
                            <p className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                              A/C: •••• {String(m.account_number || "").slice(-4)}
                            </p>
                            <p className="text-[10px] text-[#8A99AD]">IFSC: {m.ifsc_code} • {m.holder_name}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-inherit flex items-center justify-between text-[11px]">
                        {!m.is_default ? (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultPayoutMethod(m.id)}
                            className="text-[#035BE3] hover:underline font-bold cursor-pointer"
                          >
                            Set as Default
                          </button>
                        ) : (
                          <span className="text-[#8A99AD] text-[10px]">Primary Destination</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeletePayoutMethod(m.id)}
                          className="text-red-500 hover:text-red-600 font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payout History Ledger Table */}
            <div
              className={`rounded-[28px] border p-6 ${
                darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
              }`}
            >
              <h3 className="text-base font-bold mb-4">Withdrawal Request History</h3>
              <div className="overflow-x-auto rounded-2xl border border-inherit">
                <table className="w-full text-left text-xs">
                  <thead
                    className={`border-b ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D] text-[#8A99AD]" : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]"
                    }`}
                  >
                    <tr>
                      <th className="py-3.5 px-5 font-bold uppercase text-[10px]">Payout ID</th>
                      <th className="py-3.5 px-5 font-bold uppercase text-[10px]">Amount</th>
                      <th className="py-3.5 px-5 font-bold uppercase text-[10px]">Destination</th>
                      <th className="py-3.5 px-5 font-bold uppercase text-[10px]">Requested Date</th>
                      <th className="py-3.5 px-5 font-bold uppercase text-[10px]">Status</th>
                      <th className="py-3.5 px-5 font-bold uppercase text-[10px]">UTR / Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-inherit">
                    {payouts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-xs text-[#8A99AD]">
                          No withdrawal requests found.
                        </td>
                      </tr>
                    ) : (
                      payouts.map((p) => (
                        <tr key={p.id} className={darkMode ? "hover:bg-[#1A2234]/50" : "hover:bg-[#F8FAFC]"}>
                          <td className="py-3.5 px-5 font-mono font-bold text-[#8A99AD]">#{p.id}</td>
                          <td className="py-3.5 px-5 font-black text-emerald-500">₹{Number(p.amount).toLocaleString()}</td>
                          <td className="py-3.5 px-5">
                            <span className="font-bold capitalize">{p.payout_method || "UPI"}</span>
                            <p className="text-[10px] text-[#8A99AD] font-mono">{p.upi_id || p.account_number || "—"}</p>
                          </td>
                          <td className="py-3.5 px-5 text-[#8A99AD]">
                            {p.requested_at ? new Date(p.requested_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                          </td>
                          <td className="py-3.5 px-5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                p.status === "Approved" || p.status === "completed"
                                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                  : p.status === "Rejected"
                                  ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                  : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 font-mono text-[10.5px] text-[#8A99AD]">
                            {p.utr_number ? (
                              <span className="font-bold text-emerald-500">UTR: {p.utr_number}</span>
                            ) : p.admin_note ? (
                              p.admin_note
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: 2-TIER COMMISSION MATRIX (RATES BREAKDOWN) */}
        {/* ======================================================== */}
        {(activeTab === "matrix" || activeTab === "tiers") && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div
              className={`rounded-[28px] border p-6 ${
                darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
              }`}
            >
              <div className="mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Transparent 2-Tier Commission Matrix
                </span>
                <h2 className="text-xl font-black mt-2">Earn Direct & Team Sponsor Commissions</h2>
                <p className="text-xs text-[#8A99AD] mt-1">
                  Commission is calculated directly from the final checkout price (either % percentage or flat rate defined by admin) and credited to your wallet instantly.
                </p>
              </div>

              {/* Packages Commission Matrix (2-Tier Direct + Leadership) */}
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A99AD] mb-3 flex items-center gap-1.5">
                  <Layers3 className="w-4 h-4 text-amber-500" /> Package 2-Tier Commission Rates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(commissionPackages.length > 0 ? commissionPackages : [
                    { name: "Pro Package", mrp_price: 11800, promo_price: 7999, commission_type: "percentage", commission_value: 20, leadership_commission_type: "percentage", leadership_commission_value: 5 },
                    { name: "Supreme Package", mrp_price: 14800, promo_price: 9999, commission_type: "percentage", commission_value: 22, leadership_commission_type: "percentage", leadership_commission_value: 5 },
                    { name: "Premium Package", mrp_price: 18800, promo_price: 12999, commission_type: "percentage", commission_value: 25, leadership_commission_type: "percentage", leadership_commission_value: 5 },
                    { name: "Premium Plus", mrp_price: 24800, promo_price: 16999, commission_type: "percentage", commission_value: 30, leadership_commission_type: "percentage", leadership_commission_value: 5 },
                  ]).map((item, idx) => {
                    const isDirectFlat = item.commission_type === "flat";
                    const directVal = Number(item.commission_value) || 20;
                    const directEarning = isDirectFlat
                      ? directVal
                      : Math.round(((item.promo_price || 7999) * directVal) / 100);

                    const isLeadFlat = item.leadership_commission_type === "flat";
                    const leadVal = Number(item.leadership_commission_value) || 5;
                    const leadEarning = isLeadFlat
                      ? leadVal
                      : Math.round(((item.promo_price || 7999) * leadVal) / 100);

                    return (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl border flex flex-col justify-between ${
                          darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 uppercase">
                              {item.slug || "Package"}
                            </span>
                            <span className="text-[11px] font-black text-emerald-500">
                              {isDirectFlat ? `₹${directVal} Flat` : `${directVal}%`} Direct
                            </span>
                          </div>
                          <h4 className="text-sm font-bold">{item.name}</h4>
                          <p className="text-lg font-black mt-1">₹{Number(item.promo_price || 0).toLocaleString()}</p>
                          {item.mrp_price > 0 && (
                            <p className="text-[10px] text-[#8A99AD] line-through">Standard: ₹{Number(item.mrp_price).toLocaleString()}</p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-inherit space-y-2">
                          {/* Level 1 Direct */}
                          <div className={`p-2 rounded-xl border flex items-center justify-between ${
                            darkMode ? "bg-emerald-950/20 border-emerald-900/40" : "bg-emerald-50/70 border-emerald-200/80"
                          }`}>
                            <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400">🟢 Tier 1 (Direct):</span>
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                              +₹{directEarning.toLocaleString()}
                            </span>
                          </div>

                          {/* Level 2 Leadership Sponsor */}
                          <div className={`p-2 rounded-xl border flex items-center justify-between ${
                            darkMode ? "bg-amber-950/20 border-amber-900/40" : "bg-amber-50/70 border-amber-200/80"
                          }`}>
                            <span className="text-[10.5px] font-bold text-amber-600 dark:text-amber-400">⭐ Tier 2 (Sponsor):</span>
                            <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                              +₹{leadEarning.toLocaleString()} ({isLeadFlat ? "Flat" : `${leadVal}%`})
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Individual Courses Commission Matrix (2-Tier) */}
              {commissionCourses.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#8A99AD] mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-500" /> Individual Course Commissions (2-Tier)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {commissionCourses.slice(0, 6).map((c, idx) => {
                      const isDirectFlat = c.commission_type === "flat";
                      const directVal = Number(c.commission_value) || 20;
                      const directEarning = isDirectFlat
                        ? directVal
                        : Math.round(((c.promo_price || 499) * directVal) / 100);

                      const isLeadFlat = c.leadership_commission_type === "flat";
                      const leadVal = Number(c.leadership_commission_value) || 5;
                      const leadEarning = isLeadFlat
                        ? leadVal
                        : Math.round(((c.promo_price || 499) * leadVal) / 100);

                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border flex items-center justify-between ${
                            darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold line-clamp-1">{c.title}</p>
                            <p className="text-[10px] text-[#8A99AD]">Price: ₹{Number(c.promo_price || 499).toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-emerald-500 block">
                              +₹{directEarning.toLocaleString()} <span className="text-[9px] text-[#8A99AD] font-normal">(L1 Direct)</span>
                            </span>
                            <span className="text-[10px] font-bold text-amber-500 block">
                              +₹{leadEarning.toLocaleString()} <span className="text-[9px] text-[#8A99AD] font-normal">(L2 Sponsor)</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: CHAMPIONSHIP LEADERBOARD & PODIUM */}
        {/* ======================================================== */}
        {activeTab === "leaderboard" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div
              className={`rounded-[32px] border p-6 sm:p-8 relative overflow-hidden transition-all ${
                darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-sm"
              }`}
            >
              {/* Leaderboard Header with Dynamic Period Switcher */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8 pb-6 border-b border-inherit">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-500 border border-amber-500/25 flex items-center gap-1.5 uppercase tracking-wider">
                      <Trophy className="w-3.5 h-3.5" /> Hall of Champions
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      darkMode ? "bg-[#1E2638] text-[#94A3B8]" : "bg-gray-100 text-[#64748B]"
                    }`}>
                      Live Earnings & Sales
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Affiliate Partner Leaderboard 🏆
                  </h2>
                  <p className={`text-xs sm:text-sm mt-1 max-w-xl ${
                    darkMode ? "text-[#8A99AD]" : "text-[#64748B]"
                  }`}>
                    Recognizing top revenue-generating student affiliates. Switch timeframes to view weekly breakouts, monthly toppers, and all-time champions.
                  </p>
                </div>

                {/* Period Switcher Tabs */}
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#0E1420] p-1.5 rounded-2xl border border-gray-200 dark:border-[#222B3D] shrink-0 self-start md:self-auto">
                  {[
                    { id: "weekly", label: "⚡ Weekly (7D)" },
                    { id: "monthly", label: "📅 Monthly (30D)" },
                    { id: "yearly", label: "👑 Yearly (All-Time)" },
                  ].map((p) => {
                    const isActive = leaderboardPeriod === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleLeaderboardPeriodChange(p.id)}
                        disabled={leaderboardLoading}
                        className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          isActive
                            ? "bg-linear-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20"
                            : "text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TOP 3 PODIUM HERO SHOWCASE */}
              {(() => {
                const list = displayLeaderboard;
                const rank1 = list[0] || null;
                const rank2 = list[1] || null;
                const rank3 = list[2] || null;

                return (
                  <div className="mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-end">
                      {/* ===================== RANK #2: SILVER PODIUM ===================== */}
                      {rank2 && (
                        <div
                          className={`order-2 md:order-1 rounded-[28px] border p-6 flex flex-col items-center text-center relative transition-all duration-300 hover:-translate-y-1 ${
                            darkMode
                              ? "bg-linear-to-b from-[#182032] to-[#131926] border-slate-700/80 shadow-lg shadow-slate-900/40"
                              : "bg-linear-to-b from-slate-50 to-white border-slate-300/80 shadow-md shadow-slate-200/50"
                          }`}
                        >
                          {/* Rank Badge */}
                          <div className="absolute -top-3.5 px-3 py-1 rounded-full bg-linear-to-r from-slate-400 to-slate-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                            <Medal size={13} /> 2nd Runner Up
                          </div>

                          {/* Avatar */}
                          <div className="relative mt-2 mb-3">
                            {rank2.avatar ? (
                              <img
                                src={rank2.avatar}
                                alt=""
                                aria-hidden="true"
                                className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover border-4 border-slate-300 dark:border-slate-600 shadow-md"
                              />
                            ) : (
                              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-linear-to-br from-slate-400 to-slate-600 text-white font-black text-2xl flex items-center justify-center border-4 border-slate-300 dark:border-slate-600 shadow-md">
                                {rank2.name ? rank2.name.charAt(0).toUpperCase() : "U"}
                              </div>
                            )}
                            <span className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white font-black text-xs flex items-center justify-center border-2 border-white dark:border-[#131926] shadow-xs">
                              2
                            </span>
                          </div>

                          <h3 className="text-base font-bold line-clamp-1">{rank2.name}</h3>
                          <span className="text-[10px] font-mono text-[#8A99AD] font-semibold">{rank2.student_id || "KW1002"}</span>

                          {/* Sales Count */}
                          <div className="mt-2.5 px-3 py-1 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-300 text-[11px] font-bold border border-slate-400/20">
                            {rank2.sales} Conversions
                          </div>

                          {/* Earnings */}
                          <div className="mt-4 pt-3 border-t border-inherit w-full">
                            <span className="text-[10px] uppercase font-bold text-[#8A99AD] block">
                              {leaderboardPeriod === "weekly" ? "Weekly" : leaderboardPeriod === "yearly" ? "All-Time" : "Monthly"} Earnings
                            </span>
                            <span className="text-xl font-black text-slate-700 dark:text-slate-200 mt-0.5 block">
                              {rank2.earnings}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* ===================== RANK #1: GOLD CHAMPION PODIUM ===================== */}
                      {rank1 && (
                        <div
                          className={`order-1 md:order-2 rounded-[32px] border-2 p-7 flex flex-col items-center text-center relative transition-all duration-300 hover:-translate-y-1.5 md:-mt-6 ${
                            darkMode
                              ? "bg-linear-to-b from-[#261E14] via-[#1C160F] to-[#131926] border-amber-500/80 shadow-2xl shadow-amber-500/20"
                              : "bg-linear-to-b from-amber-50 via-amber-50/40 to-white border-amber-400 shadow-xl shadow-amber-500/15"
                          }`}
                        >
                          {/* Animated Floating Crown & Champion Pill */}
                          <div className="absolute -top-5 px-4 py-1.5 rounded-full bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 animate-pulse">
                            <Crown size={15} className="fill-current text-black" /> Grand Champion #1
                          </div>

                          {/* Avatar with Golden Ring */}
                          <div className="relative mt-3 mb-3">
                            <div className="absolute -inset-1 rounded-full bg-linear-to-r from-amber-400 to-yellow-500 opacity-75 blur-xs animate-tilt" />
                            {rank1.avatar ? (
                              <img
                                src={rank1.avatar}
                                alt=""
                                aria-hidden="true"
                                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-amber-400 shadow-xl"
                              />
                            ) : (
                              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-linear-to-br from-amber-500 to-yellow-500 text-black font-black text-3xl flex items-center justify-center border-4 border-amber-400 shadow-xl">
                                {rank1.name ? rank1.name.charAt(0).toUpperCase() : "U"}
                              </div>
                            )}
                            <span className="absolute -bottom-2 -right-1 w-8 h-8 rounded-full bg-linear-to-tr from-amber-500 to-yellow-300 text-black font-black text-sm flex items-center justify-center border-2 border-white dark:border-[#131926] shadow-md">
                              👑
                            </span>
                          </div>

                          <h3 className="text-lg font-black mt-1 line-clamp-1">{rank1.name}</h3>
                          <span className="text-[11px] font-mono text-amber-500 font-bold">{rank1.student_id || "KW1001"} • MVP Partner</span>

                          {/* Sales Count */}
                          <div className="mt-3 px-3.5 py-1.2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black border border-amber-500/30 flex items-center gap-1">
                            <Flame size={13} /> {rank1.sales} Package Sales
                          </div>

                          {/* Earnings */}
                          <div className="mt-4 pt-4 border-t border-inherit w-full">
                            <span className="text-[11px] uppercase font-bold text-[#8A99AD] block">
                              Total {leaderboardPeriod === "weekly" ? "Weekly" : leaderboardPeriod === "yearly" ? "All-Time" : "Monthly"} Payout
                            </span>
                            <span className="text-2xl sm:text-3xl font-black bg-linear-to-r from-amber-500 via-amber-400 to-yellow-500 bg-clip-text text-transparent mt-0.5 block">
                              {rank1.earnings}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* ===================== RANK #3: BRONZE PODIUM ===================== */}
                      {rank3 && (
                        <div
                          className={`order-3 md:order-3 rounded-[28px] border p-6 flex flex-col items-center text-center relative transition-all duration-300 hover:-translate-y-1 ${
                            darkMode
                              ? "bg-linear-to-b from-[#211B16] to-[#131926] border-amber-800/60 shadow-lg shadow-amber-950/40"
                              : "bg-linear-to-b from-orange-50/50 to-white border-amber-700/30 shadow-md shadow-orange-100"
                          }`}
                        >
                          {/* Rank Badge */}
                          <div className="absolute -top-3.5 px-3 py-1 rounded-full bg-linear-to-r from-amber-700 to-amber-900 text-white text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                            <Medal size={13} /> 3rd Runner Up
                          </div>

                          {/* Avatar */}
                          <div className="relative mt-2 mb-3">
                            {rank3.avatar ? (
                              <img
                                src={rank3.avatar}
                                alt=""
                                aria-hidden="true"
                                className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover border-4 border-amber-700 dark:border-amber-800 shadow-md"
                              />
                            ) : (
                              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-linear-to-br from-amber-700 to-amber-900 text-white font-black text-2xl flex items-center justify-center border-4 border-amber-700 dark:border-amber-800 shadow-md">
                                {rank3.name ? rank3.name.charAt(0).toUpperCase() : "U"}
                              </div>
                            )}
                            <span className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-800 text-white font-black text-xs flex items-center justify-center border-2 border-white dark:border-[#131926] shadow-xs">
                              3
                            </span>
                          </div>

                          <h3 className="text-base font-bold line-clamp-1">{rank3.name}</h3>
                          <span className="text-[10px] font-mono text-[#8A99AD] font-semibold">{rank3.student_id || "KW1003"}</span>

                          {/* Sales Count */}
                          <div className="mt-2.5 px-3 py-1 rounded-full bg-amber-700/10 text-amber-700 dark:text-amber-400 text-[11px] font-bold border border-amber-700/20">
                            {rank3.sales} Conversions
                          </div>

                          {/* Earnings */}
                          <div className="mt-4 pt-3 border-t border-inherit w-full">
                            <span className="text-[10px] uppercase font-bold text-[#8A99AD] block">
                              {leaderboardPeriod === "weekly" ? "Weekly" : leaderboardPeriod === "yearly" ? "All-Time" : "Monthly"} Earnings
                            </span>
                            <span className="text-xl font-black text-amber-700 dark:text-amber-400 mt-0.5 block">
                              {rank3.earnings}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* YOUR CURRENT STANDING BANNER */}
              {user && (
                <div
                  className={`rounded-2xl p-4 sm:p-5 mb-8 border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
                    darkMode
                      ? "bg-linear-to-r from-[#0E1B33] via-[#122244] to-[#0E1B33] border-[#035BE3]/40"
                      : "bg-linear-to-r from-blue-50 via-indigo-50/50 to-blue-50 border-blue-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-2xl bg-[#035BE3] text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
                      ⭐
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-[#035BE3] uppercase">
                          Your Active Standing
                        </span>
                        <span className="text-xs text-[#8A99AD]">({user.name})</span>
                      </div>
                      <p className="text-sm font-bold mt-0.5">
                        You have generated <span className="text-emerald-500 font-black">{referrals.length} Sales</span> worth <span className="text-amber-500 font-black">₹{lifetimeEarned.toLocaleString()}</span> in commissions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2 rounded-xl text-xs font-black bg-[#035BE3] hover:bg-[#024bc0] text-white flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                    >
                      <Share2 size={13} /> Share Link & Rank Up
                    </button>
                  </div>
                </div>
              )}

              {/* DETAILED RANKINGS TABLE & SEARCH */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#035BE3]" /> Full Leaderboard Rankings
                    </h3>
                    <p className="text-xs text-[#8A99AD]">Showing all ranked affiliate partners for {leaderboardPeriod} timeframe</p>
                  </div>

                  {/* Search Bar */}
                  <div
                    className={`h-10 rounded-full border px-3.5 flex items-center gap-2 w-full sm:w-64 ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                  >
                    <Search className="w-3.5 h-3.5 text-[#8A99AD]" />
                    <input
                      type="text"
                      value={leaderboardSearch}
                      onChange={(e) => setLeaderboardSearch(e.target.value)}
                      placeholder="Search affiliate name or ID..."
                      className="bg-transparent text-xs outline-none placeholder-[#8A99AD] w-full"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-inherit">
                  <table className="w-full text-left text-xs">
                    <thead
                      className={`border-b uppercase text-[10px] tracking-wider ${
                        darkMode
                          ? "bg-[#0E1420] border-[#222B3D] text-[#8A99AD]"
                          : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]"
                      }`}
                    >
                      <tr>
                        <th className="py-3.5 px-5 font-bold">Rank</th>
                        <th className="py-3.5 px-5 font-bold">Affiliate Partner</th>
                        <th className="py-3.5 px-5 font-bold">Student ID</th>
                        <th className="py-3.5 px-5 font-bold">Conversions (Sales)</th>
                        <th className="py-3.5 px-5 font-bold">Income Earned</th>
                        <th className="py-3.5 px-5 font-bold">Reward Tier Badge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-inherit">
                      {displayLeaderboard
                        .filter((r) =>
                          !leaderboardSearch.trim() ||
                          r.name?.toLowerCase().includes(leaderboardSearch.toLowerCase()) ||
                          String(r.student_id || "").toLowerCase().includes(leaderboardSearch.toLowerCase())
                        )
                        .map((row) => {
                          const isTop1 = row.rank === 1;
                          const isTop2 = row.rank === 2;
                          const isTop3 = row.rank === 3;
                          const isUser = user && (String(row.id) === String(user.id) || row.name?.toLowerCase() === user.name?.toLowerCase());

                          return (
                            <tr
                              key={row.rank}
                              className={`transition-colors ${
                                isUser
                                  ? darkMode
                                    ? "bg-[#035BE3]/15 font-bold"
                                    : "bg-blue-50/80 font-bold"
                                  : darkMode
                                  ? "hover:bg-[#1A2234]/50"
                                  : "hover:bg-[#F8FAFC]"
                              }`}
                            >
                              <td className="py-3.5 px-5 font-black text-sm">
                                {isTop1 ? (
                                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs">
                                    🥇 #1
                                  </span>
                                ) : isTop2 ? (
                                  <span className="px-2.5 py-1 rounded-full bg-slate-400/20 text-slate-400 border border-slate-400/30 text-xs">
                                    🥈 #2
                                  </span>
                                ) : isTop3 ? (
                                  <span className="px-2.5 py-1 rounded-full bg-amber-800/20 text-amber-600 border border-amber-700/30 text-xs">
                                    🥉 #3
                                  </span>
                                ) : (
                                  <span className="text-[#8A99AD] font-bold text-xs ml-2">#{row.rank}</span>
                                )}
                              </td>

                              <td className="py-3.5 px-5">
                                <div className="flex items-center gap-3">
                                  {row.avatar ? (
                                    <img
                                      src={row.avatar}
                                      alt=""
                                      aria-hidden="true"
                                      className={`w-9 h-9 rounded-full object-cover border ${
                                        isTop1
                                          ? "border-amber-400 ring-2 ring-amber-400/40"
                                          : isTop2
                                          ? "border-slate-400"
                                          : isTop3
                                          ? "border-amber-700"
                                          : "border-inherit"
                                      }`}
                                    />
                                  ) : (
                                    <div
                                      className={`w-9 h-9 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 ${
                                        isTop1
                                          ? "bg-amber-500 text-black"
                                          : isTop2
                                          ? "bg-slate-400 text-white"
                                          : isTop3
                                          ? "bg-amber-700 text-white"
                                          : "bg-[#035BE3]"
                                      }`}
                                    >
                                      {row.name ? row.name.charAt(0).toUpperCase() : "U"}
                                    </div>
                                  )}
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-xs">{row.name}</span>
                                      {isUser && (
                                        <span className="text-[9.5px] font-black text-[#035BE3] px-2 py-0.2 rounded-full bg-blue-500/20 uppercase">
                                          You
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-[#8A99AD] block">Verified Student Partner</span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3.5 px-5 font-mono text-[11px] text-[#8A99AD] font-semibold">
                                {row.student_id || `KW${1000 + row.rank}`}
                              </td>

                              <td className="py-3.5 px-5 font-bold text-xs">
                                <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-[#035BE3]">
                                  {row.sales} Sales
                                </span>
                              </td>

                              <td className="py-3.5 px-5">
                                <span className="font-black text-emerald-500 text-sm">
                                  {row.earnings}
                                </span>
                              </td>

                              <td className="py-3.5 px-5">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                    isTop1
                                      ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                                      : isTop2
                                      ? "bg-slate-400/15 text-slate-400 border-slate-400/30"
                                      : isTop3
                                      ? "bg-amber-800/15 text-amber-600 border-amber-700/30"
                                      : "bg-blue-500/10 text-[#035BE3] border-blue-500/20"
                                  }`}
                                >
                                  {row.badge || "Pro"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: MARKETING & PROMO TEMPLATES */}
        {/* ======================================================== */}
        {activeTab === "promos" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div
              className={`rounded-[28px] border p-6 ${
                darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
              }`}
            >
              <div className="mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  Ready-to-Use High Converting Templates
                </span>
                <h2 className="text-xl font-black mt-2">Marketing Pitch Kits & Captions</h2>
                <p className="text-xs text-[#8A99AD] mt-1">
                  Copy and share these high-converting WhatsApp, Instagram, and Telegram templates with your referral link already inserted.
                </p>
              </div>

              <div className="space-y-4">
                {promoTemplates.map((template, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border transition-all ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-xs font-bold">{template.title}</h4>
                        <p className="text-[11px] text-[#8A99AD]">{template.desc}</p>
                      </div>
                      <button
                        onClick={() => handleCopyPromoTemplate(template.text, idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs ${
                          copiedTemplateIdx === idx
                            ? "bg-emerald-600 text-white"
                            : "bg-[#035BE3] text-white hover:bg-[#024ec2]"
                        }`}
                      >
                        {copiedTemplateIdx === idx ? (
                          <>
                            <Check size={13} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={13} /> Copy Text
                          </>
                        )}
                      </button>
                    </div>
                    <pre
                      className={`p-3 rounded-xl text-xs font-sans whitespace-pre-wrap leading-relaxed border ${
                        darkMode ? "bg-[#131926] border-[#222B3D] text-[#CBD5E1]" : "bg-white border-[#E2E8F0] text-[#334155]"
                      }`}
                    >
                      {template.text}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      </div>

      {/* WITHDRAWAL REQUEST MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`w-full max-w-lg rounded-[28px] border p-6 shadow-xl transition-all ${
              darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <div>
                <h3 className="text-base font-bold">Request Commission Withdrawal</h3>
                <p className="text-xs text-[#8A99AD] mt-0.5">
                  Available Balance: <span className="font-bold text-amber-500">₹{walletBalance.toLocaleString()}</span>
                </p>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-8 h-8 rounded-full border border-inherit flex items-center justify-center text-[#8A99AD] hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-emerald-500">Withdrawal Request Submitted!</h4>
                <p className="text-xs text-[#8A99AD]">
                  Your payout request for ₹{Number(withdrawAmount).toLocaleString()} has been queued for verification.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="mt-4 space-y-4">
                {withdrawError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{withdrawError}</span>
                  </div>
                )}

                {/* Amount */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#8A99AD] uppercase tracking-wider">
                      Withdrawal Amount (₹)
                    </label>
                    <span className="text-[11px] font-semibold text-amber-500">
                      Min: ₹{minWithdrawalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div
                    className={`h-11 rounded-xl border px-3 flex items-center gap-2 ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                    }`}
                  >
                    <span className="font-bold text-sm text-[#8A99AD]">₹</span>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder={`Min: ₹${minWithdrawalAmount} • Max: ₹${walletBalance}`}
                      min={minWithdrawalAmount}
                      max={walletBalance}
                      className="bg-transparent text-sm font-bold w-full outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(walletBalance.toString())}
                      className="text-[10px] font-bold text-[#035BE3] uppercase px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 cursor-pointer"
                    >
                      Max
                    </button>
                  </div>
                </div>

                {/* Saved Accounts vs Custom */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#8A99AD] uppercase tracking-wider">
                      Select Payout Destination
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddMethodModal(true)}
                      className="text-[11px] font-bold text-[#035BE3] hover:underline cursor-pointer"
                    >
                      + Add New Account
                    </button>
                  </div>

                  {savedPayoutMethods.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {savedPayoutMethods.map((m) => (
                        <label
                          key={m.id}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                            selectedSavedMethodId === m.id
                              ? "border-[#035BE3] bg-blue-500/5 dark:bg-blue-950/20 ring-1 ring-[#035BE3]"
                              : darkMode
                              ? "border-[#222B3D] bg-[#0E1420]/60 hover:border-slate-700"
                              : "border-slate-200 bg-[#F8FAFC] hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="payout_destination"
                              value={m.id}
                              checked={selectedSavedMethodId === m.id}
                              onChange={() => setSelectedSavedMethodId(m.id)}
                              className="text-[#035BE3] focus:ring-[#035BE3]"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold">
                                  {m.type === "upi" ? `⚡ UPI: ${m.upi_id}` : `🏦 ${m.bank_name || "Bank"} (•••• ${String(m.account_number).slice(-4)})`}
                                </span>
                                {m.is_default && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-[10.5px] text-[#8A99AD]">
                                {m.holder_name} {m.ifsc_code ? `• IFSC: ${m.ifsc_code}` : ""}
                              </p>
                            </div>
                          </div>
                        </label>
                      ))}

                      <label
                        className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                          selectedSavedMethodId === "custom"
                            ? "border-[#035BE3] bg-blue-500/5 dark:bg-blue-950/20 ring-1 ring-[#035BE3]"
                            : darkMode
                            ? "border-[#222B3D] bg-[#0E1420]/60 hover:border-slate-700"
                            : "border-slate-200 bg-[#F8FAFC] hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payout_destination"
                          value="custom"
                          checked={selectedSavedMethodId === "custom"}
                          onChange={() => setSelectedSavedMethodId("custom")}
                          className="text-[#035BE3] focus:ring-[#035BE3]"
                        />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          Enter other bank / UPI account details manually
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Custom / New Form Fields if custom is selected or no saved accounts */}
                {(selectedSavedMethodId === "custom" || savedPayoutMethods.length === 0) && (
                  <div className="space-y-3 pt-2 border-t border-inherit">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setWithdrawMethod("upi")}
                        className={`h-10 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                          withdrawMethod === "upi"
                            ? "bg-[#035BE3] text-white border-[#035BE3]"
                            : darkMode
                            ? "bg-[#0E1420] border-[#222B3D] text-[#8A99AD]"
                            : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]"
                        }`}
                      >
                        <Zap size={14} /> UPI ID (Instant)
                      </button>
                      <button
                        type="button"
                        onClick={() => setWithdrawMethod("bank")}
                        className={`h-10 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                          withdrawMethod === "bank"
                            ? "bg-[#035BE3] text-white border-[#035BE3]"
                            : darkMode
                            ? "bg-[#0E1420] border-[#222B3D] text-[#8A99AD]"
                            : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]"
                        }`}
                      >
                        <Building2 size={14} /> Bank Account
                      </button>
                    </div>

                    {/* Conditional Fields */}
                    {withdrawMethod === "upi" ? (
                      <div>
                        <label className="text-xs font-bold text-[#8A99AD] uppercase tracking-wider block mb-1">
                          Your UPI ID
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. yourname@okhdfcbank or 9876543210@upi"
                          className={`h-10 w-full rounded-xl border px-3 text-xs font-medium outline-none ${
                            darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-bold text-[#8A99AD] uppercase block mb-1">
                              Bank Name
                            </label>
                            <input
                              type="text"
                              value={bankDetails.bankName}
                              onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                              placeholder="e.g. HDFC Bank"
                              className={`h-9 w-full rounded-xl border px-3 text-xs outline-none ${
                                darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                              }`}
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-[#8A99AD] uppercase block mb-1">
                              Account Holder Name
                            </label>
                            <input
                              type="text"
                              value={bankDetails.holderName}
                              onChange={(e) => setBankDetails({ ...bankDetails, holderName: e.target.value })}
                              placeholder="e.g. Rahul Sharma"
                              className={`h-9 w-full rounded-xl border px-3 text-xs outline-none ${
                                darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                              }`}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-bold text-[#8A99AD] uppercase block mb-1">
                              Account Number
                            </label>
                            <input
                              type="text"
                              value={bankDetails.accountNumber}
                              onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                              placeholder="e.g. 501002918239"
                              className={`h-9 w-full rounded-xl border px-3 text-xs outline-none ${
                                darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                              }`}
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-[#8A99AD] uppercase block mb-1">
                              IFSC Code
                            </label>
                            <input
                              type="text"
                              value={bankDetails.ifsc}
                              onChange={(e) => setBankDetails({ ...bankDetails, ifsc: e.target.value.toUpperCase() })}
                              placeholder="e.g. HDFC0001234"
                              className={`h-9 w-full rounded-xl border px-3 text-xs outline-none uppercase ${
                                darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={saveForFuture}
                        onChange={(e) => setSaveForFuture(e.target.checked)}
                        className="rounded text-[#035BE3] focus:ring-[#035BE3]"
                      />
                      <span className="text-xs text-[#8A99AD] font-medium">Save this account for 1-click future withdrawals</span>
                    </label>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingWithdraw}
                    className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    {isSubmittingWithdraw ? (
                      <span>Submitting Request...</span>
                    ) : (
                      <>
                        <Check size={15} /> Confirm & Request Payout
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD NEW PAYOUT METHOD MODAL */}
      {/* ======================================================== */}
      {showAddMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md rounded-[28px] border p-6 shadow-2xl transition-all ${
              darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <div>
                <h3 className="text-base font-bold">Add Payout Account</h3>
                <p className="text-xs text-[#8A99AD] mt-0.5">Save UPI or Bank for instant withdrawal dispatch</p>
              </div>
              <button
                onClick={() => setShowAddMethodModal(false)}
                className="w-8 h-8 rounded-full border border-inherit flex items-center justify-center text-[#8A99AD] hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {addMethodError && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addMethodError}</span>
              </div>
            )}

            <form onSubmit={handleSaveNewPayoutMethod} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewMethodType("upi")}
                  className={`h-10 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                    newMethodType === "upi"
                      ? "bg-[#035BE3] text-white border-[#035BE3]"
                      : darkMode
                      ? "bg-[#0E1420] border-[#222B3D] text-[#8A99AD]"
                      : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]"
                  }`}
                >
                  <Zap size={14} /> UPI ID
                </button>
                <button
                  type="button"
                  onClick={() => setNewMethodType("bank")}
                  className={`h-10 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                    newMethodType === "bank"
                      ? "bg-[#035BE3] text-white border-[#035BE3]"
                      : darkMode
                      ? "bg-[#0E1420] border-[#222B3D] text-[#8A99AD]"
                      : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]"
                  }`}
                >
                  <Building2 size={14} /> Bank Account
                </button>
              </div>

              {newMethodType === "upi" ? (
                <div>
                  <label className="text-xs font-bold text-[#8A99AD] uppercase tracking-wider block mb-1">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={newUpiId}
                    onChange={(e) => setNewUpiId(e.target.value)}
                    placeholder="e.g. student@oksbi or 9876543210@paytm"
                    className={`h-10 w-full rounded-xl border px-3 text-xs outline-none ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                    }`}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#8A99AD] uppercase block mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={newBankDetails.bankName}
                      onChange={(e) => setNewBankDetails({ ...newBankDetails, bankName: e.target.value })}
                      placeholder="e.g. State Bank of India"
                      className={`h-9 w-full rounded-xl border px-3 text-xs outline-none ${
                        darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#8A99AD] uppercase block mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={newBankDetails.holderName}
                      onChange={(e) => setNewBankDetails({ ...newBankDetails, holderName: e.target.value })}
                      placeholder={user?.name || "Account Holder Name"}
                      className={`h-9 w-full rounded-xl border px-3 text-xs outline-none ${
                        darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-[#8A99AD] uppercase block mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={newBankDetails.accountNumber}
                        onChange={(e) => setNewBankDetails({ ...newBankDetails, accountNumber: e.target.value })}
                        placeholder="e.g. 30891283719"
                        className={`h-9 w-full rounded-xl border px-3 text-xs outline-none ${
                          darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#8A99AD] uppercase block mb-1">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        value={newBankDetails.ifsc}
                        onChange={(e) => setNewBankDetails({ ...newBankDetails, ifsc: e.target.value.toUpperCase() })}
                        placeholder="e.g. SBIN0001234"
                        className={`h-9 w-full rounded-xl border px-3 text-xs outline-none uppercase ${
                          darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingNewMethod}
                  className="w-full h-11 rounded-xl bg-[#035BE3] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  {isSavingNewMethod ? "Saving Account..." : "Save Payout Method"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
