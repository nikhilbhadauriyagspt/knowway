import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  X,
} from "lucide-react";

export default function AuthModal({ isOpen, onClose, initialMode = "login" }) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeTerms: false,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo submission handling
    alert(isLogin ? "Logged in successfully!" : "Account created successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#171C29]/40 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Outer Modal Container with Hero-Matched Background Design */}
      <div className="relative w-full max-w-[480px] overflow-hidden rounded-[28px] border border-[#E2E7F0] bg-[#FBFCFF] p-7 sm:p-9 shadow-2xl shadow-blue-900/10 transition-all">
        
        {/* ================= BACKGROUND GRID & SOFT ACCENTS ================= */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(91,111,150,.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(91,111,150,.07) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
          }}
        />

        {/* Soft Radial Fade */}
        <div className="pointer-events-none absolute inset-0 -z-5 bg-[radial-gradient(circle_at_top,rgba(238,243,255,0.7)_0%,rgba(251,252,255,0.95)_70%)]" />

        {/* Soft floating decorative shapes */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full border-[28px] border-[#EEF3FF]" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full border-[24px] border-[#F5F0FF]" />
        
        <div className="pointer-events-none absolute right-16 top-6 h-2 w-2 rounded-full bg-[#356AE6]/40" />
        <div className="pointer-events-none absolute left-8 bottom-12 h-2.5 w-2.5 rounded-full bg-[#7555E8]/30" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E7F0] bg-white text-[#657184] shadow-2xs hover:bg-[#F8FAFD] hover:text-[#171C29] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={17} />
        </button>

        {/* ================= HEADER BRANDING ================= */}
        <div className="text-center">
          {/* Logo Badge */}
          <img
            src="/images/logo/logo.png"
            alt="Logo"
            className="mx-auto h-12 w-auto object-contain"
          />

          <h2 className="mt-4 text-[24px] sm:text-[26px] font-bold tracking-[-0.03em] text-[#171C29]">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>

          <p className="mt-1 text-[13px] text-[#6B7688]">
            {isLogin
              ? "Enter your credentials to access your courses"
              : "Start learning in-demand skills today for free"}
          </p>
        </div>

        {/* ================= AUTH TOGGLE TABS ================= */}
        <div className="mt-6 flex rounded-xl border border-[#E2E8F3] bg-[#EFF3F9] p-1">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`
              flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all cursor-pointer
              ${
                isLogin
                  ? "bg-white text-[#171C29] shadow-xs"
                  : "text-[#657184] hover:text-[#171C29]"
              }
            `}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`
              flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all cursor-pointer
              ${
                !isLogin
                  ? "bg-white text-[#171C29] shadow-xs"
                  : "text-[#657184] hover:text-[#171C29]"
              }
            `}
          >
            Create account
          </button>
        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          
          {/* Full Name Input (Only on Sign Up) */}
          {!isLogin && (
            <div>
              <label className="block text-[12px] font-semibold text-[#455062] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C97A8]" />
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-[14px] border border-[#DCE3EE] bg-white pl-10 pr-4 py-2.5 text-[14px] text-[#171C29] placeholder-[#A0AABA] shadow-2xs focus:border-[#315FD8] focus:outline-none focus:ring-3 focus:ring-blue-500/10 transition"
                />
              </div>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-[12px] font-semibold text-[#455062] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C97A8]" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-[14px] border border-[#DCE3EE] bg-white pl-10 pr-4 py-2.5 text-[14px] text-[#171C29] placeholder-[#A0AABA] shadow-2xs focus:border-[#315FD8] focus:outline-none focus:ring-3 focus:ring-blue-500/10 transition"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[12px] font-semibold text-[#455062]">
                Password
              </label>
              {isLogin && (
                <a
                  href="#forgot"
                  className="text-[11px] font-semibold text-[#315FD8] hover:underline"
                >
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C97A8]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-[14px] border border-[#DCE3EE] bg-white pl-10 pr-10 py-2.5 text-[14px] text-[#171C29] placeholder-[#A0AABA] shadow-2xs focus:border-[#315FD8] focus:outline-none focus:ring-3 focus:ring-blue-500/10 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C97A8] hover:text-[#171C29] transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Terms checkbox for sign up */}
          {!isLogin && (
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                required
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-[#DCE3EE] text-[#315FD8] focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-[11px] text-[#6B7688] leading-tight">
                I agree to the{" "}
                <a href="#terms" className="font-semibold text-[#315FD8] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#privacy" className="font-semibold text-[#315FD8] hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
          )}

          {/* Main Submit Button */}
          <button
            type="submit"
            className="
              mt-2 flex w-full h-[48px] items-center justify-center gap-2
              rounded-full bg-[#035BE3] hover:bg-[#FA8C03]
              text-[14px] font-semibold text-white shadow-md shadow-[#035BE3]/20
              transition-colors duration-200 cursor-pointer
            "
          >
            <span>{isLogin ? "Sign in to account" : "Create my account"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* ================= SOCIAL LOGIN SEPARATOR ================= */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E3E8F2]" />
          </div>
          <span className="relative bg-[#FBFCFF] px-3 text-[11px] font-semibold uppercase tracking-wider text-[#96A0B0]">
            Or continue with
          </span>
        </div>

        {/* Google / Quick Login Button */}
        <button
          type="button"
          onClick={() => {
            alert("Google authentication initialized");
            onClose();
          }}
          className="
            flex w-full h-[44px] items-center justify-center gap-2.5
            rounded-full border border-[#DDE3EE] bg-white
            text-[13px] font-semibold text-[#2C3547]
            shadow-2xs hover:bg-[#F8FAFD] transition-colors cursor-pointer
          "
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Footer Toggle Text */}
        <p className="mt-5 text-center text-[12px] text-[#6B7688]">
          {isLogin ? "Don't have an account yet?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-[#315FD8] hover:underline cursor-pointer"
          >
            {isLogin ? "Create account" : "Log in"}
          </button>
        </p>

      </div>
    </div>
  );
}
