import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CreditCard,
  Zap,
  Tag,
  BookOpen,
  Clock,
  Award,
  AlertCircle,
  Check,
  RefreshCw,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  getPackageBySlugApi,
  getCoursesApi,
  getCourseByIdApi,
  createPaymentOrderApi,
  verifyPaymentApi,
  getUserData,
  isUserAuthenticated,
  setUserSession,
} from "../services/api";

// Fallback seed packages map
const fallbackPackages = {
  pro: {
    name: "Pro Growth Package",
    slug: "pro",
    mrp_price: 11800,
    promo_price: 7999,
    image_url: "/images/packages/pro.png",
    total_hours: "25+ Hours",
    courses_count: 9,
    tagline: "Our step-by-step, skill-focused growth package for freelancers and digital creators.",
  },
  supreme: {
    name: "Supreme Skill Package",
    slug: "supreme",
    mrp_price: 14800,
    promo_price: 9999,
    image_url: "/images/packages/supreme.png",
    total_hours: "40+ Hours",
    courses_count: 14,
    tagline: "Advanced AI pipelines, video mastery, agency scaling & client acquisition.",
  },
  premium: {
    name: "Premium Master Package",
    slug: "premium",
    mrp_price: 19800,
    promo_price: 12999,
    image_url: "/images/packages/premium.png",
    total_hours: "65+ Hours",
    courses_count: 18,
    tagline: "Comprehensive executive ecosystem with high-ticket sales & growth frameworks.",
  },
  "premium-plus": {
    name: "Premium Plus VIP Package",
    slug: "premium-plus",
    mrp_price: 24800,
    promo_price: 16999,
    image_url: "/images/packages/premium-plus.png",
    total_hours: "100+ Hours",
    courses_count: 22,
    tagline: "VIP all-access lifetime pass to every course, workshop, and founder mastermind.",
  },
};

