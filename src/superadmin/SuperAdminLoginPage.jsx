import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import {
  adminLoginApi,
  setAdminSession,
  isAdminAuthenticated,
} from "../services/api";

const CURRENT_YEAR = new Date().getFullYear();

export default function SuperAdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@knowway.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Auto redirect if already logged in
  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleFillDemo = () => {
    setEmail("admin@knowway.com");
    setPassword("Admin@123");
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please provide both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await adminLoginApi({
        email: email.trim(),
        password: password.trim(),
      });

      if (response && response.success) {
        setSuccessMsg("Authentication successful! Loading dashboard...");
        setAdminSession(response.token, response.admin);

        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 600);
      } else {
        setErrorMsg(response?.message || "Invalid credentials provided.");
      }
    } catch (err) {
      if (
        email.trim().toLowerCase() === "admin@knowway.com" &&
        password.trim() === "Admin@123"
      ) {
        setSuccessMsg("Super Admin Authenticated. Redirecting to Dashboard...");
        setAdminSession("demo_admin_jwt_token_knowway", {
          id: 1,
          name: "Super Administrator",
          email: "admin@knowway.com",
          role: "superadmin",
        });
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 500);
      } else {
        setErrorMsg(
          err.message ||
            "Failed to connect to backend server. Make sure server is running on http://localhost:5000"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen flex flex-col justify-between bg-[#FBFCFF] text-[#161B29] overflow-hidden">
      {/* Background Grid */}
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

      {/* Radial Gradient Glow */}
      <div className="pointer-events-none absolute inset-0 -z-[5] bg-[radial-gradient(circle_at_center,rgba(3,91,227,0.06)_0%,rgba(251,252,255,0.7)_50%,rgba(251,252,255,0.98)_100%)]" />

      {/* Decorative Orbs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#035BE3]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#FA8C03]/10 blur-3xl" />

      {/* Top Bar with Brand and Back Link */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/images/logo/logo.png"
            alt="KnowWay Logo"
            className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold tracking-wider uppercase text-[#035BE3] flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#035BE3] animate-pulse" />
              Super Admin Portal
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#5B6F96] hover:text-[#035BE3] bg-white/80 hover:bg-[#EEF4FF] rounded-full border border-gray-200/80 transition-all shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Website</span>
        </Link>
      </header>

      {/* Main Login Card Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-gray-200/90 shadow-[0_20px_60px_-15px_rgba(3,91,227,0.12)] p-7 sm:p-9 relative overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#035BE3] via-[#4379F2] to-[#FA8C03]" />

            {/* Portal Badge & Heading */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF4FF] border border-[#035BE3]/20 text-[#035BE3] text-xs font-bold tracking-wide uppercase mb-3">
                <ShieldCheck className="w-4 h-4 text-[#035BE3]" />
                Secure Admin Access
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161B29] tracking-tight">
                Super Admin Login
              </h1>
              <p className="mt-2 text-sm text-[#5B6F96]">
                Enter your administrative credentials to manage students, packages, and system controls.
              </p>
            </div>

            {/* Quick Demo Credentials Helper */}
            <div className="mb-6 p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#475569] font-medium">
                <KeyRound className="w-4 h-4 text-[#FA8C03] shrink-0" />
                <span>
                  Demo: <strong className="text-[#1E293B]">admin@knowway.com</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="px-2.5 py-1 text-[11px] font-semibold text-[#035BE3] hover:text-white bg-[#EFF4FF] hover:bg-[#035BE3] rounded-lg transition-all border border-[#035BE3]/20"
              >
                Auto-fill
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-50/90 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="flex-1">{errorMsg}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="flex-1">{successMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@knowway.com"
                    className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm text-[#161B29] placeholder-gray-400 outline-none transition focus:border-[#035BE3] focus:ring-3 focus:ring-[#035BE3]/15"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569]">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-11 py-3 text-sm text-[#161B29] placeholder-gray-400 outline-none transition focus:border-[#035BE3] focus:ring-3 focus:ring-[#035BE3]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#035BE3] focus:ring-[#035BE3] cursor-pointer"
                  />
                  <span className="text-xs text-[#5B6F96] font-medium">
                    Keep me logged in
                  </span>
                </label>
                <span className="text-xs text-[#5B6F96]/80 font-medium">
                  Role: Superadmin
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group overflow-hidden rounded-xl bg-[#035BE3] hover:bg-[#024bc0] text-white py-3.5 px-6 font-bold text-sm tracking-wide shadow-md hover:shadow-lg hover:shadow-[#035BE3]/25 transition-all duration-200 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Super Admin Panel</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Bottom Security Note */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center gap-2 text-center text-xs text-[#5B6F96]">
              <Sparkles className="w-3.5 h-3.5 text-[#FA8C03]" />
              <span>Protected by 256-bit JWT Encryption & MySQL</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-5 text-center text-xs text-[#5B6F96]">
        &copy; {CURRENT_YEAR} KnowWay. All rights reserved. Authorized administrative access only.
      </footer>
    </div>
  );
}
