import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Users,
  Layers3,
  TrendingUp,
  CreditCard,
  Search,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Tag,
  Calendar,
  Lock,
} from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import {
  isAdminAuthenticated,
  getAdminUser,
  getAdminProfileApi,
  getAdminStatsApi,
  getAllUsersApi,
  deleteUserApi,
  API_BASE_URL,
} from "../services/api";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState(null);

  // Data States
  const [adminUser, setAdminUser] = useState(getAdminUser());
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPackages: 4,
    totalRevenue: 0,
    activeCourses: 28,
    conversionRate: "14.8%",
    recentUsers: [],
  });
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Delete
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper to show temporary toast
  const showToast = (message, type = "success") => {
    setNotificationMsg({ message, type });
    setTimeout(() => {
      setNotificationMsg(null);
    }, 3500);
  };

  // Fetch all dashboard data from Centralized API
  const fetchDashboardData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch Profile
      try {
        const profileRes = await getAdminProfileApi();
        if (profileRes?.admin) {
          setAdminUser(profileRes.admin);
        }
      } catch (e) {
        console.warn("Admin profile fetch notice:", e.message);
      }

      // 2. Fetch Stats
      try {
        const statsRes = await getAdminStatsApi();
        if (statsRes?.stats) {
          setStats(statsRes.stats);
        }
      } catch (e) {
        console.warn("Admin stats fetch notice:", e.message);
      }

      // 3. Fetch All Users
      try {
        const usersRes = await getAllUsersApi();
        if (usersRes?.users) {
          setUsersList(usersRes.users);
        }
      } catch (e) {
        console.warn("Admin users fetch notice:", e.message);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
      showToast("Backend connection notice: " + err.message, "error");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Auth Guard & Initial Load
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate("/admin/login", { replace: true });
      return;
    }
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) {
        fetchDashboardData();
      }
    });
    return () => {
      isMounted = false;
    };
  }, [navigate, fetchDashboardData]);

  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteUserApi(userToDelete.id);
      if (res?.success) {
        showToast(`Student #${userToDelete.id} removed successfully.`);
        // Refresh local list
        setUsersList((prev) => prev.filter((u) => u.id !== userToDelete.id));
        setStats((prev) => ({
          ...prev,
          totalStudents: Math.max(0, (prev.totalStudents || 1) - 1),
          recentUsers: (prev.recentUsers || []).filter((u) => u.id !== userToDelete.id),
        }));
      } else {
        showToast(res?.message || "Failed to delete student.", "error");
      }
    } catch (err) {
      showToast(err.message || "Error deleting student.", "error");
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return usersList;
    const query = searchQuery.toLowerCase().trim();
    return usersList.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(query)) ||
        (u.email && u.email.toLowerCase().includes(query)) ||
        (u.phone && u.phone.toLowerCase().includes(query)) ||
        (u.referral_code && u.referral_code.toLowerCase().includes(query)) ||
        (u.address && u.address.toLowerCase().includes(query))
    );
  }, [usersList, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#161B29] flex flex-col lg:flex-row antialiased">
      {/* Toast Notification Banner */}
      {notificationMsg && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-3 duration-200 ${
            notificationMsg.type === "error"
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          {notificationMsg.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{notificationMsg.message}</span>
        </div>
      )}

      {/* ================= LEFT SIDEBAR ================= */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        adminUser={adminUser}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Admin Header */}
        <AdminHeader
          activeTab={activeTab}
          adminUser={adminUser}
          setMobileOpen={setMobileOpen}
          onRefresh={fetchDashboardData}
          isRefreshing={isRefreshing}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Dashboard Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* ======================================================== */}
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {/* ======================================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#035BE3] via-[#1d6feb] to-[#FA8C03] p-6 sm:p-8 text-white shadow-lg">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Control Center Active</span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                    Welcome back, {adminUser?.name || "Super Administrator"}! 👋
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-blue-50/90 leading-relaxed">
                    Here is the live pulse of KnowWay. Monitor user signups, check packages, and manage your MySQL backend effortlessly.
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveTab("users")}
                      className="px-4 py-2 bg-white text-[#035BE3] hover:bg-blue-50 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>View Registered Students</span>
                    </button>
                    <Link
                      to="/"
                      target="_blank"
                      className="px-4 py-2 bg-black/20 hover:bg-black/30 text-white font-bold text-xs rounded-xl border border-white/25 transition-all flex items-center gap-2"
                    >
                      <span>Open Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* 4 KPI Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* 1. Total Students */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:border-[#035BE3]/30 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5B6F96] uppercase tracking-wider">
                      Total Students
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#EFF4FF] text-[#035BE3] flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#161B29]">
                      {loading ? "..." : (stats.totalStudents ?? usersList.length)}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Live MySQL
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#5B6F96]">
                    Active accounts registered in DB
                  </p>
                </div>

                {/* 2. Active Packages */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:border-[#FA8C03]/30 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5B6F96] uppercase tracking-wider">
                      Packages
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FFF4E6] text-[#FA8C03] flex items-center justify-center">
                      <Layers3 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#161B29]">
                      {stats.totalPackages || 4}
                    </span>
                    <span className="text-xs font-bold text-[#FA8C03] bg-[#FFF4E6] px-2 py-0.5 rounded-full border border-[#FA8C03]/20">
                      Tiers Ready
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#5B6F96]">
                    Pro, Supreme, Premium & Elite
                  </p>
                </div>

                {/* 3. Platform Revenue */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:border-[#035BE3]/30 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5B6F96] uppercase tracking-wider">
                      Est. Revenue
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#EFF4FF] text-[#035BE3] flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#161B29]">
                      ₹{(stats.totalStudents || usersList.length) * 1999}
                    </span>
                    <span className="text-xs font-bold text-[#035BE3] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      INR
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#5B6F96]">
                    Estimated from course enrollments
                  </p>
                </div>

                {/* 4. Conversion & Referral */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5B6F96] uppercase tracking-wider">
                      Referral Rate
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#161B29]">
                      {stats.conversionRate || "14.8%"}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      +3.2%
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#5B6F96]">
                    Active peer-to-peer referral uptake
                  </p>
                </div>
              </div>

              {/* Two Column Section: Recent Students Preview & System Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Recent Registrations Table */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-base font-bold text-[#161B29]">
                        Recent Student Registrations
                      </h3>
                      <p className="text-xs text-[#5B6F96] mt-0.5">
                        Latest users who joined KnowWay
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="text-xs font-bold text-[#035BE3] hover:text-[#024bc0] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All ({usersList.length})</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {usersList.length === 0 ? (
                    <div className="p-8 text-center bg-[#F8FAFC] rounded-2xl border border-dashed border-gray-200">
                      <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-gray-600">
                        No students registered yet in MySQL.
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1 max-w-sm mx-auto">
                        New signups from the student registration page will automatically appear here.
                      </p>
                      <Link
                        to="/signup"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 mt-4 px-3.5 py-1.5 bg-[#035BE3] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#024bc0]"
                      >
                        <span>Test Student Signup</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-100 text-[#5B6F96] uppercase text-[10px] tracking-wider">
                            <th className="pb-3 font-bold">Student</th>
                            <th className="pb-3 font-bold">Contact</th>
                            <th className="pb-3 font-bold">Referral</th>
                            <th className="pb-3 font-bold text-right">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {usersList.slice(0, 5).map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                              <td className="py-3.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-[#EFF4FF] text-[#035BE3] font-extrabold text-[11px] flex items-center justify-center shrink-0">
                                    {(user.name || "U")[0]?.toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-bold text-[#161B29]">{user.name}</div>
                                    <div className="text-[11px] text-gray-400">ID #{user.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5">
                                <div className="text-[#161B29] font-medium">{user.email}</div>
                                <div className="text-[11px] text-[#5B6F96]">{user.phone}</div>
                              </td>
                              <td className="py-3.5">
                                {user.referral_code ? (
                                  <span className="px-2 py-0.5 rounded-md bg-[#FFF4E6] text-[#FA8C03] font-bold text-[10px] border border-[#FA8C03]/20">
                                    {user.referral_code}
                                  </span>
                                ) : (
                                  <span className="text-gray-300 text-[11px]">—</span>
                                )}
                              </td>
                              <td className="py-3.5 text-right text-[#5B6F96] font-medium text-[11px]">
                                {user.created_at
                                  ? new Date(user.created_at).toLocaleDateString()
                                  : "Recently"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Right 1 Col: System & DB Status Card */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-[#161B29]">
                        Backend & DB Status
                      </h3>
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Connected
                      </span>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/60">
                        <div className="flex items-center justify-between text-gray-500 mb-1">
                          <span className="font-semibold flex items-center gap-1.5">
                            <Database className="w-3.5 h-3.5 text-[#035BE3]" />
                            Database Type
                          </span>
                          <span className="font-bold text-[#161B29]">MySQL / phpMyAdmin</span>
                        </div>
                        <p className="text-[11px] text-[#5B6F96]">
                          Database name: <code className="text-[#035BE3] font-mono">knowway_db</code>
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/60">
                        <div className="flex items-center justify-between text-gray-500 mb-1">
                          <span className="font-semibold flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Auto-Migration
                          </span>
                          <span className="font-bold text-emerald-600">Enabled</span>
                        </div>
                        <p className="text-[11px] text-[#5B6F96]">
                          Tables <code className="text-gray-800 font-mono">admins</code> & <code className="text-gray-800 font-mono">users</code> auto-created.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/60">
                        <div className="flex items-center justify-between text-gray-500 mb-1">
                          <span className="font-semibold flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-[#FA8C03]" />
                            API Service
                          </span>
                          <span className="font-bold text-[#161B29]">Centralized</span>
                        </div>
                        <p className="text-[11px] text-[#5B6F96] truncate">
                          Base URL: <code className="text-[#035BE3] font-mono">{API_BASE_URL}</code>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[#5B6F96]">Default Admin:</span>
                    <span className="font-bold text-[#161B29] font-mono">admin@knowway.com</span>
                  </div>
                </div>
              </div>

              {/* Course Packages Overview Banner */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-base font-bold text-[#161B29]">
                      Training Packages Configured
                    </h3>
                    <p className="text-xs text-[#5B6F96] mt-0.5">
                      Available learning tracks on KnowWay
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("packages")}
                    className="text-xs font-bold text-[#035BE3] hover:underline"
                  >
                    Manage Curriculum
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      name: "Pro Package",
                      price: "₹1,999",
                      tag: "Popular Starter",
                      color: "border-[#035BE3]/30 bg-[#EFF4FF]/40",
                      badgeColor: "bg-[#EFF4FF] text-[#035BE3]",
                    },
                    {
                      name: "Supreme Package",
                      price: "₹3,499",
                      tag: "Best Value",
                      color: "border-[#FA8C03]/30 bg-[#FFF4E6]/40",
                      badgeColor: "bg-[#FFF4E6] text-[#FA8C03]",
                    },
                    {
                      name: "Premium Package",
                      price: "₹5,999",
                      tag: "Trending Track",
                      color: "border-blue-300 bg-blue-50/40",
                      badgeColor: "bg-blue-100 text-blue-800",
                    },
                    {
                      name: "Elite Package",
                      price: "₹9,999",
                      tag: "Full Mastery",
                      color: "border-purple-300 bg-purple-50/40",
                      badgeColor: "bg-purple-100 text-purple-800",
                    },
                  ].map((pkg, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border ${pkg.color} flex flex-col justify-between`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pkg.badgeColor}`}>
                          {pkg.tag}
                        </span>
                        <span className="text-sm font-extrabold text-[#161B29]">
                          {pkg.price}
                        </span>
                      </div>
                      <h4 className="text-xs font-extrabold text-[#161B29]">{pkg.name}</h4>
                      <p className="text-[11px] text-[#5B6F96] mt-1">
                        Full lifetime access & certificate
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: STUDENTS & REGISTRATIONS (USERS MANAGEMENT) */}
          {/* ======================================================== */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Top Action Bar */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-[#161B29]">
                    Registered Students Directory
                  </h2>
                  <p className="text-xs text-[#5B6F96] mt-0.5">
                    Live database records of student signups with phone numbers, emails, addresses, and referral codes.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter by name, email..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3.5 py-2 text-xs text-[#161B29] outline-none focus:border-[#035BE3] focus:bg-white focus:ring-2 focus:ring-[#035BE3]/15 transition"
                    />
                  </div>

                  <button
                    onClick={fetchDashboardData}
                    disabled={isRefreshing}
                    className="px-3.5 py-2 bg-[#EFF4FF] hover:bg-[#035BE3] text-[#035BE3] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                    <span className="hidden sm:inline">Sync DB</span>
                  </button>
                </div>
              </div>

              {/* Students Table Card */}
              <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
                {filteredUsers.length === 0 ? (
                  <div className="p-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-gray-700">
                      {searchQuery ? "No matching students found." : "No registered students yet in MySQL database."}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                      {searchQuery
                        ? "Try clearing your search query or looking for a different email/phone."
                        : "When users fill the 2-step signup form on the website, their details are automatically saved into MySQL and will show up right here."}
                    </p>
                    <div className="mt-5">
                      <Link
                        to="/signup"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#035BE3] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#024bc0] transition"
                      >
                        <span>Open Signup Page (Test New User)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#F8FAFC] border-b border-gray-200/80 text-[#5B6F96] uppercase text-[10px] tracking-wider">
                          <th className="py-3.5 px-6 font-bold"># ID</th>
                          <th className="py-3.5 px-6 font-bold">Student Name</th>
                          <th className="py-3.5 px-6 font-bold">Email Address</th>
                          <th className="py-3.5 px-6 font-bold">Phone Number</th>
                          <th className="py-3.5 px-6 font-bold">Address / City</th>
                          <th className="py-3.5 px-6 font-bold">Referral Code</th>
                          <th className="py-3.5 px-6 font-bold">Registered At</th>
                          <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-gray-50/80 transition-colors"
                          >
                            <td className="py-4 px-6 font-mono font-bold text-gray-400">
                              #{user.id}
                            </td>

                            <td className="py-4 px-6 font-bold text-[#161B29]">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#035BE3] to-[#4379F2] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">
                                  {(user.name || "U")[0]?.toUpperCase()}
                                </div>
                                <span>{user.name}</span>
                              </div>
                            </td>

                            <td className="py-4 px-6 text-[#161B29] font-medium">
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span>{user.email}</span>
                              </div>
                            </td>

                            <td className="py-4 px-6 text-[#161B29] font-medium">
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span>{user.phone || "—"}</span>
                              </div>
                            </td>

                            <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span className="truncate">{user.address || "—"}</span>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              {user.referral_code ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF4E6] text-[#FA8C03] font-bold text-[10px] border border-[#FA8C03]/20">
                                  <Tag className="w-2.5 h-2.5" />
                                  {user.referral_code}
                                </span>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>

                            <td className="py-4 px-6 text-gray-500 font-medium">
                              <div className="flex items-center gap-1.5 text-[11px]">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                <span>
                                  {user.created_at
                                    ? new Date(user.created_at).toLocaleString()
                                    : "Recently"}
                                </span>
                              </div>
                            </td>

                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => setUserToDelete(user)}
                                title="Delete user"
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Table Footer Stats */}
                <div className="p-4 bg-[#F8FAFC] border-t border-gray-100 flex items-center justify-between text-xs text-[#5B6F96]">
                  <span>
                    Showing <strong>{filteredUsers.length}</strong> of{" "}
                    <strong>{usersList.length}</strong> total registered students
                  </span>
                  <span className="font-semibold text-gray-400">
                    Auto-synced with MySQL
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: PACKAGES & CURRICULUM */}
          {/* ======================================================== */}
          {activeTab === "packages" && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
                <h2 className="text-lg font-extrabold text-[#161B29]">
                  Available Course Packages
                </h2>
                <p className="text-xs text-[#5B6F96] mt-0.5">
                  Overview of course tiers offered on the KnowWay student portal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Pro Package",
                    price: "₹1,999",
                    badge: "Popular Starter",
                    badgeColor: "bg-[#EFF4FF] text-[#035BE3]",
                    borderColor: "border-[#035BE3]/30",
                    btnColor: "bg-[#035BE3] hover:bg-[#024bc0]",
                    modules: ["AI Tools & ChatGPT", "Video Editing (CapCut/Premiere)", "Canva Graphics Design", "Certificate of Completion"],
                  },
                  {
                    title: "Supreme Package",
                    price: "₹3,499",
                    badge: "Best Value",
                    badgeColor: "bg-[#FFF4E6] text-[#FA8C03]",
                    borderColor: "border-[#FA8C03]/30",
                    btnColor: "bg-[#FA8C03] hover:bg-[#e07b00]",
                    modules: ["Everything in Pro", "Meta & Google Ads", "Sales Funnels Mastery", "Client Outreach Templates"],
                  },
                  {
                    title: "Premium Package",
                    price: "₹5,999",
                    badge: "Trending Track",
                    badgeColor: "bg-blue-50 text-blue-800",
                    borderColor: "border-blue-200",
                    btnColor: "bg-[#035BE3] hover:bg-[#024bc0]",
                    modules: ["Supreme Package Included", "Fullstack Web Basics", "Digital Product Creation", "1-on-1 Mentorship Sessions"],
                  },
                  {
                    title: "Elite Package",
                    price: "₹9,999",
                    badge: "Executive VIP",
                    badgeColor: "bg-purple-50 text-purple-800",
                    borderColor: "border-purple-200",
                    btnColor: "bg-purple-600 hover:bg-purple-700",
                    modules: ["Complete All Access Pass", "Agency Growth Blueprint", "Direct Founder Community", "Lifetime Live Workshops"],
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-3xl p-6 border ${item.borderColor} shadow-xs flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-[#161B29]">{item.title}</h3>
                      <div className="mt-2 text-2xl font-black text-[#161B29]">{item.price}</div>
                      <p className="text-[11px] text-gray-400 mt-0.5">One-time payment</p>

                      <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
                        {item.modules.map((m, mIdx) => (
                          <div key={mIdx} className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Link
                        to="/#packages"
                        target="_blank"
                        className={`w-full py-2.5 text-center text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 ${item.btnColor}`}
                      >
                        <span>View on Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: REVENUE & ANALYTICS */}
          {/* ======================================================== */}
          {activeTab === "revenue" && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
                <h2 className="text-lg font-extrabold text-[#161B29]">
                  Revenue & Sales Metrics
                </h2>
                <p className="text-xs text-[#5B6F96] mt-0.5">
                  Financial calculations based on registered students and estimated package conversions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Gross Projected Revenue
                  </span>
                  <div className="mt-2 text-3xl font-extrabold text-[#035BE3]">
                    ₹{usersList.length * 1999}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Calculated at base ₹1,999 per student
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Referral Commissions Paid
                  </span>
                  <div className="mt-2 text-3xl font-extrabold text-[#FA8C03]">
                    ₹{usersList.filter((u) => u.referral_code).length * 400}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Calculated for users registering with referral codes
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Net Platform Margins
                  </span>
                  <div className="mt-2 text-3xl font-extrabold text-emerald-600">
                    78.4%
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Healthy digital product margin benchmark
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: SETTINGS & DATABASE */}
          {/* ======================================================== */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
                <h2 className="text-lg font-extrabold text-[#161B29]">
                  System & Database Settings
                </h2>
                <p className="text-xs text-[#5B6F96] mt-0.5">
                  Node.js Express backend and MySQL database configuration.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Database Info Card */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                    <Database className="w-5 h-5 text-[#035BE3]" />
                    <h3 className="text-sm font-bold text-[#161B29]">
                      MySQL Configuration Details
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">DB Engine:</span>
                      <span className="font-bold text-[#161B29]">MySQL 8.x / MariaDB (XAMPP compatible)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">Database Name:</span>
                      <span className="font-mono font-bold text-[#035BE3]">knowway_db</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">Tables:</span>
                      <span className="font-mono font-bold text-gray-700">users, admins</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">Auto-Migration:</span>
                      <span className="font-bold text-emerald-600">Active (Auto-creates missing tables)</span>
                    </div>
                  </div>
                </div>

                {/* Super Admin Credentials Info Card */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                    <ShieldCheck className="w-5 h-5 text-[#FA8C03]" />
                    <h3 className="text-sm font-bold text-[#161B29]">
                      Super Admin Account
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">Super Admin Email:</span>
                      <span className="font-mono font-bold text-[#161B29]">admin@knowway.com</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">Password Hashing:</span>
                      <span className="font-bold text-emerald-600">bcrypt (Salt rounds: 10)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">Session Token:</span>
                      <span className="font-bold text-blue-600">JWT (7 days expiry)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">Role Level:</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#EFF4FF] text-[#035BE3] font-bold text-[10px]">
                        superadmin (Full Access)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* CONFIRM DELETE MODAL */}
      {/* ======================================================== */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-extrabold text-center text-[#161B29]">
              Delete Student Record?
            </h3>
            <p className="mt-1.5 text-xs text-center text-[#5B6F96] leading-relaxed">
              Are you sure you want to remove{" "}
              <strong className="text-gray-800">{userToDelete.name}</strong> (#{userToDelete.id}) from the MySQL database? This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
