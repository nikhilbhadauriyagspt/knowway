import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  CheckCircle2,
  Lock,
  Globe,
  Briefcase,
  Sparkles,
  Award,
  Users,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ArrowRight,
  Quote,
  Clock,
  ShieldCheck,
  Check,
  X,
  Send,
  Video,
  FileCheck,
  TrendingUp,
  Laptop,
  Flame,
  ArrowUpRight,
  BookOpen,
  HelpCircle,
  ExternalLink,
  PlusCircle,
  MessageSquare,
  Upload,
  Star,
  FileText,
  BadgePercent,
  CheckCircle,
  Loader2,
} from "lucide-react";
import SecureVideoPlayer from "../../components/SecureVideoPlayer";
import {
  getFreelanceModulesApi,
  submitFreelanceApplicationApi,
  getVideoSecurityConfigApi,
  getFreelanceTestimonialsApi,
  submitFreelanceTestimonialApi,
} from "../../services/api";

// Fallback initial stories
const INITIAL_STORIES = [
  {
    id: 1,
    name: "Chaya Rajput",
    skill: "Graphic Design & AI",
    badge: "Canva & AI Specialist",
    story:
      "IDigitalPreneur made learning digital skills and freelancing exciting! With easy-to-follow courses and supportive mentors, I gained a fresh perspective and discovered new possibilities.",
    earned: "₹35,000/mo",
    avatarBg: "from-amber-400 to-orange-500",
    rating: 5,
  },
  {
    id: 2,
    name: "Sanah Mubin Ali Inamdar",
    skill: "AI Phonics & Canva",
    badge: "Teaching Online",
    story:
      "IDigitalPreneur helped me learn graphic design and AI. I created AI phonics videos and got the chance to teach phonics online using Canva. Grateful to turn my learning into teaching!",
    earned: "₹40,000/mo",
    avatarBg: "from-blue-500 to-indigo-600",
    rating: 5,
  },
  {
    id: 3,
    name: "Gaurav Vishwakarma",
    skill: "Digital Skills & Freelancing",
    badge: "Action Taker",
    story:
      "I’m Gaurav! IDigitalPreneur is helping me build digital skills, gain confidence, and explore freelancing. With every lesson, I’m turning ambition into action and moving closer to my goals! 🚀",
    earned: "₹38,000/mo",
    avatarBg: "from-emerald-400 to-teal-600",
    rating: 5,
  },
  {
    id: 4,
    name: "Neha",
    location: "Delhi",
    skill: "Social Media Management",
    badge: "Brand Strategist",
    story:
      "I’m Neha from Delhi and a student at IDP. I enrolled in Social Media Management and learned content planning, reel strategy & analytics. Today, I manage brand accounts and handle client growth strategies.",
    earned: "₹45,000/mo",
    avatarBg: "from-pink-500 to-rose-600",
    rating: 5,
  },
  {
    id: 5,
    name: "Riya",
    location: "Rajasthan",
    skill: "Graphic Designing",
    badge: "Visual Designer",
    story:
      "I’m Riya from Rajasthan. I joined the Graphic Designing course and learned branding, logo design, color theory & social creatives. Now, I design for clients and manage brand visuals confidently.",
    earned: "₹32,000/mo",
    avatarBg: "from-purple-500 to-indigo-600",
    rating: 5,
  },
  {
    id: 6,
    name: "Sameer",
    location: "Rajasthan",
    skill: "Canva & Branding",
    badge: "Paid Trainer",
    story:
      "I learned Canva, branding & logo design but didn’t know how to build a portfolio. IDIGITALPRENEUR taught me. I applied to companies, got noticed, and even received a paid teaching opportunity with IDIGITALPRENEUR.",
    earned: "₹50,000/mo",
    avatarBg: "from-amber-500 to-yellow-600",
    rating: 5,
  },
  {
    id: 7,
    name: "Arjun",
    skill: "Mobile Video Editing",
    badge: "Video Editor",
    story:
      "I enrolled in the Mobile Video Editing course where I learned transitions, sound design, reels formatting & client workflow. Today, I work with multiple creators and manage editing projects professionally.",
    earned: "₹42,000/mo",
    avatarBg: "from-cyan-500 to-blue-600",
    rating: 5,
  },
  {
    id: 8,
    name: "Sonal",
    location: "Bihar",
    skill: "Meta Ads Setup",
    badge: "Paid Ads Expert",
    story:
      "Hi, I’m Neha from Bihar. I learned Meta Ads setup, targeting, creative testing & optimization. After a demo campaign, IDIGITALPRENEUR gave me a real brand paid project. Now I handle ads confidently.",
    earned: "₹48,000/mo",
    avatarBg: "from-emerald-500 to-green-600",
    rating: 5,
  },
  {
    id: 9,
    name: "Armaan",
    location: "MP",
    skill: "CapCut & Sound Design",
    badge: "Short-Form Creator",
    story:
      "I’m Armaan from MP. I learned CapCut editing, overlays, sound, transitions & AI effects. Built my portfolio and got a paid short-form project within the company. Thank you IDIGITALPRENEUR.",
    earned: "₹36,000/mo",
    avatarBg: "from-violet-500 to-purple-600",
    rating: 5,
  },
  {
    id: 10,
    name: "Kunal",
    skill: "Performance Marketing",
    badge: "Campaign Manager",
    story:
      "I’m Kunal, student at IDP. I joined the Performance Marketing course and learned Meta Ads setup, targeting & optimization. Now, I run ad campaigns and manage client budgets confidently.",
    earned: "₹55,000/mo",
    avatarBg: "from-sky-500 to-indigo-600",
    rating: 5,
  },
  {
    id: 11,
    name: "Priya",
    location: "Bihar",
    skill: "Content Writing",
    badge: "SEO Copywriter",
    story:
      "I’m Priya from Bihar. I enrolled in the Content Writing course and learned copywriting, SEO basics & sales scripts. Today, I work with clients and create content that drives results.",
    earned: "₹30,000/mo",
    avatarBg: "from-fuchsia-500 to-pink-600",
    rating: 5,
  },
];

