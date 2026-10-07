import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false);
  const [mobilePackagesOpen, setMobilePackagesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      link: "/#packages",
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
      link: "/#packages",
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
      link: "/#packages",
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
      link: "/#packages",
    },
  ];

  return (
    <header
      className={`
        fixed left-0 top-0 z-50 w-full
        transition-all duration-300 ease-in-out
        ${scrolled ? "px-0 pt-0" : "px-4 pt-5 sm:px-6 lg:px-8"}
      `}
    >
      <div
        className={`
          mx-auto flex h-[74px] items-center justify-between
          backdrop-blur-xl transition-all duration-300 ease-in-out
          ${
            scrolled
              ? "max-w-full rounded-none border-b border-[#E3E9F4] border-t-0 border-x-0 bg-[#FBFCFF]/95 px-6 shadow-[0_4px_24px_-6px_rgba(3,91,227,0.08)] sm:px-8 lg:px-12 xl:px-16"
              : "max-w-[1420px] rounded-[22px] border border-[#E2E7F0] bg-white/90 px-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] sm:px-6 lg:px-7"
          }
        `}
      >
        {/* ================= LOGO ================= */}
        <Link to="/" className="flex items-center group shrink-0">
          <img
            src="/images/logo/logo.png"
            alt="Logo"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden items-center gap-1.5 lg:flex">
          {/* 1. Home */}
          <Link
            to="/"
            className="
              rounded-full px-4 py-2.5
              text-[14px] font-semibold text-[#035BE3]
              transition-colors
              hover:bg-[#EEF4FF]
            "
          >
            Home
          </Link>

          {/* 2. Packages (Heavy Rich Mega Dropdown) */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setPackagesOpen(true)}
            onMouseLeave={() => setPackagesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setPackagesOpen(!packagesOpen)}
              className={`
                group flex items-center gap-1.5
                rounded-full px-4 py-2.5
                text-[14px] font-medium transition-colors cursor-pointer
                ${
                  packagesOpen
                    ? "bg-[#EEF4FF] text-[#035BE3] font-semibold"
                    : "text-[#4A5568] hover:bg-[#F3F6FD] hover:text-[#161B29]"
                }
              `}
            >
              <span>Packages</span>
              <ChevronDown
                size={15}
                className={`transition-transform duration-200 ${
                  packagesOpen ? "rotate-180 text-[#035BE3]" : "text-[#7A8497]"
                }`}
              />
            </button>

            {/* Heavy Rich Mega Dropdown Box */}
            {packagesOpen && (
              <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3 z-50 w-[780px] max-w-[92vw] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="rounded-[26px] border border-[#DCE4F2] bg-white p-5 shadow-[0_24px_60px_-12px_rgba(3,91,227,0.18)]">
                  
                  {/* Dropdown Top Bar */}
                  <div className="flex items-center justify-between border-b border-[#F0F4FA] px-2 pb-3.5 pt-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EFF4FF] text-[#035BE3]">
                        <Layers3 size={15} />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                          Explore Career Packages
                        </span>
                        <p className="text-[12px] text-[#94A3B8]">
                          Structured skill paths with practical certifications
                        </p>
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
                        {/* Package 3D Image Box */}
                        <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[16px] bg-white border border-[#E8EEF8] p-1.5 shadow-2xs group-hover/card:scale-105 transition-transform duration-300">
                          <img
                            src={pkg.image}
                            alt={pkg.name}
                            className="h-full w-full object-contain drop-shadow-sm"
                          />
                        </div>

                        {/* Package Info */}
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

                          {/* Mini Features Pills */}
                          <div className="mt-2 flex flex-wrap gap-1">
                            {pkg.features.map((feature) => (
                              <span
                                key={feature}
                                className="rounded-[6px] bg-[#F1F5F9] px-1.5 py-0.5 text-[9.5px] font-semibold text-[#475569]"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Hover Arrow */}
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
          <a
            href="/#packages"
            className="
              rounded-full px-4 py-2.5
              text-[14px] font-medium text-[#4A5568]
              transition-colors
              hover:bg-[#F3F6FD]
              hover:text-[#161B29]
            "
          >
            Courses
          </a>

          {/* 4. Help */}
          <a
            href="/#faq"
            className="
              rounded-full px-4 py-2.5
              text-[14px] font-medium text-[#4A5568]
              transition-colors
              hover:bg-[#F3F6FD]
              hover:text-[#161B29]
            "
          >
            Help
          </a>
        </nav>

        {/* ================= RIGHT ACTIONS ================= */}
        <div className="hidden items-center gap-3 lg:flex">
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
          className={`
            mx-auto mt-2 max-w-[1420px]
            rounded-[24px]
            border border-[#E2E7F0]
            bg-white
            p-4 shadow-xl
            lg:hidden
            ${scrolled ? "mx-4" : ""}
          `}
        >
          <div className="flex flex-col">
            {/* 1. Home */}
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="
                flex items-center justify-between
                border-b border-[#EEF1F5]
                px-3 py-3
                text-[15px] font-bold text-[#035BE3]
              "
            >
              <span>Home</span>
              <BookOpen size={16} />
            </Link>

            {/* 2. Packages (Mobile Accordion) */}
            <div className="border-b border-[#EEF1F5] py-2">
              <button
                type="button"
                onClick={() => setMobilePackagesOpen(!mobilePackagesOpen)}
                className="flex w-full items-center justify-between px-3 py-2 text-[15px] font-bold text-[#161B29] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>Packages</span>
                  <span className="rounded-full bg-[#EFF4FF] px-2 py-0.5 text-[10px] font-bold text-[#035BE3]">
                    4 Bundles
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    mobilePackagesOpen ? "rotate-180 text-[#035BE3]" : "text-[#7A8497]"
                  }`}
                />
              </button>

              {mobilePackagesOpen && (
                <div className="space-y-2 pt-2 px-1">
                  {packageItems.map((pkg) => (
                    <a
                      key={pkg.id}
                      href={pkg.link}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-[16px] border border-[#EEF2F8] bg-[#F8FAFD] p-2.5 hover:bg-white transition-colors"
                    >
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="h-11 w-11 object-contain shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-[13px] font-bold text-[#161B29]">{pkg.name}</p>
                          <span className={`text-[9px] font-bold uppercase rounded px-1.5 py-0.2 ${pkg.bgBadge}`}>
                            {pkg.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] truncate">{pkg.subtitle}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Courses */}
            <a
              href="/#packages"
              onClick={() => setMobileOpen(false)}
              className="
                border-b border-[#EEF1F5]
                px-3 py-3
                text-[15px] font-medium text-[#4F596B] hover:text-[#035BE3]
              "
            >
              Courses
            </a>

            {/* 4. Help */}
            <a
              href="/#faq"
              onClick={() => setMobileOpen(false)}
              className="
                flex items-center justify-between
                px-3 py-3
                text-[15px] font-medium text-[#4F596B] hover:text-[#035BE3]
              "
            >
              <span>Help</span>
              <HelpCircle size={16} className="text-[#8C97A8]" />
            </a>
          </div>

          {/* Bottom Auth Buttons */}
          <div className="mt-4 grid grid-cols-2 gap-2 pt-2 border-t border-[#EEF1F5]">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="
                flex h-[46px] items-center justify-center
                rounded-full
                border border-[#DDE3EC]
                text-[13px] font-semibold text-[#2C3547] cursor-pointer
              "
            >
              Log in
            </Link>

            <Link
              to="/signup"
              onClick={() => setMobileOpen(false)}
              className="
                flex h-[46px] items-center justify-center gap-2
                rounded-full
                bg-[#035BE3] hover:bg-[#FA8C03]
                text-[13px] font-semibold text-white transition-colors cursor-pointer
              "
            >
              Start Learning
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}