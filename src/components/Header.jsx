import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  HelpCircle,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import {
  getUserData,
  isUserAuthenticated,
  clearUserSession,
  isUserHasPurchasedPackage,
  openPackageRequiredModal,
  getPackagesApi,
  getPublicSettingsApi,
} from "../services/api";
import UserAvatarDropdown from "./UserAvatarDropdown";

const defaultPackageItems = [
  {
    id: "pro",
    name: "Pro",
    image: "/images/packages/pro.png",
    link: "/package/pro",
  },
  {
    id: "supreme",
    name: "Supreme",
    image: "/images/packages/supreme.png",
    link: "/package/supreme",
  },
  {
    id: "premium",
    name: "Premium",
    image: "/images/packages/premium.png",
    link: "/package/premium",
  },
  {
    id: "premium-plus",
    name: "Premium Plus",
    image: "/images/packages/premium-plus.png",
    link: "/package/premium-plus",
  },
];

export default function Header() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false);
  const [mobilePackagesOpen, setMobilePackagesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [packageItems, setPackageItems] = useState(defaultPackageItems);
  const [siteLogo, setSiteLogo] = useState("/images/logo/logo.png");
  const [siteName, setSiteName] = useState("The Skillpreneur");

  // Authentication State
  const [currentUser, setCurrentUser] = useState(getUserData());
  const [isLoggedIn, setIsLoggedIn] = useState(isUserAuthenticated());

  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Dynamically load packages & public branding from backend
  useEffect(() => {
    let isMounted = true;

    getPackagesApi()
      .then((res) => {
        if (!isMounted || !res?.success || !Array.isArray(res.packages) || res.packages.length === 0) return;
        const mapped = res.packages.map((pkg, idx) => ({
          id: pkg.slug || pkg.id,
          name: pkg.name,
          image: pkg.image_url || defaultPackageItems[idx % defaultPackageItems.length]?.image || "/images/packages/pro.png",
          link: `/package/${pkg.slug || pkg.id}`,
        }));
        setPackageItems(mapped);
      })
      .catch(() => {});

    getPublicSettingsApi()
      .then((res) => {
        if (!isMounted || !res?.settings) return;
        if (res.settings.site_logo) setSiteLogo(res.settings.site_logo);
        if (res.settings.site_name) setSiteName(res.settings.site_name);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize auth state on custom events & storage changes
  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getUserData());
      setIsLoggedIn(isUserAuthenticated());
    };

    window.addEventListener("skillpreneur_auth_change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("skillpreneur_auth_change", handleAuthChange);
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
            src={siteLogo}
            alt={siteName}
            onError={(e) => {
              e.currentTarget.src = "/images/logo/logo.png";
            }}
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

          {/* 2. Packages with Clean, Lightweight Dynamic Dropdown */}
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

            {/* Lightweight Dropdown Menu */}
            {packagesOpen && (
              <div className="absolute left-0 top-full mt-2 w-[230px] rounded-2xl border border-[#E7ECF3] bg-white p-1.5 shadow-lg shadow-slate-900/5 animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="flex flex-col gap-0.5">
                  {packageItems.map((pkg) => (
                    <Link
                      key={pkg.id}
                      to={pkg.link}
                      onClick={() => setPackagesOpen(false)}
                      className="group/item flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-[13.5px] font-medium text-[#334155] transition-colors hover:bg-[#F3F6FD] hover:text-[#035BE3]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={pkg.image}
                          alt={pkg.name}
                          onError={(e) => {
                            e.currentTarget.src = "/images/packages/pro.png";
                          }}
                          className="h-6 w-6 shrink-0 object-contain"
                        />
                        <span className="truncate">{pkg.name}</span>
                      </div>
                      <ChevronRight
                        size={14}
                        className="shrink-0 text-[#94A3B8] opacity-0 -translate-x-1 transition-all duration-150 group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/item:text-[#035BE3]"
                      />
                    </Link>
                  ))}
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

          {/* 4. Services */}
          <Link
            to="/services"
            className="
              rounded-full px-4 py-2
              text-[14px] font-medium text-[#4A5568]
              transition-colors
              hover:bg-[#F3F6FD]
              hover:text-[#161B29]
            "
          >
            Services
          </Link>

          {/* 5. Contact */}
          <Link
            to="/contact"
            className="
              rounded-full px-4 py-2
              text-[14px] font-medium text-[#4A5568]
              transition-colors
              hover:bg-[#F3F6FD]
              hover:text-[#161B29]
            "
          >
            Contact
          </Link>

          {/* 6. Help */}
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
                onClick={(e) => {
                  if (!isUserHasPurchasedPackage()) {
                    e.preventDefault();
                    openPackageRequiredModal();
                  }
                }}
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
                onClick={(e) => {
                  setMobileOpen(false);
                  if (!isUserHasPurchasedPackage()) {
                    e.preventDefault();
                    openPackageRequiredModal();
                  }
                }}
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

            <Link
              to="/services"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 text-[15px] font-medium text-[#4F596B] hover:text-[#035BE3]"
            >
              Services
            </Link>

            <div>
              <button
                type="button"
                onClick={() => setMobilePackagesOpen(!mobilePackagesOpen)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-[15px] font-medium text-[#4F596B] hover:text-[#035BE3] cursor-pointer"
              >
                <span>Packages</span>
                <ChevronDown
                  size={15}
                  className={`text-[#8C97A8] transition-transform duration-200 ${
                    mobilePackagesOpen ? "rotate-180 text-[#035BE3]" : ""
                  }`}
                />
              </button>
              {mobilePackagesOpen && (
                <div className="ml-3 mt-1 mb-2 flex flex-col gap-1 border-l border-[#E7ECF3] pl-3">
                  {packageItems.map((pkg) => (
                    <Link
                      key={pkg.id}
                      to={pkg.link}
                      onClick={() => {
                        setMobilePackagesOpen(false);
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-[#4F596B] hover:bg-[#F3F6FD] hover:text-[#035BE3]"
                    >
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        onError={(e) => {
                          e.currentTarget.src = "/images/packages/pro.png";
                        }}
                        className="h-5 w-5 shrink-0 object-contain"
                      />
                      <span>{pkg.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 text-[15px] font-medium text-[#4F596B] hover:text-[#035BE3]"
            >
              Contact Us
            </Link>

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