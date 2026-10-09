import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Layers3,
  ArrowRight,
  HelpCircle,
  BookOpen,
  LayoutDashboard,
  User,
  LogOut,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import {
  getUserData,
  isUserAuthenticated,
  clearUserSession,
} from "../services/api";
import UserAvatarDropdown from "./UserAvatarDropdown";

export default function Header() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false);
  const [mobilePackagesOpen, setMobilePackagesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(getUserData());
  const [isLoggedIn, setIsLoggedIn] = useState(isUserAuthenticated());

  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Synchronize auth state on custom events & storage changes
  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getUserData());
      setIsLoggedIn(isUserAuthenticated());
    };

    window.addEventListener("knowway_auth_change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("knowway_auth_change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPackagesOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearUserSession();
    setUserDropdownOpen(false);
    setMobileOpen(false);
    navigate("/", { replace: true });
  };

  const packageItems = [
    {
      id: "pro",
      name: "Pro Package",
      subtitle: "Foundations & In-Demand Digital Skills",
      desc: "Practical skills in AI, video editing, and modern digital tools to kickstart your career.",
      image: "/images/packages/pro.png",
      badge: "Popular Starter",
      accent: "#035BE3",
      bgBadge: "bg-[#EFF4FF] text-[#035BE3]",
      features: ["AI Tools", "Video Editing", "Certificate"],
      link: "/package/pro",
    },
    {
      id: "supreme",
      name: "Supreme Package",
      subtitle: "Growth Marketing & Business Strategy",
      desc: "Master high-converting digital marketing, client scaling, and business workflows.",
      image: "/images/packages/supreme.png",
      badge: "Best Value",
      accent: "#FA8C03",
      bgBadge: "bg-[#FFF4E6] text-[#E07B00]",
      features: ["Meta Ads", "Sales Funnels", "Growth Playbook"],
      link: "/package/supreme",
    },
    {
      id: "premium",
      name: "Premium Package",
      subtitle: "Digital Commerce & Tech Mastery",
      desc: "End-to-end frontend development, digital product selling, and practical monetization.",
      image: "/images/packages/premium.png",
      badge: "Trending Track",
      accent: "#2563EB",
      bgBadge: "bg-[#EFF6FF] text-[#1D4ED8]",
      features: ["Web Tech", "Ecommerce", "Real Projects"],
      link: "/package/premium",
    },
    {
      id: "premium-plus",
      name: "Premium Plus",
      subtitle: "All-in-One Flagship Career Suite",
      desc: "Complete access to all modules, creator branding, and live mentorship guidance.",
      image: "/images/packages/premium-plus.png",
      badge: "All-in-One Suite",
      accent: "#7C3AED",
      bgBadge: "bg-[#F5F3FF] text-[#6D28D9]",
      features: ["Full Library", "Mentorship", "Lifetime Access"],
      link: "/package/premium-plus",
    },
  ];

  const userInitial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U";

  return (
    <header
      className={`
        sticky top-0 z-50 w-full transition-all duration-300
        ${
          scrolled
            ? "bg-white/90 py-3 shadow-md backdrop-blur-md"
            : "bg-white/80 py-4 backdrop-blur-sm"
        }
      `}
    >
      <div className="mx-auto flex max-w-[1420px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* ================= LOGO ================= */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/images/logo/logo.png"
            alt="KnowWay LearnSpace"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* ================= DESKTOP NAVIGATION ================= */}
        <nav className="hidden items-center gap-1 rounded-full border border-[#E7ECF3] bg-white/90 px-3 py-1.5 shadow-2xs lg:flex">
          
          {/* 1. Home */}
          <Link
            to="/"
            className="
              rounded-full px-4 py-2
              text-[14px] font-medium text-[#4A5568]
              transition-colors
              hover:bg-[#F3F6FD]
              hover:text-[#161B29]
            "
          >
            Home
          </Link>

          {/* 2. Packages with Rich Mega-Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setPackagesOpen(!packagesOpen)}
              className={`
                group flex items-center gap-1.5
                rounded-full px-4 py-2
                text-[14px] font-medium transition-colors cursor-pointer
                ${
                  packagesOpen
                    ? "bg-[#F3F6FD] text-[#035BE3]"
                    : "text-[#4A5568] hover:bg-[#F3F6FD] hover:text-[#161B29]"
                }
              `}
            >
              <span>Packages</span>
              <ChevronDown
                size={14}
                className={`
                  transition-transform duration-200 text-[#8C97A8]
                  group-hover:text-[#035BE3]
                  ${packagesOpen ? "rotate-180 text-[#035BE3]" : ""}
                `}
              />
            </button>

            {/* Mega Dropdown Menu */}
            {packagesOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[660px] rounded-[28px] border border-[#E4EBF5] bg-white p-5 shadow-2xl shadow-blue-900/10 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="flex flex-col">
                  
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0F4FA] px-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEF4FF] text-[#035BE3]">
                        <Layers3 size={15} />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-bold text-[#161B29]">Career Skill Bundles</h3>
                        <p className="text-[11px] text-[#64748B]">Structured multi-course learning tracks</p>
                      </div>
                    </div>

                    <a
                      href="/#packages"
                      onClick={() => setPackagesOpen(false)}
                      className="inline-flex items-center gap-1 text-[12px] font-bold text-[#035BE3] hover:text-[#FA8C03] transition-colors"
                    >
                      <span>View All Packages</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>

                  {/* 2x2 Rich Package Cards Grid */}
                  <div className="mt-3.5 grid grid-cols-2 gap-3">
                    {packageItems.map((pkg) => (
                      <a
                        key={pkg.id}
                        href={pkg.link}
                        onClick={() => setPackagesOpen(false)}
                        className="group/card relative flex items-center gap-3.5 rounded-[20px] border border-[#E9EFF8] bg-[#FBFCFF] p-3.5 transition-all duration-200 hover:border-[#035BE3]/50 hover:bg-white hover:shadow-md hover:shadow-blue-900/5 cursor-pointer"
                      >
                        <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[16px] bg-white border border-[#E8EEF8] p-1.5 shadow-2xs group-hover/card:scale-105 transition-transform duration-300">
                          <img
                            src={pkg.image}
                            alt={pkg.name}
                            className="h-full w-full object-contain drop-shadow-sm"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-[14px] font-bold text-[#161B29] group-hover/card:text-[#035BE3] transition-colors truncate">
                              {pkg.name}
                            </h4>
                            <span className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider shrink-0 ${pkg.bgBadge}`}>
                              {pkg.badge}
                            </span>
                          </div>

                          <p className="mt-1 text-[11.5px] leading-snug text-[#64748B] line-clamp-2">
                            {pkg.desc}
                          </p>
                        </div>

                        <div className="absolute right-3 top-3 opacity-0 group-hover/card:opacity-100 group-hover/card:translate-x-0.5 transition-all duration-200 text-[#035BE3]">
                          <ArrowRight size={14} />
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* Dropdown Bottom Banner */}
                  <div className="mt-3.5 flex items-center justify-between rounded-[18px] border border-[#E8EEF8] bg-[#F8FAFD] px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-[#FA8C03]" />
                      <span className="text-[12px] font-semibold text-[#334155]">
                        All packages include practical real-world tasks & verified certificate
                      </span>
                    </div>

                    <a
                      href="/#packages"
                      onClick={() => setPackagesOpen(false)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#035BE3] px-3.5 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-[#FA8C03] shadow-xs"
                    >
                      <span>Compare Bundles</span>
                      <ArrowUpRight size={13} />
                    </a>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* 3. Courses */}
          <Link
            to="/courses"
            className="
              rounded-full px-4 py-2
              text-[14px] font-medium text-[#4A5568]
              transition-colors
              hover:bg-[#F3F6FD]
              hover:text-[#161B29]
            "
          >
            Courses
          </Link>

          {/* 4. Help */}
          <a
            href="/#faq"
            className="
              rounded-full px-4 py-2
              text-[14px] font-medium text-[#4A5568]
              transition-colors
              hover:bg-[#F3F6FD]
              hover:text-[#161B29]
            "
          >
            Help
          </a>
        </nav>

        {/* ================= RIGHT ACTIONS (DYNAMIC AUTH STATE) ================= */}
        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn && currentUser ? (
            <div className="flex items-center gap-3">
              
              {/* Sleek Dashboard Button */}
              <Link
                to="/dashboard"
                className="
                  group flex h-[42px] items-center gap-2
                  rounded-full
                  bg-[#035BE3]
                  px-4
                  text-[13px] font-semibold text-white
                  transition-colors duration-200
                  hover:bg-[#FA8C03]
                  shadow-sm shadow-[#035BE3]/20 cursor-pointer no-underline
                "
              >
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </Link>

              {/* User Avatar + Dropdown */}
              <UserAvatarDropdown
                user={currentUser}
                darkMode={false}
                align="right"
                showDashboardLink={true}
              />
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="
                  px-4 py-2
                  text-[14px] font-semibold
                  text-[#4C5668]
                  transition hover:text-[#035BE3] cursor-pointer
                "
              >
                Log in
              </Link>

              <Link
                to="/signup"
                className="
                  group flex h-[46px] items-center gap-2
                  rounded-full
                  bg-[#035BE3]
                  px-5
                  text-[13px] font-semibold text-white
                  transition-colors duration-200
                  hover:bg-[#FA8C03]
                  shadow-sm shadow-[#035BE3]/20 cursor-pointer
                "
              >
                <span>Start Learning</span>
                <ArrowUpRight
                  size={16}
                  className="
                    transition-transform duration-200
                    group-hover:-translate-y-[1px]
                    group-hover:translate-x-[2px]
                  "
                />
              </Link>
            </>
          )}
        </div>

        {/* ================= MOBILE TOGGLE BUTTON ================= */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-[12px]
            border border-[#E0E5EF]
            bg-[#F8FAFD]
            text-[#262D3C]
            lg:hidden cursor-pointer
          "
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <div
          className="
            mx-auto mt-2 max-w-[1420px]
            rounded-[24px]
            border border-[#E7ECF3]
            bg-white
            p-5
            shadow-xl
            lg:hidden
            animate-in fade-in duration-200
          "
        >
          {/* User profile banner if logged in */}
          {isLoggedIn && currentUser && (
            <div className="mb-4 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#035BE3] text-white font-bold text-xs flex items-center justify-center">
                  {userInitial}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#161B29]">{currentUser.name}</p>
                  <p className="text-[11px] text-[#64748B]">{currentUser.email}</p>
                </div>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-1.5 rounded-full bg-[#035BE3] text-white text-[11px] font-bold no-underline"
              >
                Dashboard
              </Link>
            </div>
          )}

          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 text-[15px] font-medium text-[#4F596B] hover:text-[#035BE3]"
            >
              Home
            </Link>

            <Link
              to="/courses"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 text-[15px] font-medium text-[#4F596B] hover:text-[#035BE3]"
            >
              Courses
            </Link>

            <a
              href="/#packages"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 text-[15px] font-medium text-[#4F596B] hover:text-[#035BE3]"
            >
              Packages
            </a>

            <a
              href="/#faq"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 text-[15px] font-medium text-[#4F596B] hover:text-[#035BE3]"
            >
              <span>Help & FAQ</span>
              <HelpCircle size={16} className="text-[#8C97A8]" />
            </a>
          </div>

          {/* Bottom Actions */}
          <div className="mt-4 pt-3 border-t border-[#EEF1F5]">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full flex h-[44px] items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 text-red-600 font-bold text-xs"
              >
                <LogOut size={15} />
                <span>Sign Out Account</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-[44px] items-center justify-center rounded-full border border-[#DDE3EC] text-[13px] font-semibold text-[#2C3547]"
                >
                  Log in
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-[44px] items-center justify-center gap-2 rounded-full bg-[#035BE3] text-[13px] font-semibold text-white"
                >
                  Start Learning
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}