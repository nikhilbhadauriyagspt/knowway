import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Layers3,
  BarChart3,
  Settings,
  LogOut,
  X,
  ExternalLink,
  Shield,
  GraduationCap,
} from "lucide-react";
import { clearAdminSession } from "../../services/api";

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  adminUser,
  mobileOpen,
  setMobileOpen,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin/login");
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard Overview",
      icon: LayoutDashboard,
      badge: "Live",
      badgeColor: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    },
    {
      id: "users",
      label: "Students & Registrations",
      icon: Users,
      badge: null,
    },
    {
      id: "packages",
      label: "Packages & Courses",
      icon: Layers3,
      badge: "4 Active",
      badgeColor: "bg-blue-50 text-[#035BE3] border border-blue-200",
    },
    {
      id: "revenue",
      label: "Revenue & Analytics",
      icon: BarChart3,
      badge: null,
    },
    {
      id: "settings",
      label: "System & Database",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-gray-200/90 flex flex-col justify-between
          transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:shadow-none"}
        `}
      >
        {/* Top Brand Section */}
        <div>
          <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-3 group"
              title="KnowWay Platform"
            >
              <img
                src="/images/logo/logo.png"
                alt="KnowWay Logo"
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#035BE3] bg-[#EFF4FF] px-2 py-0.5 rounded-full w-max border border-[#035BE3]/15">
                  Super Admin
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Platform View Pill */}
          <div className="px-4 pt-4">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-[#EEF4FF] border border-gray-200/60 hover:border-[#035BE3]/30 transition-all text-xs font-semibold text-[#5B6F96] hover:text-[#035BE3] group"
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#035BE3]" />
                View Student Portal
              </span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Main Navigation List */}
          <nav className="p-4 space-y-1.5 mt-2">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Navigation Menu
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (setMobileOpen) setMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer
                    ${
                      isActive
                        ? "bg-[#035BE3] text-white shadow-md shadow-[#035BE3]/20"
                        : "text-[#475569] hover:bg-gray-100/80 hover:text-[#035BE3]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? "text-white" : "text-gray-400 group-hover:text-[#035BE3]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : item.badgeColor || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Admin User & Logout */}
        <div className="p-4 border-t border-gray-100 bg-[#FAFAFC]">
          <div className="p-3 bg-white rounded-2xl border border-gray-200/70 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#035BE3] to-[#4379F2] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#161B29] truncate">
                  {adminUser?.name || "Super Admin"}
                </p>
                <p className="text-[11px] text-[#5B6F96] truncate">
                  {adminUser?.email || "admin@knowway.com"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer shrink-0"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 px-1 flex items-center justify-between text-[11px] text-[#5B6F96]">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              System Online
            </span>
            <span className="font-semibold text-gray-400">v1.2.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
