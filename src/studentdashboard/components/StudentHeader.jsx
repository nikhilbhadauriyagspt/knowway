import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  RefreshCw,
  Sun,
  Moon,
  ChevronDown,
  User,
  Tag,
  LogOut,
  Sparkles,
} from "lucide-react";
import { clearUserSession } from "../../services/api";
import UserAvatarDropdown from "../../components/UserAvatarDropdown";

export default function StudentHeader({
  activeTab,
  setActiveTab,
  user,
  setMobileOpen,
  onRefresh,
  isRefreshing,
  searchQuery,
  setSearchQuery,
  darkMode,
  setDarkMode,
}) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    clearUserSession();
    navigate("/", { replace: true });
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "S";

  return (
    <header
      className={`
        sticky top-0 z-40 py-3.5 px-4 sm:px-8 lg:px-10 flex items-center justify-between gap-3 sm:gap-4 transition-colors duration-200 backdrop-blur-md border-b
        ${
          darkMode
            ? "bg-[#0B0F17]/85 border-[#222B3D]/80"
            : "bg-[#FBFCFF]/85 border-[#E2E8F0]/80"
        }
      `}
    >
      {/* Mobile Hamburger */}
      <div className="flex items-center gap-2 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className={`h-12 w-12 rounded-full border flex items-center justify-center transition cursor-pointer ${
            darkMode ? "bg-[#131926] border-[#222B3D] text-[#E2E8F0]" : "bg-white border-[#E2E8F0] text-[#0F172A]"
          }`}
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Center Search Pill */}
      <div className="flex-1 max-w-xl">
        <div
          className={`h-12 rounded-full border flex items-center px-5 transition-all focus-within:border-[#035BE3] ${
            darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
          }`}
        >
          <Search className="w-4 h-4 text-[#8A99AD] shrink-0 mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find courses, instructors, or digital skills..."
            className={`w-full bg-transparent text-xs font-medium outline-none placeholder-[#8A99AD] ${
              darkMode ? "text-white" : "text-[#0F172A]"
            }`}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Affiliate Hub Quick Button */}
        <Link
          to="/affiliate/dashboard"
          className={`h-12 px-3.5 sm:px-4 rounded-full border flex items-center gap-2 text-xs font-bold transition cursor-pointer shadow-xs ${
            darkMode
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
              : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
          }`}
          title="Open Affiliate & Referral Income Hub"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline">Affiliate Panel</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-black leading-none">
            Earn ₹
          </span>
        </Link>

        {/* Dark / Light Theme Sliding Switcher Toggle */}
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`h-12 w-22 sm:w-24 rounded-full border p-1.5 flex items-center justify-between relative transition-all cursor-pointer select-none ${
            darkMode
              ? "bg-[#131926] border-[#222B3D]"
              : "bg-white border-[#E2E8F0]"
          }`}
          aria-label="Toggle dark and light theme"
        >
          {/* Animated Slider Pill with centered icon */}
          <div
            className={`absolute top-1 bottom-1 w-9 rounded-full transition-transform duration-300 ease-out flex items-center justify-center shadow-xs ${
              darkMode
                ? "translate-x-10 sm:translate-x-12 bg-[#1E2638] border border-[#2B374E] text-[#FBBF24]"
                : "translate-x-0 bg-[#035BE3] text-white shadow-md shadow-[#035BE3]/20"
            }`}
          >
            {darkMode ? <Moon className="w-4 h-4 shrink-0" /> : <Sun className="w-4 h-4 shrink-0" />}
          </div>

          {/* Underlay Sun Placeholder (Centered) */}
          <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 transition-colors ${!darkMode ? "opacity-0" : "text-[#64748B]"}`}>
            <Sun className="w-4 h-4 shrink-0" />
          </div>

          {/* Underlay Moon Placeholder (Centered) */}
          <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 transition-colors ${darkMode ? "opacity-0" : "text-[#94A3B8]"}`}>
            <Moon className="w-4 h-4 shrink-0" />
          </div>
        </button>

        {/* Sync / Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`h-12 w-12 rounded-full border flex items-center justify-center transition cursor-pointer ${
            darkMode ? "bg-[#131926] border-[#222B3D] text-[#8A99AD] hover:text-white" : "bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#035BE3]"
          }`}
          title="Refresh course data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#035BE3]" : ""}`} />
        </button>

        {/* User Profile Avatar & Popup Dropdown */}
        <UserAvatarDropdown
          user={user}
          darkMode={darkMode}
          onProfileClick={(tab) => {
            if (setActiveTab) setActiveTab(tab);
          }}
          align="right"
          showDashboardLink={false}
        />
      </div>
    </header>
  );
}
