import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { sendForgotPasswordOtpApi, resetPasswordApi } from "../services/api";

const CURRENT_YEAR = new Date().getFullYear();

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Wizard Step: 1 = Email, 2 = OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1);

  // Form states
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isTestMode, setIsTestMode] = useState(false);
  const [testOtp, setTestOtp] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const startResendTimer = () => {
    setResendCountdown(45);
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // STEP 1: Send OTP for Password Reset
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await sendForgotPasswordOtpApi({ email: email.trim() });
      if (res?.success) {
        setIsTestMode(Boolean(res.is_test_mode));
        if (res.test_otp) {
          setTestOtp(res.test_otp);
          setOtpCode(res.test_otp); // auto-fill in test mode
        }
        setStep(2);
        startResendTimer();
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to send reset code. Please check email address.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Proceed to New Password after entering OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMsg("Please enter the complete 6-digit OTP code.");
      return;
    }
    setErrorMsg("");
    setStep(3);
  };

  // STEP 3: Submit New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await resetPasswordApi({
        email: email.trim(),
        otp: otpCode.trim(),
        newPassword,
      });

      if (res?.success) {
        setStep(4);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to reset password. OTP may have expired.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    try {
      const res = await sendForgotPasswordOtpApi({ email: email.trim() });
      if (res?.success) {
        setIsTestMode(Boolean(res.is_test_mode));
        if (res.test_otp) {
          setTestOtp(res.test_otp);
          setOtpCode(res.test_otp);
        }
        startResendTimer();
      }
    } catch (err) {
      setErrorMsg(err.message || "Could not resend OTP");
    }
  };

  return (
    <div className="relative isolate min-h-screen flex flex-col justify-between bg-[#FBFCFF] text-[#161B29] overflow-hidden">
      
      {/* Blueprint Grid Background */}
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
          to="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#DCE2ED] bg-white text-xs font-semibold text-[#293246] hover:bg-[#F8FAFD] transition-colors shadow-2xs"
        >
          <ArrowLeft size={14} />
          <span>Back to Login</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 z-10">
        
        {/* Header content */}
        <div className="text-center max-w-lg mx-auto mb-7">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DCE5F5] bg-white px-4 py-[8px] shadow-2xs">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EEF3FF]">
              <Sparkles className="h-3 w-3 text-[#035BE3]" />
            </span>
            <span className="text-[12px] font-bold text-[#2A354D]">
              Account Recovery
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Reset Your Password
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#64748B]">
            Follow the 3 simple steps to securely restore access to your KnowWay account.
          </p>
        </div>

        {/* Step Wizard Pills */}
        <div className="flex items-center gap-2 mb-6">
          <span className={`px-3.5 py-1 rounded-full text-xs font-bold ${step === 1 ? "bg-[#035BE3] text-white" : "bg-[#EEF3FF] text-[#035BE3]"}`}>
            1. Email
          </span>
          <span className="text-gray-300">→</span>
          <span className={`px-3.5 py-1 rounded-full text-xs font-bold ${step === 2 ? "bg-[#035BE3] text-white" : step > 2 ? "bg-[#EEF3FF] text-[#035BE3]" : "bg-gray-100 text-gray-400"}`}>
            2. OTP Code
          </span>
          <span className="text-gray-300">→</span>
          <span className={`px-3.5 py-1 rounded-full text-xs font-bold ${step >= 3 ? "bg-[#035BE3] text-white" : "bg-gray-100 text-gray-400"}`}>
            3. New Password
          </span>
        </div>

        {/* Card Box */}
        <div className="w-full max-w-md bg-white rounded-[32px] border border-[#E4EAF4] p-6 sm:p-8 shadow-xl shadow-blue-900/5">
          
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: ENTER EMAIL */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                  Registered Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 rounded-full border border-[#E2E8F0] bg-[#F8FAFD] pl-11 pr-4 text-xs font-medium outline-none transition focus:border-[#035BE3] focus:ring-2 focus:ring-[#035BE3]/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#035BE3]/20 disabled:opacity-50 !mt-5"
              >
                <span>{loading ? "Sending OTP Code..." : "Send Reset Code"}</span>
                <ArrowRight size={15} />
              </button>
            </form>
          )}

          {/* STEP 2: ENTER OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-3">
                <p className="text-xs text-[#64748B]">
                  Enter the 6-digit OTP code sent to <strong className="text-[#161B29]">{email}</strong>
                </p>
              </div>

              {isTestMode && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <p className="font-bold">🧪 Testing OTP Mode</p>
                  <p className="mt-0.5 text-[11px]">
                    Your code is: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300">{testOtp || "123456"}</strong>
                  </p>
                </div>
              )}

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
                disabled={otpCode.length !== 6}
                className="w-full h-12 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#035BE3]/20 disabled:opacity-50 !mt-5"
              >
                <span>Continue to Set New Password</span>
                <ArrowRight size={15} />
              </button>

              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[#64748B] hover:text-[#161B29] font-semibold cursor-pointer"
                >
                  Change Email
                </button>
                <button
                  type="button"
                  disabled={resendCountdown > 0}
                  onClick={handleResend}
                  className="text-[#035BE3] font-bold hover:underline disabled:text-[#94A3B8] disabled:no-underline cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw size={12} className={resendCountdown > 0 ? "animate-spin" : ""} />
                  <span>{resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend OTP"}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ENTER NEW PASSWORD */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-12 rounded-full border border-[#E2E8F0] bg-[#F8FAFD] pl-11 pr-11 text-xs font-medium outline-none transition focus:border-[#035BE3] focus:ring-2 focus:ring-[#035BE3]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94A3B8] hover:text-[#1E293B] transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 rounded-full border border-[#E2E8F0] bg-[#F8FAFD] pl-11 pr-4 text-xs font-medium outline-none transition focus:border-[#035BE3] focus:ring-2 focus:ring-[#035BE3]/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#035BE3]/20 disabled:opacity-50 !mt-5"
              >
                <span>{loading ? "Updating Password..." : "Update Password & Finish"}</span>
                <CheckCircle2 size={16} />
              </button>
            </form>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-lg font-bold text-[#161B29]">Password Reset Successful!</h3>
              <p className="text-xs text-[#64748B]">
                Your account password has been updated securely. You can now log in using your new credentials.
              </p>

              <Link
                to="/login"
                className="inline-flex w-full h-12 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs items-center justify-center gap-2 shadow-md shadow-[#035BE3]/20 transition-colors"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-[#F1F5F9] text-center">
            <Link to="/login" className="text-xs font-semibold text-[#64748B] hover:text-[#035BE3]">
              Remember your password? <span className="font-bold text-[#035BE3]">Sign in</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center text-xs text-[#94A3B8] border-t border-[#EDF1F7]">
        &copy; {CURRENT_YEAR} KnowWay LearnSpace. All rights reserved.
      </footer>
    </div>
  );
}