export default function StudentFreelanceHub({ darkMode, user }) {
  const [selectedLanguage, setSelectedLanguage] = useState("Hindi");
  const [modules, setModules] = useState([]);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loadingModules, setLoadingModules] = useState(true);
  const [videoSecurityConfig, setVideoSecurityConfig] = useState(null);

  const [activeModal, setActiveModal] = useState(null); // 'freelancer' | 'creator' | 'scholarship' | 'add_testimonial'
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Testimonials state with local persistence
  // Dynamic Testimonials from DB with fallback
  const [stories, setStories] = useState(() => {
    try {
      const saved = localStorage.getItem("knowway_freelancer_stories");
      return saved ? JSON.parse(saved) : INITIAL_STORIES;
    } catch {
      return INITIAL_STORIES;
    }
  });

  // Fetch live testimonials from database
  const loadTestimonials = async () => {
    try {
      const res = await getFreelanceTestimonialsApi();
      if (res?.success && Array.isArray(res.testimonials) && res.testimonials.length > 0) {
        const formatted = res.testimonials.map((t) => ({
          id: t.id,
          name: t.name,
          location: t.location || "",
          skill: t.skill,
          badge: t.badge || "Verified Freelancer",
          story: t.story,
          earned: t.earned || "₹30,000/mo",
          avatarBg: t.avatar_bg || "from-amber-400 to-orange-500",
          rating: t.rating || 5,
        }));
        setStories(formatted);
        try {
          localStorage.setItem("knowway_freelancer_stories", JSON.stringify(formatted));
        } catch (_) {}
      }
    } catch (err) {
      console.warn("Could not load dynamic testimonials from DB, using cache/fallback:", err.message);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  // Slider scroll ref
  const sliderRef = useRef(null);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // 1. Fetch Dynamic Modules from API based on Selected Language
  useEffect(() => {
    let isMounted = true;
    const fetchModules = async () => {
      try {
        setLoadingModules(true);
        const res = await getFreelanceModulesApi(selectedLanguage);
        if (res?.success && Array.isArray(res.modules) && isMounted) {
          setModules(res.modules);
          if (res.modules.length > 0) {
            setActiveModuleId(res.modules[0].id);
            if (res.modules[0].lessons?.length > 0) {
              setActiveLesson(res.modules[0].lessons[0]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch freelance modules:", err);
      } finally {
        if (isMounted) setLoadingModules(false);
      }
    };

    fetchModules();
    return () => {
      isMounted = false;
    };
  }, [selectedLanguage]);

  // 2. Fetch Central Video Security & DRM settings
  useEffect(() => {
    getVideoSecurityConfigApi()
      .then((res) => {
        if (res?.success && res.settings) {
          setVideoSecurityConfig(res.settings);
        }
      })
      .catch((err) => console.warn("Video security config notice:", err.message));
  }, []);

  // Application form data
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    skill: "Video Editing",
    experienceLevel: "Beginner",
    portfolioUrl: "",
    hoursAvailable: "15-20 Hours/Week",
    monthlyGoal: "₹30,000 - ₹50,000",
    message: "",
  });

  // Testimonial submission form data
  const [testimonialData, setTestimonialData] = useState({
    name: user?.name || "",
    location: "",
    skill: "Video Editing",
    badge: "Active Freelancer",
    story: "",
    earned: "₹25,000/mo",
    rating: 5,
  });

  // Handle Application Submit to Backend Database
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await submitFreelanceApplicationApi({
        user_id: user?.id || null,
        type: activeModal,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        skill: formData.skill,
        experience_level: formData.experienceLevel,
        hours_available: formData.hoursAvailable,
        portfolio_url: formData.portfolioUrl,
        monthly_goal: formData.monthlyGoal,
        notes: formData.message,
      });

      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setActiveModal(null);
      }, 2500);
    } catch (err) {
      alert("Application submission failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTestimonialSubmit = async (e) => {
    e.preventDefault();
    if (!testimonialData.story || !testimonialData.name) return;

    try {
      const payload = {
        user_id: user?.id || null,
        name: testimonialData.name,
        location: testimonialData.location || "India",
        skill: testimonialData.skill,
        badge: testimonialData.badge || "Verified Freelancer",
        story: testimonialData.story,
        earned: testimonialData.earned || "₹25,000/mo",
        avatar_bg: "from-blue-600 to-indigo-600",
        rating: testimonialData.rating || 5,
      };

      const res = await submitFreelanceTestimonialApi(payload);
      if (res?.success) {
        await loadTestimonials();
      } else {
        // Local fallback if API responds otherwise
        const newStory = {
          id: Date.now(),
          ...payload,
          avatarBg: payload.avatar_bg,
        };
        const updated = [newStory, ...stories];
        setStories(updated);
        try {
          localStorage.setItem("knowway_freelancer_stories", JSON.stringify(updated));
        } catch (_) {}
      }
    } catch (err) {
      console.warn("Failed saving testimonial to server, saving locally:", err.message);
      const newStory = {
        id: Date.now(),
        name: testimonialData.name,
        location: testimonialData.location || "India",
        skill: testimonialData.skill,
        badge: testimonialData.badge || "Verified Freelancer",
        story: testimonialData.story,
        earned: testimonialData.earned || "₹25,000/mo",
        avatarBg: "from-blue-600 to-indigo-600",
        rating: testimonialData.rating,
      };
      const updated = [newStory, ...stories];
      setStories(updated);
      try {
        localStorage.setItem("knowway_freelancer_stories", JSON.stringify(updated));
      } catch (_) {}
    }

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setActiveModal(null);
      if (sliderRef.current) sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* ======================================================== */}
      {/* 1. TOP HEADER BRANDED PILL BAR */}
      {/* ======================================================== */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 ${
          darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
        }`}
      >
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#035BE3]/10 text-[#035BE3] border border-[#035BE3]/20">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Freelance Hub & Career Track</span>
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-black tracking-tight ${
              darkMode ? "text-white" : "text-[#0F172A]"
            }`}
          >
            Freelance Accelerator Modules
          </h1>
          <p
            className={`text-xs sm:text-sm leading-relaxed ${
              darkMode ? "text-[#94A3B8]" : "text-[#556377]"
            }`}
          >
            Follow the step-by-step video blueprint, learn high-income client acquisition, and work on real brand opportunities.
          </p>
        </div>

        {/* Language selector toggle */}
        <div
          className={`p-2 rounded-2xl border flex items-center gap-2 shrink-0 ${
            darkMode ? "bg-[#0A0E17] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
          }`}
        >
          <div className="px-2 text-xs font-bold text-[#8A99AD] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#035BE3]" />
            <span>Select Language</span>
          </div>
          <div
            className={`flex items-center gap-1 p-1 rounded-xl border ${
              darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
            }`}
          >
            {["Hindi", "English"].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                  selectedLanguage === lang
                    ? "bg-[#035BE3] text-white shadow-xs"
                    : darkMode
                    ? "text-[#8A99AD] hover:text-white"
                    : "text-[#556377] hover:text-[#0F172A]"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN LMS VIDEO CLASSROOM (DRM Protected Video Player) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Video Stage with SecureVideoPlayer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div
            className={`rounded-3xl border overflow-hidden p-3 sm:p-4 ${
              darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
            }`}
          >
            {/* 16:9 Secure Video Player Screen */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-inner border border-black/40 flex items-center justify-center">
              {activeLesson?.video_url ? (
                <SecureVideoPlayer
                  key={activeLesson.id}
                  src={activeLesson.video_url}
                  title={activeLesson.title}
                  isUnlocked={true}
                  securityConfig={videoSecurityConfig}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-linear-to-b from-slate-900 to-black text-white relative">
                  <div className="w-16 h-16 rounded-full bg-[#035BE3] text-white flex items-center justify-center shadow-lg">
                    <Play className="w-8 h-8 ml-1" fill="currentColor" />
                  </div>
                  <h3 className="text-sm font-bold mt-3">Select a lecture to start playing</h3>
                </div>
              )}
            </div>

            {/* Video Meta Info Footer */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#035BE3] tracking-wider block">
                  Active Lecture • {selectedLanguage}
                </span>
                <h2
                  className={`text-base font-bold mt-0.5 ${
                    darkMode ? "text-white" : "text-[#0F172A]"
                  }`}
                >
                  {activeLesson?.title || "Choose a lesson"}
                </h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DRM Secured Stream</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Module Accordion & Dynamic Video List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className={`rounded-3xl border p-5 sm:p-6 ${
              darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
            }`}
          >
            <div
              className={`flex items-center justify-between pb-4 border-b mb-4 ${
                darkMode ? "border-[#222B3D]" : "border-[#E2E8F0]"
              }`}
            >
              <div>
                <h3
                  className={`text-sm font-black uppercase tracking-wider ${
                    darkMode ? "text-white" : "text-[#0F172A]"
                  }`}
                >
                  Course Modules
                </h3>
                <p className={`text-[11px] ${darkMode ? "text-[#8A99AD]" : "text-[#64748B]"}`}>
                  Select a video lesson to begin
                </p>
              </div>
              <span className="text-xs font-bold text-[#035BE3] px-2.5 py-0.5 rounded-full bg-[#035BE3]/10">
                {modules.length} Modules
              </span>
            </div>

            {/* Modules Accordion */}
            {loadingModules ? (
              <div className="py-12 text-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#035BE3] mx-auto" />
                <p className="text-xs text-[#8A99AD]">Loading curriculum modules...</p>
              </div>
            ) : modules.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#8A99AD]">
                No modules found for {selectedLanguage}.
              </div>
            ) : (
              <div className="space-y-3">
                {modules.map((mod) => {
                  const isOpen = activeModuleId === mod.id;
                  return (
                    <div
                      key={mod.id}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isOpen
                          ? darkMode
                            ? "border-[#035BE3]/50 bg-[#0E1420]"
                            : "border-[#035BE3]/40 bg-[#F8FAFD]"
                          : darkMode
                          ? "border-[#222B3D] bg-[#0E1420]/50"
                          : "border-[#E2E8F0] bg-[#FAFAFA]"
                      }`}
                    >
                      {/* Module Accordion Head */}
                      <button
                        onClick={() => setActiveModuleId(isOpen ? null : mod.id)}
                        className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-[#035BE3]/10 text-[#035BE3] font-black text-xs flex items-center justify-center shrink-0">
                            {mod.number || mod.module_number}
                          </span>
                          <div>
                            <h4
                              className={`text-xs sm:text-sm font-bold ${
                                darkMode ? "text-white" : "text-[#0F172A]"
                              }`}
                            >
                              {mod.title}
                            </h4>
                            <p
                              className={`text-[10px] mt-0.5 line-clamp-1 ${
                                darkMode ? "text-[#8A99AD]" : "text-[#64748B]"
                              }`}
                            >
                              {mod.subtitle}
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isOpen ? "rotate-180 text-[#035BE3]" : darkMode ? "text-[#8A99AD]" : "text-[#64748B]"
                          }`}
                        />
                      </button>

                      {/* Lessons inside Module */}
                      {isOpen && (
                        <div
                          className={`p-2 pt-0 space-y-1.5 border-t ${
                            darkMode ? "border-[#222B3D]" : "border-[#E2E8F0]"
                          }`}
                        >
                          {mod.lessons?.length === 0 ? (
                            <p className="text-[11px] text-[#8A99AD] p-2 italic">
                              No lessons in this module.
                            </p>
                          ) : (
                            mod.lessons.map((lesson) => {
                              const isCurrent = activeLesson?.id === lesson.id;
                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => setActiveLesson(lesson)}
                                  className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                                    isCurrent
                                      ? "bg-[#035BE3] text-white shadow-sm font-bold"
                                      : darkMode
                                      ? "hover:bg-[#1E2638] text-[#94A3B8]"
                                      : "hover:bg-white text-[#556377]"
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0 pr-2">
                                    <span
                                      className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                                        isCurrent
                                          ? "bg-white/20 text-white"
                                          : darkMode
                                          ? "bg-gray-800 text-[#8A99AD]"
                                          : "bg-gray-100 text-[#64748B]"
                                      }`}
                                    >
                                      {lesson.number || lesson.lesson_number}
                                    </span>
                                    <span className="text-xs line-clamp-1">{lesson.title}</span>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span
                                      className={`text-[10px] ${
                                        isCurrent
                                          ? "text-white/80"
                                          : darkMode
                                          ? "text-[#8A99AD]"
                                          : "text-[#64748B]"
                                      }`}
                                    >
                                      {lesson.duration}
                                    </span>
                                    {isCurrent ? (
                                      <Play className="w-3.5 h-3.5 fill-current" />
                                    ) : (
                                      <ChevronRight className="w-3.5 h-3.5 text-[#8A99AD]" />
                                    )}
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. THREE IDIGITALPRENEUR HIGHLIGHT OPPORTUNITY CARDS */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Want to become a freelancer? */}
        <div
          className={`p-7 rounded-3xl border flex flex-col justify-between transition-all group relative overflow-hidden ${
            darkMode
              ? "bg-[#131926] border-[#222B3D] hover:border-[#035BE3]"
              : "bg-white border-[#E2E8F0] hover:border-[#035BE3] shadow-xs"
          }`}
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center mb-5">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3
              className={`text-lg sm:text-xl font-black leading-tight mb-2 ${
                darkMode ? "text-white" : "text-[#0F172A]"
              }`}
            >
              Want to become a freelancer?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-500 font-extrabold mb-2">
              Earn up to 40,000 per month.
            </p>
            <p
              className={`text-xs leading-relaxed mb-6 ${
                darkMode ? "text-[#8A99AD]" : "text-[#64748B]"
              }`}
            >
              Apply now to start your freelance journey with guided mentorship, project reviews, and direct client pipelines.
            </p>
          </div>

          <button
            onClick={() => setActiveModal("freelancer")}
            className="w-full h-11 rounded-xl bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card 2: Creator Opportunities */}
        <div
          className={`p-7 rounded-3xl border flex flex-col justify-between transition-all group relative overflow-hidden ${
            darkMode
              ? "bg-[#131926] border-purple-500/30 hover:border-purple-500"
              : "bg-white border-purple-200 hover:border-purple-400 shadow-xs"
          }`}
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3
              className={`text-lg sm:text-xl font-black leading-tight mb-2 ${
                darkMode ? "text-white" : "text-[#0F172A]"
              }`}
            >
              “Creator Opportunities”
            </h3>
            <p className="text-xs sm:text-sm text-purple-500 font-extrabold mb-2">
              Work on Real Brand Projects
            </p>
            <p
              className={`text-xs leading-relaxed mb-6 ${
                darkMode ? "text-[#8A99AD]" : "text-[#64748B]"
              }`}
            >
              Get a chance to work on real projects from industry creators, YouTube channels, and high-growth digital brands.
            </p>
          </div>

          <button
            onClick={() => setActiveModal("creator")}
            className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card 3: Earned through a skill? */}
        <div
          className={`p-7 rounded-3xl border flex flex-col justify-between transition-all group relative overflow-hidden ${
            darkMode
              ? "bg-[#131926] border-amber-500/30 hover:border-amber-500"
              : "bg-white border-amber-200 hover:border-amber-400 shadow-xs"
          }`}
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5">
              <Award className="w-6 h-6" />
            </div>
            <h3
              className={`text-lg sm:text-xl font-black leading-tight mb-2 ${
                darkMode ? "text-white" : "text-[#0F172A]"
              }`}
            >
              Earned through a skill you learned?
            </h3>
            <p className="text-xs sm:text-sm text-amber-500 font-extrabold mb-2">
              Get recognized & rewarded
            </p>
            <p
              className={`text-xs leading-relaxed mb-6 ${
                darkMode ? "text-[#8A99AD]" : "text-[#64748B]"
              }`}
            >
              Get recognized for your freelance earnings achieved through your learning journey and claim exclusive scholarships!
            </p>
          </div>

          <button
            onClick={() => setActiveModal("scholarship")}
            className="w-full h-11 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Get Scholarship</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. FREELANCER SPOTLIGHT (HORIZONTAL SCROLL + ADD TESTIMONIAL) */}
      {/* ======================================================== */}
      <div
        className={`rounded-3xl border p-6 sm:p-9 ${
          darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
        }`}
      >
        {/* Header with Title + Scroll Arrows + "Add Your Testimonial" Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Success Stories ({stories.length}+)</span>
            </div>
            <h2
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                darkMode ? "text-white" : "text-[#0F172A]"
              }`}
            >
              Freelancer Spotlight! 🌟
            </h2>
            <p className={`text-xs sm:text-sm mt-1 ${darkMode ? "text-[#8A99AD]" : "text-[#64748B]"}`}>
              Scroll through real student journeys or share your own freelance milestone.
            </p>
          </div>

          {/* Action cluster: Add Testimonial + Left/Right Slide Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveModal("add_testimonial")}
              className="h-10 px-4 rounded-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-sm hover:shadow transition flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Your Testimonial</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollSlider("left")}
                aria-label="Previous Stories"
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition cursor-pointer ${
                  darkMode
                    ? "bg-[#0E1420] border-[#222B3D] text-[#8A99AD] hover:text-white hover:border-[#035BE3]"
                    : "bg-white border-[#E2E8F0] text-[#556377] hover:text-[#035BE3] hover:border-[#035BE3] shadow-xs"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollSlider("right")}
                aria-label="Next Stories"
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition cursor-pointer ${
                  darkMode
                    ? "bg-[#0E1420] border-[#222B3D] text-[#8A99AD] hover:text-white hover:border-[#035BE3]"
                    : "bg-white border-[#E2E8F0] text-[#556377] hover:text-[#035BE3] hover:border-[#035BE3] shadow-xs"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel Track */}
        <div
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {stories.map((s) => (
            <div
              key={s.id}
              className={`min-w-[320px] sm:min-w-[360px] max-w-[360px] p-6 rounded-2xl border flex flex-col justify-between shrink-0 snap-start transition-all hover:scale-[1.01] ${
                darkMode
                  ? "bg-[#0E1420] border-[#222B3D] hover:border-amber-500/40"
                  : "bg-[#F8FAFD] border-[#E2E8F0] hover:border-amber-400/60 shadow-xs"
              }`}
            >
              <div>
                {/* Header User info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl bg-linear-to-tr ${s.avatarBg || "from-amber-400 to-orange-500"} text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0`}
                    >
                      {s.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4
                        className={`text-sm font-bold truncate ${
                          darkMode ? "text-white" : "text-[#0F172A]"
                        }`}
                      >
                        {s.name}
                      </h4>
                      <p
                        className={`text-[11px] truncate mt-0.5 ${
                          darkMode ? "text-[#8A99AD]" : "text-[#64748B]"
                        }`}
                      >
                        {s.skill} {s.location ? `• ${s.location}` : ""}
                      </p>
                    </div>
                  </div>
                  <Quote className="w-5 h-5 text-[#8A99AD]/30 shrink-0" />
                </div>

                {/* Stars Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(s.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Testimonial Quote */}
                <p
                  className={`text-xs leading-relaxed italic mb-4 line-clamp-4 ${
                    darkMode ? "text-[#94A3B8]" : "text-[#556377]"
                  }`}
                >
                  “{s.story}”
                </p>
              </div>

              {/* Bottom Tag & Income */}
              <div
                className={`pt-3 border-t flex items-center justify-between ${
                  darkMode ? "border-[#222B3D]" : "border-[#E2E8F0]"
                }`}
              >
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    darkMode
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-blue-50 text-[#035BE3]"
                  }`}
                >
                  {s.badge}
                </span>
                <span className="text-xs font-black font-mono text-emerald-500">
                  {s.earned}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5A. APPLICATION MODAL CONNECTED TO DATABASE */}
      {/* ======================================================== */}
      {activeModal && activeModal !== "add_testimonial" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div
            className={`w-full max-w-xl rounded-3xl border p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 my-8 ${
              darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            {/* Close */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-inherit flex items-center justify-center text-[#8A99AD] hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {formSubmitted ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold">Application Successfully Submitted!</h3>
                <p className="text-xs text-[#8A99AD] max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-emerald-500">{formData.name}</strong>. Our student career placement cell will review your portfolio and reach out to your WhatsApp (<span className="text-[#035BE3]">{formData.phone}</span>) with client briefs.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="pr-6">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#035BE3] bg-[#035BE3]/10 px-2.5 py-0.5 rounded-full mb-1">
                    <Briefcase className="w-3 h-3" />
                    {activeModal === "freelancer"
                      ? "Freelance Career Track"
                      : activeModal === "creator"
                      ? "Brand & Creator Opportunities"
                      : "Earnings Scholarship Claim"}
                  </span>
                  <h3 className="text-xl font-black mt-1">
                    {activeModal === "freelancer"
                      ? "Apply for Freelance Onboarding"
                      : activeModal === "creator"
                      ? "Join Paid Creator Projects Pool"
                      : "Claim Your Freelance Scholarship"}
                  </h3>
                  <p className="text-xs text-[#8A99AD] mt-1">
                    Provide accurate details to match with industry creators and verified brands.
                  </p>
                </div>

                <div className="space-y-3.5 pt-2">
                  {/* Row 1: Full Name & WhatsApp Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full h-11 px-3.5 rounded-xl border text-xs outline-none transition ${
                          darkMode ? "bg-[#0E1420] border-[#222B3D] focus:border-[#035BE3]" : "bg-white border-[#E2E8F0] focus:border-[#035BE3]"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                        WhatsApp Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className={`w-full h-11 px-3.5 rounded-xl border text-xs outline-none transition ${
                          darkMode ? "bg-[#0E1420] border-[#222B3D] focus:border-[#035BE3]" : "bg-white border-[#E2E8F0] focus:border-[#035BE3]"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Primary Skill */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="student@example.com"
                        className={`w-full h-11 px-3.5 rounded-xl border text-xs outline-none transition ${
                          darkMode ? "bg-[#0E1420] border-[#222B3D] focus:border-[#035BE3]" : "bg-white border-[#E2E8F0] focus:border-[#035BE3]"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                        Primary Freelancing Skill <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.skill}
                        onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                        className={`w-full h-11 px-3 rounded-xl border text-xs outline-none transition ${
                          darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                        }`}
                      >
                        <option value="Video Editing">Mobile & PC Video Editing (Reels/Shorts)</option>
                        <option value="Graphic Design">Graphic Designing & Canva</option>
                        <option value="Meta Ads">Meta & Google Ads (Performance Marketing)</option>
                        <option value="Social Media">Social Media Management (SMM)</option>
                        <option value="Content Writing">Content Writing & Copywriting</option>
                        <option value="Web Development">Web Design & WordPress</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Experience & Availability */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                        Current Experience Level
                      </label>
                      <select
                        value={formData.experienceLevel}
                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                        className={`w-full h-11 px-3 rounded-xl border text-xs outline-none transition ${
                          darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                        }`}
                      >
                        <option value="Beginner">Beginner (Learned in Course, Ready for First Project)</option>
                        <option value="Intermediate">Intermediate (Done 1-3 Client Works)</option>
                        <option value="Advanced">Experienced (Handled Multiple Paid Projects)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                        Weekly Time Available
                      </label>
                      <select
                        value={formData.hoursAvailable}
                        onChange={(e) => setFormData({ ...formData, hoursAvailable: e.target.value })}
                        className={`w-full h-11 px-3 rounded-xl border text-xs outline-none transition ${
                          darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                        }`}
                      >
                        <option value="10-15 Hours/Week">10 - 15 Hours / Week (Part-time)</option>
                        <option value="20-30 Hours/Week">20 - 30 Hours / Week (Dedicated)</option>
                        <option value="Full-time">Full-time Freelance</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Portfolio Link / Google Drive */}
                  <div>
                    <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                      Portfolio / Sample Work Link <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      placeholder="Google Drive link, Behance, YouTube or Instagram profile"
                      className={`w-full h-11 px-3.5 rounded-xl border text-xs outline-none transition ${
                        darkMode ? "bg-[#0E1420] border-[#222B3D] focus:border-[#035BE3]" : "bg-white border-[#E2E8F0] focus:border-[#035BE3]"
                      }`}
                    />
                    <span className="text-[10px] text-[#8A99AD] mt-1 block">
                      Make sure your Google Drive folder access is set to &ldquo;Anyone with the link can view&rdquo;.
                    </span>
                  </div>

                  {/* Row 5: Notes / Goals */}
                  <div>
                    <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                      Tell us why you want to take on this project
                    </label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Briefly describe the tools you know (Premiere, CapCut, Canva, Meta Ads Manager, etc.)..."
                      className={`w-full p-3 rounded-xl border text-xs outline-none transition resize-none ${
                        darkMode ? "bg-[#0E1420] border-[#222B3D] focus:border-[#035BE3]" : "bg-white border-[#E2E8F0] focus:border-[#035BE3]"
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-black transition cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{isSubmitting ? "Submitting..." : "Submit Application for Review"}</span>
                  </button>
                  <p className="text-[10px] text-center text-[#8A99AD] mt-2">
                    🔒 Your submission is saved to the placement database and reviewed by admins.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5B. ADD YOUR TESTIMONIAL MODAL */}
      {/* ======================================================== */}
      {activeModal === "add_testimonial" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div
            className={`w-full max-w-lg rounded-3xl border p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 my-8 ${
              darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            {/* Close */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-inherit flex items-center justify-center text-[#8A99AD] hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {formSubmitted ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold">Your Story is Now Live! 🌟</h3>
                <p className="text-xs text-[#8A99AD] max-w-sm mx-auto leading-relaxed">
                  Congratulations! Your testimonial has been added to the Freelancer Spotlight slider. Keep inspiring fellow learners!
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddTestimonialSubmit} className="space-y-4">
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full mb-1">
                    <Sparkles className="w-3 h-3" />
                    Share Your Milestone
                  </span>
                  <h3 className="text-xl font-black mt-1">Add Your Freelance Testimonial</h3>
                  <p className="text-xs text-[#8A99AD] mt-1">
                    Inspire thousands of students by sharing how you turned your learned skills into real income.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                        Your Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={testimonialData.name}
                        onChange={(e) =>
                          setTestimonialData({ ...testimonialData, name: e.target.value })
                        }
                        placeholder="e.g. Aman Verma"
                        className={`w-full h-11 px-3.5 rounded-xl border text-xs outline-none transition ${
                          darkMode ? "bg-[#0E1420] border-[#222B3D] focus:border-amber-500" : "bg-white border-[#E2E8F0] focus:border-amber-500"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                        State / City
                      </label>
                      <input
                        type="text"
                        value={testimonialData.location}
                        onChange={(e) =>
                          setTestimonialData({ ...testimonialData, location: e.target.value })
                        }
                        placeholder="e.g. Mumbai, Maharashtra"
                        className={`w-full h-11 px-3.5 rounded-xl border text-xs outline-none transition ${
                          darkMode ? "bg-[#0E1420] border-[#222B3D] focus:border-amber-500" : "bg-white border-[#E2E8F0] focus:border-amber-500"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                        Digital Skill
                      </label>
                      <select
                        value={testimonialData.skill}
                        onChange={(e) =>
                          setTestimonialData({ ...testimonialData, skill: e.target.value })
                        }
                        className={`w-full h-11 px-3 rounded-xl border text-xs outline-none transition ${
                          darkMode ? "bg-[#0E1420] border-[#222B3D] focus:border-amber-500" : "bg-white border-[#E2E8F0]"
                        }`}
                      >
                        <option value="Video Editing">Mobile & PC Video Editing</option>
                        <option value="Graphic Design">Graphic Designing & Canva</option>
                        <option value="Meta Ads">Performance Marketing & Ads</option>
                        <option value="Social Media">Social Media Management</option>
                        <option value="Content Writing">Content Writing & Copywriting</option>
                        <option value="AI Phonics & Teaching">AI Phonics & Teaching</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                        Monthly Income Achieved
                      </label>
                      <input
                        type="text"
                        value={testimonialData.earned}
                        onChange={(e) =>
                          setTestimonialData({ ...testimonialData, earned: e.target.value })
                        }
                        placeholder="e.g. ₹35,000/mo"
                        className={`w-full h-11 px-3.5 rounded-xl border text-xs outline-none transition ${
                          darkMode ? "bg-[#0E1420] border-[#222B3D] focus:border-amber-500" : "bg-white border-[#E2E8F0] focus:border-amber-500"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                      Role / Professional Title Tag
                    </label>
                    <input
                      type="text"
                      value={testimonialData.badge}
                      onChange={(e) =>
                        setTestimonialData({ ...testimonialData, badge: e.target.value })
                      }
                      placeholder="e.g. Short-Form Video Editor, Brand Strategist"
                      className={`w-full h-11 px-3.5 rounded-xl border text-xs outline-none transition ${
                        darkMode ? "bg-[#0E1420] border-[#222B3D] focus:border-amber-500" : "bg-white border-[#E2E8F0] focus:border-amber-500"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                      Your Success Story / Experience <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={testimonialData.story}
                      onChange={(e) =>
                        setTestimonialData({ ...testimonialData, story: e.target.value })
                      }
                      placeholder="Write how the course helped you, which tools you learned, and how you closed your client..."
                      className={`w-full p-3 rounded-xl border text-xs outline-none transition resize-none ${
                        darkMode ? "bg-[#0E1420] border-[#222B3D] focus:border-amber-500" : "bg-white border-[#E2E8F0] focus:border-amber-500"
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-12 rounded-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black transition cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Publish Testimonial</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
