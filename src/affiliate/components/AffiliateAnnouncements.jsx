import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Bell,
  Sparkles,
  Pin,
  Calendar,
  ExternalLink,
  Tag,
  Search,
  Filter,
  Flame,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { getAffiliateAnnouncementsApi } from "../../services/api";

export default function AffiliateAnnouncements({ darkMode, externalSearchQuery = "" }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync external search query from header if changed
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await getAffiliateAnnouncementsApi();
      if (res?.success && Array.isArray(res.announcements)) {
        setAnnouncements(res.announcements);
      }
    } catch (err) {
      console.error("Failed to load affiliate announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const categories = [
    { id: "all", label: "All Updates" },
    { id: "contest", label: "Contests & Bonuses" },
    { id: "update", label: "Payouts & System" },
    { id: "resources", label: "Marketing Packs" },
    { id: "general", label: "General News" },
  ];

  const filtered = announcements.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      (item.badge_text && item.badge_text.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Banner Capsule */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all ${
          darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
        }`}
      >
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Official Affiliate Broadcast Hub</span>
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-black tracking-tight ${
              darkMode ? "text-white" : "text-[#0F172A]"
            }`}
          >
            Affiliate Announcements & Updates
          </h1>
          <p
            className={`text-xs sm:text-sm ${
              darkMode ? "text-[#94A3B8]" : "text-[#556377]"
            }`}
          >
            Direct notices from The Skillpreneur Admin: bonus sprints, commission contests, payout cycles, and marketing materials.
          </p>
        </div>

        <button
          onClick={loadAnnouncements}
          disabled={loading}
          className={`h-10 px-4 rounded-full border text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            darkMode
              ? "border-[#222B3D] bg-[#0E1420] text-[#94A3B8] hover:text-white"
              : "border-[#E2E8F0] bg-[#F8FAFD] text-[#556377] hover:text-[#0F172A]"
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#035BE3]" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 2. Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div
          className={`p-1.5 rounded-2xl border flex items-center gap-1 overflow-x-auto scrollbar-none ${
            darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
          }`}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-[#035BE3] text-white shadow-xs"
                  : darkMode
                  ? "text-[#8A99AD] hover:text-white"
                  : "text-[#556377] hover:text-[#0F172A]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div
          className={`h-11 px-4 rounded-full border flex items-center gap-2.5 w-full sm:w-72 ${
            darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
          }`}
        >
          <Search className="w-4 h-4 text-[#8A99AD]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search updates..."
            className="bg-transparent text-xs outline-none w-full"
          />
        </div>
      </div>

      {/* 3. Announcements List */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#035BE3] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#8A99AD]">Loading announcements...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className={`p-12 rounded-3xl border text-center space-y-3 ${
            darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <h3
            className={`text-base font-bold ${
              darkMode ? "text-white" : "text-[#0F172A]"
            }`}
          >
            No Announcements Found
          </h3>
          <p className="text-xs text-[#8A99AD] max-w-sm mx-auto">
            There are no updates in this category right now. Check back soon for new contests and payout updates.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const isHigh = item.priority === "high" || item.priority === "urgent";
            return (
              <div
                key={item.id}
                className={`p-6 sm:p-7 rounded-3xl border transition-all hover:scale-[1.005] relative overflow-hidden ${
                  item.is_pinned
                    ? darkMode
                      ? "bg-linear-to-r from-[#131926] to-[#1a2336] border-amber-500/40 shadow-sm"
                      : "bg-linear-to-r from-amber-50/40 to-orange-50/20 border-amber-200 shadow-xs"
                    : darkMode
                    ? "bg-[#131926] border-[#222B3D]"
                    : "bg-white border-[#E2E8F0] shadow-xs"
                }`}
              >
                {/* Top Metas Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {item.is_pinned ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                        <Pin className="w-3 h-3 fill-current" />
                        <span>Pinned Notice</span>
                      </span>
                    ) : null}

                    {item.badge_text && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#035BE3]/10 text-[#035BE3] border border-[#035BE3]/20">
                        {item.badge_text}
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        item.category === "contest"
                          ? "bg-purple-500/10 text-purple-500"
                          : item.category === "update"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : item.category === "resources"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-gray-500/10 text-[#8A99AD]"
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#8A99AD]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Recent"}
                    </span>
                  </div>
                </div>

                {/* Announcement Title */}
                <h3
                  className={`text-base sm:text-lg font-black tracking-tight mb-2 ${
                    darkMode ? "text-white" : "text-[#0F172A]"
                  }`}
                >
                  {item.title}
                </h3>

                {/* Announcement Body */}
                <p
                  className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    darkMode ? "text-[#94A3B8]" : "text-[#556377]"
                  }`}
                >
                  {item.content}
                </p>

                {/* Action Link (If provided) */}
                {item.action_url && item.action_label && (
                  <div className="mt-4 pt-3 border-t border-inherit flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#8A99AD] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Verified Admin Announcement</span>
                    </span>

                    <a
                      href={item.action_url}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <span>{item.action_label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
