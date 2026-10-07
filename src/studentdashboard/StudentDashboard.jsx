import React, { useState, useEffect, useMemo, useRef } from "react";
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
} from "lucide-react";
import StudentSidebar from "./components/StudentSidebar";
import StudentHeader from "./components/StudentHeader";
import CertificateModal from "./components/CertificateModal";
import CourseQuizModal from "./components/CourseQuizModal";
import {
  getUserData,
  isUserAuthenticated,
  getCoursesApi,
  getMyCertificatesApi,
  setUserSession,
} from "../services/api";

export default function StudentDashboard() {
  const navigate = useNavigate();

  // Theme & Layout States
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'courses' | 'certificates' | 'referrals' | 'profile'
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [certificateModal, setCertificateModal] = useState(null);
  const [selectedQuizCourse, setSelectedQuizCourse] = useState(null);
  const [certificatesList, setCertificatesList] = useState([]);

  // User & Data States
  const [user, setUser] = useState(getUserData());
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // In-Progress Watching List
  const watchingCourses = [
    {
      id: "w1",
      title: "Short VideoPreneur",
      mentor: "Ashutosh Pratihast",
      mentorRole: "Instructor, Youtuber",
      progress: 8,
      thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=600&auto=format&fit=crop",
      slug: "mobile-video-editing",
    },
    {
      id: "w2",
      title: "Mastering Facebook Ads",
      mentor: "Aryan Tripathi",
      mentorRole: "Performance Ad Specialist",
      progress: 7,
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop",
      slug: "meta-ads-telugu",
    },
    {
      id: "w3",
      title: "Performance Marketing Unlocked",
      mentor: "Kautilya Roshan",
      mentorRole: "Growth & Funnel Lead",
      progress: 7,
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
      slug: "google-ads-telugu",
    },
    {
      id: "w4",
      title: "Mastery of Stock Market Course",
      mentor: "Rajat Sharma",
      mentorRole: "Finance & Market Mentor",
      progress: 13,
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop",
      slug: "freelance-course-english",
    },
    {
      id: "w5",
      title: "Mobile Video Editing",
      mentor: "Pari Jain",
      mentorRole: "Content Creator",
      progress: 8,
      thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop",
      slug: "adobe-premiere-pro-tamil",
    },
    {
      id: "w6",
      title: "Advanced Instagram Course 2.0",
      mentor: "Miss Riya Upreti",
      mentorRole: "Branding Strategist",
      progress: 10,
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
      slug: "freelance-course-hindi",
    },
  ];

  // Premium Flagship Carousel List (8 High Value Masterclasses)
  const premiumCoursesList = [
    {
      id: "p1",
      title: "Cloud Kitchen Startup Guide",
      mentor: "Praveen Mahla",
      badge: "Flagship Guide",
      category: "Business Startup",
      languages: "Hindi, English",
      thumbnail: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop",
      slug: "cloud-kitchen-guide",
    },
    {
      id: "p2",
      title: "Print On Demand Mastery",
      mentor: "Danish Malik",
      badge: "E-Commerce Pro",
      category: "Digital Commerce",
      languages: "Hindi, English, Tamil, Telugu",
      thumbnail: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
      slug: "print-on-demand",
    },
    {
      id: "p3",
      title: "Python Decoded for AI",
      mentor: "Anmol Punetha",
      badge: "Tech & AI Core",
      category: "Development",
      languages: "English, Hindi",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
      slug: "python-decoded",
    },
    {
      id: "p4",
      title: "AI Prompt Engineering Masterclass",
      mentor: "Dr. Kabir Roy",
      badge: "High-Income Skill",
      category: "AI Tools",
      languages: "Hindi, English",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop",
      slug: "ai-prompt-engineering",
    },
    {
      id: "p5",
      title: "Premiere Pro Reloaded: Hollywood Editing",
      mentor: "Pari Jain",
      badge: "Creative Suite",
      category: "Video Editing",
      languages: "Hindi",
      thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop",
      slug: "adobe-premiere-pro-tamil",
    },
    {
      id: "p6",
      title: "Mastery of Stock Market & Options",
      mentor: "Rajat Sharma",
      badge: "Wealth Track",
      category: "Finance",
      languages: "Hindi, English",
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop",
      slug: "freelance-course-english",
    },
    {
      id: "p7",
      title: "Advanced Meta & TikTok Ad Scaling",
      mentor: "Aryan Tripathi",
      badge: "Performance Ad",
      category: "Paid Marketing",
      languages: "Hindi, English, Telugu",
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop",
      slug: "meta-ads-telugu",
    },
    {
      id: "p8",
      title: "Fullstack SaaS Development with Next.js",
      mentor: "Tech Lead Vikram",
      badge: "Elite Dev",
      category: "Software Eng",
      languages: "English",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
      slug: "mobile-video-editing",
    },
  ];

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

  // Fetch Courses
  const loadCourses = async () => {
    setIsRefreshing(true);
    try {
      const res = await getCoursesApi();
      if (res?.success && Array.isArray(res.courses)) {
        setCourses(res.courses);
      }
    } catch (err) {
      console.warn("Could not load courses:", err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch Certificates
  const loadCertificates = async () => {
    try {
      const res = await getMyCertificatesApi();
      if (res?.success && Array.isArray(res.certificates)) {
        setCertificatesList(res.certificates);
      }
    } catch (err) {
      console.warn("Could not load certificates:", err.message);
    }
  };

  useEffect(() => {
    loadCourses();
    loadCertificates();
  }, []);

  const handleCopyReferral = () => {
    const code = user?.referral_code || "KNOWWAY2026";
    navigator.clipboard.writeText(code);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = { ...user, ...profileForm };
    setUserSession(localStorage.getItem("knowway_user_token"), updated);
    setUser(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Filtered courses for search
  const filteredCourses = useMemo(() => {
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

  if (!user) return null;

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "S";

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-200 relative isolate ${darkMode ? "bg-[#0B0F17] text-[#E2E8F0]" : "bg-[#FBFCFF] text-[#161B29]"
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
          {/* TAB 2: MY ENROLLED COURSES (4 PER ROW FULL WIDTH) */}
          {/* ======================================================== */}
          {activeTab === "courses" && (
            <div className="space-y-6 w-full">
              <div
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full ${darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                  }`}
              >
                <div>
                  <h2 className="text-base sm:text-lg font-bold">My Enrolled Curriculum</h2>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                    Access all your unlocked video masterclasses, practical tasks, and mentor discussions.
                  </p>
                </div>

                <Link
                  to="/courses"
                  className="px-5 py-2.5 bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-semibold rounded-full transition flex items-center gap-2 cursor-pointer shrink-0 no-underline"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore New Skills</span>
                </Link>
              </div>

              {/* 4 Cards Per Row Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
                {filteredCourses.map((course) => {
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
                          <h3 className="text-base font-bold line-clamp-1 group-hover:text-[#035BE3] transition-colors">
                            {course.title}
                          </h3>
                          <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${darkMode ? "text-[#94A3B8]" : "text-[#556377]"}`}>
                            {course.description || "Practical step-by-step career path with real files."}
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
                          <span>Watch</span>
                          <ArrowRight size={12} />
                        </span>
                      </div>
                    </Link>
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
          {/* TAB 4: REFERRAL & REWARDS */}
          {/* ======================================================== */}
          {activeTab === "referrals" && (
            <div className="space-y-6 w-full">
              <div
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border w-full ${darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                  }`}
              >
                <h2 className="text-base sm:text-lg font-bold">Affiliate & Referral Program</h2>
                <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                  Invite friends and fellow creators to join KnowWay using your unique referral code.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
                <div
                  className={`rounded-[28px] p-6 sm:p-8 border space-y-5 ${darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${darkMode ? "bg-[#1A2234] text-[#035BE3]" : "bg-[#F4F6FB] text-[#035BE3]"
                        }`}
                    >
                      <Tag size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold">Your Referral Code</h3>
                      <p className="text-xs text-[#64748B]">Share this code during signup</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={user.referral_code || "KNOWWAY2026"}
                      className={`flex-1 h-12 rounded-full border px-5 text-sm font-mono font-bold tracking-wider outline-none ${darkMode ? "bg-[#0B0F17] border-[#222B3D] text-[#035BE3]" : "bg-[#F4F6FB] border-[#E2E8F0] text-[#035BE3]"
                        }`}
                    />
                    <button
                      onClick={handleCopyReferral}
                      className="h-12 px-6 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {copiedReferral ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copiedReferral ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>

                  <p className="text-xs text-[#556377] leading-relaxed">
                    Students using your referral code during signup receive special welcome credits, and you earn verified partner badges.
                  </p>
                </div>

                <div
                  className={`rounded-[28px] p-6 sm:p-8 border space-y-4 ${darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                >
                  <h3 className="text-base font-bold">Referral Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-inherit text-center">
                      <p className="text-xs font-bold text-[#64748B]">Total Invites</p>
                      <h4 className="text-2xl font-black mt-1 text-[#035BE3]">12</h4>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-inherit text-center">
                      <p className="text-xs font-bold text-[#64748B]">Active Learners</p>
                      <h4 className="text-2xl font-black mt-1 text-emerald-600">8</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: ACCOUNT & PROFILE SETTINGS */}
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
