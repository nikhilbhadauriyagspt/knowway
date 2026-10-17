import React, { useState, useRef, useEffect } from "react";
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
  Bell,
  CheckCheck,
  CreditCard,
  UserPlus,
  Wallet,
  BookOpen,
  Layers3,
  Key,
  ShieldCheck,
  Trash2,
  Sparkles,
  Sliders,
  CheckCircle2,
  Clock,
  Mail,
} from "lucide-react";
import { clearAdminSession } from "../../services/api";

export default function AdminHeader({
  activeTab,
  setActiveTab,
  adminUser,
  setMobileOpen,
  onRefresh,
  isRefreshing,
  searchQuery,
  setSearchQuery,
  darkMode,
  setDarkMode,
  coursesList = [],
  packagesList = [],
  usersList = [],
  mentorsList = [],
  paymentsList = [],
  subAdminsList = [],
  notificationsList = [],
  unreadNotificationsCount = 0,
  onMarkAllNotificationsRead,
  onMarkNotificationRead,
  onClearNotifications,
}) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchBoxRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      case "servicesstudio":
        return "Services Studio & Client Enquiries";
      case "users":
        return "Student Directory";
      case "payments":
        return "Payments & Financial Orders";
      case "affiliates":
        return "Affiliate & Commission Hub";
      case "commissions":
        return "2-Tier Commission Matrix";
      case "videosecurity":
        return "Video Security & DRM Protection";
      case "subadmins":
        return "Sub-Admin & Staff Roles (RBAC)";
      case "history":
        return "Activity Logs & Audit History";
      case "settings":
        return "Cloudinary & System Settings";
      default:
        return "Control Center";
    }
  };

  // Helper function for notification icons
  const getNotificationIcon = (type) => {
    switch (type) {
      case "payment_received":
      case "course_purchased":
      case "package_purchased":
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case "commission_earned":
        return <Wallet className="w-4 h-4 text-emerald-500" />;
      case "referral_signup":
      case "user_signup":
        return <UserPlus className="w-4 h-4 text-[#035BE3]" />;
      case "inquiry_received":
        return <Mail className="w-4 h-4 text-purple-500" />;
      case "payout_requested":
      case "payout_approved":
        return <Wallet className="w-4 h-4 text-amber-500" />;
      case "subadmin_created":
        return <Key className="w-4 h-4 text-purple-500" />;
      case "course_created":
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case "package_created":
        return <Layers3 className="w-4 h-4 text-indigo-500" />;
      case "security_updated":
        return <ShieldCheck className="w-4 h-4 text-rose-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#035BE3]" />;
    }
  };

  // Calculate relative time (e.g. 2m ago, 1h ago)
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "Just now";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHour / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  // Handle clicking a notification to route to target tab
  const handleNotificationClick = (item) => {
    if (!item.is_read && onMarkNotificationRead) {
      onMarkNotificationRead(item.id);
    }
    setShowNotifications(false);

    if (item.type?.includes("inquiry")) {
      setActiveTab && setActiveTab("inquiries");
    } else if (item.type?.includes("payment") || item.type?.includes("purchased")) {
      setActiveTab && setActiveTab("payments");
    } else if (item.type?.includes("commission") || item.type?.includes("payout")) {
      setActiveTab && setActiveTab("affiliates");
    } else if (item.type?.includes("signup") || item.type?.includes("user")) {
      setActiveTab && setActiveTab("users");
    } else if (item.type?.includes("subadmin")) {
      setActiveTab && setActiveTab("subadmins");
    } else if (item.type?.includes("course")) {
      setActiveTab && setActiveTab("courses");
    } else if (item.type?.includes("package")) {
      setActiveTab && setActiveTab("packages");
    } else if (item.type?.includes("security")) {
      setActiveTab && setActiveTab("videosecurity");
    }
  };

  // Real-time Global Search Suggestions across courses, users, packages, and mentors
  const adminSuggestions = React.useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const list = [];

    // 1. Search Courses
    (coursesList || []).forEach((c) => {
      if (c.title?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q) || c.mentor_name?.toLowerCase().includes(q)) {
        list.push({
          type: "course",
          title: c.title,
          subtitle: `${c.category || 'Curriculum'} • ${c.mentor_name || 'Assigned Mentor'}`,
          category: "Course",
          action: () => {
            setActiveTab && setActiveTab("courses");
            setIsSearchFocused(false);
          },
        });
      }
    });

    // 2. Search Students / Users
    (usersList || []).forEach((u) => {
      const idVal = u.student_id || `KW${u.id}`;
      if (u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || idVal.toLowerCase().includes(q) || u.phone?.includes(q)) {
        list.push({
          type: "user",
          title: u.name,
          subtitle: `${idVal} • ${u.email}`,
          category: "Student",
          action: () => {
            setActiveTab && setActiveTab("users");
            setIsSearchFocused(false);
          },
        });
      }
    });

    // 3. Search Packages
    (packagesList || []).forEach((p) => {
      if (p.name?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q)) {
        list.push({
          type: "package",
          title: p.name,
          subtitle: `₹${Number(p.promo_price || 0).toLocaleString()} • /${p.slug}`,
          category: "Package",
          action: () => {
            setActiveTab && setActiveTab("packages");
            setIsSearchFocused(false);
          },
        });
      }
    });

    // 4. Search Mentors
    (mentorsList || []).forEach((m) => {
      if (m.name?.toLowerCase().includes(q) || m.role_title?.toLowerCase().includes(q)) {
        list.push({
          type: "mentor",
          title: m.name,
          subtitle: m.role_title || "Industry Mentor",
          category: "Mentor",
          action: () => {
            setActiveTab && setActiveTab("mentors");
            setIsSearchFocused(false);
          },
        });
      }
    });

    // 5. Search Payments
    (paymentsList || []).forEach((p) => {
      if (
        p.user_name?.toLowerCase().includes(q) ||
        p.razorpay_order_id?.toLowerCase().includes(q) ||
        p.razorpay_payment_id?.toLowerCase().includes(q)
      ) {
        list.push({
          type: "payment",
          title: `Order: ${p.package_name || p.course_name || 'Purchase'} - ₹${Number(p.amount || 0).toLocaleString()}`,
          subtitle: `${p.user_name || 'Buyer'} • ${p.razorpay_order_id || p.status}`,
          category: "Payment",
          action: () => {
            setActiveTab && setActiveTab("payments");
            setIsSearchFocused(false);
          },
        });
      }
    });

    return list.slice(0, 7);
  }, [searchQuery, coursesList, usersList, packagesList, mentorsList, paymentsList, setActiveTab]);

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

      {/* Center/Left Search Pill with Dropdown */}
      <div className="flex-1 max-w-lg pointer-events-auto relative" ref={searchBoxRef}>
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
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => {
              setSearchQuery && setSearchQuery(e.target.value);
              setIsSearchFocused(true);
            }}
            placeholder={`Search ${getTabTitle().toLowerCase()}...`}
            className={`w-full bg-transparent text-xs outline-none placeholder-[#94A3B8] ${
              darkMode ? "text-white" : "text-[#0F172A]"
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery && setSearchQuery("");
                setIsSearchFocused(false);
              }}
              className="text-[#94A3B8] hover:text-[#035BE3] transition ml-1.5 p-0.5 text-xs font-bold shrink-0 cursor-pointer"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Live Admin Results Dropdown */}
        {isSearchFocused && searchQuery?.trim() && (
          <div
            className={`absolute left-0 right-0 top-14 rounded-2xl border shadow-xl overflow-hidden z-50 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 ${
              darkMode
                ? "bg-[#131926]/95 border-[#222B3D] text-[#E2E8F0]"
                : "bg-white/95 border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            <div className="p-2.5 max-h-84 overflow-y-auto divide-y divide-inherit">
              {adminSuggestions.length === 0 ? (
                <div className="py-6 px-4 text-center">
                  <Search className="w-6 h-6 mx-auto text-[#94A3B8] mb-1.5 opacity-60" />
                  <p className="text-xs font-semibold">Active module filtering for "{searchQuery}"</p>
                  <p className={`text-[10.5px] mt-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                    Matching records will update live in the current table view.
                  </p>
                </div>
              ) : (
                <>
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] flex items-center justify-between">
                    <span>Control Center Matches ({adminSuggestions.length})</span>
                    <span>Click to jump</span>
                  </div>
                  <div className="pt-1 space-y-1">
                    {adminSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => item.action && item.action()}
                        className={`p-2.5 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                          darkMode ? "hover:bg-[#1E2638]" : "hover:bg-blue-50/70"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          item.category === "Course"
                            ? "bg-blue-500/10 text-blue-500"
                            : item.category === "Student"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : item.category === "Package"
                            ? "bg-purple-500/10 text-purple-500"
                            : item.category === "Mentor"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-indigo-500/10 text-indigo-500"
                        }`}>
                          {item.category === "Course" ? <BookOpen size={16} /> : item.category === "Student" ? <UserPlus size={16} /> : item.category === "Package" ? <Layers3 size={16} /> : item.category === "Mentor" ? <Sparkles size={16} /> : <CreditCard size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate leading-snug">{item.title}</p>
                          <p className={`text-[10.5px] truncate mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                            {item.subtitle}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                          item.category === "Course"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : item.category === "Student"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : item.category === "Package"
                            ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}>
                          {item.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls: Theme Toggle, Notifications, Sync DB, Admin Profile Pill */}
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
          className={`h-12 w-20 sm:w-22 rounded-full border p-1.5 flex items-center justify-between relative transition-all cursor-pointer select-none ${
            darkMode
              ? "bg-[#131926] border-[#222B3D]"
              : "bg-white border-[#E2E8F0]"
          }`}
        >
          <div
            className={`absolute top-1 bottom-1 w-8 sm:w-9 rounded-full transition-transform duration-300 ease-out flex items-center justify-center shadow-xs ${
              darkMode
                ? "translate-x-9 sm:translate-x-10 bg-[#1E2638] border border-[#2B374E] text-[#FBBF24]"
                : "translate-x-0 bg-[#035BE3] text-white shadow-md shadow-[#035BE3]/20"
            }`}
          >
            {darkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </div>

          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors ${!darkMode ? "opacity-0" : "text-[#64748B]"}`}>
            <Sun className="w-3.5 h-3.5" />
          </div>

          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors ${darkMode ? "opacity-0" : "text-[#94A3B8]"}`}>
            <Moon className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* ========================================================= */}
        {/* LIVE REAL-TIME NOTIFICATIONS BELL DROPDOWN */}
        {/* ========================================================= */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            title="System & Live Notifications"
            className={`h-12 w-12 rounded-full border flex items-center justify-center relative transition cursor-pointer ${
              showNotifications
                ? "border-[#035BE3] text-[#035BE3] ring-2 ring-[#035BE3]/20"
                : darkMode
                ? "bg-[#131926] border-[#222B3D] text-[#E2E8F0] hover:border-[#035BE3]"
                : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#035BE3] hover:text-[#035BE3]"
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white font-black text-[9px] flex items-center justify-center shadow-xs animate-pulse">
                {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {showNotifications && (
            <div
              className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-[24px] border shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
                darkMode
                  ? "bg-[#131926] border-[#222B3D] text-white"
                  : "bg-white border-[#E2E8F0] text-[#0F172A]"
              }`}
            >
              {/* Header */}
              <div className="p-4 pb-3 border-b border-inherit flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold">Admin Notifications</h4>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold">
                      {unreadNotificationsCount} New
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadNotificationsCount > 0 && (
                    <button
                      type="button"
                      onClick={onMarkAllNotificationsRead}
                      className="text-[11px] font-bold text-[#035BE3] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-[380px] overflow-y-auto divide-y divide-inherit scrollbar-thin">
                {notificationsList.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-[#035BE3] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold">All caught up!</p>
                    <p className="text-[11px] text-[#8A99AD]">No new admin notifications at this moment.</p>
                  </div>
                ) : (
                  notificationsList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`p-3.5 flex items-start gap-3 transition cursor-pointer ${
                        !item.is_read
                          ? (darkMode ? "bg-blue-950/20 hover:bg-blue-950/30" : "bg-blue-50/50 hover:bg-blue-50")
                          : (darkMode ? "hover:bg-[#1A2234]" : "hover:bg-[#F8FAFC]")
                      }`}
                    >
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        darkMode ? "bg-[#0E1420] border border-[#222B3D]" : "bg-white border border-slate-200 shadow-xs"
                      }`}>
                        {getNotificationIcon(item.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold truncate leading-tight">{item.title}</p>
                          <span className="text-[10px] text-[#8A99AD] shrink-0 font-medium flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {formatTimeAgo(item.created_at)}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-[#8A99AD] mt-1 leading-snug line-clamp-2">
                          {item.message}
                        </p>
                      </div>

                      {/* Unread Dot */}
                      {!item.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#035BE3] shrink-0 mt-2" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notificationsList.length > 0 && (
                <div className="p-2.5 px-4 bg-gray-50 dark:bg-[#0E1420] border-t border-inherit flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab && setActiveTab("history");
                      setShowNotifications(false);
                    }}
                    className="text-[#035BE3] font-bold hover:underline cursor-pointer"
                  >
                    View Complete Audit Logs →
                  </button>
                  <button
                    type="button"
                    onClick={onClearNotifications}
                    className="text-gray-400 hover:text-red-500 font-medium flex items-center gap-1 cursor-pointer transition"
                  >
                    <Trash2 className="w-3 h-3" /> Clear read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

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
        <div className="relative" ref={profileRef}>
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
              <p className="text-xs font-bold leading-tight truncate max-w-[110px]">
                {adminUser?.name || "Super Admin"}
              </p>
              <p className="text-[10px] font-semibold text-[#035BE3] leading-none mt-0.5">
                {adminUser?.role_title || (adminUser?.role === "superadmin" ? "Super Admin" : "Staff Admin")}
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
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#035BE3]/10 text-[#035BE3]">
                  {adminUser?.role_title || (adminUser?.role === "superadmin" ? "Super Administrator" : "Staff Admin")}
                </span>
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
