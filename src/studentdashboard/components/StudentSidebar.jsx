import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Tag,
  Settings,
  LogOut,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { clearUserSession } from "../../services/api";

export default function StudentSidebar({
  activeTab,
  setActiveTab,
  user,
  coursesCount = 0,
  mobileOpen,
  setMobileOpen,
  darkMode,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUserSession();
    navigate("/", { replace: true });
  };

  const studentMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: "Live" },
    { id: "courses", label: "My Enrolled Courses", icon: BookOpen, badge: coursesCount ? `${coursesCount}` : null },
    { id: "certificates", label: "Certificates & Badges", icon: Award, badge: "Verified" },
    { id: "referrals", label: "Referral & Rewards", icon: Tag, badge: "Bonus" },
    { id: "profile", label: "Account & Profile", icon: Settings, badge: null },
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

      {/* Sidebar Capsule Container */}
      <div
        className={`
          fixed top-4 bottom-4 left-4 z-50 flex flex-col gap-3 transition-all duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0 w-[268px]" : "-translate-x-[150%] lg:translate-x-0 lg:w-[268px]"}
        `}
      >
        {/* Top Logo Pill Capsule */}
        <div
          className={`
            h-14 w-full rounded-full border px-5 flex items-center justify-between shrink-0 transition-colors
            ${darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"}
          `}
        >
          <Link to="/" className="flex items-center gap-2.5 group" title="Back to Homepage">
            <img
              src="/images/logo/logo.png"
              alt="KnowWay Logo"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          <span
            className={`
              px-3 py-1 rounded-full font-semibold text-[11px] tracking-wide transition-colors
              ${
                darkMode
                  ? "bg-[#1A2234] text-[#94A3B8] border border-[#2B374E]"
                  : "bg-[#F4F6FB] text-[#475569] border border-[#E2E8F0]"
              }
            `}
          >
            Learner
          </span>
        </div>

        {/* Sidebar Navigation Body */}
        <aside
          className={`
            flex-1 rounded-[32px] border p-2.5 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 overflow-hidden
            ${
              darkMode
                ? "bg-[#131926] border-[#222B3D] text-[#E2E8F0]"
                : "bg-white border-[#E2E8F0] text-[#161B29]"
            }
          `}
        >
          {/* Main Navigation Menu */}
          <div className="space-y-1.5 mt-1">
            <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-[#8A99AD]">
              Main Menu
            </div>

            {studentMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`
                    w-full h-12 flex items-center justify-between rounded-full text-xs font-semibold transition-all cursor-pointer group px-1.5 pr-3.5
                    ${
                      isActive
                        ? "bg-[#035BE3] text-white shadow-xs"
                        : darkMode
                        ? "text-[#94A3B8] hover:bg-[#1E2638] hover:text-white"
                        : "text-[#556377] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 min-w-max">
                    <div
                      className={`
                        w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors
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

                    <span className="font-semibold text-xs whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                        isActive
                          ? "bg-white/20 text-white"
                          : darkMode
                          ? "bg-[#1E293B] text-[#94A3B8]"
                          : "bg-gray-100 text-[#64748B] group-hover:bg-[#035BE3]/10 group-hover:text-[#035BE3]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar Action Items */}
          <div className="pt-3 border-t border-inherit space-y-1.5">
            <Link
              to="/courses"
              className={`
                w-full h-11 flex items-center justify-between rounded-full text-xs font-semibold transition-colors px-1.5 pr-3.5 no-underline group
                ${darkMode ? "text-[#94A3B8] hover:bg-[#1E2638] hover:text-white" : "text-[#556377] hover:bg-[#F1F5F9] hover:text-[#0F172A]"}
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors
                    ${
                      darkMode
                        ? "bg-[#1A2234] text-[#94A3B8] group-hover:bg-amber-500/20 group-hover:text-amber-400"
                        : "bg-[#F4F6FB] text-[#64748B] group-hover:bg-amber-100 group-hover:text-[#FA8C03]"
                    }
                  `}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
                <span>Explore Catalog</span>
              </div>
              <ArrowUpRight size={13} className="text-[#94A3B8]" />
            </Link>

            <button
              onClick={handleLogout}
              className={`
                w-full h-11 flex items-center gap-3 rounded-full text-xs font-semibold transition-colors cursor-pointer px-1.5 group
                ${
                  darkMode
                    ? "text-[#94A3B8] hover:text-red-400 hover:bg-red-950/30"
                    : "text-[#556377] hover:text-red-600 hover:bg-red-50/60"
                }
              `}
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors
                  ${
                    darkMode
                      ? "bg-[#1A2234] text-[#94A3B8] group-hover:bg-red-900/30 group-hover:text-red-400"
                      : "bg-[#F4F6FB] text-[#64748B] group-hover:bg-red-100 group-hover:text-red-600"
                  }
                `}
              >
                <LogOut className="w-3.5 h-3.5" />
              </div>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