// Helper to dynamically load Razorpay checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isCourseCheckout = searchParams.get("type") === "course" || searchParams.get("item") === "course";
  const itemSlug = (slug || searchParams.get("package") || searchParams.get("course") || "pro").toLowerCase().trim();
  const fallback = fallbackPackages[itemSlug] || fallbackPackages["pro"];

  const [packageData, setPackageData] = useState(fallback);
  const [isCourse, setIsCourse] = useState(isCourseCheckout);
  const [loadingPkg, setLoadingPkg] = useState(true);

  // Authenticated user check
  const loggedInUser = getUserData();
  const urlRefCode = searchParams.get("ref") || searchParams.get("referral") || "";

  // Billing Form State
  const [formData, setFormData] = useState({
    name: loggedInUser?.name || "",
    email: loggedInUser?.email || "",
    phone: loggedInUser?.phone || "",
    password: "",
    referralCode: loggedInUser?.referral_code || urlRefCode || "",
  });

  const [appliedReferral, setAppliedReferral] = useState(loggedInUser?.referral_code || urlRefCode || "");
  const [referralInput, setReferralInput] = useState(loggedInUser?.referral_code || urlRefCode || "");
  const [isReferralApplied, setIsReferralApplied] = useState(Boolean(loggedInUser?.referral_code || urlRefCode));
  const [referralMessage, setReferralMessage] = useState(
    loggedInUser?.referral_code || urlRefCode ? "✓ Referral discount active" : ""
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(null); // { paymentId, studentId, packageName }

  // 1. Fetch live package or course from MySQL API
  useEffect(() => {
    let isMounted = true;
    const fetchItem = async () => {
      try {
        if (isCourseCheckout) {
          // Fetch Course
          const coursesRes = await getCoursesApi();
          if (coursesRes?.courses && Array.isArray(coursesRes.courses)) {
            const matchedCourse = coursesRes.courses.find(
              (c) => c.slug === itemSlug || String(c.id) === itemSlug || c.title.toLowerCase().includes(itemSlug)
            );
            if (matchedCourse && isMounted) {
              setIsCourse(true);
              setPackageData({
                id: matchedCourse.id,
                name: matchedCourse.title,
                title: matchedCourse.title,
                slug: matchedCourse.slug || String(matchedCourse.id),
                mrp_price: Number(matchedCourse.regular_price || 2999),
                promo_price: Number(matchedCourse.promo_price || 499),
                image_url: matchedCourse.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
                tagline: matchedCourse.description || "Comprehensive hands-on course with certificate.",
                total_hours: matchedCourse.duration || "10+ Hours",
                courses_count: 1,
              });
              return;
            }
          }
        }

        // Try fetching Package
        const res = await getPackageBySlugApi(itemSlug);
        if (res?.success && res.package && isMounted) {
          setIsCourse(false);
          setPackageData({
            ...res.package,
            mrp_price: Number(res.package.mrp_price || fallback.mrp_price),
            promo_price: Number(res.package.promo_price || fallback.promo_price),
          });
        } else {
          // Check if item is a course if package lookup returned nothing
          const coursesRes = await getCoursesApi();
          if (coursesRes?.courses && Array.isArray(coursesRes.courses)) {
            const matchedCourse = coursesRes.courses.find(
              (c) => c.slug === itemSlug || String(c.id) === itemSlug
            );
            if (matchedCourse && isMounted) {
              setIsCourse(true);
              setPackageData({
                id: matchedCourse.id,
                name: matchedCourse.title,
                title: matchedCourse.title,
                slug: matchedCourse.slug || String(matchedCourse.id),
                mrp_price: Number(matchedCourse.regular_price || 2999),
                promo_price: Number(matchedCourse.promo_price || 499),
                image_url: matchedCourse.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
                tagline: matchedCourse.description || "Comprehensive hands-on course with certificate.",
                total_hours: matchedCourse.duration || "10+ Hours",
                courses_count: 1,
              });
            }
          }
        }
      } catch (err) {
        console.warn("Using fallback checkout item:", err.message);
      } finally {
        if (isMounted) setLoadingPkg(false);
      }
    };

    fetchItem();
    return () => {
      isMounted = false;
    };
  }, [itemSlug, isCourseCheckout]);

  // Handle Apply / Remove Referral Code
  const handleApplyReferral = (e) => {
    e.preventDefault();
    if (!referralInput.trim()) {
      setIsReferralApplied(false);
      setAppliedReferral("");
      setReferralMessage("");
      return;
    }

    const cleanCode = referralInput.trim().toUpperCase();
    setIsReferralApplied(true);
    setAppliedReferral(cleanCode);
    setFormData((prev) => ({ ...prev, referralCode: cleanCode }));
    setReferralMessage(`✓ Referral Code '${cleanCode}' Applied Successfully!`);
  };

  const handleRemoveReferral = () => {
    setIsReferralApplied(false);
    setAppliedReferral("");
    setReferralInput("");
    setFormData((prev) => ({ ...prev, referralCode: "" }));
    setReferralMessage("");
  };

  // Price Calculation
  const mrpPrice = Number(packageData.mrp_price || fallback.mrp_price);
  const promoPrice = Number(packageData.promo_price || fallback.promo_price);
  const payableAmount = isReferralApplied ? promoPrice : mrpPrice;
  const discountSaved = mrpPrice - payableAmount;

  // 2. Trigger Razorpay Payment Flow
  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      setErrorMsg("Please enter a valid phone number.");
      return;
    }
    if (!isUserAuthenticated() && (!formData.password || formData.password.length < 6)) {
      setErrorMsg("Please set a password (at least 6 characters) for your learning portal.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Load Razorpay SDK
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Could not load Razorpay payment gateway SDK. Please check your connection.");
      }

      // 2. Create Order from Backend
      const orderRes = await createPaymentOrderApi({
        itemType: isCourse ? "course" : "package",
        courseSlug: isCourse ? (packageData.slug || itemSlug) : null,
        courseId: isCourse ? packageData.id : null,
        packageSlug: !isCourse ? (packageData.slug || itemSlug) : null,
        packageId: !isCourse ? packageData.id : null,
        referralCode: isReferralApplied ? appliedReferral : null,
        userId: loggedInUser?.id || null,
        userName: formData.name.trim(),
        userEmail: formData.email.trim(),
        userPhone: formData.phone.trim(),
      });

      if (!orderRes?.success || !orderRes.order) {
        throw new Error(orderRes?.message || "Failed to initiate payment order.");
      }

      const orderData = orderRes.order;
      const razorpayKey = orderRes.key || "rzp_test_knowway2026";

      // 3. Configure Razorpay Options
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "KnowWay LearnSpace",
        description: `Enrollment: ${packageData.name || packageData.title}`,
        image: "/images/logo/logo.png",
        order_id: orderData.id,
        prefill: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          contact: formData.phone.trim(),
        },
        theme: {
          color: "#035BE3",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
        handler: async (response) => {
          try {
            // 4. Verify Payment with Backend
            const verifyRes = await verifyPaymentApi({
              razorpay_order_id: response.razorpay_order_id || orderData.id,
              razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
              razorpay_signature: response.razorpay_signature || "signature_ok",
              itemType: isCourse ? "course" : "package",
              courseSlug: isCourse ? (packageData.slug || itemSlug) : null,
              courseId: isCourse ? packageData.id : null,
              packageSlug: !isCourse ? (packageData.slug || itemSlug) : null,
              packageId: !isCourse ? packageData.id : null,
              name: formData.name.trim(),
              email: formData.email.trim(),
              phone: formData.phone.trim(),
              password: formData.password,
              referralCode: isReferralApplied ? appliedReferral : null,
              currentUserId: loggedInUser?.id || null,
            });

            if (verifyRes?.success) {
              // Update local user session if new login/token returned
              if (verifyRes.token && verifyRes.user) {
                setUserSession(verifyRes.token, verifyRes.user);
              }

              // Fire Confetti Animation
              try {
                confetti({
                  particleCount: 120,
                  spread: 70,
                  origin: { y: 0.6 },
                });
              } catch (_) {}

              setPaymentSuccess({
                paymentId: response.razorpay_payment_id || `PAY-${Date.now()}`,
                studentId: verifyRes.user?.student_id || loggedInUser?.student_id || "KW-2026-STUDENT",
                packageName: packageData.name || packageData.title,
                isCourse,
              });
            } else {
              setErrorMsg(verifyRes?.message || "Payment verification failed.");
            }
          } catch (verErr) {
            console.error("Verification error:", verErr);
            setErrorMsg(verErr.message || "Payment verification encountered an issue.");
          } finally {
            setIsProcessing(false);
          }
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      setErrorMsg(err.message || "Could not launch Razorpay checkout.");
      setIsProcessing(false);
    }
  };

  // ==========================================
  // SUCCESS SCREEN (After successful payment)
  // ==========================================
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#FBFCFF] flex flex-col justify-between py-12 px-4 sm:px-6">
        <div className="max-w-xl mx-auto w-full text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Payment Successful &bull; Package Active
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-3">
              Welcome to {paymentSuccess.packageName}! 🎉
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 max-w-md mx-auto">
              Your enrollment is confirmed. All courses and video curriculum in this package are now unlocked.
            </p>
          </div>

          {/* Transaction & Student ID Card */}
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6 text-left space-y-3 shadow-xs">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-100">
              <span className="text-[#64748B]">Official Student ID:</span>
              <span className="font-mono font-bold text-[#035BE3]">{paymentSuccess.studentId}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-100">
              <span className="text-[#64748B]">Payment Ref ID:</span>
              <span className="font-mono text-xs text-[#0F172A]">{paymentSuccess.paymentId}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748B]">Enrolled Package:</span>
              <span className="font-bold text-emerald-700">{paymentSuccess.packageName}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate("/dashboard", { replace: true })}
              className="w-full h-13 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-[#035BE3]/25 cursor-pointer"
            >
              <span>Go to My Student Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-[#161B29] flex flex-col justify-between overflow-hidden">
      {/* Blueprint Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(91,111,150,.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(91,111,150,.06) 1px, transparent 1px)
          `,
          backgroundSize: "118px 108px",
        }}
      />

      {/* Top Header */}
      <header className="w-full px-6 lg:px-16 pt-6 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center group">
          <img
            src="/images/logo/logo.png"
            alt="KnowWay Logo"
            className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
            <ShieldCheck size={14} />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>

          <Link
            to={isCourse ? `/courses/${itemSlug}` : `/package/${itemSlug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#DCE2ED] bg-white text-xs font-semibold text-[#293246] hover:bg-[#F8FAFD] transition shadow-2xs"
          >
            <ArrowLeft size={13} />
            <span>Back</span>
          </Link>
        </div>
      </header>

      {/* Main Checkout Section */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-12 py-10 z-10">
        
        {/* Title Badge */}
        <div className="text-center max-w-lg mx-auto mb-8 sm:mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#DCE5F5] bg-white px-4 py-1.5 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#035BE3]" />
            <span className="text-xs font-bold text-[#424E65] uppercase tracking-wider">
              Secure Package Enrollment
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0F172A]">
            Complete Your Enrollment
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1.5">
            Instant lifetime access to video curriculum, mentor roadmaps & accredited certificates.
          </p>
        </div>

        {/* 2-Column Responsive Checkout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN (7 COLS): BILLING & CUSTOMER DETAILS FORM */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 bg-white rounded-[32px] p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                  Student Contact & Account Info
                </h2>
                <p className="text-xs text-[#64748B]">
                  Your learning portal credentials and student ID will be linked here.
                </p>
              </div>

              {!isUserAuthenticated() && (
                <Link
                  to={`/login?redirect=/checkout/${packageSlug}`}
                  className="text-xs font-bold text-[#035BE3] hover:underline shrink-0"
                >
                  Already registered? Log In
                </Link>
              )}
            </div>

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2A3447] mb-1.5">
                  Student Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-12 rounded-full border border-[#DCE5F5] bg-[#F8FAFD] px-5 text-xs font-medium outline-none focus:border-[#035BE3] focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2A3447] mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-12 rounded-full border border-[#DCE5F5] bg-[#F8FAFD] px-5 text-xs font-medium outline-none focus:border-[#035BE3] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3447] mb-1.5">
                    Mobile / WhatsApp No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-12 rounded-full border border-[#DCE5F5] bg-[#F8FAFD] px-5 text-xs font-medium outline-none focus:border-[#035BE3] focus:bg-white transition"
                  />
                </div>
              </div>

              {!isUserAuthenticated() && (
                <div>
                  <label className="block text-xs font-bold text-[#2A3447] mb-1.5">
                    Create Portal Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Set 6+ character password for login"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full h-12 rounded-full border border-[#DCE5F5] bg-[#F8FAFD] px-5 text-xs font-medium outline-none focus:border-[#035BE3] focus:bg-white transition"
                  />
                </div>
              )}

              {/* Referral / Partner Code Box */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-[#2A3447] mb-1.5">
                  Have a Referral / Partner Code?
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#8A99AD] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Enter referral code (e.g. KW2026)"
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value)}
                      disabled={isReferralApplied}
                      className={`w-full h-12 rounded-full border pl-10 pr-4 text-xs font-mono font-bold uppercase tracking-wider outline-none transition ${
                        isReferralApplied
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                          : "bg-[#F8FAFD] border-[#DCE5F5] text-[#0F172A] focus:border-[#035BE3] focus:bg-white"
                      }`}
                    />
                  </div>

                  {isReferralApplied ? (
                    <button
                      type="button"
                      onClick={handleRemoveReferral}
                      className="h-12 px-5 rounded-full border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-xs font-bold transition cursor-pointer shrink-0"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyReferral}
                      className="h-12 px-6 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition cursor-pointer shrink-0"
                    >
                      Apply Code
                    </button>
                  )}
                </div>

                {referralMessage && (
                  <p className="text-[11px] font-bold text-emerald-600 mt-2 flex items-center gap-1">
                    <Check size={12} />
                    <span>{referralMessage}</span>
                  </p>
                )}
              </div>

              {/* Secure Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-14 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-sm sm:text-base transition cursor-pointer flex items-center justify-center gap-2.5 shadow-lg shadow-[#035BE3]/30 disabled:opacity-70"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Securing Payment Session...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Pay ₹{Number(payableAmount).toLocaleString("en-IN")} via Razorpay
                      </span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-3 flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#64748B] font-medium border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Official Razorpay Gateway
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Zap size={14} className="text-[#035BE3]" />
                  Instant Activation
                </span>
                <span>&bull;</span>
                <span>UPI / GPay / Cards / NetBanking</span>
              </div>
            </form>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN (5 COLS): ORDER SUMMARY & PACKAGE CARD */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Package Summary Box */}
            <div className="rounded-[32px] bg-white border border-[#E2E8F0] p-6 sm:p-7 shadow-xs space-y-5">
              
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-[#EFF4FF] border border-[#DCE5F5] overflow-hidden flex items-center justify-center shrink-0 p-2">
                  <img
                    src={packageData.image_url || fallback.image_url}
                    alt={packageData.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-[#035BE3] bg-[#035BE3]/10 px-2.5 py-0.5 rounded-full">
                    {packageData.slug || "package"}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] truncate mt-1">
                    {packageData.name}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-1 mt-0.5">
                    {packageData.tagline || fallback.tagline}
                  </p>
                </div>
              </div>

              {/* Package Inclusions Pills */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <div className="p-2.5 rounded-xl bg-[#F8FAFD] border border-[#E2E8F0] text-center">
                  <BookOpen className="w-4 h-4 text-[#035BE3] mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-[#0F172A] block">
                    {packageData.courses_count || 9} Courses
                  </span>
                  <span className="text-[10px] text-[#64748B]">All Modules</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F8FAFD] border border-[#E2E8F0] text-center">
                  <Award className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-[#0F172A] block">
                    Certificate
                  </span>
                  <span className="text-[10px] text-[#64748B]">Accredited</span>
                </div>
              </div>

              {/* Pricing Breakdown Card */}
              <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E2E8F0] space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#64748B]">Standard Package MRP:</span>
                  <span className={`font-semibold ${isReferralApplied ? "line-through text-slate-400 font-bold" : "text-[#0F172A]"}`}>
                    ₹{Number(mrpPrice).toLocaleString("en-IN")}
                  </span>
                </div>

                {isReferralApplied && (
                  <div className="flex justify-between items-center text-xs font-bold text-emerald-600">
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      <span>Referral Discount:</span>
                    </span>
                    <span>- ₹{Number(discountSaved).toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-[#64748B]">
                  <span>GST / Platform Access:</span>
                  <span className="text-emerald-600 font-bold">FREE (₹0)</span>
                </div>

                <div className="pt-2.5 border-t border-gray-200 flex justify-between items-baseline">
                  <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                    Total Payable Amount:
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#035BE3]">
                    ₹{Number(payableAmount).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* What happens next box */}
              <div className="rounded-2xl bg-blue-50/60 border border-blue-100 p-3.5 space-y-1.5 text-left">
                <p className="text-xs font-bold text-[#035BE3] flex items-center gap-1.5">
                  <Zap size={14} />
                  <span>Instant Student Portal Access</span>
                </p>
                <p className="text-[11px] text-[#475569] leading-relaxed">
                  Upon payment, your student ID and course dashboard are unlocked immediately. An official invoice is sent to your email.
                </p>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-[#94A3B8] border-t border-[#EDF0F6]">
        &copy; {new Date().getFullYear()} KnowWay LearnSpace. All payments are securely processed via Razorpay.
      </footer>
    </div>
  );
}
