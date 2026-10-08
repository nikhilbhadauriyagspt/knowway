import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Layers3,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { clearAdminSession } from "../../services/api";

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  adminUser,
  mobileOpen,
  setMobileOpen,
  darkMode,
  isHovered,
  setIsHovered,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin/login");
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      badge: "Live",
    },
    {
      id: "packages",
      label: "Package Studio",
      icon: Layers3,
      badge: "Dynamic",
    },
    {
      id: "mentors",
      label: "Mentors / Instructors",
      icon: GraduationCap,
      badge: null,
    },
    {
      id: "courses",
      label: "Course Management",
      icon: BookOpen,
      badge: "New",
    },
    {
      id: "users",
      label: "Students",
      icon: Users,
      badge: null,
    },
    {
      id: "settings",
      label: "Cloudinary & Settings",
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

      {/* Floating Container: Fixed size Logo Pill on top + Hover Expandable Sidebar below */}
      <div
        className={`
          fixed top-4 bottom-4 left-4 z-50 flex flex-col gap-3 transition-all duration-300 ease-in-out
          ${
            mobileOpen
              ? "translate-x-0 w-64"
              : "-translate-x-[150%] lg:translate-x-0"
          }
          ${isHovered || mobileOpen ? "lg:w-64" : "lg:w-[68px]"}
        `}
      >
        {/* ================= 1. LOGO PILL (FIXED FULL ROUNDED CIRCLE) ================= */}
        <div
          className={`
            h-12 w-[68px] rounded-full border flex items-center justify-center shrink-0 transition-colors
            ${
              darkMode
                ? "bg-[#131926] border-[#222B3D]"
                : "bg-white border-[#E2E8F0]"
            }
          `}
        >
          <Link
            to="/"
            className="flex items-center justify-center group"
            title="Knowway Home"
          >
            <img
              src="/images/logo/logo.png"
              alt="Logo"
              className="h-6 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        {/* ================= 2. SIDEBAR ISLAND ================= */}
        <aside
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            flex-1 rounded-[36px] border p-2 flex flex-col justify-between overflow-hidden transition-all duration-300
            ${
              darkMode
                ? "bg-[#131926] border-[#222B3D] text-[#E2E8F0]"
                : "bg-white border-[#E2E8F0] text-[#0F172A]"
            }
          `}
        >
          {/* Navigation Menu Items */}
          <nav className="space-y-2 overflow-hidden">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  title={!isHovered ? item.label : undefined}
                  className={`
                    w-full h-12 flex items-center rounded-full text-xs font-semibold transition-all cursor-pointer group px-1.5
                    ${
                      isActive
                        ? "bg-[#035BE3] text-white shadow-xs"
                        : darkMode
                        ? "text-[#94A3B8] hover:bg-[#1E2638] hover:text-white"
                        : "text-[#556377] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                    }
                    ${isHovered || mobileOpen ? "justify-between pr-3" : "justify-center"}
                  `}
                >
                  <div className="flex items-center gap-3 min-w-max">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors
                        ${
                          isActive
                            ? "bg-white/15 text-white"
                            : darkMode
                            ? "bg-[#1A2234] text-[#94A3B8] group-hover:bg-[#035BE3]/20 group-hover:text-[#035BE3]"
                            : "bg-[#F4F6FB] text-[#64748B] group-hover:bg-[#035BE3]/10 group-hover:text-[#035BE3]"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <span
                      className={`transition-all duration-200 whitespace-nowrap font-medium text-[13px] ${
                        isHovered || mobileOpen
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-3 pointer-events-none lg:hidden"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {(isHovered || mobileOpen) && item.badge && (
                    <span
                      className={`
                        text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0
                        ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#EFF4FF] text-[#035BE3]"
                        }
                      `}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions: Site link & Logout */}
          <div className="pt-3 border-t border-inherit space-y-1.5 overflow-hidden shrink-0">
            <Link
              to="/"
              target="_blank"
              title={!isHovered ? "Visit Public Site" : undefined}
              className={`
                w-full h-11 flex items-center rounded-full text-xs font-semibold transition-colors px-1.5
                ${
                  darkMode
                    ? "text-[#94A3B8] hover:bg-[#1E2638] hover:text-white"
                    : "text-[#556377] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                }
                ${isHovered || mobileOpen ? "gap-3 pr-3" : "justify-center"}
              `}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  darkMode ? "bg-[#1A2234]" : "bg-[#F4F6FB]"
                }`}
              >
                <ExternalLink className="w-4 h-4" />
              </div>
              <span
                className={`transition-all duration-200 whitespace-nowrap text-[12px] font-medium ${
                  isHovered || mobileOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-3 pointer-events-none lg:hidden"
                }`}
              >
                Public Site
              </span>
            </Link>

            <button
              onClick={handleLogout}
              title={!isHovered ? "Sign Out" : undefined}
              className={`
                w-full h-11 flex items-center rounded-full text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer px-1.5
                ${isHovered || mobileOpen ? "gap-3 pr-3" : "justify-center"}
              `}
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-red-500/10 text-red-500">
                <LogOut className="w-4 h-4" />
              </div>
              <span
                className={`transition-all duration-200 whitespace-nowrap text-[12px] font-medium ${
                  isHovered || mobileOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-3 pointer-events-none lg:hidden"
                }`}
              >
                Logout
              </span>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
