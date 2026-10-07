import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  Sparkles,
  BarChart2,
  PieChart as PieIcon,
  Activity,
  Award,
} from "lucide-react";

export default function DashboardCharts({ darkMode, usersCount = 0 }) {
  const [activeRange, setActiveRange] = useState("weekly");
  const [hoveredBar, setHoveredBar] = useState(null);

  // 1. Weekly Student Signups & Retention Bar Chart Data
  const weeklyBarData = [
    { day: "Mon", signups: 14, completions: 8, height: "42%" },
    { day: "Tue", signups: 22, completions: 15, height: "60%" },
    { day: "Wed", signups: 28, completions: 18, height: "72%" },
    { day: "Thu", signups: 35, completions: 24, height: "85%" },
    { day: "Fri", signups: 48, completions: 32, height: "96%" },
    { day: "Sat", signups: 39, completions: 26, height: "82%" },
    { day: "Sun", signups: usersCount > 0 ? usersCount + 10 : 30, completions: 20, height: "70%" },
  ];

  // 2. Course Category Engagement (Radar/Horizontal Bars)
  const categoryEngagement = [
    { name: "Digital Marketing & Ads", score: 88, color: "#035BE3", tag: "Hot Track" },
    { name: "Video Editing & CapCut", score: 74, color: "#FA8C03", tag: "Popular" },
    { name: "AI Tools & ChatGPT", score: 65, color: "#6366F1", tag: "Trending" },
    { name: "Fullstack Web Basics", score: 48, color: "#10B981", tag: "Steady" },
  ];

  // 3. Package Tier Share with Donut SVG & Stats
  const tierDistribution = [
    { name: "Pro Package", percent: 40, color: "#035BE3", count: "₹1,999" },
    { name: "Supreme Package", percent: 30, color: "#FA8C03", count: "₹3,499" },
    { name: "Premium Package", percent: 20, color: "#6366F1", count: "₹5,999" },
    { name: "Elite VIP", percent: 10, color: "#10B981", count: "₹9,999" },
  ];

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* ROW 1: DUAL POWER CHARTS (Growth Wave + Weekly Bar Chart) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHART 1: SMOOTH CURVE REVENUE & ENROLLMENT WAVE (7 Cols) */}
        <div
          className={`lg:col-span-7 rounded-[28px] p-6 border transition-colors flex flex-col justify-between ${
            darkMode
              ? "bg-[#131926] border-[#222B3D] text-white"
              : "bg-white border-[#E2E8F0] text-[#0F172A]"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#035BE3] animate-pulse" />
                <h3 className="text-base font-bold">Revenue & Growth Trend</h3>
              </div>
              <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                Continuous learner trajectory & monetization velocity
              </p>
            </div>

            {/* Time Filter Tabs */}
            <div
              className={`p-1 rounded-full border flex items-center gap-1 shrink-0 ${
                darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F4F6FA] border-[#E2E8F0]"
              }`}
            >
              {["weekly", "monthly", "yearly"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveRange(t)}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-full capitalize transition-all cursor-pointer ${
                    activeRange === t
                      ? "bg-[#035BE3] text-white shadow-xs"
                      : darkMode
                      ? "text-[#94A3B8] hover:text-white"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Smooth Area Wave */}
          <div className="relative w-full h-48 sm:h-52 my-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 170" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradientBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#035BE3" stopOpacity="0.4" />
                  <stop offset="60%" stopColor="#035BE3" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#035BE3" stopOpacity="0.0" />
                </linearGradient>

                <linearGradient id="waveGradientOrange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FA8C03" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#FA8C03" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke={darkMode ? "#1E2638" : "#F1F5F9"} strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke={darkMode ? "#1E2638" : "#F1F5F9"} strokeDasharray="4 4" />
              <line x1="0" y1="130" x2="500" y2="130" stroke={darkMode ? "#1E2638" : "#F1F5F9"} strokeDasharray="4 4" />

              {/* Secondary Comparison Wave (Target Forecast) */}
              <path
                d="M 0,140 C 80,125 150,110 230,85 C 310,60 390,75 500,35"
                fill="none"
                stroke="#FA8C03"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.75"
              />

              {/* Primary Filled Gradient Wave */}
              <path
                d="M 0,150 C 75,130 140,110 220,70 C 300,35 370,55 440,25 L 500,18 L 500,165 L 0,165 Z"
                fill="url(#waveGradientBlue)"
              />

              {/* Primary Main Line */}
              <path
                d="M 0,150 C 75,130 140,110 220,70 C 300,35 370,55 440,25 L 500,18"
                fill="none"
                stroke="#035BE3"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data Pulsing Nodes */}
              <circle cx="220" cy="70" r="5" fill="#035BE3" stroke="white" strokeWidth="2" />
              <circle cx="440" cy="25" r="5" fill="#035BE3" stroke="white" strokeWidth="2" />
              <circle cx="500" cy="18" r="6" fill="#035BE3" stroke="white" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Bottom Footnote */}
          <div className="flex items-center justify-between pt-3.5 border-t border-inherit text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#035BE3]" />
                <span className="font-semibold text-[11px]">Realized Revenue (₹{(usersCount || 1) * 1999})</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#FA8C03]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FA8C03]" />
                <span className="font-semibold text-[11px]">Target Projected</span>
              </div>
            </div>

            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
              +32.6% M-o-M
            </span>
          </div>
        </div>

        {/* CHART 2: MODERN VERTICAL DUAL BARS (DAILY SIGNUPS VS COMPLETIONS - 5 Cols) */}
        <div
          className={`lg:col-span-5 rounded-[28px] p-6 border transition-colors flex flex-col justify-between ${
            darkMode
              ? "bg-[#131926] border-[#222B3D] text-white"
              : "bg-white border-[#E2E8F0] text-[#0F172A]"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold">Daily Activity Breakdown</h3>
              <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                New signups vs Course completions
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-[#035BE3]">
                <span className="w-2 h-2 rounded-full bg-[#035BE3]" /> Signups
              </span>
              <span className="flex items-center gap-1 text-[#FA8C03]">
                <span className="w-2 h-2 rounded-full bg-[#FA8C03]" /> Modules
              </span>
            </div>
          </div>

          {/* Bar Columns Container */}
          <div className="h-44 flex items-end justify-between gap-2 px-1 pt-6 pb-2">
            {weeklyBarData.map((item, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredBar(item)}
                onMouseLeave={() => setHoveredBar(null)}
                className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer"
              >
                {/* Dual Bars Pair */}
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  {/* Primary Bar (Signups) */}
                  <div
                    style={{ height: item.height }}
                    className="w-3 sm:w-3.5 bg-[#035BE3] rounded-full transition-all duration-300 group-hover:bg-[#024bc0] group-hover:scale-105"
                  />
                  {/* Secondary Bar (Completions) */}
                  <div
                    style={{ height: `${parseInt(item.height) * 0.65}%` }}
                    className="w-2.5 sm:w-3 bg-[#FA8C03] rounded-full opacity-85 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
                  />
                </div>

                {/* Day Label */}
                <span
                  className={`text-[10px] font-semibold mt-1 transition-colors ${
                    hoveredBar?.day === item.day
                      ? "text-[#035BE3] font-bold"
                      : darkMode
                      ? "text-[#94A3B8]"
                      : "text-[#64748B]"
                  }`}
                >
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Summary Bar */}
          <div
            className={`mt-2 p-2.5 rounded-2xl border flex items-center justify-between text-xs ${
              darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
            }`}
          >
            <span className={`text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
              Weekly Total:
            </span>
            <span className="font-bold text-[#035BE3]">210+ Student Sessions</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ROW 2: DONUT CHART TIER DISTRIBUTION & TOP SKILL TRACKS */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHART 3: CIRCULAR DONUT CHART (TIER DISTRIBUTION - 6 Cols) */}
        <div
          className={`lg:col-span-6 rounded-[28px] p-6 border transition-colors flex flex-col justify-between ${
            darkMode
              ? "bg-[#131926] border-[#222B3D] text-white"
              : "bg-white border-[#E2E8F0] text-[#0F172A]"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold">Package Enrollment Share</h3>
              <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                Student tier distribution across all 4 packages
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#035BE3] border border-blue-200/60">
              Live Ratio
            </span>
          </div>

          {/* Donut Chart Visual + Legend Side-by-Side */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-3">
            {/* SVG Donut Circle */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="none" stroke={darkMode ? "#1E2638" : "#F1F5F9"} strokeWidth="11" />
                
                {/* Pro: 40% (stroke-dasharray="95.5 238.7") */}
                <circle
                  cx="50" cy="50" r="38" fill="none"
                  stroke="#035BE3" strokeWidth="11"
                  strokeDasharray="95.5 238.7" strokeDashoffset="0"
                />

                {/* Supreme: 30% */}
                <circle
                  cx="50" cy="50" r="38" fill="none"
                  stroke="#FA8C03" strokeWidth="11"
                  strokeDasharray="71.6 238.7" strokeDashoffset="-95.5"
                />

                {/* Premium: 20% */}
                <circle
                  cx="50" cy="50" r="38" fill="none"
                  stroke="#6366F1" strokeWidth="11"
                  strokeDasharray="47.7 238.7" strokeDashoffset="-167.1"
                />

                {/* Elite: 10% */}
                <circle
                  cx="50" cy="50" r="38" fill="none"
                  stroke="#10B981" strokeWidth="11"
                  strokeDasharray="23.9 238.7" strokeDashoffset="-214.8"
                />
              </svg>

              {/* Center Donut Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold tracking-tight">4 Tiers</span>
                <span className="text-[10px] text-[#64748B] font-semibold">100% Active</span>
              </div>
            </div>

            {/* Donut Legend Items */}
            <div className="flex-1 w-full space-y-2.5">
              {tierDistribution.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                    <span className="font-semibold">{t.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold">{t.percent}%</span>
                    <span className={`text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      ({t.count})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHART 4: SKILL TRACK POPULARITY / COMPLETION BARS (6 Cols) */}
        <div
          className={`lg:col-span-6 rounded-[28px] p-6 border transition-colors flex flex-col justify-between ${
            darkMode
              ? "bg-[#131926] border-[#222B3D] text-white"
              : "bg-white border-[#E2E8F0] text-[#0F172A]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold">Category Demand & Completion</h3>
                <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                  Learner interest score and module activity
                </p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-[#FA8C03] border border-amber-200/60">
                Top Rated
              </span>
            </div>

            {/* Horizontal Progress Bars */}
            <div className="space-y-4 my-3">
              {categoryEngagement.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{cat.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-700">
                        {cat.tag}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-xs">{cat.score}% Index</span>
                  </div>

                  {/* Progress Line */}
                  <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? "bg-[#1E2638]" : "bg-[#F1F5F9]"}`}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${cat.score}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
              darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
            }`}
          >
            <span className={`text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
              Most active track this week:
            </span>
            <span className="font-bold text-[#035BE3]">Digital Marketing & Ads (88%)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
