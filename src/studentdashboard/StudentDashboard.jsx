import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Award,
  Tag,
  Play,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  X,
  Sparkles,
  ArrowRight,
  User,
  Flame,
  Zap,
  GraduationCap,
  Globe,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Layers3,
  ExternalLink,
  ShieldCheck,
  ArrowUpRight,
  Compass,
  Filter,
  Search,
  ShoppingCart,
  Lock,
  Unlock,
} from "lucide-react";
import StudentSidebar from "./components/StudentSidebar";
import StudentHeader from "./components/StudentHeader";
import CertificateModal from "./components/CertificateModal";
import CourseQuizModal from "./components/CourseQuizModal";
import {
  getUserData,
  isUserAuthenticated,
  getCoursesApi,
  getMyCoursesApi,
  getMyCertificatesApi,
  getMyPackagesApi,
  setUserSession,
} from "../services/api";

export default function StudentDashboard() {
  const navigate = useNavigate();

  // Theme & Layout States
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'all_courses' | 'courses' | 'packages' | 'upgrade' | 'certificates' | 'profile'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedStudentId, setCopiedStudentId] = useState(false);
  const [certificateModal, setCertificateModal] = useState(null);
  const [selectedQuizCourse, setSelectedQuizCourse] = useState(null);
  const [certificatesList, setCertificatesList] = useState([]);

  // Packages States (Purchased & Upgrade Options)
  const [myPackages, setMyPackages] = useState([]);
  const [upgradePackages, setUpgradePackages] = useState([]);
  const [allPackagesList, setAllPackagesList] = useState([]);

  // User & Data States
  const [user, setUser] = useState(getUserData());

  const handleCopyStudentId = () => {
    const idVal = user?.student_id || (user?.id ? `KW-2026-${String(user.id).padStart(4, "0")}` : "KW-2026-STUDENT");
    navigator.clipboard.writeText(idVal);
    setCopiedStudentId(true);
    setTimeout(() => setCopiedStudentId(false), 2000);
  };
  const [courses, setCourses] = useState([]); // Enrolled Courses
  const [allCourses, setAllCourses] = useState([]); // All Platform Courses
  const [loading, setLoading] = useState(true);

  // Dynamic Progress Calculation from LocalStorage or DB
  const getCourseProgress = useCallback(
    (c) => {
      try {
        const cid = c.slug || c.id;
        const key1 = `knowway_progress_${user?.id || "guest"}_${cid}`;
        const key2 = `knowway_progress_${user?.id || "guest"}_${c.id}`;
        const raw = localStorage.getItem(key1) || localStorage.getItem(key2);
        if (raw) {
          const completed = JSON.parse(raw);
          if (Array.isArray(completed) && completed.length > 0) {
            let totalLectures = 0;
            if (Array.isArray(c.modules)) {
              c.modules.forEach((m) => {
                totalLectures += (m.lectures?.length || 4);
              });
            }
            if (!totalLectures) totalLectures = 10;
            const pct = Math.min(100, Math.round((completed.length / totalLectures) * 100));
            return Math.max(5, pct);
          }
        }
      } catch (_) {}
      return 0;
    },
    [user?.id]
  );

  // Dynamic Watching Courses (calculated from real student enrollment & lecture progress)
  const watchingCourses = useMemo(() => {
    if (courses && courses.length > 0) {
      return courses.map((c) => ({
        id: c.id,
        title: c.title,
        mentor: c.mentor_name || c.mentor || "KnowWay Mentor",
        mentorRole: c.category || "Masterclass",
        progress: getCourseProgress(c),
        thumbnail:
          c.thumbnail_url ||
          c.thumbnail ||
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
        slug: c.slug || c.id,
        isEnrolled: true,
      }));
    }
    // Fallback if no course enrolled yet: show catalog starter courses
    return (allCourses.length > 0 ? allCourses.slice(0, 3) : []).map((c) => ({
      id: c.id,
      title: c.title,
      mentor: c.mentor_name || c.mentor || "KnowWay Mentor",
      mentorRole: c.category || "Masterclass",
      progress: 0,
      thumbnail:
        c.thumbnail_url ||
        c.thumbnail ||
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
      slug: c.slug || c.id,
      isEnrolled: false,
    }));
  }, [courses, allCourses, getCourseProgress]);

  // Dynamic Premium Flagship Courses (loaded from live database)
  const premiumCoursesList = useMemo(() => {
    return allCourses.length > 0 ? allCourses : courses;
  }, [allCourses, courses]);

  // Overall student average learning progress
  const averageProgress = useMemo(() => {
    if (!courses || courses.length === 0) return 0;
    const sum = courses.reduce((acc, c) => acc + getCourseProgress(c), 0);
    return Math.round(sum / courses.length);
  }, [courses, getCourseProgress]);

    // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync user data & authentication check
  useEffect(() => {
    if (!isUserAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
    const current = getUserData();
    setUser(current);
    if (current) {
      setProfileForm({
        name: current.name || "",
        email: current.email || "",
        phone: current.phone || "",
        address: current.address || "",
      });
    }
  }, [navigate]);

  // Fetch Courses (Enrolled & All Courses)
  const loadCourses = async () => {
    setIsRefreshing(true);
    try {
      const res = await getMyCoursesApi();
      if (res?.success) {
        setCourses(res.enrolled_courses || []);
        setAllCourses(res.all_courses || []);
      } else {
        const fallRes = await getCoursesApi();
        if (fallRes?.success && Array.isArray(fallRes.courses)) {
          setCourses([]);
          setAllCourses(fallRes.courses);
        }
      }
    } catch (err) {
      console.warn("Could not load my courses:", err.message);
      try {
        const fallRes = await getCoursesApi();
        if (fallRes?.success && Array.isArray(fallRes.courses)) {
          setCourses([]);
          setAllCourses(fallRes.courses);
        }
      } catch (_) {}
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch Certificates (DB + LocalStorage)
  const loadCertificates = async () => {
    try {
      let dbCerts = [];
      try {
        const res = await getMyCertificatesApi();
        if (res?.success && Array.isArray(res.certificates)) {
          dbCerts = res.certificates;
        }
      } catch (_) {}

      // Scan local storage for user awarded certificates
      const localCerts = [];
      try {
        const userId = user?.id || "guest";
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(`knowway_certificate_${userId}_`)) {
            const raw = localStorage.getItem(key);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed && (parsed.certificate_number || parsed.course_title)) {
                localCerts.push(parsed);
              }
            }
          }
        }
      } catch (_) {}

      // Merge unique
      const seen = new Set();
      const merged = [];
      [...localCerts, ...dbCerts].forEach((item) => {
        const uniqueKey = item.certificate_number || item.course_title || item.id;
        if (uniqueKey && !seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          merged.push(item);
        }
      });
      setCertificatesList(merged);
    } catch (err) {
      console.warn("Could not load certificates:", err.message);
    }
  };

  // Fetch Purchased & Upgrade Packages
  const loadMyPackages = async () => {
    try {
      const res = await getMyPackagesApi();
      if (res?.success) {
        setMyPackages(res.purchased_packages || []);
        setUpgradePackages(res.upgrade_packages || []);
        setAllPackagesList(res.all_packages || []);
      }
    } catch (err) {
      console.warn("Could not load packages:", err.message);
    }
  };

  useEffect(() => {
    loadCourses();
    loadCertificates();
    loadMyPackages();
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = { ...user, ...profileForm };
    setUserSession(localStorage.getItem("knowway_user_token"), updated);
    setUser(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Filtered enrolled courses for "My Courses" tab
  const filteredEnrolledCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const q = searchQuery.toLowerCase();
    return courses.filter(
      (c) =>
        c.title?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.languages?.toLowerCase().includes(q) ||
        c.mentor_name?.toLowerCase().includes(q)
    );
  }, [courses, searchQuery]);

  // Filtered all courses for "All Courses" tab
  const filteredAllCourses = useMemo(() => {
    let list = allCourses.length > 0 ? allCourses : courses;
    if (selectedCategory !== "all") {
      list = list.filter((c) =>
        c.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q) ||
          c.languages?.toLowerCase().includes(q) ||
          c.mentor_name?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allCourses, courses, selectedCategory, searchQuery]);

  const filteredCourses = filteredAllCourses;

  if (!user) return null;

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "S";

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-200 relative isolate ${
        darkMode ? "dark bg-[#0B0F17] text-[#E2E8F0]" : "bg-[#FBFCFF] text-[#161B29]"
      }`}
    >
      {/* ================= BLUEPRINT GRID BACKGROUND ================= */}
      <div
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          backgroundImage: darkMode
            ? `linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)`
            : `linear-gradient(to right, rgba(91,111,150,.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(91,111,150,.07) 1px, transparent 1px)`,
          backgroundSize: "118px 108px",
        }}
      />

      {/* Radial Soft Fade */}
      <div
        className={`pointer-events-none fixed inset-0 -z-10 ${darkMode
          ? "bg-[radial-gradient(circle_at_top,rgba(3,91,227,0.12)_0%,rgba(11,15,23,0.92)_70%)]"
          : "bg-[radial-gradient(circle_at_center,rgba(251,252,255,0.30)_0%,rgba(251,252,255,0.55)_45%,rgba(251,252,255,0.96)_100%)]"
          }`}
      />

      {/* Floating Soft Color Rings */}
      <div
        className={`pointer-events-none fixed -left-[80px] top-[140px] -z-10 hidden lg:block h-[340px] w-[340px] rounded-full border-[65px] ${darkMode ? "border-[#035BE3]/10" : "border-[#E4EDFF]"
          }`}
      />
      <div
        className={`pointer-events-none fixed -right-[80px] bottom-[120px] -z-10 hidden lg:block h-[300px] w-[300px] rounded-full border-[60px] ${darkMode ? "border-purple-900/20" : "border-[#EDE4FF]"
          }`}
      />

      {/* Hero Colored Accent Dots */}
      <div className="pointer-events-none fixed left-[18%] top-[14%] -z-10 hidden lg:block h-[11px] w-[11px] rounded-full bg-[#FF985D] opacity-85" />
      <div className="pointer-events-none fixed right-[14%] top-[28%] -z-10 hidden lg:block h-[12px] w-[12px] rounded-full bg-[#6D5CE7] opacity-85" />
      <div className="pointer-events-none fixed bottom-[20%] left-[24%] -z-10 hidden lg:block h-[10px] w-[10px] rounded-full bg-[#FFCE57] opacity-85" />
      <div className="pointer-events-none fixed right-[28%] bottom-[15%] -z-10 hidden lg:block h-[10px] w-[10px] rounded-full bg-[#035BE3] opacity-70" />

      {/* ================= 1. MODULAR STUDENT SIDEBAR ================= */}
      <StudentSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        coursesCount={courses.length}
        allCoursesCount={allCourses.length}
        packagesCount={myPackages.length}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        darkMode={darkMode}
      />

      {/* ================= 2. FULL WIDTH MAIN CONTENT AREA ================= */}
      <div className="lg:pl-[292px] min-h-screen flex flex-col transition-all duration-300 w-full">

        {/* Modular Sticky Fixed Header */}
        <StudentHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          setMobileOpen={setMobileOpen}
          onRefresh={loadCourses}
          isRefreshing={isRefreshing}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* ================= 3. RICH DIVERSE TAB CONTENT ================= */}
        <main className="flex-1 px-4 sm:px-8 lg:px-10 py-5 sm:py-7 space-y-8 w-full">

          {/* ======================================================== */}
          {/* TAB 1: LEARNING HUB / OVERVIEW */}
          {/* ======================================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 w-full">

              {/* Top Welcome Title */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center text-xl sm:text-2xl font-bold shrink-0">
                    {userInitial}
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
                      <span>Welcome! {user.name}</span>
                      <span className="inline-block animate-bounce">👋</span>
                    </h1>
                    <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#556377]"}`}>
                      Learn something new everyday.. Pick up where you left off or unlock high-income tracks.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Clean, Modern Focus Times Badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold ${darkMode
                      ? "bg-[#1A2234] text-[#94A3B8]"
                      : "bg-[#F4F6FB] text-[#556377]"
                      }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span>Focus Times: When People Like You Learn</span>
                  </div>

                  <button
                    onClick={() => setActiveTab("courses")}
                    className="px-5 py-2.5 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>My Courses</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* ================= DYNAMIC STUDENT METRICS STATS BAR ================= */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stat 1: Enrolled Courses */}
                <div
                  onClick={() => setActiveTab("courses")}
                  className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition hover:scale-[1.01] flex items-center justify-between ${
                    darkMode
                      ? "bg-[#131926] border-[#222B3D] text-white hover:border-[#035BE3]"
                      : "bg-white border-[#E2E8F0] text-[#0F172A] shadow-xs hover:border-[#035BE3]"
                  }`}
                >
                  <div className="space-y-1">
                    <p className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Enrolled Courses
                    </p>
                    <h3 className="text-xl sm:text-2xl font-black text-[#035BE3]">{courses.length}</h3>
                    <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                      <span>● Unlocked & Active</span>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>

                {/* Stat 2: Active Package */}
                <div
                  onClick={() => setActiveTab("packages")}
                  className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition hover:scale-[1.01] flex items-center justify-between ${
                    darkMode
                      ? "bg-[#131926] border-[#222B3D] text-white hover:border-amber-500"
                      : "bg-white border-[#E2E8F0] text-[#0F172A] shadow-xs hover:border-amber-500"
                  }`}
                >
                  <div className="space-y-1 min-w-0 pr-2">
                    <p className={`text-[11px] font-bold uppercase tracking-wider truncate ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Active Package
                    </p>
                    <h3 className="text-base sm:text-lg font-black text-amber-500 truncate">
                      {myPackages[0]?.package_name || "Starter Track"}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold truncate">
                      {myPackages.length > 0 ? "Lifetime Access" : "Upgrade to unlock all"}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>

                {/* Stat 3: Certificates */}
                <div
                  onClick={() => setActiveTab("certificates")}
                  className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition hover:scale-[1.01] flex items-center justify-between ${
                    darkMode
                      ? "bg-[#131926] border-[#222B3D] text-white hover:border-emerald-500"
                      : "bg-white border-[#E2E8F0] text-[#0F172A] shadow-xs hover:border-emerald-500"
                  }`}
                >
                  <div className="space-y-1">
                    <p className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Certificates
                    </p>
                    <h3 className="text-xl sm:text-2xl font-black text-emerald-500">{certificatesList.length}</h3>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      {certificatesList.length > 0 ? "Verified Credentials" : "Pass test to claim"}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                </div>

                {/* Stat 4: Learning Progress */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between ${
                    darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A] shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Overall Progress
                    </p>
                    <span className="text-xs font-black text-[#035BE3]">{averageProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden my-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, averageProgress)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Student ID: <strong className="text-slate-700 dark:text-slate-300">{user?.student_id || ('KW' + (user?.id || '2000'))}</strong></span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyStudentId();
                      }}
                      className="text-[#035BE3] hover:underline font-bold cursor-pointer"
                    >
                      {copiedStudentId ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              {/* ================= SECTION 1: PREMIUM COURSES SLIDER CAROUSEL ================= */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${darkMode ? "bg-[#1A2234] text-amber-400" : "bg-[#F4F6FB] text-[#FA8C03]"
                        }`}
                    >
                      <Flame size={18} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold">Premium Courses</h2>
                      <p className={`text-xs ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        Handpicked flagship bootcamps led by industry leaders
                      </p>
                    </div>
                  </div>

                  {/* Slider Controls + View All */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 mr-2">
                      <button
                        type="button"
                        onClick={() => {
                          const slider = document.getElementById("premium-courses-slider");
                          if (slider) slider.scrollBy({ left: -340, behavior: "smooth" });
                        }}
                        aria-label="Previous Courses"
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition cursor-pointer ${
                          darkMode
                            ? "bg-[#131926] border-[#222B3D] text-[#94A3B8] hover:text-white hover:border-[#035BE3]"
                            : "bg-white border-[#E2E8F0] text-[#556377] hover:text-[#035BE3] hover:border-[#035BE3]"
                        }`}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const slider = document.getElementById("premium-courses-slider");
                          if (slider) slider.scrollBy({ left: 340, behavior: "smooth" });
                        }}
                        aria-label="Next Courses"
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition cursor-pointer ${
                          darkMode
                            ? "bg-[#131926] border-[#222B3D] text-[#94A3B8] hover:text-white hover:border-[#035BE3]"
                            : "bg-white border-[#E2E8F0] text-[#556377] hover:text-[#035BE3] hover:border-[#035BE3]"
                        }`}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <Link
                      to="/courses"
                      className="text-xs font-bold text-[#035BE3] hover:underline flex items-center gap-1 no-underline"
                    >
                      <span>View All</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Smooth Horizontal Scroll Slider Container */}
                <div
                  id="premium-courses-slider"
                  className="flex gap-5 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {(courses.length > 0 ? courses : premiumCoursesList).map((course) => {
                    const courseId = course.slug || course.id;
                    const mentorName = course.mentor_name || course.mentor || "KnowWay Mentor";
                    const mentorRole = course.category || "Masterclass";
                    const mentorPhoto = course.mentor_photo || course.photo_url || null;
                    const mentorInitial = mentorName ? mentorName.charAt(0).toUpperCase() : "M";

                    return (
                      <Link
                        key={course.id}
                        to={`/courses/${courseId}`}
                        className={`min-w-[270px] sm:min-w-[290px] md:min-w-[300px] max-w-[300px] shrink-0 snap-start group transition-all duration-200 flex flex-col justify-between no-underline ${
                          darkMode ? "text-[#E2E8F0]" : "text-[#161B29]"
                        }`}
                      >
                        {/* Only image is rounded */}
                        <div>
                          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[10px] bg-[#1E2638]">
                            <img
                              src={
                                course.thumbnail_url ||
                                course.thumbnail ||
                                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"
                              }
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {course.category && (
                              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                                {course.category}
                              </div>
                            )}
                            {course.duration && (
                              <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#035BE3] text-white text-[9.5px] font-semibold flex items-center gap-1">
                                <Clock size={10} />
                                <span>{course.duration}</span>
                              </div>
                            )}
                          </div>

                          {/* Text under image */}
                          <div className="pt-3 px-0.5">
                            <h3 className="text-sm font-bold line-clamp-2 leading-snug group-hover:text-[#035BE3] transition-colors">
                              {course.title}
                            </h3>

                            {/* Mentor with Image / Avatar */}
                            <div className="mt-2.5 flex items-center gap-2.5">
                              {mentorPhoto ? (
                                <img
                                  src={mentorPhoto}
                                  alt={mentorName}
                                  className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-200 dark:border-gray-700"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#035BE3] font-bold text-xs flex items-center justify-center shrink-0">
                                  {mentorInitial}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-semibold truncate leading-none">
                                  {mentorName}
                                </p>
                                <p className={`text-[10.5px] truncate mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                                  {mentorRole}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Languages / Meta info below */}
                        <div className="pt-2 px-0.5 mt-2 flex items-center justify-between text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">
                          <span className="flex items-center gap-1 truncate max-w-[190px]">
                            <Globe size={12} className="text-[#035BE3] shrink-0" />
                            <span className="truncate">{course.languages || "Hindi, English"}</span>
                          </span>
                          <span className="text-[#035BE3] font-bold flex items-center gap-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform">
                            <span>View</span>
                            <ArrowRight size={12} />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* ================= SECTION 2: PRO FAST-TRACK BANNER ================= */}
              <div
                className={`rounded-[32px] p-6 sm:p-8 border flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden ${darkMode
                  ? "bg-gradient-to-r from-blue-950/70 via-[#131926] to-[#0B0F17] border-[#222B3D]"
                  : "bg-gradient-to-r from-blue-100 via-[#F3F7FF] to-amber-100 border-[#CCE0FF]"
                  }`}
              >
                <div className="flex items-center gap-4 sm:gap-5 max-w-2xl">
                  <div className="w-14 h-14 rounded-2xl bg-[#035BE3] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#035BE3]/25">
                    <Zap size={28} />
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full bg-blue-200/80 dark:bg-blue-900/80 text-[#035BE3] dark:text-blue-200 font-bold text-[10px] uppercase tracking-wider">
                      Pro Acceleration Track
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold mt-1 !text-[#0F172A] !dark:text-white">
                      Ready to Start Your Digital Journey?
                    </h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#475569]"}`}>
                      You're just one click away from unlocking all masterclasses, live mentor doubt sessions & accredited career certificates.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href="/#packages"
                    className="px-6 py-3 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer no-underline shadow-md shadow-[#035BE3]/30"
                  >
                    <span>Upgrade Now!</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>

              {/* ================= SECTION 3: COURSES YOU ARE WATCHING ================= */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${darkMode ? "bg-[#1A2234] text-[#035BE3]" : "bg-[#F4F6FB] text-[#035BE3]"
                        }`}
                    >
                      <Play size={16} fill="currentColor" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold">Courses You Are Watching</h2>
                      <p className={`text-xs ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        Resume instantly from your last saved lecture
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[#64748B]">
                    {watchingCourses.length} In Progress
                  </span>
                </div>

                {/* Watching List Grid (3 per row) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {watchingCourses.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-[22px] p-3 transition-all duration-200 flex items-center gap-3.5 ${
                        darkMode ? "bg-[#131926]/40" : "bg-slate-50/70"
                      }`}
                    >
                      {/* Thumbnail with Play Overlay */}
                      <div className="relative w-20 h-20 rounded-[10px] overflow-hidden shrink-0 bg-[#1E2638] group">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <Link
                          to={`/courses/${item.slug}`}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-90 group-hover:opacity-100 transition no-underline"
                        >
                          <Play size={18} fill="currentColor" />
                        </Link>
                      </div>

                      {/* Content & Progress */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold truncate">{item.title}</h4>
                        <p className={`text-[11px] truncate mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#556377]"}`}>
                          {item.mentor} <span className="text-[10px] text-[#8A99AD]">({item.mentorRole})</span>
                        </p>

                        <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-[#64748B] mb-1">
                          <Link
                            to={`/courses/${item.slug}`}
                            className="text-[#035BE3] font-bold hover:underline flex items-center gap-1 no-underline"
                          >
                            <span>Play</span>
                            <ArrowRight size={10} />
                          </Link>
                          <span>{item.progress}%</span>
                        </div>

                        <div className="w-full h-1.5 rounded-full bg-gray-200/70 dark:bg-gray-800 overflow-hidden">
                          <div
                            className="h-full bg-[#035BE3] rounded-full"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= SECTION 4: TRENDING COURSES (4 PER ROW) ================= */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${darkMode ? "bg-[#1A2234] text-emerald-400" : "bg-[#F4F6FB] text-emerald-600"
                        }`}
                    >
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold">Trending Courses</h2>
                      <p className={`text-xs ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        Explore practical masterclasses with multi-language support
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/courses"
                    className="text-xs font-bold text-[#035BE3] hover:underline flex items-center gap-1 no-underline"
                  >
                    <span>View All Catalog</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

                {/* 4 Cards Grid for Trending Courses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredCourses.slice(0, 8).map((course) => {
                    const courseId = course.slug || course.id;
                    const mentorName = course.mentor_name || course.mentor || "Assigned Mentor";
                    const mentorRole = course.category || "Masterclass";
                    const mentorPhoto = course.mentor_photo || course.photo_url || null;
                    const mentorInitial = mentorName ? mentorName.charAt(0).toUpperCase() : "M";

                    return (
                      <Link
                        key={course.id}
                        to={`/courses/${courseId}`}
                        className={`group transition-all duration-200 flex flex-col justify-between no-underline ${
                          darkMode ? "text-[#E2E8F0]" : "text-[#161B29]"
                        }`}
                      >
                        {/* Rounded image only */}
                        <div>
                          <div className="relative aspect-video w-full overflow-hidden rounded-[10px] bg-[#1E2638]">
                            <img
                              src={
                                course.thumbnail_url ||
                                course.thumbnail ||
                                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop"
                              }
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {course.category && (
                              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                                {course.category}
                              </div>
                            )}
                            <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#035BE3] text-white text-[10px] font-bold flex items-center gap-1">
                              <Clock size={10} />
                              <span>{course.duration || "14 Hours"}</span>
                            </div>
                          </div>

                          {/* Text under image */}
                          <div className="pt-3 px-0.5">
                            <h3 className="text-sm font-bold line-clamp-1 group-hover:text-[#035BE3] transition-colors">
                              {course.title}
                            </h3>
                            <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${darkMode ? "text-[#94A3B8]" : "text-[#556377]"}`}>
                              {course.description || "This comprehensive course provides a complete roadmap — from basic fundamentals to advanced scaling."}
                            </p>

                            {/* Mentor with Image / Avatar */}
                            <div className="mt-2.5 flex items-center gap-2.5">
                              {mentorPhoto ? (
                                <img
                                  src={mentorPhoto}
                                  alt={mentorName}
                                  className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-200 dark:border-gray-700"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#035BE3] font-bold text-xs flex items-center justify-center shrink-0">
                                  {mentorInitial}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-semibold truncate leading-none">
                                  {mentorName}
                                </p>
                                <p className={`text-[10.5px] truncate mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                                  {mentorRole}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Languages / Meta info below */}
                        <div className="pt-2 px-0.5 mt-2 flex items-center justify-between text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">
                          <span className="flex items-center gap-1 truncate max-w-[190px]">
                            <Globe size={12} className="text-[#035BE3] shrink-0" />
                            <span className="truncate">{course.languages || "Hindi, English"}</span>
                          </span>
                          <span className="text-[#035BE3] font-bold flex items-center gap-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform">
                            <span>View</span>
                            <ArrowRight size={12} />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* ================= SECTION 5: CAREER & OPPORTUNITY MATCH ================= */}
              <div
                className={`rounded-[32px] p-6 sm:p-10 border flex flex-col md:flex-row items-center justify-between gap-6 ${darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-[#0F172A] text-white border-transparent"
                  }`}
              >
                <div className="space-y-2 max-w-2xl text-center md:text-left">
                  <span className="px-3 py-1 rounded-full bg-blue-900/60 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                    Career Acceleration
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Turn Your Skills Into Opportunities
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-300">
                    Discover freelance gigs, internship matches and high-paying jobs aligned with your verified KnowWay certifications.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <button
                    onClick={() => setActiveTab("certificates")}
                    className="px-6 py-3 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition cursor-pointer"
                  >
                    Explore Jobs & Gigs
                  </button>
                  <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
                    Learn &bull; Implement &bull; Grow
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: MY ENROLLED PACKAGES */}
          {/* ======================================================== */}
          {activeTab === "packages" && (
            <div className="space-y-6 w-full">
              {/* Capsule Header Banner */}
              <div
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div>
                  <h2 className="text-base sm:text-lg font-bold">My Enrolled Packages</h2>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                    All your active learning bundles with full lifetime access & verified certificates.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setActiveTab("upgrade")}
                    className="px-5 py-2.5 bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-semibold rounded-full transition flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Upgrade Package</span>
                  </button>
                </div>
              </div>

              {/* Purchased Packages Grid */}
              {myPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                  {myPackages.map((pkg, idx) => {
                    const slug = (pkg.package_slug || pkg.slug || "pro").toLowerCase();
                    const theme =
                      slug.includes("plus") || slug.includes("vip")
                        ? { cardClass: darkMode ? "bg-[#1D1435] border-[#3A2868]" : "bg-[#F6F0FF] border-[#E5D9FF]", accent: "#7555E8" }
                        : slug.includes("premium")
                        ? { cardClass: darkMode ? "bg-[#0D1E36] border-[#1A3860]" : "bg-[#EFF7FF] border-[#D7E9FF]", accent: "#356AE6" }
                        : slug.includes("supreme")
                        ? { cardClass: darkMode ? "bg-[#251D0B] border-[#4A3B16]" : "bg-[#FFF8E9] border-[#F6E7BD]", accent: "#D99B1D" }
                        : { cardClass: darkMode ? "bg-[#101935] border-[#1E2D5A]" : "bg-[#EEF3FF] border-[#DDE7FF]", accent: "#315FD8" };

                    return (
                      <div
                        key={pkg.id || pkg.package_id || idx}
                        className={`group relative rounded-[30px] border p-6 sm:p-7 overflow-hidden flex flex-col justify-between transition-all hover:shadow-lg ${theme.cardClass}`}
                      >
                        {/* Decorative circles */}
                        <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full border-[20px] border-white/40 dark:border-white/5" />

                        <div>
                          {/* Accent Bar */}
                          <div
                            className="mb-4 h-[4px] w-[34px] rounded-full"
                            style={{ backgroundColor: theme.accent }}
                          />

                          <div className="flex items-center justify-between">
                            <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-[#161B29]"}`}>
                              {pkg.name}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                              <Check size={10} /> Active
                            </span>
                          </div>

                          {/* Image with Drop Shadow */}
                          <div className="relative my-4 flex min-h-[160px] items-center justify-center">
                            <div
                              className="absolute h-[110px] w-[110px] rounded-full opacity-25 blur-2xl"
                              style={{ backgroundColor: theme.accent }}
                            />
                            <img
                              src={pkg.image_url || "/images/packages/pro.png"}
                              alt={pkg.name}
                              className="relative z-10 max-h-[150px] w-auto object-contain drop-shadow-[0_16px_20px_rgba(28,43,75,.15)] transition-transform duration-300 group-hover:-translate-y-1"
                              onError={(e) => { e.currentTarget.src = "/images/packages/pro.png"; }}
                            />
                          </div>

                          <p className={`text-xs line-clamp-2 leading-relaxed ${darkMode ? "text-gray-300" : "text-[#5E697D]"}`}>
                            {pkg.tagline || "Full lifetime access to in-demand modules and mentor resources."}
                          </p>
                        </div>

                        {/* Bottom Action Button */}
                        <div className="pt-4 mt-2 border-t border-black/5 dark:border-white/10 flex items-center gap-2">
                          <button
                            onClick={() => setActiveTab("courses")}
                            className="flex-1 h-11 rounded-full bg-[#035BE3] hover:bg-[#FA8C03] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-[#035BE3]/20"
                          >
                            <span>Learn Courses</span>
                            <ArrowRight size={13} />
                          </button>
                          <button
                            onClick={() => setActiveTab("upgrade")}
                            className="h-11 px-4 rounded-full bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 text-xs font-semibold hover:bg-white text-[#161B29] dark:text-white transition flex items-center gap-1 cursor-pointer"
                            title="Upgrade Package"
                          >
                            <Zap size={13} className="text-amber-500" />
                            <span>Upgrade</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Fallback default active tier */
                <div className={`rounded-[28px] border p-8 text-center space-y-4 max-w-xl mx-auto ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}>
                  <div className="w-16 h-16 rounded-2xl bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center mx-auto border border-[#035BE3]/20">
                    <Layers3 size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Standard Learning Access Active</h3>
                    <p className={`text-xs mt-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      You have free learning access. Upgrade to an official verified Skill Package to unlock all video modules, project files & accredited certificates.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("upgrade")}
                    className="px-7 py-3 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition inline-flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Zap size={14} />
                    <span>Explore Packages & Upgrade</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: ALL COURSES DIRECTORY (BUY OR WATCH) */}
          {/* ======================================================== */}
          {activeTab === "all_courses" && (
            <div className="space-y-6 w-full">
              {/* Header Capsule */}
              <div
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div>
                  <h2 className="text-base sm:text-lg font-bold">All Masterclasses & Skill Courses</h2>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                    Explore industry-accredited courses. Purchase individually or unlock all with an active Skill Package.
                  </p>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {[
                    { id: "all", label: "All Skills" },
                    { id: "Marketing", label: "Marketing" },
                    { id: "Video", label: "Video Editing" },
                    { id: "Development", label: "Development" },
                    { id: "Finance", label: "Finance & Sales" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                        selectedCategory === cat.id
                          ? "bg-[#035BE3] text-white shadow-sm"
                          : darkMode
                          ? "bg-[#1A2234] text-[#94A3B8] hover:text-white"
                          : "bg-gray-100 text-[#475569] hover:bg-gray-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Cards Per Row Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
                {filteredAllCourses.map((course) => {
                  const courseId = course.slug || course.id;
                  const mentorName = course.mentor_name || course.mentor || "Assigned Mentor";
                  const mentorRole = course.category || "Masterclass";
                  const mentorPhoto = course.mentor_photo || course.photo_url || null;
                  const mentorInitial = mentorName ? mentorName.charAt(0).toUpperCase() : "M";
                  const isEnrolled =
                    course.is_enrolled ||
                    courses.some((c) => c.id === course.id || c.slug === course.slug);
                  const hasReferral = Boolean(user?.referral_code);
                  const mrp = Number(course.regular_price || 2999);
                  const promo = Number(course.promo_price || 499);

                  return (
                    <div
                      key={course.id}
                      className={`group rounded-[24px] border overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                        isEnrolled
                          ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/10"
                          : darkMode
                          ? "bg-[#131926] border-[#222B3D] text-[#E2E8F0]"
                          : "bg-white border-[#E2E8F0] text-[#161B29]"
                      }`}
                    >
                      <div>
                        {/* Thumbnail */}
                        <div className="relative aspect-video w-full overflow-hidden bg-[#1E2638]">
                          <img
                            src={
                              course.thumbnail_url ||
                              course.thumbnail ||
                              "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop"
                            }
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {course.category && (
                            <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                              {course.category}
                            </div>
                          )}
                          <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#035BE3] text-white text-[10px] font-bold flex items-center gap-1">
                            <Clock size={10} />
                            <span>{course.duration || "14 Hours"}</span>
                          </div>
                          {isEnrolled ? (
                            <div className="absolute bottom-2.5 left-2.5">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                                <Check size={11} /> Unlocked (Enrolled)
                              </span>
                            </div>
                          ) : (
                            <div className="absolute bottom-2.5 left-2.5">
                              <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold flex items-center gap-1">
                                <Lock size={10} /> Locked
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-2.5">
                          <h3 className="text-sm font-bold line-clamp-1 group-hover:text-[#035BE3] transition-colors">
                            {course.title}
                          </h3>

                          {/* Mentor with Image */}
                          <div className="flex items-center gap-2">
                            {mentorPhoto ? (
                              <img
                                src={mentorPhoto}
                                alt={mentorName}
                                className="w-6 h-6 rounded-full object-cover shrink-0 border border-gray-200 dark:border-gray-700"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-[#035BE3] font-bold text-[10px] flex items-center justify-center shrink-0">
                                {mentorInitial}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate leading-none">{mentorName}</p>
                              <p className={`text-[10px] truncate mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                                {mentorRole}
                              </p>
                            </div>
                          </div>

                          {/* Pricing Box (If not enrolled) - Always shows both prices */}
                          {!isEnrolled && (
                            <div className="p-2.5 rounded-xl bg-[#F8FAFD] dark:bg-[#0B0F17] border border-[#E2E8F0] dark:border-[#222B3D] flex items-center justify-between mt-2">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                  {hasReferral ? "✓ Referral Offer" : "Referral Rate"}
                                </span>
                                <span className="text-sm font-black text-[#035BE3] dark:text-blue-400">
                                  ₹{promo.toLocaleString("en-IN")}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] uppercase font-bold text-[#94A3B8] block">Real Price</span>
                                <span className={`text-xs font-bold ${hasReferral ? "line-through text-[#94A3B8]" : "text-[#475569] dark:text-gray-300"}`}>
                                  ₹{mrp.toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="p-4 pt-0">
                        {isEnrolled ? (
                          <Link
                            to={`/courses/${courseId}`}
                            className="w-full h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 no-underline shadow-xs cursor-pointer"
                          >
                            <Play size={12} fill="currentColor" />
                            <span>Watch Course</span>
                            <ArrowRight size={12} />
                          </Link>
                        ) : (
                          <Link
                            to={`/checkout/${course.slug || course.id}?type=course${hasReferral ? `&ref=${user.referral_code}` : ""}`}
                            className="w-full h-10 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 no-underline shadow-sm shadow-[#035BE3]/25 cursor-pointer"
                          >
                            <Lock size={12} />
                            <span>Buy & Unlock (₹{(hasReferral ? promo : mrp).toLocaleString("en-IN")})</span>
                            <ArrowRight size={12} />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: MY ENROLLED COURSES (STUDENT'S UNLOCKED COURSES) */}
          {/* ======================================================== */}
          {activeTab === "courses" && (
            <div className="space-y-6 w-full">
              <div
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div>
                  <h2 className="text-base sm:text-lg font-bold">My Enrolled Courses</h2>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                    Access all your unlocked video masterclasses, practical tasks, and mentor discussions.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("all_courses")}
                  className="px-5 py-2.5 bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-semibold rounded-full transition flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Compass className="w-4 h-4" />
                  <span>Browse All Courses</span>
                </button>
              </div>

              {/* Enrolled Courses Grid or Empty State */}
              {filteredEnrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
                  {filteredEnrolledCourses.map((course) => {
                    const courseId = course.slug || course.id;
                    const mentorName = course.mentor_name || course.mentor || "Assigned Mentor";
                    const mentorRole = course.category || "Masterclass";
                    const mentorPhoto = course.mentor_photo || course.photo_url || null;
                    const mentorInitial = mentorName ? mentorName.charAt(0).toUpperCase() : "M";

                    return (
                      <Link
                        key={course.id}
                        to={`/courses/${courseId}`}
                        className={`group rounded-[24px] border overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md no-underline ${
                          darkMode ? "bg-[#131926] border-[#222B3D] text-[#E2E8F0]" : "bg-white border-[#E2E8F0] text-[#161B29]"
                        }`}
                      >
                        <div>
                          <div className="relative aspect-video w-full overflow-hidden bg-[#1E2638]">
                            <img
                              src={
                                course.thumbnail_url ||
                                course.thumbnail ||
                                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop"
                              }
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {course.category && (
                              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                                {course.category}
                              </div>
                            )}
                            <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#035BE3] text-white text-[10px] font-bold flex items-center gap-1">
                              <Clock size={10} />
                              <span>{course.duration || "14 Hours"}</span>
                            </div>
                          </div>

                          <div className="p-4 space-y-2">
                            <h3 className="text-sm font-bold line-clamp-1 group-hover:text-[#035BE3] transition-colors">
                              {course.title}
                            </h3>
                            <p className={`text-xs line-clamp-2 leading-relaxed ${darkMode ? "text-[#94A3B8]" : "text-[#556377]"}`}>
                              {course.description || "Practical step-by-step career path with real files."}
                            </p>

                            <div className="mt-2.5 flex items-center gap-2">
                              {mentorPhoto ? (
                                <img
                                  src={mentorPhoto}
                                  alt={mentorName}
                                  className="w-6 h-6 rounded-full object-cover shrink-0 border border-gray-200 dark:border-gray-700"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#035BE3] font-bold text-[10px] flex items-center justify-center shrink-0">
                                  {mentorInitial}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-semibold truncate leading-none">{mentorName}</p>
                                <p className={`text-[10px] truncate mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                                  {mentorRole}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 pt-0">
                          <div className="w-full h-10 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm">
                            <Play size={12} fill="currentColor" />
                            <span>Resume Watching</span>
                            <ArrowRight size={12} />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div
                  className={`rounded-[28px] border p-8 text-center space-y-4 max-w-xl mx-auto ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center mx-auto border border-[#035BE3]/20">
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">No Courses Enrolled Yet</h3>
                    <p className={`text-xs mt-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      You haven't purchased or enrolled in individual courses yet. Explore our course directory or upgrade to an all-access skill package!
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab("all_courses")}
                      className="px-6 py-2.5 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition inline-flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Compass size={14} />
                      <span>Explore All Courses</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("upgrade")}
                      className="px-6 py-2.5 rounded-full border text-xs font-bold transition inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Zap size={14} className="text-amber-500" />
                      <span>View Packages</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: UPGRADE PACKAGE */}
          {/* ======================================================== */}
          {activeTab === "upgrade" && (
            <div className="space-y-6 w-full">
              {/* Header Capsule */}
              <div
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div>
                  <h2 className="text-base sm:text-lg font-bold">Upgrade Your Learning Package</h2>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                    Level up your digital skills. Unlock advanced AI frameworks, VIP founder workshops, and high-income masterclasses.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold shrink-0">
                  <Sparkles size={13} />
                  <span>Special Member Upgrade Rates</span>
                </div>
              </div>

              {/* Upgrade Package Cards matching Home Aesthetic */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {(allPackagesList.length > 0 ? allPackagesList : [
                  { id: 1, name: "Pro Growth Package", slug: "pro", mrp_price: 11800, promo_price: 7999, total_hours: "25+ Hours", tagline: "Build practical digital skills and create a strong foundation for your online career.", image_url: "/images/packages/pro.png" },
                  { id: 2, name: "Supreme Skill Package", slug: "supreme", mrp_price: 14800, promo_price: 9999, total_hours: "40+ Hours", tagline: "Go deeper with advanced learning paths designed for digital growth and business skills.", image_url: "/images/packages/supreme.png" },
                  { id: 3, name: "Premium Master Package", slug: "premium", mrp_price: 19800, promo_price: 12999, total_hours: "65+ Hours", tagline: "Learn how digital commerce works and explore the skills behind building an online business.", image_url: "/images/packages/premium.png" },
                  { id: 4, name: "Premium Plus VIP", slug: "premium-plus", mrp_price: 24800, promo_price: 16999, total_hours: "100+ Hours", tagline: "Explore content creation, personal branding, AI automation, and VIP founder community access.", image_url: "/images/packages/premium-plus.png" },
                ]).map((pkg) => {
                  const slug = (pkg.package_slug || pkg.slug || "pro").toLowerCase();
                  const isAlreadyPurchased = myPackages.some((p) => p.package_slug === pkg.slug || p.package_id === pkg.id);
                  const hasReferral = Boolean(user?.referral_code);
                  const mrp = Number(pkg.mrp_price || 11800);
                  const promo = Number(pkg.promo_price || 7999);
                  const payablePrice = hasReferral ? promo : mrp;

                  const theme =
                    slug.includes("plus") || slug.includes("vip")
                      ? { cardClass: darkMode ? "bg-[#1D1435] border-[#3A2868]" : "bg-[#F6F0FF] border-[#E5D9FF]", accent: "#7555E8" }
                      : slug.includes("premium")
                      ? { cardClass: darkMode ? "bg-[#0D1E36] border-[#1A3860]" : "bg-[#EFF7FF] border-[#D7E9FF]", accent: "#356AE6" }
                      : slug.includes("supreme")
                      ? { cardClass: darkMode ? "bg-[#251D0B] border-[#4A3B16]" : "bg-[#FFF8E9] border-[#F6E7BD]", accent: "#D99B1D" }
                      : { cardClass: darkMode ? "bg-[#101935] border-[#1E2D5A]" : "bg-[#EEF3FF] border-[#DDE7FF]", accent: "#315FD8" };

                  return (
                    <div
                      key={pkg.id || pkg.slug}
                      className={`group relative rounded-[30px] border p-6 sm:p-7 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${theme.cardClass}`}
                    >
                      {/* Decorative Background Circles */}
                      <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full border-[22px] border-white/45 dark:border-white/5" />

                      <div>
                        {/* Top Accent Indicator */}
                        <div
                          className="mb-4 h-[4px] w-[34px] rounded-full"
                          style={{ backgroundColor: theme.accent }}
                        />

                        {/* Title & Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-[#161B29]"}`}>
                            {pkg.name}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold shrink-0">
                            {pkg.total_hours || "25+ Hours"}
                          </span>
                        </div>

                        {/* Floating Product Image */}
                        <div className="relative my-4 flex min-h-[170px] items-center justify-center">
                          <div
                            className="absolute h-[120px] w-[120px] rounded-full opacity-20 blur-2xl"
                            style={{ backgroundColor: theme.accent }}
                          />
                          <img
                            src={pkg.image_url || "/images/packages/pro.png"}
                            alt={pkg.name}
                            className="relative z-10 max-h-[160px] w-auto object-contain drop-shadow-[0_18px_22px_rgba(28,43,75,.16)] transition-transform duration-300 group-hover:-translate-y-1.5"
                            onError={(e) => { e.currentTarget.src = "/images/packages/pro.png"; }}
                          />
                        </div>

                        <p className={`text-xs line-clamp-2 leading-relaxed mb-4 ${darkMode ? "text-gray-300" : "text-[#5E697D]"}`}>
                          {pkg.tagline || "Structured practical skill track with accredited certificate."}
                        </p>

                        {/* Pricing Box - Always shows both prices */}
                        <div className={`p-3.5 rounded-2xl border flex items-center justify-between mb-4 ${darkMode ? "bg-black/40 border-white/10" : "bg-white border-[#DDE5F5] shadow-xs"}`}>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              {hasReferral ? "✓ Referral Offer" : "Referral Rate"}
                            </span>
                            <span className={`text-xl font-black ${hasReferral ? "text-[#035BE3] dark:text-blue-400" : darkMode ? "text-white" : "text-[#161B29]"}`}>
                              ₹{promo.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-semibold text-[#94A3B8] block">Real Price</span>
                            <span className={`text-xs font-bold ${hasReferral ? "line-through text-[#94A3B8]" : darkMode ? "text-gray-300" : "text-[#475569]"}`}>
                              ₹{mrp.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button matching Home style */}
                      <div>
                        {isAlreadyPurchased ? (
                          <div className="w-full h-11 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                            <CheckCircle2 size={14} />
                            <span>Active Lifetime Tier</span>
                          </div>
                        ) : (
                          <Link
                            to={`/checkout/${pkg.slug || "pro"}${hasReferral ? `?ref=${user.referral_code}` : ""}`}
                            className="w-full h-11 rounded-full bg-[#035BE3] hover:bg-[#FA8C03] text-white text-xs font-bold transition-colors duration-200 flex items-center justify-between pl-5 pr-2 shadow-sm shadow-[#035BE3]/20 no-underline cursor-pointer"
                          >
                            <span>Upgrade to {pkg.name.split(" ")[0]}</span>
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#171D2B]">
                              <ArrowUpRight size={13} />
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ======================================================== */}
          {/* TAB 3: CERTIFICATES & ACHIEVEMENTS */}
          {/* ======================================================== */}
          {activeTab === "certificates" && (
            <div className="space-y-8 w-full">
              <div
                className={`rounded-[28px] p-6 sm:p-8 border flex flex-col md:flex-row md:items-center justify-between gap-4 w-full ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#035BE3]" />
                    <h2 className="text-lg sm:text-xl font-bold">Verified Certificates of Completion</h2>
                  </div>
                  <p className={`text-xs ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                    Pass the course assessment test (&ge; 60%) to earn accredited, shareable credentials.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#035BE3] bg-blue-50 dark:bg-blue-950/60 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-900">
                    {certificatesList.length} Earned Certificates
                  </span>
                </div>
              </div>

              {/* Earned Certificates Grid */}
              {certificatesList.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#64748B]">
                    Your Earned Certificates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {certificatesList.map((cert) => (
                      <div
                        key={cert.id}
                        className={`rounded-[28px] p-6 border flex flex-col justify-between transition-all hover:border-[#035BE3]/40 ${
                          darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#035BE3] flex items-center justify-center font-bold">
                              <Award size={20} />
                            </div>
                            <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 size={11} /> Score: {cert.score}%
                            </span>
                          </div>

                          <h4 className="text-base font-bold leading-snug">{cert.course_title}</h4>
                          <p className={`text-xs mt-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                            Issued to <strong>{cert.student_name}</strong>
                          </p>
                          <p className="text-[11px] font-mono text-[#035BE3] font-semibold mt-2.5">
                            ID: {cert.certificate_no}
                          </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-inherit flex items-center justify-between">
                          <button
                            onClick={() => setCertificateModal(cert)}
                            className="px-4 py-2 rounded-full bg-[#035BE3] text-white text-xs font-bold hover:bg-[#024bc0] transition cursor-pointer flex items-center gap-1.5 shadow-sm shadow-[#035BE3]/30"
                          >
                            <span>View & Download</span>
                            <ArrowRight size={12} />
                          </button>
                          <span className="text-[11px] text-[#64748B]">
                            {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString() : "Active"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 px-6 rounded-[28px] border border-dashed border-gray-300 dark:border-gray-800 space-y-2">
                  <Award className="w-12 h-12 text-[#94A3B8] mx-auto opacity-50" />
                  <h3 className="text-base font-bold">No Certificates Earned Yet</h3>
                  <p className="text-xs text-[#64748B] max-w-md mx-auto">
                    Complete your course lectures and take the 5-question assessment test below to generate your official accredited certificate!
                  </p>
                </div>
              )}

              {/* Available Assessments Section */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold">Take Course Final Assessment</h3>
                    <p className={`text-xs ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Test your knowledge to instantly unlock your Certificate of Excellence.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {(courses.length > 0 ? courses : premiumCoursesList).map((course) => {
                    const isAlreadyPassed = certificatesList.some(
                      (c) => c.course_title === course.title || c.course_id === course.id
                    );

                    return (
                      <div
                        key={course.id}
                        className={`rounded-[24px] p-4 border flex flex-col justify-between transition-all ${
                          darkMode ? "bg-[#131926]/70 border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={course.thumbnail_url || course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"}
                            alt={course.title}
                            className="w-16 h-16 rounded-[10px] object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold line-clamp-1">{course.title}</h4>
                            <p className={`text-[11px] truncate mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                              {course.category || "Skill Track"}
                            </p>
                            <span className="text-[10px] text-[#035BE3] font-semibold mt-1 inline-block">
                              5 Questions &bull; Pass Mark: 60%
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-inherit flex items-center justify-between">
                          {isAlreadyPassed ? (
                            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 size={13} /> Certified
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#64748B]">Ready for Assessment</span>
                          )}

                          <button
                            onClick={() => setSelectedQuizCourse(course)}
                            className="px-4 py-1.5 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>{isAlreadyPassed ? "Retake Test" : "Start Test"}</span>
                            <ArrowRight size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: ACCOUNT & PROFILE SETTINGS */}
          {/* ======================================================== */}
          {activeTab === "profile" && (
            <div className="space-y-6 w-full">
              <div
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border w-full ${darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                  }`}
              >
                <h2 className="text-base sm:text-lg font-bold">Account Profile & Settings</h2>
                <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                  Update your contact details, student name, and account preferences.
                </p>
              </div>

              <div
                className={`rounded-[28px] p-6 sm:p-8 border max-w-2xl ${darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                  }`}
              >
                {/* Student Unique ID Badge Box */}
                <div className="mb-6 p-4 rounded-2xl bg-[#EEF4FF] dark:bg-[#1E2638] border border-[#035BE3]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#035BE3] dark:text-blue-400 tracking-wider">
                      Official Student ID
                    </span>
                    <p className="text-base font-mono font-extrabold text-[#0F172A] dark:text-white mt-0.5">
                      {user?.student_id || (user?.id ? `KW-2026-${String(user.id).padStart(4, "0")}` : "KW-2026-STUDENT")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyStudentId}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#035BE3] text-white text-xs font-bold hover:bg-[#024bc0] transition cursor-pointer shrink-0"
                  >
                    {copiedStudentId ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedStudentId ? "Copied!" : "Copy Student ID"}</span>
                  </button>
                </div>

                {saveSuccess && (
                  <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Profile details updated successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className={`w-full h-12 rounded-full border px-5 text-xs outline-none focus:border-[#035BE3] ${darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                        }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5">Email Address</label>
                    <input
                      type="email"
                      readOnly
                      disabled
                      value={profileForm.email}
                      className={`w-full h-12 rounded-full border px-5 text-xs outline-none opacity-60 cursor-not-allowed ${darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                        }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className={`w-full h-12 rounded-full border px-5 text-xs outline-none focus:border-[#035BE3] ${darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                        }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 !mt-6"
                  >
                    <Check size={16} />
                    <span>Save Profile Changes</span>
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ================= HIGH-RESOLUTION CERTIFICATE MODAL ================= */}
      {certificateModal && (
        <CertificateModal
          certificate={certificateModal}
          onClose={() => setCertificateModal(null)}
        />
      )}

      {/* ================= COURSE ASSESSMENT / QUIZ MODAL ================= */}
      {selectedQuizCourse && (
        <CourseQuizModal
          course={selectedQuizCourse}
          user={user}
          onClose={() => setSelectedQuizCourse(null)}
          onPassCertificate={(cert) => {
            loadCertificates();
            setCertificateModal(cert);
          }}
        />
      )}
    </div>
  );
}
