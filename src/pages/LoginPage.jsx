import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logged in successfully with ${email}`);
  };

  return (
    <div className="relative isolate min-h-screen flex flex-col justify-between bg-[#FBFCFF] text-[#161B29] overflow-hidden">
      
      {/* ================= EXACT HERO GRID BACKGROUND ================= */}
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

      {/* Hero Radial Center Fade */}
      <div
        className="
          pointer-events-none absolute inset-0 -z-[5]
          bg-[radial-gradient(circle_at_center,rgba(251,252,255,0.30)_0%,rgba(251,252,255,0.55)_47%,rgba(251,252,255,0.94)_100%)]
        "
      />

      {/* Hero Soft Color Rings */}
      <div
        className="
          pointer-events-none absolute
          -left-[100px] top-[100px]
          hidden h-[300px] w-[300px]
          rounded-full border-[60px] border-[#EDF3FF]
          lg:block
        "
      />

      <div
        className="
          pointer-events-none absolute
          -right-[80px] bottom-[100px]
          hidden h-[280px] w-[280px]
          rounded-full border-[55px] border-[#F3EEFF]
          lg:block
        "
      />

      {/* Hero Colored Accent Dots */}
      <div className="absolute left-[9%] top-[18%] hidden h-[11px] w-[11px] rounded-full bg-[#FF985D] lg:block" />
      <div className="absolute right-[12%] top-[34%] hidden h-[12px] w-[12px] rounded-full bg-[#6D5CE7] lg:block" />
      <div className="absolute bottom-[23%] left-[19%] hidden h-[10px] w-[10px] rounded-full bg-[#FFCE57] lg:block" />

      {/* ================= TOP NAVIGATION ================= */}
      <header className="w-full px-6 lg:px-16 pt-6 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center group">
          <img
            src="/images/logo/logo.png"
            alt="Logo"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DCE2ED] bg-white text-xs font-semibold text-[#293246] hover:bg-[#F8FAFD] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* ================= MAIN CENTERED LOGIN FORM ================= */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 z-10">
        
        {/* Top Content Above Box */}
        <div className="text-center max-w-lg mx-auto mb-7">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DCE5F5] bg-white px-4 py-[8px]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EEF3FF]">
              <Sparkles size={12} className="text-[#416FE8]" />
            </span>
            <span className="text-[12px] font-semibold tracking-[0.01em] text-[#526079]">
              Student & Learner Dashboard
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.04em] text-[#161B29] leading-tight">
            Log in to your account
          </h1>

          <p className="mt-2 text-[15px] text-[#626B7C] leading-relaxed">
            Welcome back! Continue learning your tracks, practical projects, and courses.
          </p>
        </div>

        {/* Wide Center Card Box (Flat, No Shadows) */}
        <div className="w-full max-w-[560px] rounded-[24px] border border-[#E2E7F0] bg-white p-8 sm:p-10">
          
          <form onSubmit={handleSubmit} className="space-y-4.5">
            {/* Email Field */}
            <div>
              <label className="block text-[13px] font-semibold text-[#293246] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C97A8]" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[14px] border border-[#DCE2ED] bg-[#FBFCFF] pl-11 pr-4 py-3 text-[14px] text-[#161B29] placeholder-[#A0AABA] focus:border-[#315FD8] focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[13px] font-semibold text-[#293246]">
                  Password
                </label>
                <a
                  href="#forgot"
                  className="text-[12px] font-semibold text-[#315FD8] hover:text-[#264EB8] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C97A8]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[14px] border border-[#DCE2ED] bg-[#FBFCFF] pl-11 pr-11 py-3 text-[14px] text-[#161B29] placeholder-[#A0AABA] focus:border-[#315FD8] focus:bg-white focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C97A8] hover:text-[#161B29] transition cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 text-[13px] text-[#626B7C] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-[#DCE2ED] text-[#315FD8] focus:ring-0"
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            {/* Submit Button (Flat, Clean) */}
            <button
              type="submit"
              className="w-full h-[50px] mt-2 flex items-center justify-center gap-2 rounded-full bg-[#035BE3] hover:bg-[#FA8C03] text-[14px] font-semibold text-white transition-colors duration-200 shadow-md shadow-[#035BE3]/20 cursor-pointer"
            >
              <span>Sign In to Learning Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Clean Separator */}
          <div className="relative my-7 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E9F1]" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9AA3B1]">
              Or continue with
            </span>
          </div>

          {/* Social Google Button */}
          <button
            type="button"
            onClick={() => alert("Google Login initialized")}
            className="w-full h-[48px] flex items-center justify-center gap-3 rounded-full border border-[#DCE2ED] bg-white text-[13px] font-semibold text-[#293246] hover:border-[#035BE3] hover:bg-[#F8FAFD] transition-colors cursor-pointer"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
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

          {/* Footer Link */}
          <div className="mt-8 pt-6 border-t border-[#F0F3F8] text-center">
            <p className="text-[13px] text-[#626B7C]">
              New to LearnSpace?{" "}
              <Link to="/signup" className="font-bold text-[#035BE3] hover:text-[#FA8C03] hover:underline">
                Create a free account
              </Link>
            </p>
          </div>
        </div>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full px-6 py-6 text-center text-[12px] text-[#9AA3B1] z-10 border-t border-[#E5E9F1]">
        © {CURRENT_YEAR} LearnSpace Platform. All rights reserved. • <a href="#privacy" className="hover:underline">Privacy Policy</a> • <a href="#terms" className="hover:underline">Terms of Service</a>
      </footer>

    </div>
  );
}
