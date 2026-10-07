import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Play,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Globe,
  GraduationCap,
  Award,
  ChevronDown,
  ChevronUp,
  Share2,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Download,
  BookOpen,
  Wrench,
  Check,
  ShieldCheck,
  Video,
  ArrowUpRight,
  Layers3,
  FileText,
  Tag,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CertificateModal from "../studentdashboard/components/CertificateModal";
import CourseQuizModal from "../studentdashboard/components/CourseQuizModal";
import { getCourseByIdApi, getUserData } from "../services/api";

// Fallback seed detail in case DB is offline
const fallbackCourseDetail = {
  id: 5,
  title: "Meta Ads (Telugu)",
  slug: "meta-ads-telugu",
  category: "Meta Ads",
  languages: "Telugu",
  duration: "1.53 Hours",
  thumbnail_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop",
  description:
    "Meta Ads Mastery is a practical course that teaches learners how to create, manage, test, retarget, report, and scale campaigns on Facebook and Instagram using campaign objectives, audiences, creatives, pixel, A/B testing, and optimization.",
  software_required: "You only need a stable internet connection, a Facebook account, and basic social media knowledge to start this course. No prior experience is required, so beginners can easily learn how to create ads, test audiences, use creatives, and optimize campaign results.",
  mentor_name: "Yaswanth Sai Palaghat",
  mentor_role: "Meta Ads & Performance Marketing Specialist",
  mentor_bio: "Experienced digital growth specialist having managed over $500k in ad spend across ecommerce and high-ticket service brands.",
  mentor_photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  mentor_exp: "6+ Yrs Exp",
  what_you_will_learn_parsed: [
    "Meta Business Manager and Ads Manager structure",
    "Campaign, ad set, and ad-level setup",
    "Core, custom, and lookalike audience targeting",
    "Meta Ads campaign creation step-by-step",
    "Creative setup, ad copy, and mobile preview",
    "Meta Pixel installation and event tracking",
    "Reporting, freelancing client acquisition, and final roadmap",
  ],
  lectures: [
    {
      id: 1,
      section_name: "Introduction",
      lecture_order: 1,
      title: "Introduction to Meta Ads",
      duration: "1m",
      video_url: "https://res.cloudinary.com/demo/video/upload/sample.mp4",
      is_free_preview: true,
    },
    {
      id: 2,
      section_name: "Introduction",
      lecture_order: 2,
      title: "Mindset & Structure of Business Manager",
      duration: "8m",
      video_url: "",
      is_free_preview: true,
    },
    {
      id: 3,
      section_name: "Introduction",
      lecture_order: 3,
      title: "Audience Targeting & Strategy",
      duration: "7m",
      video_url: "",
      is_free_preview: false,
    },
    {
      id: 4,
      section_name: "Campaign Execution",
      lecture_order: 4,
      title: "Creating Meta Ads Campaign Step-by-Step",
      duration: "27m",
      video_url: "",
      is_free_preview: false,
    },
    {
      id: 5,
      section_name: "Campaign Execution",
      lecture_order: 5,
      title: "Meta Pixel Integration & Retargeting Campaigns",
      duration: "19m",
      video_url: "",
      is_free_preview: false,
    },
    {
      id: 6,
      section_name: "Optimization & Scaling",
      lecture_order: 6,
      title: "Meta Ads Targeting & AB Testing",
      duration: "19m",
      video_url: "",
      is_free_preview: false,
    },
    {
      id: 7,
      section_name: "Optimization & Scaling",
      lecture_order: 7,
      title: "Reporting, Freelancing & Final RoadMap",
      duration: "11m",
      video_url: "",
      is_free_preview: false,
    },
  ],
};

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [certificateModal, setCertificateModal] = useState(null);
  const user = getUserData() || { name: "Certified Student" };

  // Active Lecture in Player
  const [activeLecture, setActiveLecture] = useState(null);

  // Completed Lectures tracker
  const [completedLectures, setCompletedLectures] = useState([]);

  // Active Bottom Tab: "about" | "curriculum" | "learn" | "software" | "mentor" | "certificate" | "doubts"
  const [activeTab, setActiveTab] = useState("about");

  // Expanded Sections in Sidebar
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const res = await getCourseByIdApi(id);
        if (res?.success && res.course) {
          setCourse(res.course);
          if (res.course.lectures && res.course.lectures.length > 0) {
            setActiveLecture(res.course.lectures[0]);
          }
        } else {
          setCourse(null);
        }
      } catch (err) {
        console.warn("Error fetching course detail:", err.message);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [id]);

  // Group lectures by section
  const groupedSections = useMemo(() => {
    if (!course?.lectures) return [];
    const map = {};
    course.lectures.forEach((lec) => {
      const secName = lec.section_name || "Course Modules";
      if (!map[secName]) {
        map[secName] = [];
      }
      map[secName].push(lec);
    });

    return Object.entries(map).map(([name, lecs]) => ({
      section_name: name,
      lectures: lecs,
    }));
  }, [course]);

  // Expand all sections by default on load
  useEffect(() => {
    if (groupedSections.length > 0) {
      const initial = {};
      groupedSections.forEach((sec) => {
        initial[sec.section_name] = true;
      });
      setExpandedSections(initial);
    }
  }, [groupedSections]);

  const toggleSection = (secName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [secName]: !prev[secName],
    }));
  };

  const handleToggleComplete = (lecId) => {
    setCompletedLectures((prev) =>
      prev.includes(lecId) ? prev.filter((id) => id !== lecId) : [...prev, lecId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFCFF] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#035BE3] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#64748B]">Loading Course Studio...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#FBFCFF] text-[#141A29] flex flex-col justify-between">
        <Header />
        <div className="py-32 px-4 text-center max-w-lg mx-auto space-y-4">
          <BookOpen className="w-16 h-16 text-[#94A3B8] mx-auto opacity-60" />
          <h2 className="text-2xl font-bold">Course Not Found</h2>
          <p className="text-xs text-[#64748B]">
            The course you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 h-11 rounded-full bg-[#035BE3] text-white text-xs font-bold hover:bg-[#024bc0] transition shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All Courses</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentCourse = course;
  const whatYouWillLearn = currentCourse.what_you_will_learn_parsed || [];
  const isCurrentLectureFree = activeLecture?.is_free_preview || false;

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-[#141A29] font-sans antialiased flex flex-col justify-between selection:bg-[#035BE3] selection:text-white">
      <div>
        <Header />

        {/* Blueprint Grid Background */}
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.45] -z-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(90,109,145,.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(90,109,145,.07) 1px, transparent 1px)
            `,
            backgroundSize: "118px 118px",
          }}
        />

        {/* ======================================================== */}
        {/* FULL WIDTH HERO SECTION */}
        {/* ======================================================== */}
        <section className="pt-28 sm:pt-32 pb-6 px-5 sm:px-8 lg:px-12 max-w-[1540px] mx-auto w-full">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] mb-4">
            <Link to="/" className="hover:text-[#035BE3]">Home</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-[#035BE3]">Courses</Link>
            <span>/</span>
            <span className="text-[#141A29] truncate max-w-xs sm:max-w-md">{currentCourse.title}</span>
          </div>

          {/* Header Title Card */}
          <div className="bg-white rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 border border-[#DCE5F5] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#035BE3] text-white text-[11px] font-bold">
                  {currentCourse.category || "Skill Track"}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                  {currentCourse.languages || "Hindi"}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#F4F7FC] text-[#556377] border border-[#E2E7F0] text-[11px] font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#035BE3]" />
                  <span>{currentCourse.duration || "2.5 Hours"}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#141A29]">
                {currentCourse.title}
              </h1>

              {/* Mentor Attribution Bar */}
              <div className="flex items-center gap-3 pt-1">
                <img
                  src={
                    currentCourse.mentor_photo ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                  }
                  alt={currentCourse.mentor_name}
                  className="w-11 h-11 rounded-full object-cover border border-[#E2E8F0] shrink-0"
                />
                <div>
                  <p className="text-xs font-bold text-[#141A29]">
                    {currentCourse.mentor_name || "Lead Instructor"}
                  </p>
                  <p className="text-[11px] text-[#035BE3] font-semibold">
                    {currentCourse.mentor_role || "Instructor & Mentor"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats Widget */}
            <div className="flex items-center gap-4 bg-[#F8FAFD] p-4 sm:p-5 rounded-2xl border border-[#E2E7F0] shrink-0">
              <div className="text-center px-4 border-r border-[#E2E8F0]">
                <p className="text-xl font-bold text-[#035BE3]">{currentCourse.lectures?.length || 0}</p>
                <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Lectures</p>
              </div>
              <div className="text-center px-4 border-r border-[#E2E8F0]">
                <p className="text-xl font-bold text-emerald-600">{currentCourse.duration}</p>
                <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Duration</p>
              </div>
              <div className="text-center px-4">
                <Award className="w-6 h-6 text-amber-500 mx-auto" />
                <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Certificate</p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* MAIN VIDEO PLAYER + CURRICULUM PLAYLIST SECTION */}
        {/* ======================================================== */}
        <section className="pb-20 px-5 sm:px-8 lg:px-12 max-w-[1540px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ================= LEFT 8 COLS: THEATER VIDEO PLAYER & TABS ================= */}
            <div className="lg:col-span-8 space-y-6">
              {/* VIDEO PLAYER THEATER CONTAINER */}
              <div className="bg-[#0B0F17] rounded-[32px] sm:rounded-[36px] overflow-hidden border border-[#1E2638] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] relative aspect-video flex items-center justify-center">
                {isCurrentLectureFree && activeLecture?.video_url ? (
                  <video
                    src={activeLecture.video_url}
                    controls
                    autoPlay={false}
                    className="w-full h-full object-contain"
                    poster={currentCourse.thumbnail_url}
                  />
                ) : isCurrentLectureFree ? (
                  /* Demo Cloudinary Video Stream */
                  <div className="relative w-full h-full flex items-center justify-center bg-[#0B0F17]">
                    <img
                      src={currentCourse.thumbnail_url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                      <div className="w-16 h-16 rounded-full bg-[#035BE3] flex items-center justify-center shadow-lg shadow-[#035BE3]/40 animate-pulse">
                        <Play className="w-7 h-7 fill-current ml-1" />
                      </div>
                      <h3 className="text-lg font-bold">{activeLecture?.title || "Video Lecture Preview"}</h3>
                      <span className="text-xs px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                        Free Preview Unlocked
                      </span>
                    </div>
                  </div>
                ) : (
                  /* LOCKED OVERLAY */
                  <div className="relative w-full h-full flex items-center justify-center bg-[#0B0F17]">
                    <img
                      src={currentCourse.thumbnail_url}
                      alt="Locked Thumbnail"
                      className="w-full h-full object-cover opacity-20 filter blur-xs"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-4 max-w-md mx-auto">
                      <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shadow-lg">
                        <Lock className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{activeLecture?.title || "Locked Lesson"}</h3>
                        <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                          This video part is locked. Enroll in the KnowWay Skill Package to get complete unrestricted access to all video parts, resources, and verified certificate.
                        </p>
                      </div>

                      <Link
                        to="/#packages"
                        className="h-11 px-7 rounded-full bg-[#035BE3] hover:bg-[#FA8C03] text-white text-xs font-bold transition-colors duration-200 flex items-center gap-2 shadow-lg shadow-[#035BE3]/30"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Enroll to Unlock All Parts</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTIVE LECTURE ACTION BAR */}
              <div className="bg-white rounded-[26px] p-5 border border-[#DCE5F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#035BE3] bg-[#035BE3]/10 px-3 py-0.5 rounded-full">
                      Lecture {activeLecture?.lecture_order || 1}
                    </span>
                    <span className="text-xs text-[#64748B] font-semibold">
                      ⏱️ {activeLecture?.duration || "5m"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#141A29] mt-1">
                    {activeLecture?.title || "Introduction"}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => activeLecture && handleToggleComplete(activeLecture.id)}
                    className={`h-11 px-5 rounded-full border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                      activeLecture && completedLectures.includes(activeLecture.id)
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "border-[#DCE5F5] text-[#556377] hover:text-[#141A29] bg-white"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {activeLecture && completedLectures.includes(activeLecture.id)
                        ? "Marked As Complete"
                        : "Mark As Complete"}
                    </span>
                  </button>
                </div>
              </div>

              {/* ======================================================== */}
              {/* TABS NAVIGATION BAR */}
              {/* ======================================================== */}
              <div className="bg-white rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 border border-[#DCE5F5] shadow-xs space-y-6">
                {/* Tabs Switcher Pill */}
                <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-[#F1F5F9] scrollbar-none">
                  {[
                    { id: "about", label: "Description", icon: BookOpen },
                    { id: "learn", label: "What You'll Learn", icon: CheckCircle2 },
                    { id: "software", label: "Software Required", icon: Wrench },
                    { id: "mentor", label: "Mentor", icon: GraduationCap },
                    { id: "certificate", label: "Certificate", icon: Award },
                    { id: "doubts", label: "Ask Doubt & Resources", icon: HelpCircle },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`h-10 px-5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          isActive
                            ? "bg-[#035BE3] text-white shadow-xs"
                            : "text-[#64748B] hover:text-[#141A29] hover:bg-[#F4F7FC]"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* TAB 1: DESCRIPTION / ABOUT */}
                {activeTab === "about" && (
                  <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#4A5568]">
                    <h3 className="text-base font-bold text-[#141A29]">About Course</h3>
                    <p className="leading-relaxed">
                      {currentCourse.description ||
                        "Practical, step-by-step digital learning curriculum designed to take you from foundational concepts to advanced execution."}
                    </p>
                    <p className="leading-relaxed">
                      This curriculum is structured for practical execution with live examples, real-world case studies, and actionable frameworks to implement immediately.
                    </p>
                  </div>
                )}

                {/* TAB 2: WHAT YOU'LL LEARN */}
                {activeTab === "learn" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-[#141A29]">What You’ll Learn</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {whatYouWillLearn.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E2E8F0] text-xs text-[#334155] font-medium"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: SOFTWARE REQUIRED */}
                {activeTab === "software" && (
                  <div className="space-y-4 text-xs sm:text-sm text-[#4A5568]">
                    <h3 className="text-base font-bold text-[#141A29]">Software Required</h3>
                    <div className="p-5 rounded-2xl bg-[#F8FAFD] border border-[#E2E8F0] space-y-2">
                      <p className="leading-relaxed">
                        {currentCourse.software_required ||
                          "You only need a stable internet connection, a laptop or smartphone, and basic browser access to start."}
                      </p>
                      <p className="text-[#035BE3] font-semibold text-xs">
                        No prior high-end equipment or paid tool subscription is mandatory for beginner lessons.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 4: MENTOR INFO */}
                {activeTab === "mentor" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-[#141A29]">About Instructor</h3>
                    <div className="p-6 rounded-[26px] bg-[#F8FAFD] border border-[#E2E8F0] flex flex-col sm:flex-row items-center sm:items-start gap-5">
                      <img
                        src={
                          currentCourse.mentor_photo ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                        }
                        alt={currentCourse.mentor_name}
                        className="w-20 h-20 rounded-full object-cover border border-[#E2E8F0] shrink-0"
                      />
                      <div className="space-y-1.5 text-center sm:text-left">
                        <h4 className="text-base font-bold text-[#141A29]">{currentCourse.mentor_name}</h4>
                        <p className="text-xs text-[#035BE3] font-semibold">{currentCourse.mentor_role}</p>
                        <span className="inline-block text-[10px] font-bold px-3 py-0.5 rounded-full bg-gray-200 text-gray-700">
                          {currentCourse.mentor_exp || "Senior Mentor"}
                        </span>
                        <p className="text-xs text-[#5D6B82] pt-2 leading-relaxed">
                          {currentCourse.mentor_bio ||
                            "Experienced digital practitioner guiding learners with practical, industry-tested frameworks."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: CERTIFICATE PREVIEW */}
                {activeTab === "certificate" && (
                  <div className="space-y-4 text-center sm:text-left">
                    <h3 className="text-base font-bold text-[#141A29]">Official Course Certificate</h3>
                    <p className="text-xs text-[#64748B]">
                      Showcase your achievement with an accredited, verifiable KnowWay Certificate by passing the final course exam (&ge; 60%).
                    </p>

                    <div className="p-7 rounded-[32px] bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white border border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 inline-block">
                          Verified Credential
                        </span>
                        <h4 className="text-lg sm:text-xl font-bold">KnowWay Certificate of Mastery</h4>
                        <p className="text-xs text-gray-300 max-w-md leading-relaxed">
                          Share directly on LinkedIn, include in your client proposals, or download in high-resolution PDF format.
                        </p>
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setShowQuiz(true)}
                            className="px-6 py-2.5 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md shadow-[#035BE3]/30"
                          >
                            <Award className="w-4 h-4" />
                            <span>Start Certification Exam</span>
                          </button>
                        </div>
                      </div>

                      <div className="w-20 h-20 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0 shadow-lg">
                        <Award className="w-10 h-10" />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: ASK DOUBT */}
                {activeTab === "doubts" && (
                  <div className="space-y-4 text-xs text-[#475569]">
                    <h3 className="text-base font-bold text-[#141A29]">Ask Your Doubt & Student Resources</h3>
                    <p>Have questions about this lesson? Our community mentors respond within 24 hours.</p>
                    <div className="space-y-3">
                      <textarea
                        rows={3}
                        placeholder="Type your question or doubt here..."
                        className="w-full rounded-2xl border border-[#E2E8F0] p-4 text-xs outline-none focus:border-[#035BE3] bg-[#F8FAFD]"
                      />
                      <button
                        type="button"
                        className="h-11 px-7 rounded-full bg-[#035BE3] hover:bg-[#FA8C03] text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Submit Question
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ================= RIGHT 4 COLS: PLAYLIST & CURRICULUM ================= */}
            <div className="lg:col-span-4 space-y-6">
              {/* Course Progress Card */}
              <div className="bg-white rounded-[32px] sm:rounded-[36px] p-6 sm:p-7 border border-[#DCE5F5] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold">Course Content</h3>
                  <span className="text-xs font-bold text-[#035BE3] bg-[#035BE3]/10 px-3.5 py-1 rounded-full">
                    {currentCourse.lectures?.length || 0} Lectures
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] mb-1.5">
                    <span>Your Progress</span>
                    <span>
                      {Math.round(
                        (completedLectures.length / Math.max(currentCourse.lectures?.length || 1, 1)) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          (completedLectures.length / Math.max(currentCourse.lectures?.length || 1, 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Certification Exam CTA */}
                <div className="pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowQuiz(true)}
                    className="w-full py-3 px-4 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#035BE3]/20"
                  >
                    <Award className="w-4 h-4" />
                    <span>Take Final Exam & Get Certificate</span>
                  </button>
                  <p className="text-[10.5px] text-center text-[#64748B] mt-1.5 font-medium">
                    5 Questions &bull; Pass score &ge; 60% &bull; Instant Accredited PDF
                  </p>
                </div>
              </div>

              {/* Sections & Lectures Playlist */}
              <div className="bg-white rounded-[32px] sm:rounded-[36px] p-6 sm:p-7 border border-[#DCE5F5] shadow-xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Curriculum Playlist</h4>

                <div className="space-y-3">
                  {groupedSections.map((sec, sIdx) => {
                    const isExpanded = expandedSections[sec.section_name] ?? true;

                    return (
                      <div
                        key={sIdx}
                        className="rounded-2xl border border-[#E2E8F0] overflow-hidden bg-[#F8FAFD]"
                      >
                        {/* Section Header Accordion */}
                        <button
                          type="button"
                          onClick={() => toggleSection(sec.section_name)}
                          className="w-full p-4 flex items-center justify-between text-left font-bold text-xs bg-white hover:bg-gray-50 transition cursor-pointer"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="text-[#141A29] truncate">{sec.section_name}</p>
                            <p className="text-[10px] text-[#64748B] font-semibold mt-0.5">
                              {sec.lectures.length} Lectures
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#94A3B8] shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#94A3B8] shrink-0" />
                          )}
                        </button>

                        {/* Section Lectures */}
                        {isExpanded && (
                          <div className="divide-y divide-[#E2E8F0] border-t border-[#E2E8F0]">
                            {sec.lectures.map((lec) => {
                              const isPlaying = activeLecture?.id === lec.id;
                              const isFree = lec.is_free_preview;
                              const isCompleted = completedLectures.includes(lec.id);

                              return (
                                <div
                                  key={lec.id}
                                  onClick={() => setActiveLecture(lec)}
                                  className={`p-3.5 flex items-center justify-between gap-3 text-xs transition cursor-pointer ${
                                    isPlaying
                                      ? "bg-[#035BE3]/10 text-[#035BE3] font-bold"
                                      : "hover:bg-white text-[#475569]"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div
                                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                                        isPlaying
                                          ? "bg-[#035BE3] text-white shadow-xs"
                                          : isCompleted
                                          ? "bg-emerald-500 text-white"
                                          : "bg-gray-200 text-gray-600"
                                      }`}
                                    >
                                      {isCompleted ? (
                                        <Check className="w-3.5 h-3.5" />
                                      ) : isPlaying ? (
                                        <Play className="w-3 h-3 fill-current ml-0.5" />
                                      ) : (
                                        <span>{lec.lecture_order}</span>
                                      )}
                                    </div>

                                    <div className="min-w-0">
                                      <p className="truncate text-xs font-semibold leading-tight">
                                        {lec.title}
                                      </p>
                                      <span className="text-[10px] text-[#94A3B8] font-medium">
                                        {lec.duration || "5m"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="shrink-0">
                                    {isFree ? (
                                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                        Watch
                                      </span>
                                    ) : (
                                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Enroll Call To Action Card */}
              <div className="bg-gradient-to-br from-[#035BE3] to-[#023E9B] rounded-[32px] sm:rounded-[36px] p-7 text-white text-center space-y-3.5 shadow-md shadow-[#035BE3]/20">
                <Award className="w-10 h-10 mx-auto text-amber-300" />
                <div>
                  <h4 className="text-base sm:text-lg font-bold">Get Certified & Access All Tracks</h4>
                  <p className="text-xs text-white/80 leading-relaxed mt-1">
                    Master this course with step-by-step video modules, mentor doubts & verifiable certificates.
                  </p>
                </div>

                {/* Price Display Box */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
                  <div className="flex items-center justify-center gap-4">
                    <div>
                      <span className="text-[10px] text-white/70 font-semibold block">Real Price</span>
                      <span className="text-xs text-white/60 line-through font-bold">
                        ₹{Number(currentCourse.regular_price || 2999).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="w-[1px] h-7 bg-white/20" />
                    <div>
                      <span className="text-[10.5px] text-amber-300 font-extrabold block">With Promocode</span>
                      <span className="text-xl font-black text-white">
                        ₹{Number(currentCourse.promo_price || 499).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/#packages"
                  className="w-full h-11 rounded-full bg-white text-[#035BE3] hover:bg-gray-100 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Enroll in Skill Package</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* ================= HIGH-RESOLUTION CERTIFICATE MODAL ================= */}
      {certificateModal && (
        <CertificateModal
          certificate={certificateModal}
          onClose={() => setCertificateModal(null)}
        />
      )}

      {/* ================= COURSE ASSESSMENT / QUIZ MODAL ================= */}
      {showQuiz && (
        <CourseQuizModal
          course={currentCourse}
          user={user}
          onClose={() => setShowQuiz(false)}
          onPassCertificate={(cert) => {
            setShowQuiz(false);
            setCertificateModal(cert);
          }}
        />
      )}
    </div>
  );
}
