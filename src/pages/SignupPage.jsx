import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Phone,
  Tag,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Gift,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { sendSignupOtpApi, registerUserApi, setUserSession } from "../services/api";

const CURRENT_YEAR = new Date().getFullYear();

export default function SignupPage() {
  const navigate = useNavigate();

  // Form input state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    referralCode: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Verification Modal / Step State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isTestMode, setIsTestMode] = useState(false);
  const [testOtp, setTestOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Validate Primary Form
  const validateForm = () => {
    const errs = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = "Full name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address";
    }

    if (formData.phone.trim() && formData.phone.trim().length < 8) {
      errs.phone = "Please enter a valid phone number";
    }

    if (!formData.password || formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters long";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 1: Send OTP to User's Email
  const handleInitiateSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await sendSignupOtpApi({
        email: formData.email.trim(),
        name: formData.name.trim(),
      });

      if (res?.success) {
        setIsTestMode(Boolean(res.is_test_mode));
        if (res.test_otp) {
          setTestOtp(res.test_otp);
          setOtpCode(res.test_otp); // Auto-fill in test mode for instant ease
        }
        setShowOtpModal(true);
        startResendTimer();
      }
    } catch (err) {
      setErrors({ general: err.message || "Failed to send verification code." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Timer helper for OTP resend
  const startResendTimer = () => {
    setResendCountdown(45);
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    try {
      const res = await sendSignupOtpApi({
        email: formData.email.trim(),
        name: formData.name.trim(),
      });
      if (res?.success) {
        setIsTestMode(Boolean(res.is_test_mode));
        if (res.test_otp) {
          setTestOtp(res.test_otp);
          setOtpCode(res.test_otp);
        }
        startResendTimer();
      }
    } catch (err) {
      setOtpError(err.message || "Could not resend OTP");
    }
  };

  // Step 2: Verify OTP & Complete Registration
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP code");
      return;
    }

    setIsVerifying(true);
    setOtpError("");

    try {
      const res = await registerUserApi({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        referralCode: formData.referralCode.trim() || null,
        otp: otpCode.trim(),
      });

      if (res?.success && res.token) {
        // Save session & dispatch auth update
        setUserSession(res.token, res.user);
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setOtpError(err.message || "Invalid or expired verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen flex flex-col justify-between bg-[#FBFCFF] text-[#161B29] overflow-hidden">
      
      {/* Blueprint background grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(91,111,150,.075) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(91,111,150,.075) 1px, transparent 1px)
          `,
          backgroundSize: "118px 108px",
        }}
      />

      <div
        className="
          pointer-events-none absolute inset-0 -z-[5]
          bg-[radial-gradient(circle_at_center,rgba(251,252,255,0.30)_0%,rgba(251,252,255,0.6)_45%,rgba(251,252,255,0.96)_100%)]
        "
      />

      {/* Top Header */}
      <header className="w-full px-6 lg:px-16 pt-6 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center group">
          <img
            src="/images/logo/logo.png"
            alt="KnowWay Logo"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#DCE2ED] bg-white text-xs font-semibold text-[#293246] hover:bg-[#F8FAFD] transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:px-6 z-10">
        
        {/* Title and Badge */}
        <div className="text-center max-w-lg mx-auto mb-6">
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-[#DCE5F5] bg-white px-4 py-[7px] shadow-2xs">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EEF3FF]">
              <Sparkles className="h-3 w-3 text-[#035BE3]" />
            </span>
            <span className="text-[12px] font-bold text-[#2A354D]">
              Start Your Learning Journey
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Create Your Free Account
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#64748B]">
            Join thousands of learners mastering digital marketing, AI tools, and high-income skills.
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="w-full max-w-md bg-white rounded-[32px] border border-[#E4EAF4] p-6 sm:p-8 shadow-xl shadow-blue-900/5">
          
          {errors.general && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleInitiateSignup} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full h-12 rounded-full border pl-11 pr-4 text-xs font-medium outline-none transition focus:border-[#035BE3] focus:ring-2 focus:ring-[#035BE3]/10 ${
                    errors.name ? "border-red-400 bg-red-50/20" : "border-[#E2E8F0] bg-[#F8FAFD]"
                  }`}
                />
              </div>
              {errors.name && <p className="mt-1 text-[11px] text-red-500 font-medium pl-3">{errors.name}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full h-12 rounded-full border pl-11 pr-4 text-xs font-medium outline-none transition focus:border-[#035BE3] focus:ring-2 focus:ring-[#035BE3]/10 ${
                    errors.email ? "border-red-400 bg-red-50/20" : "border-[#E2E8F0] bg-[#F8FAFD]"
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-[11px] text-red-500 font-medium pl-3">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                Phone Number <span className="text-[#94A3B8] font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full h-12 rounded-full border pl-11 pr-4 text-xs font-medium outline-none transition focus:border-[#035BE3] focus:ring-2 focus:ring-[#035BE3]/10 ${
                    errors.phone ? "border-red-400 bg-red-50/20" : "border-[#E2E8F0] bg-[#F8FAFD]"
                  }`}
                />
              </div>
              {errors.phone && <p className="mt-1 text-[11px] text-red-500 font-medium pl-3">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full h-12 rounded-full border pl-11 pr-11 text-xs font-medium outline-none transition focus:border-[#035BE3] focus:ring-2 focus:ring-[#035BE3]/10 ${
                    errors.password ? "border-red-400 bg-red-50/20" : "border-[#E2E8F0] bg-[#F8FAFD]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94A3B8] hover:text-[#1E293B] transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-[11px] text-red-500 font-medium pl-3">{errors.password}</p>}
            </div>

            {/* Referral Code (Optional) */}
            <div>
              <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                Referral / Affiliate Code <span className="text-[#94A3B8] font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                  <Tag size={16} />
                </div>
                <input
                  type="text"
                  placeholder="e.g. KNOW2026 (leave empty if none)"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                  className="w-full h-12 rounded-full border border-[#E2E8F0] bg-[#F8FAFD] pl-11 pr-4 text-xs font-medium uppercase outline-none transition focus:border-[#035BE3] focus:ring-2 focus:ring-[#035BE3]/10"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#035BE3]/20 disabled:opacity-50 !mt-6"
            >
              <span>{isSubmitting ? "Sending Verification Code..." : "Continue with Email Verification"}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Bottom Login Link */}
          <div className="mt-6 pt-5 border-t border-[#F1F5F9] text-center">
            <p className="text-xs text-[#64748B]">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-[#035BE3] hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* ======================================================== */}
      {/* MODAL: 6-DIGIT EMAIL OTP VERIFICATION */}
      {/* ======================================================== */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-[32px] border border-[#E2E8F0] p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150">
            
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-[#EEF4FF] text-[#035BE3] flex items-center justify-center mx-auto mb-3 border border-[#035BE3]/15 shadow-xs">
                <KeyRound size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#161B29]">Enter Verification Code</h3>
              <p className="text-xs text-[#64748B] mt-1">
                We've sent a 6-digit OTP code to <strong className="text-[#161B29]">{formData.email}</strong>
              </p>
            </div>

            {/* If test mode is active, display test helper badge */}
            {isTestMode && (
              <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                <p className="font-bold flex items-center gap-1.5">
                  <span>🧪 Testing OTP Mode Active</span>
                </p>
                <p className="mt-0.5 text-[11px] text-amber-700">
                  SMTP is in test mode. Your verification code is: <strong className="text-sm font-mono tracking-wider ml-1 bg-white px-2 py-0.5 rounded border border-amber-300">{testOtp || "123456"}</strong>
                </p>
              </div>
            )}

            {otpError && (
              <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyAndRegister} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  placeholder="••••••"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-14 rounded-full border border-[#CBD5E1] bg-[#F8FAFD] text-center text-2xl font-mono font-bold tracking-[12px] outline-none focus:border-[#035BE3] focus:ring-2 focus:ring-[#035BE3]/10"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying || otpCode.length !== 6}
                className="w-full h-12 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#035BE3]/20 disabled:opacity-50"
              >
                <span>{isVerifying ? "Verifying Account..." : "Verify & Complete Signup"}</span>
                <CheckCircle2 size={16} />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="text-[#64748B] hover:text-[#161B29] font-semibold cursor-pointer"
              >
                Change Email
              </button>

              <button
                type="button"
                disabled={resendCountdown > 0}
                onClick={handleResendOtp}
                className="text-[#035BE3] font-bold hover:underline disabled:text-[#94A3B8] disabled:no-underline cursor-pointer flex items-center gap-1"
              >
                <RefreshCw size={12} className={resendCountdown > 0 ? "animate-spin" : ""} />
                <span>{resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : "Resend OTP"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-[#94A3B8] border-t border-[#EDF1F7]">
        &copy; {CURRENT_YEAR} KnowWay LearnSpace. All rights reserved.
      </footer>
    </div>
  );
}
