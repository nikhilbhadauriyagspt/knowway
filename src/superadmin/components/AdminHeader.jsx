import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  RefreshCw,
  LogOut,
  ChevronDown,
  Shield,
  CheckCircle2,
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
}) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin/login");
  };

  const getTitle = () => {
    switch (activeTab) {
      case "users":
        return {
          title: "Student Registrations",
          subtitle: "Manage and monitor registered students & referral records",
        };
      case "packages":
        return {
          title: "Packages & Curriculum",
          subtitle: "Explore training packages, active tiers, and modules",
        };
      case "revenue":
        return {
          title: "Revenue & Earnings Analytics",
          subtitle: "Financial metrics, transaction trends, and forecasts",
        };
      case "settings":
        return {
          title: "System & Database Configuration",
          subtitle: "MySQL database health, credentials, and app controls",
        };
      default:
        return {
          title: "Super Admin Dashboard",
          subtitle: "Real-time overview of student enrollments, courses, and platform metrics",
        };
    }
  };

  const currentTabInfo = getTitle();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-all">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-extrabold text-[#161B29] truncate flex items-center gap-2">
            <span>{currentTabInfo.title}</span>
          </h1>
          <p className="hidden sm:block text-xs text-[#5B6F96] truncate">
            {currentTabInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Search + Refresh + Notifications + Admin Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Search input (visible on sm+) */}
        <div className="relative hidden md:block w-56 lg:w-72">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="Search students, emails..."
            className="w-full rounded-xl border border-gray-200 bg-[#F8FAFC] pl-9 pr-4 py-1.5 text-xs text-[#161B29] placeholder-gray-400 outline-none transition focus:border-[#035BE3] focus:bg-white focus:ring-2 focus:ring-[#035BE3]/15"
          />
        </div>

        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh live data"
            className="p-2 text-[#5B6F96] hover:text-[#035BE3] hover:bg-[#EFF4FF] rounded-xl border border-gray-200/80 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#035BE3]" : ""}`}
            />
          </button>
        )}

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 text-[#5B6F96] hover:text-[#035BE3] hover:bg-[#EFF4FF] rounded-xl border border-gray-200/80 transition-all cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#FA8C03] ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-gray-200 shadow-xl p-3 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                <span className="font-bold text-[#161B29]">Notifications</span>
                <span className="text-[10px] bg-[#EFF4FF] text-[#035BE3] font-bold px-2 py-0.5 rounded-full">
                  1 New
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">MySQL DB Connected</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Tables synced: users, admins.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-gray-200/80 hover:border-[#035BE3]/30 bg-white hover:bg-gray-50 transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#035BE3] to-[#4379F2] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-[#161B29] leading-tight">
                {adminUser?.name || "Super Admin"}
              </span>
              <span className="block text-[10px] text-[#035BE3] font-semibold leading-none mt-0.5">
                Root Access
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-gray-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-gray-100">
                <p className="text-xs font-bold text-[#161B29]">
                  {adminUser?.name || "Super Administrator"}
                </p>
                <p className="text-[11px] text-[#5B6F96] truncate">
                  {adminUser?.email || "admin@knowway.com"}
                </p>
                <span className="inline-block mt-1.5 text-[10px] font-bold text-[#035BE3] bg-[#EFF4FF] px-2 py-0.5 rounded-full border border-[#035BE3]/20">
                  Role: Super Admin
                </span>
              </div>

              <div className="p-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout from Panel</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
