import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  RefreshCw,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  ExternalLink,
} from "lucide-react";
import { clearAdminSession } from "../../services/api";

export default function AdminHeader({
  activeTab,
  adminUser,
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
    clearAdminSession();
    navigate("/admin/login");
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "packages":
        return "Package Studio & Bundles";
      case "mentors":
        return "Mentors & Instructors";
      case "courses":
        return "Course & Video Management";
      case "users":
        return "Student Directory";
      case "settings":
        return "Cloudinary & System Settings";
      default:
        return "Control Center";
    }
  };

  return (
    <header className="sticky top-0 z-30 pt-4 px-4 sm:px-6 lg:px-8 pb-2 flex items-center justify-between gap-3 sm:gap-4 pointer-events-none">
      {/* Mobile Hamburger */}
      <div className="flex items-center gap-2 pointer-events-auto lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className={`h-12 w-12 rounded-full border flex items-center justify-center transition cursor-pointer ${
            darkMode
              ? "bg-[#131926] border-[#222B3D] text-[#E2E8F0]"
              : "bg-white border-[#E2E8F0] text-[#0F172A]"
          }`}
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Center/Left Search Pill */}
      <div className="flex-1 max-w-lg pointer-events-auto">
        <div
          className={`h-12 rounded-full border flex items-center px-4 transition-all focus-within:border-[#035BE3] ${
            darkMode
              ? "bg-[#131926] border-[#222B3D]"
              : "bg-white border-[#E2E8F0]"
          }`}
        >
          <Search className="w-4 h-4 text-[#94A3B8] shrink-0 mr-2.5" />
          <input
            type="text"
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder={`Search ${getTabTitle().toLowerCase()}...`}
            className={`w-full bg-transparent text-xs outline-none placeholder-[#94A3B8] ${
              darkMode ? "text-white" : "text-[#0F172A]"
            }`}
          />
        </div>
      </div>

      {/* Right Controls: Theme Switcher Toggle, Sync DB, Admin Profile Pill */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 pointer-events-auto">
        {/* Dark / Light Theme Sliding Switcher Toggle */}
        <button
          type="button"
          onClick={() => {
            const nextMode = !darkMode;
            setDarkMode(nextMode);
            try {
              localStorage.setItem("admin_dark_mode", String(nextMode));
              if (nextMode) {
                document.documentElement.classList.add("dark");
              } else {
                document.documentElement.classList.remove("dark");
              }
            } catch {
              // Ignore storage errors
            }
          }}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`h-12 w-22 sm:w-24 rounded-full border p-1.5 flex items-center justify-between relative transition-all cursor-pointer select-none ${
            darkMode
              ? "bg-[#131926] border-[#222B3D]"
              : "bg-white border-[#E2E8F0]"
          }`}
        >
          <div
            className={`absolute top-1 bottom-1 w-9 rounded-full transition-transform duration-300 ease-out flex items-center justify-center shadow-xs ${
              darkMode
                ? "translate-x-10 sm:translate-x-12 bg-[#1E2638] border border-[#2B374E] text-[#FBBF24]"
                : "translate-x-0 bg-[#035BE3] text-white shadow-md shadow-[#035BE3]/20"
            }`}
          >
            {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </div>

          <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 transition-colors ${!darkMode ? "opacity-0" : "text-[#64748B]"}`}>
            <Sun className="w-4 h-4" />
          </div>

          <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 transition-colors ${darkMode ? "opacity-0" : "text-[#94A3B8]"}`}>
            <Moon className="w-4 h-4" />
          </div>
        </button>

        {/* Database Sync Refresh Pill */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh database records"
          className={`h-12 px-3 sm:px-4 rounded-full border flex items-center gap-2 text-xs font-semibold transition cursor-pointer disabled:opacity-50 ${
            darkMode
              ? "bg-[#131926] border-[#222B3D] text-[#E2E8F0] hover:border-[#035BE3]"
              : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#035BE3] hover:text-[#035BE3]"
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#035BE3]" : ""}`} />
          <span className="hidden sm:inline">Sync DB</span>
        </button>

        {/* Super Admin Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`h-12 px-3 sm:px-4 rounded-full border flex items-center gap-2.5 transition cursor-pointer ${
              darkMode
                ? "bg-[#131926] border-[#222B3D] text-white hover:border-[#035BE3]"
                : "bg-white border-[#E2E8F0] text-[#0F172A] hover:border-[#CBD5E1]"
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-[#035BE3] text-white font-bold text-xs flex items-center justify-center shrink-0">
              {(adminUser?.name || "A")[0]?.toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold leading-tight truncate max-w-[100px]">
                {adminUser?.name || "Super Admin"}
              </p>
              <p className="text-[10px] font-semibold text-[#035BE3] leading-none mt-0.5">
                Admin
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div
              className={`absolute right-0 mt-2 w-56 rounded-2xl border p-2 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100 ${
                darkMode
                  ? "bg-[#131926] border-[#222B3D] text-white"
                  : "bg-white border-[#E2E8F0] text-[#0F172A]"
              }`}
            >
              <div className="p-2 border-b border-inherit mb-1">
                <p className="text-xs font-bold">
                  {adminUser?.name || "Super Admin"}
                </p>
                <p className="text-[11px] text-[#64748B] truncate">
                  {adminUser?.email || "admin@knowway.com"}
                </p>
              </div>

              <Link
                to="/"
                target="_blank"
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition ${
                  darkMode ? "hover:bg-[#1E2638]" : "hover:bg-[#F8FAFD]"
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Visit Public Site</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Admin</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
