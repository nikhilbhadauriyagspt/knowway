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
  Zap,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Flame,
  FileCheck,
  Shield,
  Eye,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CertificateModal from "../studentdashboard/components/CertificateModal";
import CourseQuizModal from "../studentdashboard/components/CourseQuizModal";
import SecureVideoPlayer from "../components/SecureVideoPlayer";
import {
  getCourseByIdApi,
  getMyCoursesApi,
  getUserData,
  isUserAuthenticated,
  getVideoSecurityConfigApi,
} from "../services/api";

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
  software_required:
    "You only need a stable internet connection, a Facebook account, and basic social media knowledge to start this course. No prior experience is required, so beginners can easily learn how to create ads, test audiences, use creatives, and optimize campaign results.",
  mentor_name: "Yaswanth Sai Palaghat",
  mentor_role: "Meta Ads & Performance Marketing Specialist",
  mentor_bio:
    "Experienced digital growth specialist having managed over $500k in ad spend across ecommerce and high-ticket service brands.",
  mentor_exp: "5+ Years Exp",
  mentor_photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
  lectures: [
    {
      id: 101,
      lecture_order: 1,
      title: "1. Introduction to Meta Ads Framework",
      duration: "08:15",
      is_free_preview: true,
      section_name: "Module 1: Foundations & Campaign Architecture",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
    {
      id: 102,
      lecture_order: 2,
      title: "2. Setting Up Business Manager & Pixel Tracking",
      duration: "14:20",
      is_free_preview: false,
      section_name: "Module 1: Foundations & Campaign Architecture",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    },
    {
      id: 103,
      lecture_order: 3,
      title: "3. Audience Targeting & Lookalike Creation",
      duration: "19:40",
      is_free_preview: false,
      section_name: "Module 2: Targeting & Creative Mastery",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
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
  const user = getUserData() || { name: "Certified Student", id: "guest" };

  // Active Lecture in Player
  const [activeLecture, setActiveLecture] = useState(null);

  // Completed Lectures tracker (Loaded strictly per student/course)
  const [completedLectures, setCompletedLectures] = useState([]);

  // Awarded Certificate tracker
  const [awardedCertificate, setAwardedCertificate] = useState(null);

  // Toast notification for auto-completion
  const [completionToast, setCompletionToast] = useState(null);

  // Active Bottom Tab: "about" | "learn" | "software" | "mentor" | "certificate" | "doubts"
  const [activeTab, setActiveTab] = useState("about");

  // Expanded Sections in Sidebar
  const [expandedSections, setExpandedSections] = useState({});

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [videoSecurityConfig, setVideoSecurityConfig] = useState(null);

  // Load stored completion and certificate from LocalStorage
  const courseStorageKey = useMemo(() => {
    return `knowway_progress_${user.id || "guest"}_${id}`;
  }, [user.id, id]);

  const certStorageKey = useMemo(() => {
    return `knowway_cert_${user.id || "guest"}_${id}`;
  }, [user.id, id]);

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(courseStorageKey);
      if (savedProgress) {
        setCompletedLectures(JSON.parse(savedProgress));
      }
      const savedCert = localStorage.getItem(certStorageKey);
      if (savedCert) {
        setAwardedCertificate(JSON.parse(savedCert));
      }
    } catch (_) {}
  }, [courseStorageKey, certStorageKey]);

  useEffect(() => {
    let isMounted = true;

    // Load active Video Security & DRM settings
    getVideoSecurityConfigApi()
      .then((res) => {
        if (res?.success && res.settings && isMounted) {
          setVideoSecurityConfig(res.settings);
        }
      })
      .catch((err) => console.warn("Video security config notice:", err.message));

    const fetchCourseDetail = async () => {
      try {
        const res = await getCourseByIdApi(id);
        if (res?.success && res.course && isMounted) {
          setCourse(res.course);
          if (res.course.lectures && res.course.lectures.length > 0) {
            setActiveLecture(res.course.lectures[0]);
          }

          // Check if current logged in user has purchased/enrolled this course
          if (isUserAuthenticated()) {
            try {
              const myRes = await getMyCoursesApi();
              if (myRes?.success && Array.isArray(myRes.enrolled_courses) && isMounted) {
                const enrolled = myRes.enrolled_courses.some(
                  (c) =>
                    String(c.id) === String(res.course.id) ||
                    c.slug === res.course.slug ||
                    String(c.id) === String(id) ||
                    c.slug === id
                );
                setIsEnrolled(Boolean(enrolled));
              }
            } catch (e) {
              console.warn("Could not check enrollment:", e.message);
            }
          }
        } else if (isMounted) {
          setCourse(null);
        }
      } catch (err) {
        console.warn("Error fetching course detail:", err.message);
        if (isMounted) setCourse(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourseDetail();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const currentCourse = course || fallbackCourseDetail;
  const allLectures = currentCourse.lectures || [];
  const totalLecturesCount = allLectures.length;
  const completedCount = completedLectures.length;
  const progressPercent = totalLecturesCount > 0 ? Math.min(100, Math.round((completedCount / totalLecturesCount) * 100)) : 0;
  const isCourseFullyCompleted = totalLecturesCount > 0 && completedCount >= totalLecturesCount;

  // Group lectures by section
  const groupedSections = useMemo(() => {
    if (!currentCourse?.lectures) return [];
    const map = {};
    currentCourse.lectures.forEach((lec) => {
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
  }, [currentCourse]);

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

  // STRICT AUTO-WATCH COMPLETION HANDLER (Called strictly by SecureVideoPlayer when video finishes)
  const handleLectureFinished = (finishedLecId) => {
    if (!finishedLecId) return;

    setCompletedLectures((prev) => {
      if (!prev.includes(finishedLecId)) {
        const nextList = [...prev, finishedLecId];
        try {
          localStorage.setItem(courseStorageKey, JSON.stringify(nextList));
        } catch (_) {}

        // Trigger celebratory toast
        setCompletionToast(`🎉 Lesson ${finishedLecId} Completed!`);
        setTimeout(() => setCompletionToast(null), 3500);

        // Auto-advance to next lecture
        const currentIndex = allLectures.findIndex((l) => l.id === finishedLecId);
        if (currentIndex !== -1 && currentIndex + 1 < allLectures.length) {
          const nextLec = allLectures[currentIndex + 1];
          if (isEnrolled || nextLec.is_free_preview) {
            setTimeout(() => {
              setActiveLecture(nextLec);
            }, 1000);
          }
        }

        return nextList;
      }
      return prev;
    });
  };

  // On passing exam quiz
  const handleQuizPass = (result) => {
    const cert = result.certificate || {
      certificate_no: `KW-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      student_name: user?.name || "Certified Student",
      course_title: currentCourse.title,
      score: result.score || 100,
      issued_at: new Date().toISOString(),
    };

    setAwardedCertificate(cert);
    try {
      localStorage.setItem(certStorageKey, JSON.stringify(cert));
    } catch (_) {}
    setShowQuiz(false);
    setCertificateModal(cert);
  };

  const whatYouWillLearn = [
    "Core architectural frameworks & live practical execution",
    "Real-world workflows with case studies and tool mastery",
    "Performance measurement, reporting, and ROI scaling methods",
    "End-to-end certification exam readiness & official accredited credential",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFCFF] flex items-center justify-center text-[#1E293B]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#035BE3] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-[#64748B]">Loading Course Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFCFF] text-[#1E293B] font-sans antialiased">
      <Header />

      {/* Completion Toast Notification */}
      {completionToast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-xl animate-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4" />
          <span>{completionToast}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. LIGHT CLEAN TOP BAR */}
      {/* ======================================================== */}
      <section className="pt-24 sm:pt-26 pb-3 px-4 sm:px-6 lg:px-8 max-w-[1580px] mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] font-medium text-[#64748B] mb-2">
          <Link to="/" className="hover:text-[#035BE3] transition">Home</Link>
          <span>/</span>
          <Link to="/courses" className="hover:text-[#035BE3] transition">Courses</Link>
          <span>/</span>
          <span className="text-[#0F172A] font-semibold truncate max-w-xs">{currentCourse.title}</span>
        </div>

        {/* Lightweight Header Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E9EEF5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#035BE3]/10 text-[#035BE3] text-[10.5px] font-bold">
                {currentCourse.category || "Skill Track"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10.5px] font-semibold">
                {currentCourse.languages || "Hindi / English"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-gray-50 text-[#64748B] border border-gray-200 text-[10.5px] font-medium flex items-center gap-1">
                <Clock size={11} className="text-[#035BE3]" /> {currentCourse.duration || "2.5 Hours"}
              </span>
              {isEnrolled && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 text-[10.5px] font-bold flex items-center gap-1">
                  <CheckCircle2 size={11} /> Enrolled
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight">
              {currentCourse.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <img
                src={
                  currentCourse.mentor_photo ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                }
                alt={currentCourse.mentor_name}
                className="w-5 h-5 rounded-full object-cover border border-gray-200"
              />
              <span>Mentor: <strong className="text-[#1E293B]">{currentCourse.mentor_name || "Instructor"}</strong> ({currentCourse.mentor_role || "Specialist"})</span>
            </div>
          </div>

          {/* Quick Progress Indicator */}
          <div className="flex items-center gap-3 bg-[#F8FAFC] p-2.5 sm:p-3 rounded-xl border border-[#E9EEF5] shrink-0">
            <div className="space-y-1 text-left min-w-[130px]">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-[#64748B]">Watch Progress</span>
                <span className={isCourseFullyCompleted ? "text-emerald-600" : "text-[#035BE3]"}>
                  {progressPercent}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-[#8A99AD] block">
                {completedCount} of {totalLecturesCount} lessons
              </span>
            </div>

            {awardedCertificate ? (
              <button
                onClick={() => setCertificateModal(awardedCertificate)}
                className="h-9 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Award size={13} />
                <span>Certificate</span>
              </button>
            ) : isCourseFullyCompleted ? (
              <button
                onClick={() => setShowQuiz(true)}
                className="h-9 px-3.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs animate-pulse"
              >
                <Award size={13} />
                <span>Take Exam</span>
              </button>
            ) : !isEnrolled ? (
              <Link
                to={`/checkout/${currentCourse.slug || currentCourse.id}?type=course`}
                className="h-9 px-4 rounded-lg bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer no-underline shadow-xs"
              >
                <Zap size={12} />
                <span>₹{currentCourse.promo_price || 499}</span>
              </Link>
            ) : (
              <span className="text-[10px] font-bold text-[#64748B] px-2 py-1 bg-white rounded-md border border-gray-200">
                🔒 Exam at 100%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. MAIN PLAYER & CURRICULUM WORKSPACE */}
      {/* ======================================================== */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8 max-w-[1580px] mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT 8 COLS: VIDEO PLAYER & TABS */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Video Player Frame */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-gray-900 shadow-md flex items-center justify-center">
              {Boolean(isEnrolled || activeLecture?.is_free_preview) ? (
                activeLecture?.video_url ? (
                  <SecureVideoPlayer
                    key={activeLecture?.id}
                    src={activeLecture.video_url}
                    poster={currentCourse.thumbnail_url}
                    title={activeLecture.title}
                    isUnlocked={true}
                    securityConfig={videoSecurityConfig}
                    onEnded={() => handleLectureFinished(activeLecture?.id)}
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center bg-gray-950">
                    <img
                      src={currentCourse.thumbnail_url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover opacity-25"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white space-y-2">
                      <div className="w-12 h-12 rounded-full bg-[#035BE3] flex items-center justify-center shadow-md animate-pulse">
                        <Play size={20} className="fill-current ml-0.5" />
                      </div>
                      <h3 className="text-sm font-bold">{activeLecture?.title || "Video Lecture"}</h3>
                    </div>
                  </div>
                )
              ) : (
                /* Locked Player */
                <div className="relative w-full h-full flex items-center justify-center bg-[#0B0F17]">
                  <img
                    src={currentCourse.thumbnail_url}
                    alt="Locked Thumbnail"
                    className="w-full h-full object-cover opacity-15 filter blur-xs"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center text-white space-y-3 max-w-sm mx-auto">
                    <div className="w-11 h-11 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
                      <Lock size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{activeLecture?.title || "Locked Lesson"}</h3>
                      <p className="text-[11px] text-gray-300 mt-0.5">
                        Enroll in this course to get full HD access to all video parts and certified exam.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-1 w-full">
                      <Link
                        to={`/checkout/${currentCourse.slug || currentCourse.id}?type=course`}
                        className="h-9 px-5 rounded-lg bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center gap-1.5 no-underline shadow-xs"
                      >
                        <Zap size={13} />
                        <span>Unlock Course (₹{currentCourse.promo_price || 499})</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Current Playing Bar */}
            <div className="bg-white rounded-xl p-3.5 border border-[#E9EEF5] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-6 h-6 rounded-md bg-[#035BE3]/10 text-[#035BE3] font-bold text-[11px] flex items-center justify-center shrink-0">
                  #{activeLecture?.lecture_order || 1}
                </span>
                <span className="text-xs font-bold text-[#0F172A] truncate">
                  {activeLecture?.title || "Lesson"}
                </span>
                <span className="text-[11px] text-[#8A99AD] shrink-0">
                  ({activeLecture?.duration || "5m"})
                </span>
              </div>

              <div className="shrink-0">
                {activeLecture && completedLectures.includes(activeLecture.id) ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-600" /> Watched
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Flame size={12} className="text-amber-500 animate-pulse" /> Auto-completes on finish
                  </span>
                )}
              </div>
            </div>

            {/* ======================================================== */}
            {/* 3. VERIFIABLE CERTIFICATE MILESTONE CARD WITH REALISTIC MOCKUP */}
            {/* ======================================================== */}
            <div className="bg-gradient-to-r from-amber-50/70 via-white to-blue-50/50 rounded-2xl p-5 border border-amber-200/80 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Left Info */}
                <div className="space-y-2 flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 border border-amber-500/30 text-[10.5px] font-black uppercase tracking-wider">
                      Official Credential
                    </span>
                    {awardedCertificate ? (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle size={13} className="text-emerald-600" /> Verified & Awarded
                      </span>
                    ) : (
                      <span className="text-xs text-[#64748B]">
                        Step 3 of 3 &bull; Pass Exam (&ge;60%)
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-[#0F172A]">
                    KnowWay Accredited Certificate of Mastery 📜
                  </h3>

                  <p className="text-xs text-[#64748B] max-w-lg leading-relaxed">
                    Watch all {totalLecturesCount} video lectures to unlock the 15-minute final certification quiz. Scoring 60%+ automatically issues your verifiable digital certificate.
                  </p>

                  {/* Progress Bar inside Cert card */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] mb-1">
                      <span>Video Completion Milestone</span>
                      <span className="font-bold text-[#0F172A]">{completedCount} / {totalLecturesCount} Lessons</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                    {awardedCertificate ? (
                      <button
                        onClick={() => setCertificateModal(awardedCertificate)}
                        className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-2 shadow-xs cursor-pointer"
                      >
                        <Download size={14} />
                        <span>Download Certificate (PDF)</span>
                      </button>
                    ) : isCourseFullyCompleted ? (
                      <button
                        onClick={() => setShowQuiz(true)}
                        className="h-10 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs transition flex items-center gap-2 shadow-sm animate-pulse cursor-pointer"
                      >
                        <Award size={14} />
                        <span>Take Final Exam & Claim Certificate</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="h-10 px-4 rounded-xl bg-gray-100 text-[#94A3B8] font-bold text-xs flex items-center gap-1.5 border border-gray-200 cursor-not-allowed"
                      >
                        <Lock size={13} />
                        <span>Exam Locked (Watch All {totalLecturesCount} Lessons)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Realistic Certificate Mockup Visual */}
                <div className="relative w-48 sm:w-56 shrink-0 aspect-[4/3] rounded-xl bg-white border-2 border-amber-300 shadow-md p-3 flex flex-col justify-between text-center overflow-hidden">
                  {/* Subtle Corner Accents */}
                  <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-500" />
                  <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-500" />
                  <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-500" />
                  <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-500" />

                  {/* Top Seal */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-1">
                    <span className="text-[8px] font-black text-[#035BE3] uppercase">KNOWWAY LEARNSPACE</span>
                    <span className="text-[8px] font-bold text-amber-600 flex items-center gap-0.5">
                      <ShieldCheck size={9} /> VERIFIED
                    </span>
                  </div>

                  {/* Middle Title */}
                  <div className="space-y-0.5 my-auto">
                    <span className="text-[7.5px] uppercase font-bold text-gray-400 tracking-wider block">
                      Certificate of Achievement
                    </span>
                    <p className="text-[10px] font-bold text-[#0F172A] line-clamp-1">
                      {user.name || "Student Name"}
                    </p>
                    <p className="text-[7.5px] text-gray-500 line-clamp-1">
                      {currentCourse.title}
                    </p>
                  </div>

                  {/* Bottom Seal Badge */}
                  <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center text-[8px] font-bold shadow-xs">
                      🏅
                    </div>
                    <span className="text-[7px] font-mono text-gray-400">
                      {awardedCertificate?.certificate_no || "KW-2026-CERT"}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* ======================================================== */}
            {/* 4. LIGHTWEIGHT TABS */}
            {/* ======================================================== */}
            <div className="bg-white rounded-2xl p-5 border border-[#E9EEF5] shadow-xs space-y-4">
              {/* Tab Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#F1F5F9] scrollbar-none">
                {[
                  { id: "about", label: "Overview", icon: BookOpen },
                  { id: "learn", label: "What You'll Learn", icon: CheckCircle2 },
                  { id: "software", label: "Prerequisites", icon: Wrench },
                  { id: "mentor", label: "Instructor", icon: GraduationCap },
                  { id: "doubts", label: "Q&A Help", icon: HelpCircle },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`h-8 px-3.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        isActive
                          ? "bg-[#035BE3] text-white shadow-xs"
                          : "text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={12} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Overview */}
              {activeTab === "about" && (
                <div className="space-y-3 text-xs leading-relaxed text-[#4A5568]">
                  <h4 className="text-sm font-bold text-[#0F172A]">About This Masterclass</h4>
                  <p>
                    {currentCourse.description ||
                      "Practical, step-by-step digital learning curriculum designed to take you from foundational concepts to advanced execution."}
                  </p>
                </div>
              )}

              {/* Tab 2: Learn */}
              {activeTab === "learn" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {whatYouWillLearn.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2.5 rounded-xl bg-[#F8FAFD] border border-[#E9EEF5] text-xs text-[#334155]"
                    >
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Software */}
              {activeTab === "software" && (
                <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#E9EEF5] text-xs text-[#4A5568] space-y-1">
                  <p>{currentCourse.software_required || "Standard browser and stable internet connection."}</p>
                </div>
              )}

              {/* Tab 4: Mentor */}
              {activeTab === "mentor" && (
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#F8FAFD] border border-[#E9EEF5]">
                  <img
                    src={
                      currentCourse.mentor_photo ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                    }
                    alt={currentCourse.mentor_name}
                    className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">{currentCourse.mentor_name}</h4>
                    <p className="text-[11px] text-[#035BE3] font-semibold">{currentCourse.mentor_role}</p>
                    <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-1">{currentCourse.mentor_bio}</p>
                  </div>
                </div>
              )}

              {/* Tab 5: Doubts */}
              {activeTab === "doubts" && (
                <div className="space-y-2.5 text-xs">
                  <textarea
                    rows={2}
                    placeholder="Type your question or doubt here..."
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs outline-none focus:border-[#035BE3] bg-[#F8FAFD]"
                  />
                  <button
                    type="button"
                    className="h-8 px-4 rounded-lg bg-[#035BE3] text-white text-xs font-bold transition hover:bg-[#024bc0] cursor-pointer"
                  >
                    Submit Question
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT 4 COLS: COMPACT CURRICULUM PLAYLIST */}
          <div className="lg:col-span-4 space-y-3">
            
            {/* Playlist Header */}
            <div className="bg-white rounded-2xl p-4 border border-[#E9EEF5] shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#0F172A]">Course Content</h3>
                  <p className="text-[10.5px] text-[#64748B]">{allLectures.length} Total Lectures</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-50 text-[#035BE3] border border-blue-200">
                  {completedCount}/{totalLecturesCount} Watched
                </span>
              </div>

              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Sections Accordion Playlist */}
            <div className="bg-white rounded-2xl p-3 border border-[#E9EEF5] shadow-xs space-y-2.5 max-h-[640px] overflow-y-auto scrollbar-thin">
              {groupedSections.map((sec, sIdx) => {
                const isExpanded = expandedSections[sec.section_name] ?? true;

                return (
                  <div
                    key={sIdx}
                    className="rounded-xl border border-[#E9EEF5] overflow-hidden bg-[#FAFCFF]"
                  >
                    {/* Section Header */}
                    <button
                      type="button"
                      onClick={() => toggleSection(sec.section_name)}
                      className="w-full p-3 flex items-center justify-between text-left font-bold text-xs bg-white hover:bg-gray-50 transition cursor-pointer text-[#0F172A]"
                    >
                      <span className="truncate pr-2">{sec.section_name}</span>
                      <div className="flex items-center gap-1.5 text-[#64748B] shrink-0">
                        <span className="text-[10px]">{sec.lectures.length} lessons</span>
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </div>
                    </button>

                    {/* Lessons */}
                    {isExpanded && (
                      <div className="divide-y divide-[#E9EEF5]">
                        {sec.lectures.map((lec) => {
                          const isActive = activeLecture?.id === lec.id;
                          const isWatched = completedLectures.includes(lec.id);
                          const isPlayable = isEnrolled || lec.is_free_preview;

                          return (
                            <div
                              key={lec.id}
                              onClick={() => {
                                if (isPlayable) {
                                  setActiveLecture(lec);
                                }
                              }}
                              className={`p-2.5 flex items-center justify-between gap-2.5 text-xs transition cursor-pointer ${
                                isActive
                                  ? "bg-[#035BE3]/10 text-[#035BE3] font-bold border-l-3 border-l-[#035BE3]"
                                  : isPlayable
                                  ? "hover:bg-white text-[#334155]"
                                  : "opacity-40 cursor-not-allowed text-[#94A3B8]"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="shrink-0">
                                  {isWatched ? (
                                    <CheckCircle2 size={14} className="text-emerald-600" />
                                  ) : isActive ? (
                                    <div className="w-3.5 h-3.5 rounded-full bg-[#035BE3] flex items-center justify-center">
                                      <Play size={8} className="text-white fill-current ml-0.2" />
                                    </div>
                                  ) : isPlayable ? (
                                    <Play size={11} className="text-[#64748B]" />
                                  ) : (
                                    <Lock size={11} className="text-gray-400" />
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-[11.5px]">{lec.title}</p>
                                  <span className="text-[10px] text-[#8A99AD] block">⏱️ {lec.duration || "5m"}</span>
                                </div>
                              </div>

                              <div className="shrink-0">
                                {isWatched ? (
                                  <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                                    Done
                                  </span>
                                ) : isActive ? (
                                  <span className="text-[9.5px] font-bold text-[#035BE3] bg-blue-100 px-1.5 py-0.2 rounded-md">
                                    Playing
                                  </span>
                                ) : null}
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

        </div>
      </section>

      <Footer />

      {/* Course Final Quiz Assessment Modal */}
      {showQuiz && (
        <CourseQuizModal
          course={currentCourse}
          user={user}
          onClose={() => setShowQuiz(false)}
          onPassCertificate={handleQuizPass}
        />
      )}

      {/* Verified Certificate Modal with PDF Download */}
      {certificateModal && (
        <CertificateModal
          certificate={certificateModal}
          onClose={() => setCertificateModal(null)}
        />
      )}
    </div>
  );
}
