import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  TrendingUp,
  Calendar,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Award,
  Users,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  RefreshCw,
  IndianRupee,
  PieChart,
  Target,
  ArrowDownRight,
  Activity,
  Layers,
} from "lucide-react";
import { getAffiliateIncomeAnalyticsApi } from "../../services/api";

// Smooth animated counter hook with gentle duration (2.4s) and natural easing
function useAnimatedNumber(targetValue, duration = 2400) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = 0;
    const val = Number(targetValue) || 0;

    if (val === 0) {
      setCurrent(0);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease-out cubic: starts smooth, gently glides and stops at the exact number
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(startValue + (val - startValue) * easeProgress));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrent(val);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [targetValue, duration]);

  return current;
}

// Mini SVG Sparkline component for card trends
function Sparkline({ points = [10, 25, 18, 40, 32, 60, 55, 80], color = "#F59E0B", animate = true }) {
  const width = 110;
  const height = 36;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;

  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 8) - 4;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  const fillPath = `${path} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#grad-${color.replace("#", "")})`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "transition-all duration-1000 ease-out" : ""}
      />
    </svg>
  );
}

export default function AffiliateIncomeReports({ darkMode, user, setActiveTab }) {
  const [period, setPeriod] = useState("monthly"); // 'daily' | 'weekly' | 'monthly' | 'yearly'
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [animateChart, setAnimateChart] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const getIstDateString = (dateObj) =>
    dateObj.toLocaleDateString("en-GB", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const activeDateRef = useRef(getIstDateString(new Date()));

  const fetchAnalytics = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
        setAnimateChart(false);
      }
      const res = await getAffiliateIncomeAnalyticsApi();
      if (res?.success && res.analytics) {
        setAnalytics(res.analytics);
      }
    } catch (err) {
      console.error("Failed to load income analytics:", err);
    } finally {
      if (!silent) {
        setLoading(false);
        setTimeout(() => setAnimateChart(true), 300);
      } else {
        setAnimateChart(true);
      }
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(false);

    // 1. Real-time 1-second clock & automatic midnight date-change rollover
    const clockTimer = setInterval(() => {
      const current = new Date();
      setNow(current);

      const currentIstDate = getIstDateString(current);
      if (currentIstDate !== activeDateRef.current) {
        activeDateRef.current = currentIstDate;
        // Date changed at midnight — auto-refresh all earnings & reset Today's Earnings
        fetchAnalytics(false);
      }
    }, 1000);

    // 2. Automatic background refresh every 30 seconds (no manual refresh needed)
    const syncTimer = setInterval(() => {
      fetchAnalytics(true);
    }, 30000);

    // 3. Auto-refresh when user returns to browser tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const current = new Date();
        setNow(current);
        const currentIstDate = getIstDateString(current);
        if (currentIstDate !== activeDateRef.current) {
          activeDateRef.current = currentIstDate;
          fetchAnalytics(false);
        } else {
          fetchAnalytics(true);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(clockTimer);
      clearInterval(syncTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchAnalytics]);

  // Current active period data
  const currentData = analytics ? analytics[period] : { income: 0, conversions: 0, direct: 0, leadership: 0 };
  const animatedIncome = useAnimatedNumber(currentData?.income || 0, 2400);
  const animatedConversions = useAnimatedNumber(currentData?.conversions || 0, 1800);
  const animatedDirect = useAnimatedNumber(currentData?.direct || 0, 2200);
  const animatedLeadership = useAnimatedNumber(currentData?.leadership || 0, 2200);

  // Dynamic Chart Data based on selected period
  const isWeeklyOrDaily = period === "daily" || period === "weekly";
  const rawChartData = isWeeklyOrDaily
    ? (analytics?.chart7Days?.length ? analytics.chart7Days : [
        { label: "Mon", amount: 0, count: 0 },
        { label: "Tue", amount: 0, count: 0 },
        { label: "Wed", amount: 0, count: 0 },
        { label: "Thu", amount: 0, count: 0 },
        { label: "Fri", amount: 0, count: 0 },
        { label: "Sat", amount: 0, count: 0 },
        { label: "Sun", amount: 0, count: 0 },
      ])
    : (analytics?.chartMonths?.length ? analytics.chartMonths : [
        { label: "Jan", amount: 0, count: 0 },
        { label: "Feb", amount: 0, count: 0 },
        { label: "Mar", amount: 0, count: 0 },
        { label: "Apr", amount: 0, count: 0 },
        { label: "May", amount: 0, count: 0 },
        { label: "Jun", amount: 0, count: 0 },
        { label: "Jul", amount: 0, count: 0 },
        { label: "Aug", amount: 0, count: 0 },
        { label: "Sep", amount: 0, count: 0 },
        { label: "Oct", amount: 0, count: 0 },
        { label: "Nov", amount: 0, count: 0 },
        { label: "Dec", amount: 0, count: 0 },
      ]);

  const maxChartAmount = Math.max(...rawChartData.map((d) => d.amount), 2000);

  // Period title
  const periodTitles = {
    daily: "Today's Income",
    weekly: "This Week's Income",
    monthly: "This Month's Income",
    yearly: "This Year's Income",
  };

  // Tier 1 vs Tier 2 Percentage calculations
  const totalIncomeCalc = (currentData?.direct || 0) + (currentData?.leadership || 0);
  const directPct = totalIncomeCalc > 0 ? Math.round(((currentData?.direct || 0) / totalIncomeCalc) * 100) : 100;
  const leadershipPct = totalIncomeCalc > 0 ? 100 - directPct : 0;

  // Monthly target simulator (₹10,000 goal)
  const monthlyGoal = 10000;
  const goalProgress = Math.min(Math.round(((currentData?.income || 0) / monthlyGoal) * 100), 100);

  // Real-time IST Date (DD/MM/YYYY), Day Name, and Live Running Clock
  const liveDateFormatted = getIstDateString(now);
  const liveDayFormatted = now.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
  });
  const liveTimeFormatted = now
    .toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    .toUpperCase();

  const todayIncome = analytics?.today?.income || 0;
  const last7DaysIncome = analytics?.last7Days?.income || 0;
  const last30DaysIncome = analytics?.last30Days?.income || 0;
  const allTimeIncome = analytics?.allTime?.income || 0;

  const animatedToday = useAnimatedNumber(todayIncome, 2000);
  const animated7Days = useAnimatedNumber(last7DaysIncome, 2200);
  const animated30Days = useAnimatedNumber(last30DaysIncome, 2400);
  const animatedAllTime = useAnimatedNumber(allTimeIncome, 2600);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Banner: Earnings Insights / Performance Summary */}
      <div
        className={`rounded-[30px] border p-6 sm:p-8 relative overflow-hidden transition-all ${
          darkMode
            ? "bg-linear-to-br from-[#131926] via-[#101726] to-[#0A0E17] border-[#222B3D]"
            : "bg-linear-to-br from-white via-[#F8FAFC] to-[#F1F5F9] border-[#E2E8F0] shadow-xs"
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Earnings Insights</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
              <span>Performance Summary</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#8A99AD] max-w-xl">
              Track your daily, weekly, monthly and yearly 2-tier affiliate earnings with animated growth insights.
            </p>
          </div>

          {/* Live Date, Day & Real-Time Clock Badge with Revise Earning */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div
              className={`px-3.5 py-2 rounded-2xl border flex flex-wrap items-center gap-2.5 text-xs font-bold ${
                darkMode
                  ? "bg-[#0E1420] border-[#222B3D] text-[#E2E8F0]"
                  : "bg-white border-[#E2E8F0] text-[#0F172A] shadow-xs"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="font-mono text-xs font-black">{liveDateFormatted}</span>
              </div>

              <span className="text-[#8A99AD]">•</span>

              <span className="text-amber-500 font-extrabold">{liveDayFormatted}</span>

              <span className="text-[#8A99AD]">•</span>

              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
                <span className="font-mono text-xs font-bold text-emerald-500">{liveTimeFormatted}</span>
              </div>
            </div>

            <button
              onClick={() => fetchAnalytics(false)}
              className="px-4 py-2 rounded-2xl text-xs font-black bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-sm hover:opacity-90 transition cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Revise Earning</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Four Performance Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Earnings */}
        <div
          className={`p-5 rounded-[26px] border relative overflow-hidden transition-all ${
            darkMode
              ? "bg-[#131926] border-[#222B3D] hover:border-amber-500/40"
              : "bg-white border-[#E2E8F0] hover:border-amber-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-[#8A99AD] mb-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Today’s Earnings
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Live
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div className="text-2xl sm:text-3xl font-black text-amber-500 font-mono">
              ₹ {animatedToday.toLocaleString("en-IN")}
            </div>
            <Sparkline points={[0, 10, 5, 20, 15, 30, 25, 40]} color="#F59E0B" animate={animateChart} />
          </div>

          <p className="text-[10px] sm:text-[11px] text-[#8A99AD] mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>{analytics?.today?.conversions || 0} conversions today</span>
          </p>

          <div className="w-full bg-amber-500/10 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-[2000ms] ease-out"
              style={{ width: animateChart && todayIncome > 0 ? "100%" : "8%" }}
            />
          </div>
        </div>

        {/* Card 2: Last 7 Days */}
        <div
          className={`p-5 rounded-[26px] border relative overflow-hidden transition-all ${
            darkMode
              ? "bg-[#131926] border-[#222B3D] hover:border-emerald-500/40"
              : "bg-white border-[#E2E8F0] hover:border-emerald-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-[#8A99AD] mb-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Last 7 Days
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              7D
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div className="text-2xl sm:text-3xl font-black text-emerald-500 font-mono">
              ₹ {animated7Days.toLocaleString("en-IN")}
            </div>
            <Sparkline points={[10, 25, 20, 45, 35, 60, 55, 80]} color="#10B981" animate={animateChart} />
          </div>

          <p className="text-[10px] sm:text-[11px] text-[#8A99AD] mt-2 flex items-center gap-1">
            <Users className="w-3 h-3 text-emerald-500" />
            <span>{analytics?.last7Days?.conversions || 0} conversions past 7 days</span>
          </p>

          <div className="w-full bg-emerald-500/10 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-[2200ms] ease-out"
              style={{ width: animateChart && last7DaysIncome > 0 ? "100%" : "8%" }}
            />
          </div>
        </div>

        {/* Card 3: Last 30 days */}
        <div
          className={`p-5 rounded-[26px] border relative overflow-hidden transition-all ${
            darkMode
              ? "bg-[#131926] border-[#222B3D] hover:border-purple-500/40"
              : "bg-white border-[#E2E8F0] hover:border-purple-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-[#8A99AD] mb-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-purple-500 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              Last 30 days
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              30D
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div className="text-2xl sm:text-3xl font-black text-purple-500 font-mono">
              ₹ {animated30Days.toLocaleString("en-IN")}
            </div>
            <Sparkline points={[15, 30, 25, 55, 45, 70, 65, 90]} color="#A855F7" animate={animateChart} />
          </div>

          <p className="text-[10px] sm:text-[11px] text-[#8A99AD] mt-2 flex items-center gap-1">
            <Activity className="w-3 h-3 text-purple-400" />
            <span>{analytics?.last30Days?.conversions || 0} conversions past 30 days</span>
          </p>

          <div className="w-full bg-purple-500/10 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-[2400ms] ease-out"
              style={{ width: animateChart && last30DaysIncome > 0 ? "100%" : "8%" }}
            />
          </div>
        </div>

        {/* Card 4: All Time Earning */}
        <div
          className={`p-5 rounded-[26px] border relative overflow-hidden transition-all ${
            darkMode
              ? "bg-[#131926] border-amber-500/30 shadow-[0_0_25px_-5px_rgba(245,158,11,0.15)]"
              : "bg-white border-amber-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-[#8A99AD] mb-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              All Time Earning
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Total
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div className="text-2xl sm:text-3xl font-black text-amber-500 font-mono">
              ₹ {animatedAllTime.toLocaleString("en-IN")}
            </div>
            <Sparkline points={[20, 35, 30, 60, 50, 80, 75, 100]} color="#F59E0B" animate={animateChart} />
          </div>

          <p className="text-[10px] sm:text-[11px] text-[#8A99AD] mt-2 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            <span>{analytics?.allTime?.conversions || 0} total sales credited</span>
          </p>

          <div className="w-full bg-amber-500/10 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-amber-500 via-orange-500 to-emerald-500 rounded-full transition-all duration-[2600ms] ease-out"
              style={{ width: animateChart && allTimeIncome > 0 ? "100%" : "8%" }}
            />
          </div>
        </div>
      </div>

      {/* Timeframe Switcher Tabs & Chart Header */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#8A99AD] flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-amber-500" />
          <span>Detailed Breakdown & Trends</span>
        </h2>

        <div
          className={`p-1.5 rounded-2xl border flex items-center gap-1 shrink-0 ${
            darkMode ? "bg-[#0A0E17] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
          }`}
        >
          {[
            { id: "daily", label: "Daily" },
            { id: "weekly", label: "Weekly" },
            { id: "monthly", label: "Monthly" },
            { id: "yearly", label: "Yearly" },
          ].map((tab) => {
            const active = period === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setPeriod(tab.id);
                  setAnimateChart(false);
                  setTimeout(() => setAnimateChart(true), 200);
                }}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  active
                    ? "bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-sm"
                    : darkMode
                    ? "text-[#8A99AD] hover:text-white hover:bg-[#1E2638]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Middle Section: Dynamic Chart + Mini Insights Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Interactive Chart (2 Columns) */}
        <div
          className={`lg:col-span-2 rounded-[28px] border p-6 sm:p-7 flex flex-col justify-between ${
            darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
          }`}
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold">
                    {isWeeklyOrDaily ? "Weekly Income Curve (Last 7 Days)" : "Monthly Income Progression"}
                  </h2>
                </div>
                <p className="text-xs text-[#8A99AD] mt-1">
                  Bars animate smoothly to your earned income amount.
                </p>
              </div>

              <button
                onClick={() => fetchAnalytics(false)}
                className={`h-9 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                  darkMode
                    ? "border-[#222B3D] text-[#8A99AD] hover:text-white hover:bg-[#1E2638]"
                    : "border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-500" : ""}`} />
                <span>Refresh Data</span>
              </button>
            </div>

            {/* Dynamic Animated Bars with 2.2s gentle transition */}
            <div className="space-y-3.5 pt-2">
              {rawChartData.map((item, idx) => {
                const rawPercent = maxChartAmount > 0 ? (item.amount / maxChartAmount) * 100 : 0;
                const displayPercent = item.amount > 0 ? Math.max(rawPercent, 14) : 4;

                return (
                  <div key={idx} className="group space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold min-w-[85px]">{item.label}</span>
                        <span className="text-[11px] text-[#8A99AD] hidden sm:inline">
                          ({item.count} conversions)
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`font-black font-mono text-sm transition-colors ${
                            item.amount > 0 ? "text-amber-500" : "text-[#8A99AD]"
                          }`}
                        >
                          ₹{item.amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Outer capsule */}
                    <div
                      className={`h-4 rounded-full p-0.5 overflow-hidden border ${
                        darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                      }`}
                    >
                      {/* Inner animated bar with smooth 2.2s glide */}
                      <div
                        className={`h-full rounded-full transition-all duration-[2200ms] ease-out flex items-center justify-end pr-2 text-[9px] font-black text-white ${
                          item.amount > 0
                            ? "bg-linear-to-r from-amber-500 via-orange-500 to-emerald-500 shadow-xs"
                            : "bg-gray-300 dark:bg-gray-800"
                        }`}
                        style={{
                          width: animateChart ? `${displayPercent}%` : "0%",
                          transitionDelay: `${idx * 100}ms`,
                        }}
                      >
                        {item.amount > 0 && animateChart && (
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            ₹{item.amount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart Footer */}
          <div className="mt-8 pt-4 border-t border-inherit flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#8A99AD]">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Real-time MySQL synchronized verification.</span>
            </div>

            <button
              onClick={() => setActiveTab("wallet")}
              className="text-xs font-bold text-[#035BE3] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Withdraw to Bank</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: 2 Mini Charts & Visual Goal Widgets */}
        <div className="space-y-6">
          {/* Mini Widget 1: 2-Tier Split Donut / Ratio Bar */}
          <div
            className={`p-6 rounded-[28px] border ${
              darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <PieChart className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold">Bonus Commission Split</h3>
              </div>
              <span className="text-[10px] font-bold text-[#8A99AD] uppercase">Ratio</span>
            </div>

            <p className="text-xs text-[#8A99AD] mb-4">
              Breakdown between Direct Bonus vs Leadership Bonus.
            </p>

            {/* Split Progress bar */}
            <div className="h-3 rounded-full overflow-hidden flex bg-gray-200 dark:bg-gray-800 mb-3">
              <div
                className="bg-emerald-500 h-full transition-all duration-[2200ms] ease-out"
                style={{ width: animateChart ? `${directPct}%` : "0%" }}
                title={`Direct Bonus: ${directPct}%`}
              />
              <div
                className="bg-purple-500 h-full transition-all duration-[2200ms] ease-out"
                style={{ width: animateChart ? `${leadershipPct}%` : "0%" }}
                title={`Leadership Bonus: ${leadershipPct}%`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-inherit">
              <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <span className="text-[10px] font-bold text-emerald-500 block uppercase">🟢 Direct Bonus</span>
                <span className="text-sm font-black font-mono text-emerald-500">{directPct}%</span>
                <span className="text-[10px] text-[#8A99AD] block">₹{currentData?.direct?.toLocaleString("en-IN") || 0}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/10">
                <span className="text-[10px] font-bold text-purple-400 block uppercase">⭐ Leadership Bonus</span>
                <span className="text-sm font-black font-mono text-purple-400">{leadershipPct}%</span>
                <span className="text-[10px] text-[#8A99AD] block">₹{currentData?.leadership?.toLocaleString("en-IN") || 0}</span>
              </div>
            </div>
          </div>

          {/* Mini Widget 2: Monthly Milestone Goal Tracker */}
          <div
            className={`p-6 rounded-[28px] border relative overflow-hidden ${
              darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold">Monthly Milestone</h3>
              </div>
              <span className="text-xs font-black font-mono text-amber-500">{goalProgress}%</span>
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs text-[#8A99AD]">Current: ₹{animatedIncome.toLocaleString("en-IN")}</span>
              <span className="text-xs font-bold text-[#8A99AD]">Target: ₹10,000</span>
            </div>

            {/* Smooth Radial/Bar Goal Loader */}
            <div className="h-2.5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
              <div
                className="h-full bg-linear-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-[2400ms] ease-out"
                style={{ width: animateChart ? `${goalProgress}%` : "0%" }}
              />
            </div>

            <div className="mt-4 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-center gap-2.5 text-xs text-[#8A99AD]">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Reach ₹10,000 this month to unlock Top Earner leaderboard perks!</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Income Breakdown Table */}
      <div
        className={`rounded-[28px] border p-6 ${
          darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold">Recent Commission Log</h3>
            <p className="text-xs text-[#8A99AD] mt-0.5">
              Live breakdown of credited student enrollment commissions
            </p>
          </div>
          <button
            onClick={() => setActiveTab("referrals")}
            className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Network</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-inherit">
          <table className="w-full text-left text-xs">
            <thead
              className={`border-b ${
                darkMode ? "bg-[#0E1420] border-[#222B3D] text-[#8A99AD]" : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]"
              }`}
            >
              <tr>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Item Enrolled</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Student</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Bonus Type</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Package Price</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Commission Amount</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Date</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {analytics?.recentActivity?.length > 0 ? (
                analytics.recentActivity.map((r, i) => (
                  <tr
                    key={r.id || i}
                    className={`transition-colors ${
                      darkMode ? "hover:bg-[#1E2638]/50" : "hover:bg-amber-50/30"
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold">{r.title || "Course / Package"}</td>
                    <td className="py-3.5 px-4 text-[#8A99AD]">{r.student}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.tier.includes("Leadership") || r.tier.includes("Tier 2")
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        }`}
                      >
                        {r.tier.includes("Leadership") || r.tier.includes("Tier 2") ? "Leadership Bonus" : "Direct Bonus"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">₹{r.price.toLocaleString("en-IN")}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-black text-emerald-500">
                        +₹{r.amount.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#8A99AD]">
                      {r.date ? new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Credited</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#8A99AD]">
                    No commission entries recorded yet. Share your referral link to start earning!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
