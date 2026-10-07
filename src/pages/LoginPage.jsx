import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { loginUserApi, setUserSession } from "../services/api";

const CURRENT_YEAR = new Date().getFullYear();

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await loginUserApi({
        email: email.trim(),
        password,
      });

      if (res?.success && res.token) {
        setUserSession(res.token, res.user);
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || "Invalid credentials. Please check your email/password.");
    } finally {
      setLoading(false);
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

      <footer className="w-full py-4 text-center text-xs text-[#94A3B8] border-t border-[#EDF1F7]">
        &copy; {CURRENT_YEAR} KnowWay LearnSpace. All rights reserved.
      </footer>
    </div>
  );
}
