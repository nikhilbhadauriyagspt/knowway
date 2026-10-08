import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers3,
  BookOpen,
  Clock,
  Users,
  UploadCloud,
  AlertCircle,
  Tag,
  ShieldCheck,
  Check,
  Loader2,
  Search,
  ExternalLink,
  GraduationCap,
  Image as ImageIcon,
} from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import {
  getCoursesApi,
  getMentorsApi,
  getPackageBySlugApi,
  createPackageApi,
  updatePackageApi,
  uploadImageApi,
  isAdminAuthenticated,
  getAdminUser,
} from "../services/api";

export default function CreatePackagePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Persistent Layout & Theme State
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("admin_dark_mode");
      if (saved !== null) return saved === "true";
      return false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser] = useState(getAdminUser());

  // Wizard Step State (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);

  // Loading & submission state
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState(null);

  // Banner Upload
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const bannerInputRef = useRef(null);

  // Data Lists for Multi-Select & Mentors
  const [coursesList, setCoursesList] = useState([]);
  const [mentorsList, setMentorsList] = useState([]);
  const [courseSearch, setCourseSearch] = useState("");

  // ========================================================
  // MAIN PACKAGE FORM STATE
  // ========================================================
  const [packageData, setPackageData] = useState({
    name: "Pro",
    slug: "pro",
    tagline:
      "Our step-by-step, skill-focused, and practical growth package. Specially designed for people who want to learn high-income digital skills and start their freelancing journey.",
    image_url: "/images/packages/pro.png",
    mrp_price: "11800",
    promo_price: "7999",
    mrp_note:
      "Full access to 9 value-packed courses, ideal for beginners, freelancers, content creators",
    promo_note:
      "Launch your Freelance career with 9+ High Value courses + lifetime access, tools, and community.",
    total_hours: "25+ Hours",
    enrolled_students: "45K+ Students Enrolled",
    overview_heading:
      "Unlock lifetime access, certification, and community support to grow, earn, and thrive confidently.",
    overview_desc:
      "A complete ecosystem designed for individuals who are serious about building their freelance career that leads to real results.",
    what_you_will_learn: [
      "Learn Artificial Intelligence tools to improve productivity and work smarter.",
      "Master Video Editing with Premiere Pro, Filmora, and create engaging content.",
      "Learn freelancing skills to find clients and start earning online.",
      "Design professional graphics using Canva for personal and business needs.",
      "Grow your Instagram presence with effective growth strategies.",
      "Understand Content Marketing and create content that attracts audiences.",
      "Create short-form videos that engage viewers and build digital presence.",
    ],
    faqs: [
      {
        question: "What’s included in this package?",
        answer:
          "The package includes full lifetime access to in-demand courses covering Freelancing, Video Editing, AI Tools, Graphic Design, Canva, and Social Media Marketing. You also get accredited completion certificates, downloadable project files, and access to our private community.",
      },
      {
        question: "Can I upgrade to a higher package later?",
        answer:
          "Yes, you can easily upgrade to Supreme, Premium, or Premium Plus packages from your student dashboard at any time by paying only the upgrade difference.",
      },
      {
        question: "What kind of certificate or recognition will I receive?",
        answer:
          "Upon scoring 60% or higher in the module quiz assessment, you will receive an official ISO-certified, verifiable digital certificate with unique QR code verification to add directly to your LinkedIn, resume, or client proposals.",
      },
    ],
    course_ids: [],
  });

  // Preset package templates for 1-click filling
  const presetTemplates = [
    {
      name: "Pro",
      slug: "pro",
      image_url: "/images/packages/pro.png",
      mrp_price: "11800",
      promo_price: "7999",
      tagline:
        "Our step-by-step, skill-focused, and practical growth package. Specially designed for people who want to learn high-income digital skills and start their freelancing journey.",
      total_hours: "25+ Hours",
      enrolled_students: "45K+ Students Enrolled",
    },
    {
      name: "Supreme",
      slug: "supreme",
      image_url: "/images/packages/supreme.png",
      mrp_price: "14800",
      promo_price: "9999",
      tagline:
        "Go deeper with advanced learning paths designed for digital growth and business skills. Master high-converting digital marketing, client scaling, and business workflows.",
      total_hours: "40+ Hours",
      enrolled_students: "28K+ Students Enrolled",
    },
    {
      name: "Premium",
      slug: "premium",
      image_url: "/images/packages/premium.png",
      mrp_price: "18800",
      promo_price: "12999",
      tagline:
        "Learn how digital commerce works and explore the skills behind building an online business. End-to-end frontend development, digital product selling, and practical monetization.",
      total_hours: "60+ Hours",
      enrolled_students: "18K+ Students Enrolled",
    },
    {
      name: "Premium Plus",
      slug: "premium-plus",
      image_url: "/images/packages/premium-plus.png",
      mrp_price: "24800",
      promo_price: "16999",
      tagline:
        "Explore content creation, personal branding, AI automation, and VIP founder community access with full lifetime privileges.",
      total_hours: "100+ Hours",
      enrolled_students: "9.5K+ Students Enrolled",
    },
  ];

  // Toast Helper
  const showToast = (message, type = "success") => {
    setNotificationMsg({ message, type });
    setTimeout(() => {
      setNotificationMsg(null);
    }, 3500);
  };

  // Auth Guard & Initial Data Fetch
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate("/admin/login", { replace: true });
      return;
    }

    const loadInitialData = async () => {
      try {
        let loadedCourses = [];

        // 1. Fetch all available courses
        try {
          const coursesRes = await getCoursesApi();
          if (coursesRes?.courses) {
            loadedCourses = coursesRes.courses;
            setCoursesList(coursesRes.courses);
          }
        } catch (e) {
          console.warn("Courses fetch notice:", e.message);
        }

        // 2. Fetch mentors directory
        try {
          const mentorsRes = await getMentorsApi();
          if (mentorsRes?.mentors) {
            setMentorsList(mentorsRes.mentors);
          }
        } catch (e) {
          console.warn("Mentors fetch notice:", e.message);
        }

        // 3. If in Edit Mode, fetch existing package details
        if (isEditMode) {
          try {
            const pkgRes = await getPackageBySlugApi(id);
            if (pkgRes?.package) {
              const p = pkgRes.package;
              const linkedIds = Array.isArray(p.courses) ? p.courses.map((c) => c.id) : [];

              setPackageData({
                name: p.name || "",
                slug: p.slug || "",
                tagline: p.tagline || "",
                image_url: p.image_url || "/images/packages/pro.png",
                mrp_price: String(p.mrp_price || 11800),
                promo_price: String(p.promo_price || 7999),
                mrp_note: p.mrp_note || "Full access to value-packed courses",
                promo_note: p.promo_note || "Launch your career with high-value courses",
                total_hours: p.total_hours || "25+ Hours",
                enrolled_students: p.enrolled_students || "45K+ Students Enrolled",
                overview_heading:
                  p.overview_heading ||
                  "Unlock lifetime access, certification, and community support",
                overview_desc:
                  p.overview_desc ||
                  "A complete ecosystem designed for individuals who are serious about building their career",
                what_you_will_learn:
                  Array.isArray(p.what_you_will_learn) && p.what_you_will_learn.length > 0
                    ? p.what_you_will_learn
                    : ["", "", ""],
                faqs:
                  Array.isArray(p.faqs) && p.faqs.length > 0
                    ? p.faqs
                    : [{ question: "", answer: "" }],
                course_ids: linkedIds,
              });
            }
          } catch (pErr) {
            console.error("Failed to load package for editing:", pErr);
            showToast("Failed to load package details for editing", "error");
          }
        } else {
          // In create mode, select all courses by default
          setPackageData((prev) => ({
            ...prev,
            course_ids: loadedCourses.map((c) => c.id),
          }));
        }
      } catch (err) {
        console.error("Package studio initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [navigate, id, isEditMode]);

  // Handle Banner Image File Upload to Cloudinary
  const handleBannerFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBanner(true);
    try {
      const res = await uploadImageApi(file, "knowway_packages");
      if (res?.success && (res.url || res.data?.url)) {
        const uploadedUrl = res.url || res.data?.url;
        setPackageData((prev) => ({
          ...prev,
          image_url: uploadedUrl,
        }));
        showToast("Banner artwork uploaded to Cloudinary!");
      } else {
        showToast(res?.message || "Failed to upload image", "error");
      }
    } catch (err) {
      showToast(err.message || "Error uploading image to Cloudinary", "error");
    } finally {
      setIsUploadingBanner(false);
    }
  };

  // Step Validation & Navigation
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!packageData.name.trim()) {
        showToast("Please enter a package name", "error");
        return;
      }
    } else if (currentStep === 2) {
      if (!packageData.promo_price || Number(packageData.promo_price) <= 0) {
        showToast("Please enter a valid offer price", "error");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit Final Package Payload
  const handleSubmitPackage = async () => {
    if (!packageData.name.trim()) {
      showToast("Package Name is required", "error");
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: packageData.name.trim(),
        slug:
          packageData.slug.trim() ||
          packageData.name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-"),
        tagline: packageData.tagline.trim(),
        image_url: packageData.image_url || "/images/packages/pro.png",
        mrp_price: Number(packageData.mrp_price) || 11800,
        promo_price: Number(packageData.promo_price) || 7999,
        mrp_note: packageData.mrp_note,
        promo_note: packageData.promo_note,
        total_hours: packageData.total_hours || "25+ Hours",
        enrolled_students: packageData.enrolled_students || "45K+ Students Enrolled",
        overview_heading: packageData.overview_heading,
        overview_desc: packageData.overview_desc,
        what_you_will_learn: packageData.what_you_will_learn.filter((item) => item.trim() !== ""),
        faqs: packageData.faqs.filter((faq) => faq.question.trim() !== ""),
        course_ids: packageData.course_ids,
      };

      const res = isEditMode
        ? await updatePackageApi(id, payload)
        : await createPackageApi(payload);

      if (res?.success) {
        showToast(
          isEditMode ? "🎉 Package updated successfully!" : "🎉 Package created successfully!"
        );
        setTimeout(() => {
          navigate("/admin/dashboard?tab=packages");
        }, 1200);
      } else {
        showToast(
          res?.message || (isEditMode ? "Failed to update package" : "Failed to create package"),
          "error"
        );
      }
    } catch (err) {
      showToast(err.message || "An unexpected error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Wizard Steps Configuration
  const wizardSteps = [
    { number: 1, title: "Identity & Banner", subtitle: "Name & Artwork", icon: Layers3 },
    { number: 2, title: "Pricing & Badges", subtitle: "MRP & Offers", icon: Tag },
    { number: 3, title: "Courses & Mentors", subtitle: `${packageData.course_ids.length} Courses`, icon: BookOpen },
    { number: 4, title: "Overview & FAQs", subtitle: "Review & Publish", icon: Sparkles },
  ];

  // Filtered courses for multi-select
  const filteredCourses = useMemo(() => {
    return coursesList.filter((c) => {
      if (!courseSearch.trim()) return true;
      const q = courseSearch.toLowerCase();
      return (
        c.title?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.mentor_name?.toLowerCase().includes(q) ||
        c.languages?.toLowerCase().includes(q)
      );
    });
  }, [coursesList, courseSearch]);

  // Mentors derived from currently selected courses
  const packageMentors = useMemo(() => {
    const selectedCourses = coursesList.filter((c) => packageData.course_ids.includes(c.id));
    const mentorMap = new Map();

    selectedCourses.forEach((c) => {
      const mentorKey = c.mentor_name || "Instructor";
      if (!mentorMap.has(mentorKey)) {
        // Find matching mentor object from mentorsList if available
        const matchedObj = mentorsList.find(
          (m) =>
            m.id === c.mentor_id ||
            m.name?.toLowerCase().trim() === c.mentor_name?.toLowerCase().trim()
        );

        mentorMap.set(mentorKey, {
          name: c.mentor_name || "Assigned Instructor",
          role: matchedObj?.role_title || c.category + " Specialist",
          photo:
            matchedObj?.photo_url ||
            c.mentor_photo ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
          experience_badge: matchedObj?.experience_badge || "Lead Mentor",
          coursesCount: 1,
        });
      } else {
        const existing = mentorMap.get(mentorKey);
        existing.coursesCount += 1;
      }
    });

    return Array.from(mentorMap.values());
  }, [coursesList, packageData.course_ids, mentorsList]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 antialiased ${
        darkMode ? "bg-[#0B0F17] text-[#E2E8F0]" : "bg-[#F4F6FA] text-[#0F172A]"
      }`}
    >
      {/* Toast Notification Banner */}
      {notificationMsg && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3.5 rounded-full border flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-3 duration-200 shadow-lg ${
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

      {/* Admin Sidebar */}
      <AdminSidebar
        activeTab="packages"
        setActiveTab={(tab) => {
          if (tab === "dashboard") navigate("/admin/dashboard");
          else navigate(`/admin/dashboard?tab=${tab}`);
        }}
        adminUser={adminUser}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        darkMode={darkMode}
        isHovered={sidebarHovered}
        setIsHovered={setSidebarHovered}
      />

      {/* Main Content Area: Aligned with sidebar offset */}
      <div className="lg:pl-[96px] flex flex-col min-w-0">
        <AdminHeader
          activeTab="packages"
          adminUser={adminUser}
          setMobileOpen={setMobileOpen}
          onRefresh={() => {}}
          isRefreshing={loading}
          searchQuery=""
          setSearchQuery={() => {}}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main
          className={`p-4 sm:p-6 lg:p-8 w-full space-y-6 transition-all duration-300 ${
            sidebarHovered ? "lg:pl-[196px]" : "lg:pl-8"
          }`}
        >
          {/* ================= TOP HEADER PILL ================= */}
          <div
            className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
            }`}
          >
            <div className="flex items-center gap-4">
              <Link
                to="/admin/dashboard?tab=packages"
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors ${
                  darkMode
                    ? "bg-[#1A2234] border-[#2B374E] text-[#94A3B8] hover:text-white"
                    : "bg-[#F4F6FB] border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]"
                }`}
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight">
                    {isEditMode ? `Edit Package: ${packageData.name}` : "Package Creation Studio"}
                  </h1>
                  <span className="text-[11px] font-bold text-[#035BE3] bg-[#035BE3]/10 px-2.5 py-0.5 rounded-full border border-[#035BE3]/20">
                    Step {currentStep} of 4
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                  {isEditMode
                    ? "Configure bundle details, pricing, assigned courses, instructors, and FAQs."
                    : "Build an all-in-one skill bundle with courses, instructors, and dynamic pricing."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/package/${packageData.slug || "pro"}`}
                target="_blank"
                className={`h-11 px-5 rounded-full border text-xs font-semibold transition flex items-center gap-2 ${
                  darkMode
                    ? "border-[#222B3D] bg-[#1A2234] text-[#94A3B8] hover:text-white hover:border-[#035BE3]"
                    : "border-[#E2E8F0] bg-[#F4F6FB] text-[#64748B] hover:text-[#0F172A] hover:border-[#035BE3]"
                }`}
              >
                <span>Live Preview</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/admin/dashboard?tab=packages"
                className={`h-11 px-5 rounded-full border text-xs font-semibold transition flex items-center justify-center ${
                  darkMode
                    ? "border-[#222B3D] text-[#94A3B8] hover:bg-[#1E2638]"
                    : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFD]"
                }`}
              >
                Cancel & Exit
              </Link>

              <button
                onClick={handleSubmitPackage}
                disabled={isSubmitting}
                className="h-11 px-6 bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs rounded-full transition shadow-md shadow-[#035BE3]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isEditMode ? "Save Changes" : "Publish Package"}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ================= STEPPER PROGRESS INDICATOR (4 STEPS FULL ROUNDED PILLS) ================= */}
          <div
            className={`rounded-full p-2 sm:p-2.5 border ${
              darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
            }`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {wizardSteps.map((step) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.number;
                const isActive = currentStep === step.number;

                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => setCurrentStep(step.number)}
                    className={`h-14 px-4 rounded-full border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      isActive
                        ? "bg-[#035BE3] border-[#035BE3] text-white shadow-md shadow-[#035BE3]/20"
                        : isCompleted
                        ? darkMode
                          ? "bg-[#1A2234] border-[#2B374E] text-[#E2E8F0]"
                          : "bg-emerald-50/60 border-emerald-200 text-[#0F172A]"
                        : darkMode
                        ? "bg-[#0B0F17]/50 border-[#222B3D] text-[#64748B] opacity-70"
                        : "bg-[#F8FAFD] border-[#E2E8F0] text-[#94A3B8]"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isActive
                          ? "bg-white/20 text-white"
                          : isCompleted
                          ? "bg-emerald-500 text-white"
                          : darkMode
                          ? "bg-[#1E2638] text-[#94A3B8]"
                          : "bg-white text-[#64748B] border border-[#E2E8F0]"
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          isActive ? "text-white/80" : "text-[#94A3B8]"
                        }`}
                      >
                        Step {step.number}
                      </p>
                      <p className="text-xs font-bold truncate">{step.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================= STEP 1: IDENTITY, PRESETS & BANNER ================= */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div
                className={`rounded-[32px] p-6 sm:p-8 border ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div className="flex items-center gap-3 pb-6 border-b border-inherit">
                  <div className="w-10 h-10 rounded-full bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center font-bold shrink-0">
                    <Layers3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">Step 1: Package Identity & Banner Artwork</h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Set the package name, slug, hero tagline, and upload high-res artwork banner.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                  {/* Left 2 Cols: Form Inputs */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* 1-Click Preset Template Pills */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#035BE3]" />
                          <span>Quick Preset Bundles</span>
                        </label>
                        <span className={`text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                          Click to auto-fill details
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {presetTemplates.map((t) => (
                          <button
                            key={t.slug}
                            type="button"
                            onClick={() => {
                              setPackageData((prev) => ({
                                ...prev,
                                name: t.name,
                                slug: t.slug,
                                image_url: t.image_url,
                                mrp_price: t.mrp_price,
                                promo_price: t.promo_price,
                                tagline: t.tagline,
                                total_hours: t.total_hours,
                                enrolled_students: t.enrolled_students,
                              }));
                              showToast(`Loaded ${t.name} package template!`);
                            }}
                            className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                              packageData.slug === t.slug
                                ? "border-[#035BE3] bg-[#035BE3]/10 text-[#035BE3] ring-1 ring-[#035BE3]"
                                : darkMode
                                ? "border-[#222B3D] bg-[#0B0F17] text-[#E2E8F0] hover:border-[#035BE3]/50"
                                : "border-[#E2E8F0] bg-[#F8FAFD] text-[#0F172A] hover:border-[#035BE3]/50"
                            }`}
                          >
                            <p className="text-xs font-bold">{t.name}</p>
                            <p className="text-[11px] text-[#035BE3] font-semibold mt-0.5">
                              ₹{Number(t.promo_price).toLocaleString("en-IN")}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name & Slug */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold mb-2">
                          Package Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Pro, Supreme, Premium"
                          value={packageData.name}
                          onChange={(e) =>
                            setPackageData((prev) => ({ ...prev, name: e.target.value }))
                          }
                          className={`w-full h-12 rounded-full border px-5 text-xs outline-none focus:border-[#035BE3] font-medium transition ${
                            darkMode
                              ? "bg-[#0B0F17] border-[#222B3D] text-white"
                              : "bg-[#F8FAFD] border-[#E2E8F0]"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-2">
                          URL Slug <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                            /package/
                          </span>
                          <input
                            type="text"
                            placeholder="pro, supreme"
                            value={packageData.slug}
                            onChange={(e) =>
                              setPackageData((prev) => ({
                                ...prev,
                                slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                              }))
                            }
                            className={`w-full h-12 rounded-full border pl-22 pr-5 text-xs outline-none focus:border-[#035BE3] font-medium transition ${
                              darkMode
                                ? "bg-[#0B0F17] border-[#222B3D] text-white"
                                : "bg-[#F8FAFD] border-[#E2E8F0]"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tagline / Subtitle */}
                    <div>
                      <label className="block text-xs font-bold mb-2">
                        Hero Tagline & Growth Pitch
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Our step-by-step, skill-focused, and practical growth package..."
                        value={packageData.tagline}
                        onChange={(e) =>
                          setPackageData((prev) => ({ ...prev, tagline: e.target.value }))
                        }
                        className={`w-full rounded-[24px] border p-4 text-xs outline-none focus:border-[#035BE3] leading-relaxed transition ${
                          darkMode
                            ? "bg-[#0B0F17] border-[#222B3D] text-white"
                            : "bg-[#F8FAFD] border-[#E2E8F0]"
                        }`}
                      />
                    </div>

                    {/* Banner Upload Box */}
                    <div
                      className={`p-6 rounded-[26px] border ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                          <span className="text-xs font-bold">Package Artwork Banner</span>
                          <p className={`text-[11px] mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                            Recommended: High-res transparent PNG (Max 10MB)
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => bannerInputRef.current?.click()}
                          disabled={isUploadingBanner}
                          className="h-10 px-5 bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-semibold rounded-full transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <UploadCloud className="w-4 h-4" />
                          <span>
                            {isUploadingBanner ? "Uploading..." : "Upload Banner"}
                          </span>
                        </button>
                        <input
                          ref={bannerInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleBannerFileUpload}
                          className="hidden"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div
                          className={`w-36 h-28 rounded-2xl border p-2 flex items-center justify-center shrink-0 ${
                            darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                          }`}
                        >
                          <img
                            src={packageData.image_url || "/images/packages/pro.png"}
                            alt="Banner Preview"
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "/images/packages/pro.png";
                            }}
                          />
                        </div>

                        <div className="flex-1 w-full space-y-2">
                          <label className="block text-[11px] font-bold text-gray-400">
                            Artwork URL (Direct Cloudinary Link)
                          </label>
                          <input
                            type="text"
                            placeholder="/images/packages/pro.png or https://res.cloudinary.com/..."
                            value={packageData.image_url}
                            onChange={(e) =>
                              setPackageData((prev) => ({ ...prev, image_url: e.target.value }))
                            }
                            className={`w-full h-11 rounded-full border px-4 text-xs outline-none focus:border-[#035BE3] ${
                              darkMode
                                ? "bg-[#131926] border-[#222B3D] text-white"
                                : "bg-white border-[#E2E8F0]"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right 1 Col: Live Visual Package Card Preview */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                      Live Package Card Preview
                    </span>

                    <div
                      className={`rounded-[28px] border overflow-hidden transition-all shadow-md ${
                        darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                      }`}
                    >
                      <div className="relative aspect-[16/10] bg-[#EFF4FF] dark:bg-[#1A2234] p-4 flex items-center justify-center overflow-hidden">
                        <img
                          src={packageData.image_url || "/images/packages/pro.png"}
                          alt={packageData.name}
                          className="max-h-full max-w-full object-contain transition-transform hover:scale-105 duration-300"
                          onError={(e) => {
                            e.currentTarget.src = "/images/packages/pro.png";
                          }}
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                            {packageData.course_ids.length} Courses Included
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold">{packageData.name || "Package Name"}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#035BE3]/10 text-[#035BE3]">
                            /{packageData.slug || "package"}
                          </span>
                        </div>

                        <p className={`text-xs line-clamp-2 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                          {packageData.tagline || "High-value skill bundle designed for digital career success."}
                        </p>

                        <div
                          className={`p-3 rounded-2xl border flex items-center justify-between ${
                            darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                          }`}
                        >
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400">Offer Price</span>
                            <div className="text-sm font-extrabold text-[#035BE3]">
                              ₹{Number(packageData.promo_price || 7999).toLocaleString("en-IN")}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-gray-400">MRP</span>
                            <div className="text-xs font-semibold text-gray-400 line-through">
                              ₹{Number(packageData.mrp_price || 11800).toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                          <span>{packageData.total_hours}</span>
                          <span>{packageData.enrolled_students}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Navigation */}
                <div className="flex justify-end pt-6 border-t border-inherit mt-6">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="h-12 px-7 bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs rounded-full transition flex items-center gap-2 cursor-pointer shadow-md shadow-[#035BE3]/20"
                  >
                    <span>Continue to Pricing & Badges</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: PRICING & BADGES ================= */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div
                className={`rounded-[32px] p-6 sm:p-8 border ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div className="flex items-center gap-3 pb-6 border-b border-inherit">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">Step 2: Dual Pricing & Trust Badges</h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Set MRP price, promo offer price, badge notes, duration, and student count.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                  {/* MRP Price */}
                  <div>
                    <label className="block text-xs font-bold mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#035BE3]" />
                      <span>Original Real MRP Price (₹)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="11800"
                      value={packageData.mrp_price}
                      onChange={(e) =>
                        setPackageData((prev) => ({ ...prev, mrp_price: e.target.value }))
                      }
                      className={`w-full h-12 rounded-full border px-5 text-xs outline-none focus:border-[#035BE3] font-medium transition ${
                        darkMode
                          ? "bg-[#0B0F17] border-[#222B3D] text-white"
                          : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    />
                  </div>

                  {/* Promo Price */}
                  <div>
                    <label className="block text-xs font-bold mb-2 flex items-center gap-1.5 text-emerald-600">
                      <Tag className="w-4 h-4" />
                      <span>Promo / Offer Price (₹) *</span>
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="7999"
                      value={packageData.promo_price}
                      onChange={(e) =>
                        setPackageData((prev) => ({ ...prev, promo_price: e.target.value }))
                      }
                      className={`w-full h-12 rounded-full border px-5 text-xs outline-none focus:border-[#035BE3] font-medium transition ${
                        darkMode
                          ? "bg-[#0B0F17] border-[#222B3D] text-white"
                          : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    />
                  </div>

                  {/* MRP Note */}
                  <div>
                    <label className="block text-xs font-bold mb-2">MRP Note Text</label>
                    <input
                      type="text"
                      placeholder="Full access to 9 value-packed courses, ideal for beginners..."
                      value={packageData.mrp_note}
                      onChange={(e) =>
                        setPackageData((prev) => ({ ...prev, mrp_note: e.target.value }))
                      }
                      className={`w-full h-12 rounded-full border px-5 text-xs outline-none focus:border-[#035BE3] font-medium transition ${
                        darkMode
                          ? "bg-[#0B0F17] border-[#222B3D] text-white"
                          : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    />
                  </div>

                  {/* Promo Note */}
                  <div>
                    <label className="block text-xs font-bold mb-2">Promo Note Text</label>
                    <input
                      type="text"
                      placeholder="Launch your Freelance career with lifetime access..."
                      value={packageData.promo_note}
                      onChange={(e) =>
                        setPackageData((prev) => ({ ...prev, promo_note: e.target.value }))
                      }
                      className={`w-full h-12 rounded-full border px-5 text-xs outline-none focus:border-[#035BE3] font-medium transition ${
                        darkMode
                          ? "bg-[#0B0F17] border-[#222B3D] text-white"
                          : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    />
                  </div>

                  {/* Duration Badge */}
                  <div>
                    <label className="block text-xs font-bold mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Total Duration Badge</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 25+ Hours"
                      value={packageData.total_hours}
                      onChange={(e) =>
                        setPackageData((prev) => ({ ...prev, total_hours: e.target.value }))
                      }
                      className={`w-full h-12 rounded-full border px-5 text-xs outline-none focus:border-[#035BE3] font-medium transition ${
                        darkMode
                          ? "bg-[#0B0F17] border-[#222B3D] text-white"
                          : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    />
                  </div>

                  {/* Enrolled Students Badge */}
                  <div>
                    <label className="block text-xs font-bold mb-2 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Enrolled Students Badge</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 45K+ Students Enrolled"
                      value={packageData.enrolled_students}
                      onChange={(e) =>
                        setPackageData((prev) => ({ ...prev, enrolled_students: e.target.value }))
                      }
                      className={`w-full h-12 rounded-full border px-5 text-xs outline-none focus:border-[#035BE3] font-medium transition ${
                        darkMode
                          ? "bg-[#0B0F17] border-[#222B3D] text-white"
                          : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    />
                  </div>
                </div>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-inherit mt-6">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className={`h-12 px-6 rounded-full border text-xs font-semibold flex items-center gap-2 cursor-pointer transition ${
                      darkMode
                        ? "border-[#222B3D] text-[#94A3B8] hover:bg-[#1E2638]"
                        : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFD]"
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="h-12 px-7 bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs rounded-full transition flex items-center gap-2 cursor-pointer shadow-md shadow-[#035BE3]/20"
                  >
                    <span>Continue to Courses & Mentors</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: COURSES & INCLUDED MENTORS ================= */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div
                className={`rounded-[32px] p-6 sm:p-8 border space-y-6 ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-inherit">
                  <div>
                    <h2 className="text-base font-bold">
                      Step 3: Select Included Courses & Instructors
                    </h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Tick which courses belong to this package. Assigned mentors will be shown in the bundle.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-full bg-[#035BE3] text-white text-xs font-bold shadow-xs">
                      {packageData.course_ids.length} Courses Selected
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPackageData((prev) => ({
                          ...prev,
                          course_ids: coursesList.map((c) => c.id),
                        }))
                      }
                      className="px-3 py-1.5 text-xs font-bold text-[#035BE3] hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-gray-300 dark:text-gray-700">|</span>
                    <button
                      type="button"
                      onClick={() =>
                        setPackageData((prev) => ({
                          ...prev,
                          course_ids: [],
                        }))
                      }
                      className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Course Search Filter */}
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search available courses by title, category, mentor name, or language..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className={`w-full h-12 rounded-full border pl-11 pr-5 text-xs outline-none focus:border-[#035BE3] font-medium transition ${
                      darkMode
                        ? "bg-[#0B0F17] border-[#222B3D] text-white"
                        : "bg-[#F8FAFD] border-[#E2E8F0]"
                    }`}
                  />
                </div>

                {/* Courses Multi-Select Grid */}
                {filteredCourses.length === 0 ? (
                  <div className="p-12 text-center border rounded-[28px] border-dashed">
                    <BookOpen className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-60" />
                    <p className="text-sm font-bold">No courses match your filter.</p>
                    <p className={`text-xs mt-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Try resetting your search query.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1">
                    {filteredCourses.map((course) => {
                      const isSelected = packageData.course_ids.includes(course.id);
                      return (
                        <div
                          key={course.id}
                          onClick={() => {
                            const current = [...packageData.course_ids];
                            const next = isSelected
                              ? current.filter((cid) => cid !== course.id)
                              : [...current, course.id];
                            setPackageData((prev) => ({ ...prev, course_ids: next }));
                          }}
                          className={`p-4 rounded-[24px] border flex items-start gap-3.5 cursor-pointer transition-all ${
                            isSelected
                              ? "border-[#035BE3] bg-[#035BE3]/10 ring-1 ring-[#035BE3] shadow-xs"
                              : darkMode
                              ? "border-[#222B3D] bg-[#0B0F17] hover:border-[#035BE3]/50"
                              : "border-[#E2E8F0] bg-[#F8FAFD] hover:border-[#035BE3]/50"
                          }`}
                        >
                          <div className="pt-0.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="rounded text-[#035BE3] w-4 h-4 pointer-events-none cursor-pointer"
                            />
                          </div>

                          <img
                            src={
                              course.thumbnail_url ||
                              "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop"
                            }
                            alt={course.title}
                            className="w-16 h-12 rounded-xl object-cover shrink-0 border border-inherit"
                          />

                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                              {course.category}
                            </span>
                            <h4 className="text-xs font-bold mt-1 line-clamp-1">{course.title}</h4>
                            <p className="text-[11px] text-[#035BE3] font-semibold mt-0.5 truncate flex items-center gap-1">
                              <GraduationCap className="w-3 h-3" />
                              <span>{course.mentor_name || "Instructor Assigned"}</span>
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {course.duration || "2 Hours"} • {course.languages || "English"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ================= INCLUDED MENTORS SHOWCASE ================= */}
                <div
                  className={`mt-8 p-6 rounded-[28px] border space-y-4 ${
                    darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center font-bold shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">
                          Mentors & Instructors in this Package ({packageMentors.length} Mentors)
                        </h3>
                        <p className={`text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                          Automatically compiled from the selected courses above.
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/admin/dashboard?tab=mentors"
                      className="text-xs font-bold text-[#035BE3] hover:underline flex items-center gap-1"
                    >
                      <span>Manage All Mentors</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  {packageMentors.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-2">
                      No mentors active. Select courses above to show assigned mentors.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {packageMentors.map((m, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
                            darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                          }`}
                        >
                          <img
                            src={m.photo}
                            alt={m.name}
                            className="w-12 h-12 rounded-full object-cover border border-[#E2E8F0] shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold truncate">{m.name}</h4>
                            <p className="text-[11px] text-[#035BE3] font-semibold truncate">
                              {m.role}
                            </p>
                            <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 mt-1">
                              {m.coursesCount} {m.coursesCount === 1 ? "Course" : "Courses"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-inherit mt-6">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className={`h-12 px-6 rounded-full border text-xs font-semibold flex items-center gap-2 cursor-pointer transition ${
                      darkMode
                        ? "border-[#222B3D] text-[#94A3B8] hover:bg-[#1E2638]"
                        : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFD]"
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="h-12 px-7 bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs rounded-full transition flex items-center gap-2 cursor-pointer shadow-md shadow-[#035BE3]/20"
                  >
                    <span>Continue to Overview & FAQs</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: OVERVIEW, LEARNINGS & FAQS ================= */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div
                className={`rounded-[32px] p-6 sm:p-8 border space-y-6 ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div className="flex items-center gap-3 pb-6 border-b border-inherit">
                  <div className="w-10 h-10 rounded-full bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center font-bold shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">Step 4: Package Overview, Learnings & FAQs</h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Configure the landing page overview heading, dynamic learning bullet points, and FAQs.
                    </p>
                  </div>
                </div>

                {/* Overview Heading & Description */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-2">Package Overview Heading</label>
                    <input
                      type="text"
                      placeholder="Unlock lifetime access, certification, and community support..."
                      value={packageData.overview_heading}
                      onChange={(e) =>
                        setPackageData((prev) => ({ ...prev, overview_heading: e.target.value }))
                      }
                      className={`w-full h-12 rounded-full border px-5 text-xs outline-none focus:border-[#035BE3] font-medium transition ${
                        darkMode
                          ? "bg-[#0B0F17] border-[#222B3D] text-white"
                          : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-2">
                      Package Overview Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="A complete ecosystem designed for individuals who are serious about building their freelance career..."
                      value={packageData.overview_desc}
                      onChange={(e) =>
                        setPackageData((prev) => ({ ...prev, overview_desc: e.target.value }))
                      }
                      className={`w-full rounded-[24px] border p-4 text-xs outline-none focus:border-[#035BE3] leading-relaxed transition ${
                        darkMode
                          ? "bg-[#0B0F17] border-[#222B3D] text-white"
                          : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    />
                  </div>
                </div>

                {/* What You'll Learn Dynamic Points */}
                <div
                  className={`p-6 rounded-[28px] border space-y-4 ${
                    darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold">
                        What You'll Learn in this Package ({packageData.what_you_will_learn.length}{" "}
                        points)
                      </span>
                      <p className={`text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        Checklist items that show with blue checkmarks on the public page.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setPackageData((prev) => ({
                          ...prev,
                          what_you_will_learn: [...prev.what_you_will_learn, ""],
                        }))
                      }
                      className="h-9 px-4 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Point</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {packageData.what_you_will_learn.map((pt, pIdx) => (
                      <div key={pIdx} className="flex gap-2.5 items-center">
                        <span className="w-6 h-6 rounded-full bg-[#035BE3]/15 text-[#035BE3] text-[10px] font-bold flex items-center justify-center shrink-0">
                          {pIdx + 1}
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. Master Video Editing with Premiere Pro and create engaging content."
                          value={pt}
                          onChange={(e) => {
                            const updated = [...packageData.what_you_will_learn];
                            updated[pIdx] = e.target.value;
                            setPackageData((prev) => ({ ...prev, what_you_will_learn: updated }));
                          }}
                          className={`flex-1 h-11 rounded-full border px-4 text-xs outline-none focus:border-[#035BE3] ${
                            darkMode
                              ? "bg-[#131926] border-[#222B3D] text-white"
                              : "bg-white border-[#E2E8F0]"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = packageData.what_you_will_learn.filter(
                              (_, i) => i !== pIdx
                            );
                            setPackageData((prev) => ({ ...prev, what_you_will_learn: updated }));
                          }}
                          className="w-9 h-9 rounded-full border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-500/10 flex items-center justify-center cursor-pointer shrink-0"
                          title="Remove point"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ Dynamic Questions & Answers */}
                <div
                  className={`p-6 rounded-[28px] border space-y-4 ${
                    darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold">
                        Frequently Asked Questions ({packageData.faqs.length} FAQs)
                      </span>
                      <p className={`text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        Accordion items shown at the bottom of the package detail page.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setPackageData((prev) => ({
                          ...prev,
                          faqs: [...prev.faqs, { question: "", answer: "" }],
                        }))
                      }
                      className="h-9 px-4 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add FAQ</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {packageData.faqs.map((faq, fIdx) => (
                      <div
                        key={fIdx}
                        className={`p-4 rounded-[22px] border space-y-3 ${
                          darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <input
                            type="text"
                            placeholder="Question: e.g. What’s included in this package?"
                            value={faq.question}
                            onChange={(e) => {
                              const updated = [...packageData.faqs];
                              updated[fIdx].question = e.target.value;
                              setPackageData((prev) => ({ ...prev, faqs: updated }));
                            }}
                            className={`flex-1 h-10 rounded-full border px-4 text-xs font-semibold outline-none focus:border-[#035BE3] ${
                              darkMode
                                ? "bg-[#0B0F17] border-[#222B3D] text-white"
                                : "bg-[#F8FAFD] border-[#E2E8F0]"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = packageData.faqs.filter((_, i) => i !== fIdx);
                              setPackageData((prev) => ({ ...prev, faqs: updated }));
                            }}
                            className="w-9 h-9 rounded-full border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-500/10 flex items-center justify-center cursor-pointer shrink-0"
                            title="Remove FAQ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          placeholder="Answer: e.g. Full lifetime access to all courses, downloadable assets..."
                          value={faq.answer}
                          onChange={(e) => {
                            const updated = [...packageData.faqs];
                            updated[fIdx].answer = e.target.value;
                            setPackageData((prev) => ({ ...prev, faqs: updated }));
                          }}
                          className={`w-full rounded-2xl border p-3 text-xs outline-none focus:border-[#035BE3] leading-relaxed ${
                            darkMode
                              ? "bg-[#0B0F17] border-[#222B3D] text-white"
                              : "bg-[#F8FAFD] border-[#E2E8F0]"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Submission Bar */}
                <div className="flex items-center justify-between pt-6 border-t border-inherit mt-6">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className={`h-12 px-6 rounded-full border text-xs font-semibold flex items-center gap-2 cursor-pointer transition ${
                      darkMode
                        ? "border-[#222B3D] text-[#94A3B8] hover:bg-[#1E2638]"
                        : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFD]"
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitPackage}
                    disabled={isSubmitting}
                    className="h-12 px-8 bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs rounded-full transition shadow-lg shadow-[#035BE3]/30 flex items-center gap-2.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Package to Database...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isEditMode ? "Update Package Now" : "Publish Package Now"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
