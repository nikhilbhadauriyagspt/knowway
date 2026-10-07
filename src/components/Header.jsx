import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  BrainCircuit,
  Palette,
  Code2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const exploreItems = [
    {
      title: "AI & Smart Tools",
      desc: "Prompt engineering, AI automation & workflows",
      icon: BrainCircuit,
      color: "bg-[#EFF4FF] text-[#356AE6]",
      badge: "Popular",
    },
    {
      title: "Design & Creative Skills",
      desc: "UI/UX, visual design & content creation",
      icon: Palette,
      color: "bg-[#F5F0FF] text-[#7555E8]",
      badge: "Trending",
    },
    {
      title: "Web & App Development",
      desc: "Frontend, React, Tailwind & code mastery",
      icon: Code2,
      color: "bg-[#EFF5FF] text-[#3970E8]",
      badge: "New",
    },
    {
      title: "Digital Business & Growth",
      desc: "Freelancing, client acquisition & marketing",
      icon: TrendingUp,
      color: "bg-[#FFF4EC] text-[#EE7D42]",
      badge: "Featured",
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
              ? "max-w-full rounded-none border-b border-[#E3E9F4] border-t-0 border-x-0 bg-[#FBFCFF]/95 px-6 shadow-[0_4px_24px_-6px_rgba(49,95,216,0.06)] sm:px-8 lg:px-12 xl:px-16"
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
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            to="/"
            className="
              rounded-full px-4 py-2.5
              text-[14px] font-semibold text-[#315FD8]
              transition-colors
              hover:bg-[#EEF3FF]
            "
          >
            Home
          </Link>

          {/* Explore Dropdown Trigger */}
          <div
            className="relative"
            onMouseEnter={() => setExploreOpen(true)}
            onMouseLeave={() => setExploreOpen(false)}
          >
            <button
              type="button"
              onClick={() => setExploreOpen(!exploreOpen)}
              className={`
                group flex items-center gap-1.5
                rounded-full px-4 py-2.5
                text-[14px] font-medium transition-colors cursor-pointer
                ${
                  exploreOpen
                    ? "bg-[#EEF3FF] text-[#315FD8] font-semibold"
                    : "text-[#555F72] hover:bg-[#F3F6FD] hover:text-[#171C29]"
                }
              `}
            >
              Explore
              <ChevronDown
                size={15}
                className={`transition-transform duration-200 ${
                  exploreOpen ? "rotate-180 text-[#315FD8]" : "text-[#7A8497]"
                }`}
              />
            </button>

            {/* Explore Dropdown Menu */}
            {exploreOpen && (
              <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2.5 z-50 w-[450px] animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="rounded-[22px] border border-[#E1E8F5] bg-white p-3.5 shadow-2xl shadow-blue-900/10">
                  <div className="flex items-center justify-between border-b border-[#F0F4FA] px-3 pb-2.5 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#929AA9]">
                      Learning Tracks
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#315FD8]">
                      <Sparkles size={12} />
                      Curated Modules
                    </span>
                  </div>

                  <div className="mt-1.5 grid grid-cols-1 gap-1">
                    {exploreItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.title}
                          to="/signup"
                          onClick={() => setExploreOpen(false)}
                          className="group/track flex items-start gap-3.5 rounded-[16px] p-2.5 transition-colors hover:bg-[#F4F7FD]"
                        >
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] ${item.color} mt-0.5 transition-transform group-hover/track:scale-105 shadow-2xs`}
                          >
                            <Icon size={18} strokeWidth={1.8} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-[13px] font-bold text-[#171C29] transition-colors group-hover/track:text-[#315FD8]">
                                {item.title}
                              </p>
                              <span className="rounded-full bg-[#EFF3F9] px-2 py-0.5 text-[10px] font-bold text-[#555F72]">
                                {item.badge}
                              </span>
                            </div>
                            <p className="mt-0.5 truncate text-[11px] text-[#788294]">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-2 border-t border-[#F0F4FA] pt-2">
                    <Link
                      to="/signup"
                      onClick={() => setExploreOpen(false)}
                      className="flex items-center justify-between rounded-[14px] bg-[#EEF3FF] px-3.5 py-2.5 text-[12px] font-bold text-[#315FD8] transition-colors hover:bg-[#E3EDFF]"
                    >
                      <span>Explore all learning guides & paths</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <a
            href="#categories"
            className="
              rounded-full px-4 py-2.5
              text-[14px] font-medium text-[#555F72]
              transition-colors
              hover:bg-[#F3F6FD]
              hover:text-[#171C29]
            "
          >
            Categories
          </a>

          <a
            href="#packages"
            className="
              rounded-full px-4 py-2.5
              text-[14px] font-medium text-[#555F72]
              transition-colors
              hover:bg-[#F3F6FD]
              hover:text-[#171C29]
            "
          >
            Bundles
          </a>

          <a
            href="#about"
            className="
              rounded-full px-4 py-2.5
              text-[14px] font-medium text-[#555F72]
              transition-colors
              hover:bg-[#F3F6FD]
              hover:text-[#171C29]
            "
          >
            About
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
              transition hover:text-[#171C29] cursor-pointer
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
            Start Learning

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

        {/* ================= MOBILE BUTTON ================= */}
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
            rounded-[20px]
            border border-[#E2E7F0]
            bg-white
            p-4 shadow-xl
            lg:hidden
            ${scrolled ? "mx-4" : ""}
          `}
        >
          <div className="flex flex-col">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="
                flex items-center justify-between
                border-b border-[#EEF1F5]
                px-3 py-3.5
                text-[14px] font-semibold text-[#315FD8]
              "
            >
              Home
              <Sparkles size={15} />
            </Link>

            <div className="border-b border-[#EEF1F5] py-2">
              <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#929AA9]">
                Explore Tracks
              </p>
              <div className="space-y-1 pl-2">
                {exploreItems.map((item) => (
                  <Link
                    key={item.title}
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-[13px] font-medium text-[#4F596B] hover:text-[#315FD8]"
                  >
                    <span>{item.title}</span>
                    <span className="rounded bg-[#F3F6FA] px-1.5 py-0.5 text-[10px] font-bold text-[#555F72]">
                      {item.badge}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <a
              href="#packages"
              onClick={() => setMobileOpen(false)}
              className="
                border-b border-[#EEF1F5]
                px-3 py-3.5
                text-[14px] font-medium text-[#4F596B]
              "
            >
              Skill Bundles
            </a>

            <a
              href="#about"
              onClick={() => setMobileOpen(false)}
              className="
                px-3 py-3.5
                text-[14px] font-medium text-[#4F596B]
              "
            >
              About
            </a>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
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