import React, { useState, useRef, useEffect, useMemo } from "react";
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
  BookOpen,
  ArrowRight,
  Layers3,
  CheckCircle2,
} from "lucide-react";
import { clearUserSession } from "../../services/api";
import UserAvatarDropdown from "../../components/UserAvatarDropdown";

export default function StudentHeader({
  activeTab,
  setActiveTab,
  user,
  courses = [],
  allCourses = [],
  myPackages = [],
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
  const [isFocused, setIsFocused] = useState(false);
  const searchBoxRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearUserSession();
    navigate("/", { replace: true });
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "S";

  // Dropdown search suggestions (Courses + Packages + Quick Tabs)
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const list = [];

    // Search Enrolled & Catalog Courses
    const pool = (allCourses && allCourses.length > 0) ? allCourses : courses;
    pool.forEach((c) => {
      const titleMatch = c.title?.toLowerCase().includes(q);
      const mentorMatch = (c.mentor_name || c.mentor)?.toLowerCase().includes(q);
      const catMatch = c.category?.toLowerCase().includes(q);
      if (titleMatch || mentorMatch || catMatch) {
        list.push({
          type: "course",
          id: c.id,
          slug: c.slug || c.id,
          title: c.title,
          subtitle: c.mentor_name || c.mentor || c.category || "Masterclass",
          category: c.category || "Course",
          image: c.thumbnail_url || c.thumbnail,
          url: `/courses/${c.slug || c.id}`,
        });
      }
    });

    // Search Packages
    (myPackages || []).forEach((pkg) => {
      if (pkg.name?.toLowerCase().includes(q) || pkg.slug?.toLowerCase().includes(q)) {
        list.push({
          type: "package",
          id: pkg.id || pkg.slug,
          slug: pkg.slug,
          title: pkg.name,
          subtitle: "Active Skill Package",
          category: "Package",
          image: pkg.image_url,
          action: () => {
            setActiveTab && setActiveTab("packages");
            setIsFocused(false);
          },
        });
      }
    });

    return list.slice(0, 6);
  }, [searchQuery, allCourses, courses, myPackages, setActiveTab]);

  return (
    <header
      className={`
        sticky top-0 z-40 w-full max-w-full py-2.5 sm:py-3.5 px-3 sm:px-8 lg:px-10 flex items-center justify-between gap-2 sm:gap-4 transition-colors duration-200 backdrop-blur-md border-b
        ${
          darkMode
            ? "bg-[#0B0F17]/85 border-[#222B3D]/80"
            : "bg-[#FBFCFF]/85 border-[#E2E8F0]/80"
        }
      `}
    >
      {/* Mobile Hamburger */}
      <div className="flex items-center gap-2 lg:hidden shrink-0">
        <button
          onClick={() => setMobileOpen(true)}
          className={`flex h-10 w-10 sm:h-12 sm:w-12 rounded-full border items-center justify-center transition cursor-pointer shrink-0 ${
            darkMode ? "bg-[#131926] border-[#222B3D] text-[#E2E8F0]" : "bg-white border-[#E2E8F0] text-[#0F172A]"
          }`}
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Center Search Pill with Interactive Dropdown */}
      <div className="flex-1 min-w-0 max-w-xl relative" ref={searchBoxRef}>
        <div
          className={`h-10 sm:h-12 rounded-full border flex items-center px-3 sm:px-5 transition-all focus-within:border-[#035BE3] ${
            darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
          }`}
        >
          <Search className="w-4 h-4 text-[#8A99AD] shrink-0 mr-2 sm:mr-3" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsFocused(true);
            }}
            placeholder="Find courses, instructors, or digital skills..."
            className={`w-full min-w-0 bg-transparent text-xs font-medium outline-none placeholder-[#8A99AD] ${
              darkMode ? "text-white" : "text-[#0F172A]"
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setIsFocused(false);
              }}
              className="text-[#8A99AD] hover:text-[#035BE3] transition ml-2 p-1 text-xs font-bold shrink-0 cursor-pointer"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {isFocused && searchQuery.trim() && (
          <div
            className={`fixed sm:absolute left-3 right-3 sm:left-0 sm:right-0 top-15 sm:top-14 rounded-2xl border shadow-xl overflow-hidden z-50 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 ${
              darkMode
                ? "bg-[#131926]/95 border-[#222B3D] text-[#E2E8F0]"
                : "bg-white/95 border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            <div className="p-2.5 max-h-80 overflow-y-auto divide-y divide-inherit">
              {searchSuggestions.length === 0 ? (
                <div className="py-6 px-4 text-center">
                  <BookOpen className="w-6 h-6 mx-auto text-[#8A99AD] mb-1.5 opacity-60" />
                  <p className="text-xs font-semibold">No direct matches for "{searchQuery}"</p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab && setActiveTab("all_courses");
                      setIsFocused(false);
                    }}
                    className="mt-2 text-[11px] text-[#035BE3] font-bold hover:underline cursor-pointer"
                  >
                    Search across all catalog courses &rarr;
                  </button>
                </div>
              ) : (
                <>
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-[#8A99AD] flex items-center justify-between">
                    <span>Quick Results ({searchSuggestions.length})</span>
                    <span>Click to open</span>
                  </div>
                  <div className="pt-1 space-y-1">
                    {searchSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (item.url) {
                            navigate(item.url);
                          } else if (item.action) {
                            item.action();
                          }
                          setIsFocused(false);
                        }}
                        className={`p-2.5 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                          darkMode ? "hover:bg-[#1E2638]" : "hover:bg-blue-50/70"
                        }`}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-black/5 dark:border-white/5"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center shrink-0">
                            {item.type === "package" ? <Layers3 size={18} /> : <BookOpen size={18} />}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate leading-snug">{item.title}</p>
                          <p className={`text-[10.5px] truncate mt-0.5 ${darkMode ? "text-[#8A99AD]" : "text-[#64748B]"}`}>
                            {item.subtitle}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                          item.type === "package"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-[#035BE3]/10 text-[#035BE3] border-[#035BE3]/20"
                        }`}>
                          {item.category}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer Shortcut */}
                  <div className="pt-2 px-2 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab && setActiveTab("all_courses");
                        setIsFocused(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#035BE3]/10 hover:bg-[#035BE3] text-[#035BE3] hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Show all matching courses in directory</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Affiliate Hub Quick Button */}
        <Link
          to="/affiliate/dashboard"
          className={`h-10 sm:h-12 px-2.5 sm:px-4 rounded-full border flex items-center gap-1.5 sm:gap-2 text-xs font-bold transition cursor-pointer shadow-xs shrink-0 ${
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
          className={`h-10 w-10 sm:h-12 sm:w-24 rounded-full border p-1 sm:p-1.5 flex items-center justify-center sm:justify-between relative transition-all cursor-pointer select-none shrink-0 ${
            darkMode
              ? "bg-[#131926] border-[#222B3D]"
              : "bg-white border-[#E2E8F0]"
          }`}
          aria-label="Toggle dark and light theme"
        >
          {/* Animated Slider Pill with centered icon */}
          <div
            className={`sm:absolute sm:top-1 sm:bottom-1 w-8 h-8 sm:w-9 sm:h-auto rounded-full transition-transform duration-300 ease-out flex items-center justify-center shadow-xs ${
              darkMode
                ? "translate-x-0 sm:translate-x-12 bg-[#1E2638] border border-[#2B374E] text-[#FBBF24]"
                : "translate-x-0 bg-[#035BE3] text-white shadow-md shadow-[#035BE3]/20"
            }`}
          >
            {darkMode ? <Moon className="w-4 h-4 shrink-0" /> : <Sun className="w-4 h-4 shrink-0" />}
          </div>

          {/* Underlay Sun Placeholder (Centered) */}
          <div className={`hidden sm:flex w-9 h-9 rounded-full items-center justify-center z-10 transition-colors ${!darkMode ? "opacity-0" : "text-[#64748B]"}`}>
            <Sun className="w-4 h-4 shrink-0" />
          </div>

          {/* Underlay Moon Placeholder (Centered) */}
          <div className={`hidden sm:flex w-9 h-9 rounded-full items-center justify-center z-10 transition-colors ${darkMode ? "opacity-0" : "text-[#94A3B8]"}`}>
            <Moon className="w-4 h-4 shrink-0" />
          </div>
        </button>

        {/* Sync / Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`hidden sm:flex h-10 w-10 sm:h-12 sm:w-12 rounded-full border items-center justify-center transition cursor-pointer shrink-0 ${
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
