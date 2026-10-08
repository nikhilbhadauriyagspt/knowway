import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Copy,
  Check,
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
  GraduationCap,
  Sparkles,
  Share2,
  TrendingUp,
} from "lucide-react";
import { clearUserSession } from "../../services/api";

export default function AffiliateHeader({
  activeTab,
  setActiveTab,
  user,
  setMobileOpen,
  darkMode,
  setDarkMode,
}) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralCode = user?.referral_code || `KW${user?.id || 1001}`;
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLogout = () => {
    clearUserSession();
    navigate("/", { replace: true });
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <header
      className={`
        sticky top-0 z-40 py-3 px-4 sm:px-8 lg:px-10 flex items-center justify-between gap-3 transition-colors duration-200 backdrop-blur-md border-b
        ${
          darkMode
            ? "bg-[#0B0F17]/85 border-[#222B3D]/80"
            : "bg-[#FBFCFF]/85 border-[#E2E8F0]/80"
        }
      `}
    >
      {/* Mobile Hamburger & Logo preview */}
      <div className="flex items-center gap-2 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className={`h-11 w-11 rounded-full border flex items-center justify-center transition cursor-pointer ${
            darkMode
              ? "bg-[#131926] border-[#222B3D] text-[#E2E8F0]"
              : "bg-white border-[#E2E8F0] text-[#0F172A]"
          }`}
          aria-label="Open affiliate navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Referral Link Quick Capsule */}
      <div className="flex-1 max-w-xl hidden md:flex items-center">
        <div
          className={`h-11 w-full rounded-full border px-4 flex items-center justify-between transition-all ${
            darkMode
              ? "bg-[#131926] border-[#222B3D]"
              : "bg-white border-[#E2E8F0]"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold text-[#8A99AD] shrink-0 uppercase tracking-wider">
              Referral Link:
            </span>
            <span
              className={`text-xs font-mono font-medium truncate ${
                darkMode ? "text-blue-400" : "text-[#035BE3]"
              }`}
              title={referralLink}
            >
              {referralLink}
            </span>
          </div>

          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer shadow-xs ${
              copied
                ? "bg-emerald-600 text-white"
                : darkMode
                ? "bg-[#1E2638] text-white hover:bg-[#035BE3]"
                : "bg-blue-50 text-[#035BE3] hover:bg-[#035BE3] hover:text-white"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto lg:ml-0">
        {/* Switch to Student Learning Dashboard */}
        <Link
          to="/dashboard"
          className={`h-11 px-3.5 sm:px-4 rounded-full border flex items-center gap-2 text-xs font-bold transition cursor-pointer shadow-xs ${
            darkMode
              ? "bg-[#131926] border-[#222B3D] text-[#94A3B8] hover:text-white hover:border-[#035BE3]/50"
              : "bg-white border-[#E2E8F0] text-[#475569] hover:text-[#035BE3] hover:border-[#035BE3]/40"
          }`}
          title="Return to Student Learning Area"
        >
          <GraduationCap className="w-4 h-4 text-[#035BE3]" />
          <span className="hidden sm:inline">Learning Dashboard</span>
        </Link>

        {/* Dark / Light Theme Sliding Switcher Toggle */}
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`h-11 w-20 sm:w-22 rounded-full border p-1 flex items-center justify-between relative transition-all cursor-pointer select-none ${
            darkMode
              ? "bg-[#131926] border-[#222B3D]"
              : "bg-white border-[#E2E8F0]"
          }`}
          aria-label="Toggle dark and light theme"
        >
          <div
            className={`absolute top-1 bottom-1 w-8 rounded-full transition-transform duration-300 ease-out flex items-center justify-center shadow-xs ${
              darkMode
                ? "translate-x-9 sm:translate-x-11 bg-[#1E2638] border border-[#2B374E] text-[#FBBF24]"
                : "translate-x-0 bg-[#035BE3] text-white"
            }`}
          >
            {darkMode ? <Moon className="w-3.5 h-3.5 shrink-0" /> : <Sun className="w-3.5 h-3.5 shrink-0" />}
          </div>

          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors ${!darkMode ? "opacity-0" : "text-[#64748B]"}`}>
            <Sun className="w-3.5 h-3.5 shrink-0" />
          </div>

          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors ${darkMode ? "opacity-0" : "text-[#94A3B8]"}`}>
            <Moon className="w-3.5 h-3.5 shrink-0" />
          </div>
        </button>

        {/* Affiliate Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`h-11 rounded-full border px-3 pr-3.5 flex items-center gap-2 transition cursor-pointer ${
              darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-linear-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
              {userInitial}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold leading-none truncate max-w-[90px]">{user?.name?.split(" ")[0]}</p>
              <p className="text-[10px] text-amber-500 font-bold mt-0.5 flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> Affiliate
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8A99AD]" />
          </button>

          {showProfileMenu && (
            <div
              className={`absolute right-0 top-full mt-2 w-56 rounded-[22px] border p-2 shadow-lg animate-in fade-in zoom-in-95 duration-150 z-50 ${
                darkMode ? "bg-[#131926] border-[#222B3D] text-[#E2E8F0]" : "bg-white border-[#E2E8F0] text-[#161B29]"
              }`}
            >
              <div className="p-3 border-b border-inherit">
                <p className="text-xs font-bold truncate">{user?.name}</p>
                <p className="text-[11px] text-[#64748B] truncate mt-0.5">{user?.email}</p>
                <div className="mt-2 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-500 font-mono text-[10px] font-bold">
                  <span>Code: {referralCode}</span>
                </div>
              </div>
              <div className="py-1">
                <Link
                  to="/dashboard"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                >
                  <GraduationCap size={14} className="text-[#035BE3]" />
                  <span>Student Dashboard</span>
                </Link>
              </div>
              <div className="pt-1 border-t border-inherit">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
