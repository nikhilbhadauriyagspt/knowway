import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  MonitorSmartphone,
  LogOut,
  X,
} from "lucide-react";
import { loginUserApi, setUserSession } from "../services/api";

const CURRENT_YEAR = new Date().getFullYear();

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Concurrent Session Detection States
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [activeSessionInfo, setActiveSessionInfo] = useState(null);
  const [sessionTerminatedNotice, setSessionTerminatedNotice] = useState("");

  useEffect(() => {
    // Check if user was redirected due to session termination from another device
    const handleSessionTerminated = (e) => {
      setSessionTerminatedNotice(
        e?.detail?.message ||
          "Your session was logged out because your account was accessed from another browser or device."
      );
    };

    window.addEventListener("knowway_session_terminated", handleSessionTerminated);
    return () => window.removeEventListener("knowway_session_terminated", handleSessionTerminated);
  }, []);

  const handleSubmit = async (e, forceLogin = false) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSessionTerminatedNotice("");

    try {
      const res = await loginUserApi({
        email: email.trim(),
        password,
        force_login: forceLogin,
      });

      // 1. If user is logged in on another device/browser and needs confirmation
      if (res?.requires_confirmation || res?.code === "ALREADY_LOGGED_IN") {
        setActiveSessionInfo(res.active_session || { last_device: "Another Browser / Device" });
        setShowSessionModal(true);
        setLoading(false);
        return;
      }

      // 2. Success login
      if (res?.success && res.token) {
        setShowSessionModal(false);
        setUserSession(res.token, res.user);
        navigate("/dashboard", { replace: true });
      } else {
        setErrorMsg(res?.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Invalid credentials. Please check your email/password.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOverrideLogin = () => {
    handleSubmit(null, true);
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

      {/* Header */}
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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#DCE2ED] bg-white text-xs font-semibold text-[#293246] hover:bg-[#F8FAFD] transition-colors shadow-2xs"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Login Form */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 z-10">
        
        <div className="text-center max-w-lg mx-auto mb-7">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DCE5F5] bg-white px-4 py-[8px] shadow-2xs">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EEF3FF]">
              <Sparkles className="h-3 w-3 text-[#035BE3]" />
            </span>
            <span className="text-[12px] font-bold text-[#2A354D]">
              Student & Learner Access
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Welcome Back to KnowWay
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#64748B]">
            Sign in to continue your enrolled courses, certifications, and resources.
          </p>
        </div>

        <div className="w-full max-w-md bg-white rounded-[32px] border border-[#E4EAF4] p-6 sm:p-8 shadow-xl shadow-blue-900/5">
          
          {sessionTerminatedNotice && (
            <div className="mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Session Notice</p>
                <p className="mt-0.5 text-[#64748B]">{sessionTerminatedNotice}</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
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
                  autoComplete="username email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 rounded-full border border-[#E2E8F0] bg-[#F8FAFD] pl-11 pr-4 text-xs font-medium outline-none transition focus:border-[#035BE3] focus:ring-2 focus:ring-[#035BE3]/10"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#1E293B]">
                  Password <span className="text-red-500">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-[#035BE3] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#035BE3] focus:ring-[#035BE3]"
                />
                <span className="text-xs text-[#64748B]">Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#035BE3]/20 disabled:opacity-50 !mt-5"
            >
              <span>{loading ? "Signing in..." : "Sign In to Account"}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Bottom Signup Link */}
          <div className="mt-6 pt-5 border-t border-[#F1F5F9] text-center">
            <p className="text-xs text-[#64748B]">
              Don't have an account yet?{" "}
              <Link to="/signup" className="font-bold text-[#035BE3] hover:underline">
                Create free account
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* ======================================================== */}
      {/* CONCURRENT ACTIVE SESSION CONFIRMATION MODAL (ENGLISH) */}
      {/* ======================================================== */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xl shadow-slate-900/20">
            {/* Close Button */}
            <button
              onClick={() => setShowSessionModal(false)}
              className="absolute right-4 top-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Icon & Title */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A]">
                  Active Session Detected
                </h3>
                <p className="text-xs text-[#64748B]">
                  Account currently active on another device
                </p>
              </div>
            </div>

            {/* Body Explanation */}
            <div className="space-y-3 mb-6 text-xs text-[#475569] leading-relaxed">
              <p>
                Your account is currently signed in on another browser or device.
              </p>

              {activeSessionInfo && (
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-3">
                  <MonitorSmartphone size={20} className="text-[#035BE3] shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Active Device
                    </span>
                    <span className="font-bold text-gray-800 text-xs block">
                      {activeSessionInfo.last_device || "Other Browser / Device"}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 flex items-start gap-2">
                <LogOut size={15} className="shrink-0 text-amber-700 mt-0.5" />
                <span>
                  Continuing here will automatically <strong>log out</strong> your account from all other browsers and devices.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSessionModal(false)}
                className="flex-1 h-11 rounded-full border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmOverrideLogin}
                disabled={loading}
                className="flex-1 h-11 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-black shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <span>{loading ? "Logging in..." : "OK, Proceed"}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="w-full py-4 text-center text-xs text-[#94A3B8] border-t border-[#EDF1F7]">
        &copy; {CURRENT_YEAR} KnowWay LearnSpace. All rights reserved.
      </footer>
    </div>
  );
}
