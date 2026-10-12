import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Copy,
  Check,
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
  GraduationCap,
  Sparkles,
  Share2,
  TrendingUp,
  Users,
  Wallet,
  Trophy,
  ArrowRight,
  CreditCard,
  Megaphone,
} from "lucide-react";
import { clearUserSession } from "../../services/api";
import UserAvatarDropdown from "../../components/UserAvatarDropdown";

export default function AffiliateHeader({
  activeTab,
  setActiveTab,
  user,
  referrals = [],
  payouts = [],
  leaderboard = [],
  commissionPackages = [],
  setMobileOpen,
  darkMode,
  setDarkMode,
  searchQuery = "",
  setSearchQuery,
}) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const referralCode = user?.referral_code || user?.referralCode || (user?.id ? `KW${user.id}` : "KW1001");
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLogout = () => {
    clearUserSession();
    navigate("/", { replace: true });
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  // Real-time affiliate search options/suggestions
  const affiliateSuggestions = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const list = [];

    // 1. Matched Referrals
    (referrals || []).forEach((r) => {
      const name = r.referred_user_name || r.name || "";
      const itemTitle = r.item_title || r.package || "";
      if (name.toLowerCase().includes(q) || itemTitle.toLowerCase().includes(q) || String(r.id || "").includes(q)) {
        list.push({
          type: "referral",
          title: name || `Referral #${r.id}`,
          subtitle: `${itemTitle} • Earned ₹${Number(r.commission_amount || 0).toLocaleString()}`,
          tag: r.status || "Completed",
          action: () => {
            setActiveTab && setActiveTab("referrals");
            setIsFocused(false);
          },
        });
      }
    });

    // 2. Matched Payouts
    (payouts || []).forEach((p) => {
      const utr = p.utr_number || "";
      const method = p.payout_method || "";
      if (utr.toLowerCase().includes(q) || method.toLowerCase().includes(q) || String(p.id || "").includes(q) || String(p.amount || "").includes(q)) {
        list.push({
          type: "payout",
          title: `Withdrawal #${p.id} - ₹${Number(p.amount || 0).toLocaleString()}`,
          subtitle: `Method: ${method.toUpperCase()} • Status: ${p.status || "In-Review"}`,
          tag: p.status || "Payout",
          action: () => {
            setActiveTab && setActiveTab("payouts");
            setIsFocused(false);
          },
        });
      }
    });

    // 3. Matched Top Leaders
    (leaderboard || []).forEach((lb) => {
      if (lb.name?.toLowerCase().includes(q) || String(lb.student_id || "").toLowerCase().includes(q)) {
        list.push({
          type: "leaderboard",
          title: lb.name,
          subtitle: `Rank #${lb.rank} • ₹${Number(lb.income || lb.earnings || 0).toLocaleString()} Generated`,
          tag: `Rank #${lb.rank}`,
          action: () => {
            setActiveTab && setActiveTab("leaderboard");
            setIsFocused(false);
          },
        });
      }
    });

    return list.slice(0, 6);
  }, [searchQuery, referrals, payouts, leaderboard, setActiveTab]);

  return (
    <header
      className={`
        sticky top-0 z-40 py-3 px-4 sm:px-8 lg:px-10 flex items-center justify-between gap-3 transition-colors duration-200 backdrop-blur-md border-b
        ${
          darkMode
            ? "bg-[#0B0F17]/85 border-[#222B3D]/80"
            : "bg-[#FBFCFF]/85 border-[#E2E8F0]/80"
        }
      `}
    >
      {/* Mobile Hamburger & Logo preview */}
      <div className="flex items-center gap-2 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className={`h-11 w-11 rounded-full border flex items-center justify-center transition cursor-pointer ${
            darkMode
              ? "bg-[#131926] border-[#222B3D] text-[#E2E8F0]"
              : "bg-white border-[#E2E8F0] text-[#0F172A]"
          }`}
          aria-label="Open affiliate navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Center Search Pill & Referral Capsule with Interactive Dropdown */}
      <div className="flex-1 max-w-2xl flex items-center gap-2.5 relative" ref={searchBoxRef}>
        {/* Real-time Search Input */}
        <div
          className={`h-11 flex-1 rounded-full border px-4 flex items-center transition-all focus-within:border-[#035BE3] ${
            darkMode
              ? "bg-[#131926] border-[#222B3D]"
              : "bg-white border-[#E2E8F0]"
          }`}
        >
          <Search className="w-3.5 h-3.5 text-[#8A99AD] shrink-0 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => {
              setSearchQuery && setSearchQuery(e.target.value);
              setIsFocused(true);
            }}
            placeholder={`Search ${activeTab === 'referrals' ? 'referrals & buyers' : activeTab === 'payouts' ? 'payouts & UTR' : activeTab === 'leaderboard' ? 'top partners' : 'affiliate panel'}...`}
            className={`w-full bg-transparent text-xs font-medium outline-none placeholder-[#8A99AD] ${
              darkMode ? "text-white" : "text-[#0F172A]"
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery && setSearchQuery("");
                setIsFocused(false);
              }}
              className="text-[#8A99AD] hover:text-[#035BE3] transition ml-1.5 p-0.5 text-xs font-bold shrink-0 cursor-pointer"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Live Dropdown Options */}
        {isFocused && searchQuery.trim() && (
          <div
            className={`absolute left-0 right-0 xl:right-48 top-13 rounded-2xl border shadow-xl overflow-hidden z-50 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 ${
              darkMode
                ? "bg-[#131926]/95 border-[#222B3D] text-[#E2E8F0]"
                : "bg-white/95 border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            <div className="p-2.5 max-h-80 overflow-y-auto divide-y divide-inherit">
              {affiliateSuggestions.length === 0 ? (
                <div className="py-6 px-4 text-center">
                  <Search className="w-6 h-6 mx-auto text-[#8A99AD] mb-1.5 opacity-60" />
                  <p className="text-xs font-semibold">Filtering active tab for "{searchQuery}"</p>
                  <p className={`text-[10.5px] mt-1 ${darkMode ? "text-[#8A99AD]" : "text-[#64748B]"}`}>
                    Results are updated live in the table below.
                  </p>
                </div>
              ) : (
                <>
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-[#8A99AD] flex items-center justify-between">
                    <span>Affiliate Matches ({affiliateSuggestions.length})</span>
                    <span>Click to jump</span>
                  </div>
                  <div className="pt-1 space-y-1">
                    {affiliateSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => item.action && item.action()}
                        className={`p-2.5 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                          darkMode ? "hover:bg-[#1E2638]" : "hover:bg-amber-50/70"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          item.type === "referral"
                            ? "bg-blue-500/10 text-blue-500"
                            : item.type === "payout"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {item.type === "referral" ? <Users size={17} /> : item.type === "payout" ? <Wallet size={17} /> : <Trophy size={17} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">{item.title}</p>
                          <p className={`text-[10.5px] truncate mt-0.5 ${darkMode ? "text-[#8A99AD]" : "text-[#64748B]"}`}>
                            {item.subtitle}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-500 border-amber-500/20 shrink-0 capitalize">
                          {item.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Compact Referral Link Quick Capsule (desktop only) */}
        <div className="hidden xl:flex items-center">
          <button
            onClick={handleCopyLink}
            className={`h-11 flex items-center gap-2 px-3.5 rounded-full border text-[11px] font-bold transition-all shrink-0 cursor-pointer shadow-xs ${
              copied
                ? "bg-emerald-600 border-emerald-600 text-white"
                : darkMode
                ? "bg-[#131926] border-[#222B3D] text-[#8A99AD] hover:text-white hover:border-[#035BE3]"
                : "bg-white border-[#E2E8F0] text-[#475569] hover:text-[#035BE3] hover:border-[#035BE3]"
            }`}
            title={`Copy ${referralLink}`}
          >
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{copied ? "Link Copied!" : "Copy Referral Link"}</span>
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-amber-500" />}
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto lg:ml-0">
        {/* Switch to Student Learning Dashboard */}
        <Link
          to="/dashboard"
          className={`h-11 px-3.5 sm:px-4 rounded-full border flex items-center gap-2 text-xs font-bold transition cursor-pointer shadow-xs ${
            darkMode
              ? "bg-[#131926] border-[#222B3D] text-[#94A3B8] hover:text-white hover:border-[#035BE3]/50"
              : "bg-white border-[#E2E8F0] text-[#475569] hover:text-[#035BE3] hover:border-[#035BE3]/40"
          }`}
          title="Return to Student Learning Area"
        >
          <GraduationCap className="w-4 h-4 text-[#035BE3]" />
          <span className="hidden sm:inline">Learning Dashboard</span>
        </Link>

        {/* Dark / Light Theme Sliding Switcher Toggle */}
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`h-11 w-20 sm:w-22 rounded-full border p-1 flex items-center justify-between relative transition-all cursor-pointer select-none ${
            darkMode
              ? "bg-[#131926] border-[#222B3D]"
              : "bg-white border-[#E2E8F0]"
          }`}
          aria-label="Toggle dark and light theme"
        >
          <div
            className={`absolute top-1 bottom-1 w-8 rounded-full transition-transform duration-300 ease-out flex items-center justify-center shadow-xs ${
              darkMode
                ? "translate-x-9 sm:translate-x-11 bg-[#1E2638] border border-[#2B374E] text-[#FBBF24]"
                : "translate-x-0 bg-[#035BE3] text-white"
            }`}
          >
            {darkMode ? <Moon className="w-3.5 h-3.5 shrink-0" /> : <Sun className="w-3.5 h-3.5 shrink-0" />}
          </div>

          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors ${!darkMode ? "opacity-0" : "text-[#64748B]"}`}>
            <Sun className="w-3.5 h-3.5 shrink-0" />
          </div>

          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors ${darkMode ? "opacity-0" : "text-[#94A3B8]"}`}>
            <Moon className="w-3.5 h-3.5 shrink-0" />
          </div>
        </button>

        {/* User Profile Avatar & Popup Dropdown */}
        <UserAvatarDropdown
          user={user}
          darkMode={darkMode}
          align="right"
          showDashboardLink={true}
        />
      </div>
    </header>
  );
}
