import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Lock,
  Sparkles,
  ArrowRight,
  X,
  BookOpen,
  Briefcase,
  Award,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

export default function PackageRequiredModal() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Listen for the custom event or URL query param ?package_required=true
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener("knowway_open_package_modal", handleOpen);

    // Check URL query parameters
    const params = new URLSearchParams(location.search);
    if (params.get("package_required") === "true") {
      setIsOpen(true);
    }

    return () => {
      window.removeEventListener("knowway_open_package_modal", handleOpen);
    };
  }, [location.search]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    // Clean up query param if present without full page reload
    if (location.search.includes("package_required")) {
      const params = new URLSearchParams(location.search);
      params.delete("package_required");
      const newSearch = params.toString() ? `?${params.toString()}` : "";
      navigate(`${location.pathname}${newSearch}`, { replace: true });
    }
  };

  const handleExplorePackages = () => {
    handleClose();
    if (location.pathname === "/") {
      const el = document.getElementById("packages");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate("/#packages");
      setTimeout(() => {
        const el = document.getElementById("packages");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop with modern soft blur */}
      <div
        className="fixed inset-0 bg-[#0F172A]/65 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modern Modal Card Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] rounded-[32px] shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 overflow-hidden z-10 transition-all transform scale-100">
        {/* Subtle Decorative Ambient Background Glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl" />

        {/* Top Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Capsule & Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500/15 to-orange-500/15 border border-amber-500/25 dark:border-amber-500/30 flex items-center justify-center shadow-inner">
              <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400 stroke-[2.2]" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-semibold text-xs mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Package Enrolment Required</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Please Buy a Package to Unlock Dashboard
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm">
            You haven't purchased a learning package yet. Please enroll in any package to unlock your full Student Dashboard and Affiliate Hub.
          </p>
        </div>

        {/* Features / Benefits Grid */}
        <div className="mt-6 space-y-2.5 bg-slate-50 dark:bg-[#172033] p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            What Unlocks With Any Package:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#1E293B] shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                Full Video Courses
              </span>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#1E293B] shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                Affiliate Income Hub
              </span>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#1E293B] shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                Freelancing Studio
              </span>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#1E293B] shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                Verified Certificates
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleExplorePackages}
            className="w-full sm:flex-1 h-12 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#035BE3]/25 hover:shadow-xl transition-all cursor-pointer group"
          >
            <span>Explore All Packages</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto px-6 h-12 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1F2937] hover:bg-slate-50 dark:hover:bg-[#283548] text-slate-700 dark:text-slate-300 font-semibold text-sm transition cursor-pointer"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
