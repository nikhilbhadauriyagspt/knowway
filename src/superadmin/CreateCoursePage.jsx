import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Video,
  Image as ImageIcon,
  Sparkles,
  Layers,
  GraduationCap,
  Globe,
  Clock,
  Lock,
  Unlock,
  UploadCloud,
  FileText,
  AlertCircle,
  Wrench,
  Award,
  Check,
  Eye,
  HelpCircle,
  Loader2,
  Link2,
  FileVideo,
  Upload,
} from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import {
  getMentorsApi,
  createCourseApi,
  updateCourseApi,
  getCourseByIdApi,
  getSystemSettingsApi,
  uploadImageApi,
  uploadVideoApi,
  isAdminAuthenticated,
  getAdminUser,
} from "../services/api";

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Layout & Theme State
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("admin_dark_mode");
      if (saved !== null) return saved === "true";
      return false;
    } catch {
      return false;
    }
  });
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser] = useState(getAdminUser());

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Wizard Step State (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);

  // Loading & submission state
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState(null);

  // Thumbnail Upload Mode: "file" | "url"
  const [thumbnailMode, setThumbnailMode] = useState("file");
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const thumbInputRef = useRef(null);

  // Video Upload State per lecture: { [lecId]: boolean }
  const [uploadingLectures, setUploadingLectures] = useState({});

  // Mentors and Cloudinary Settings
  const [mentorsList, setMentorsList] = useState([]);
  const [cloudinarySettings, setCloudinarySettings] = useState({
    cloud_name: "",
  });

  // Predefined Categories and Languages for quick pills
  const availableCategories = [
    "Digital Marketing",
    "Meta Ads",
    "Google Ads",
    "Video Editing",
    "AI Tools & Prompt Engineering",
    "Graphic Design & Canva",
    "Web Development",
    "Crypto & Stock Trading",
    "Freelancing & Client Acquisition",
    "Calligraphy & Art",
    "Spoken English & Communication",
  ];

  const [categoryList, setCategoryList] = useState(availableCategories);
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [customCategoryText, setCustomCategoryText] = useState("");

  const handleAddCustomCategory = () => {
    const trimmed = customCategoryText.trim();
    if (!trimmed) return;
    if (!categoryList.includes(trimmed)) {
      setCategoryList((prev) => [...prev, trimmed]);
    }
    setCourseData((prev) => ({ ...prev, category: trimmed }));
    setCustomCategoryText("");
    setShowCustomCategoryInput(false);
    showToast(`Added and selected "${trimmed}" category!`);
  };

  const availableLanguages = [
    "Hindi",
    "Telugu",
    "Tamil",
    "English",
    "Kannada",
    "Malayalam",
    "Urdu",
  ];

  // ========================================================
  // MAIN COURSE FORM STATE
  // ========================================================
  const [courseData, setCourseData] = useState({
    title: "",
    mentor_id: "",
    category: "Meta Ads",
    selectedLanguages: ["Telugu"],
    duration: "2.5 Hours",
    regular_price: "2999",
    promo_price: "499",
    promo_code: "KNOWWAY50",
    thumbnail_url: "",
    description: "",
    what_you_will_learn: [
      "Meta Business Manager and Ads Manager structure",
      "Campaign, ad set, and ad-level setup",
      "Core, custom, and lookalike audience targeting",
      "Creative setup, ad copy, and mobile preview",
      "Meta Pixel installation and event tracking",
    ],
    software_required: "Facebook Account, Ads Manager Access, Stable Internet Connection",
    certificate_enabled: true,
    referral_commission_type: "percentage",
    referral_commission_value: "20",
  });

  // ========================================================
  // SECTIONS & VIDEO LECTURES HIERARCHY STATE
  // ========================================================
  const [sections, setSections] = useState([
    {
      id: "sec-1",
      section_name: "Introduction",
      lectures: [
        {
          id: "lec-1",
          title: "Introduction to Meta Ads",
          duration: "8m",
          video_url: "",
          is_free_preview: true,
          mode: "file", // "file" | "url"
        },
        {
          id: "lec-2",
          title: "Audience Targeting & Strategy",
          duration: "7m",
          video_url: "",
          is_free_preview: false,
          mode: "file",
        },
      ],
    },
    {
      id: "sec-2",
      section_name: "Campaign Execution & Setup",
      lectures: [
        {
          id: "lec-3",
          title: "Creating Meta Ads Campaign Step-by-Step",
          duration: "27m",
          video_url: "",
          is_free_preview: false,
          mode: "file",
        },
        {
          id: "lec-4",
          title: "Meta Pixel Integration & Retargeting Campaigns",
          duration: "19m",
          video_url: "",
          is_free_preview: false,
          mode: "file",
        },
      ],
    },
    {
      id: "sec-3",
      section_name: "Scaling & Optimization",
      lectures: [
        {
          id: "lec-5",
          title: "Meta Ads Targeting & A/B Testing",
          duration: "19m",
          video_url: "",
          is_free_preview: false,
          mode: "file",
        },
        {
          id: "lec-6",
          title: "Reporting, Freelancing & Final Roadmap",
          duration: "11m",
          video_url: "",
          is_free_preview: false,
          mode: "file",
        },
      ],
    },
  ]);

  // ========================================================
  // QUIZ QUESTIONS FOR ACCREDITED CERTIFICATION STATE
  // ========================================================
  const [quizQuestions, setQuizQuestions] = useState([
    {
      id: "q-1",
      question: "What is the primary objective of this course curriculum?",
      option_a: "To master practical workflows and real-world execution",
      option_b: "To memorize theory without implementation",
      option_c: "To avoid software tools and setups",
      option_d: "To skip portfolio building",
      correct_option: "A",
    },
    {
      id: "q-2",
      question: "Which habit produces the fastest client results and skill monetization?",
      option_a: "Building a verified portfolio and structured outreach",
      option_b: "Waiting without taking action",
      option_c: "Random guesswork",
      option_d: "Avoiding mentor feedback",
      correct_option: "A",
    },
    {
      id: "q-3",
      question: "Why is continuous optimization critical in this domain?",
      option_a: "To maintain competitive edge and improve ROI",
      option_b: "It is not required once course finishes",
      option_c: "To create duplicate files",
      option_d: "To reset settings every day",
      correct_option: "A",
    },
    {
      id: "q-4",
      question: "What is the primary indicator of high-quality deliverable output?",
      option_a: "Consistency, testing, and business impact",
      option_b: "Random font colors",
      option_c: "Ignoring client instructions",
      option_d: "Skipping final review",
      correct_option: "A",
    },
    {
      id: "q-5",
      question: "What is the key takeaway of KnowWay hands-on training?",
      option_a: "Practical execution over passive watching",
      option_b: "Never asking mentors for clarification",
      option_c: "Skipping final assessments",
      option_d: "Avoiding practice tasks",
      correct_option: "A",
    },
  ]);

  const handleAddQuizQuestion = () => {
    setQuizQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "A",
      },
    ]);
  };

  const handleRemoveQuizQuestion = (qIdx) => {
    if (quizQuestions.length <= 1) {
      showToast("Course must have at least 1 quiz question for certification", "error");
      return;
    }
    setQuizQuestions((prev) => prev.filter((_, idx) => idx !== qIdx));
  };

  const handleUpdateQuizQuestion = (qIdx, field, value) => {
    setQuizQuestions((prev) => {
      const updated = [...prev];
      updated[qIdx][field] = value;
      return updated;
    });
  };

  // Toast Helper
  const showToast = (message, type = "success") => {
    setNotificationMsg({ message, type });
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  // Check auth & fetch initial mentors, settings, and existing course if edit mode
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate("/admin/login", { replace: true });
      return;
    }

    const loadInitialData = async () => {
      try {
        const [mentorsRes, settingsRes] = await Promise.allSettled([
          getMentorsApi(),
          getSystemSettingsApi(),
        ]);

        if (mentorsRes.status === "fulfilled" && mentorsRes.value?.mentors) {
          setMentorsList(mentorsRes.value.mentors);
          if (!isEditMode && mentorsRes.value.mentors.length > 0) {
            setCourseData((prev) => ({
              ...prev,
              mentor_id: prev.mentor_id || String(mentorsRes.value.mentors[0].id),
            }));
          }
        }

        if (settingsRes.status === "fulfilled" && settingsRes.value?.settings) {
          setCloudinarySettings({
            cloud_name: settingsRes.value.settings.cloudinary_cloud_name || "",
          });
        }

        // If in Edit Mode, fetch and populate course data
        if (isEditMode) {
          try {
            const courseRes = await getCourseByIdApi(id);
            if (courseRes?.success && courseRes.course) {
              const c = courseRes.course;
              if (c.category) {
                setCategoryList((prev) => (prev.includes(c.category) ? prev : [...prev, c.category]));
              }
              setCourseData({
                title: c.title || "",
                mentor_id: c.mentor_id ? String(c.mentor_id) : "",
                category: c.category || "Meta Ads",
                selectedLanguages: c.languages
                  ? c.languages.split(",").map((s) => s.trim())
                  : ["Hindi"],
                duration: c.duration || "2.5 Hours",
                regular_price: String(c.regular_price || "2999"),
                promo_price: String(c.promo_price || "499"),
                promo_code: c.promo_code || "KNOWWAY50",
                thumbnail_url: c.thumbnail_url || "",
                description: c.description || "",
                what_you_will_learn:
                  Array.isArray(c.what_you_will_learn_parsed) && c.what_you_will_learn_parsed.length > 0
                    ? c.what_you_will_learn_parsed
                    : ["", "", ""],
                software_required: c.software_required || "",
                certificate_enabled: true,
                referral_commission_type: c.referral_commission_type || "percentage",
                referral_commission_value: String(c.referral_commission_value !== undefined && c.referral_commission_value !== null ? c.referral_commission_value : "20"),
              });

              if (c.lectures && c.lectures.length > 0) {
                const sectionMap = {};
                c.lectures.forEach((lec, idx) => {
                  const secName = lec.section_name || "Module 1";
                  if (!sectionMap[secName]) {
                    sectionMap[secName] = {
                      id: `sec-${idx + 1}`,
                      section_name: secName,
                      lectures: [],
                    };
                  }
                  sectionMap[secName].lectures.push({
                    id: lec.id || `lec-${idx + 1}`,
                    title: lec.title || `Lecture ${idx + 1}`,
                    duration: lec.duration || "10m",
                    video_url: lec.video_url || "",
                    is_free_preview: Boolean(lec.is_free_preview),
                    mode: "file",
                  });
                });
                setSections(Object.values(sectionMap));
              }

              // Load existing quiz questions if present
              if (c.quiz_questions && c.quiz_questions.length > 0) {
                setQuizQuestions(
                  c.quiz_questions.map((q, idx) => ({
                    id: q.id || `q-${idx + 1}`,
                    question: q.question || "",
                    option_a: q.option_a || "",
                    option_b: q.option_b || "",
                    option_c: q.option_c || "",
                    option_d: q.option_d || "",
                    correct_option: (q.correct_option || "A").toUpperCase(),
                  }))
                );
              }
            }
          } catch (cErr) {
            console.error("Failed to load course for editing:", cErr);
            showToast("Failed to load course details for editing", "error");
          }
        }
      } catch (err) {
        console.error("Failed to load course studio context", err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [navigate, id, isEditMode]);

  // Handle Thumbnail File Upload
  const handleThumbnailFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (PNG, JPG, WebP)", "error");
      return;
    }

    setIsUploadingThumb(true);
    try {
      const res = await uploadImageApi(file, "knowway_courses/thumbnails");
      if (res?.success && res.data?.url) {
        setCourseData((prev) => ({
          ...prev,
          thumbnail_url: res.data.url,
        }));
        showToast("Thumbnail uploaded to Cloudinary!");
      } else {
        showToast(res?.message || "Failed to upload thumbnail", "error");
      }
    } catch (err) {
      showToast(err.message || "Error uploading image to Cloudinary", "error");
    } finally {
      setIsUploadingThumb(false);
    }
  };

  // Handle Video File Upload for a specific lecture
  const handleVideoFileUpload = async (secIdx, lecIdx, file) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      showToast("Please select a valid video file (.mp4, .mov, .webm)", "error");
      return;
    }

    const lecId = sections[secIdx].lectures[lecIdx].id;
    setUploadingLectures((prev) => ({ ...prev, [lecId]: true }));

    try {
      const res = await uploadVideoApi(file, "knowway_courses/lectures");
      if (res?.success && res.data?.url) {
        setSections((prev) => {
          const updated = [...prev];
          const targetLec = updated[secIdx].lectures[lecIdx];
          targetLec.video_url = res.data.url;
          if (res.data.duration) {
            targetLec.duration = res.data.duration;
          }
          return updated;
        });
        showToast(`Video uploaded successfully! (${res.data.duration || "Ready"})`);
      } else {
        showToast(res?.message || "Failed to upload video", "error");
      }
    } catch (err) {
      showToast(err.message || "Error uploading video to Cloudinary", "error");
    } finally {
      setUploadingLectures((prev) => ({ ...prev, [lecId]: false }));
    }
  };

  // Language toggle handler
  const handleToggleLanguage = (lang) => {
    setCourseData((prev) => {
      const exists = prev.selectedLanguages.includes(lang);
      if (exists) {
        if (prev.selectedLanguages.length === 1) return prev;
        return {
          ...prev,
          selectedLanguages: prev.selectedLanguages.filter((l) => l !== lang),
        };
      } else {
        return {
          ...prev,
          selectedLanguages: [...prev.selectedLanguages, lang],
        };
      }
    });
  };

  // What you'll learn list operations
  const handleAddLearnPoint = () => {
    setCourseData((prev) => ({
      ...prev,
      what_you_will_learn: [...prev.what_you_will_learn, ""],
    }));
  };

  const handleUpdateLearnPoint = (index, value) => {
    setCourseData((prev) => {
      const updated = [...prev.what_you_will_learn];
      updated[index] = value;
      return { ...prev, what_you_will_learn: updated };
    });
  };

  const handleRemoveLearnPoint = (index) => {
    setCourseData((prev) => ({
      ...prev,
      what_you_will_learn: prev.what_you_will_learn.filter((_, i) => i !== index),
    }));
  };

  // Section Operations
  const handleAddSection = () => {
    const newSecNum = sections.length + 1;
    setSections((prev) => [
      ...prev,
      {
        id: `sec-${Date.now()}`,
        section_name: `Module ${newSecNum}: Core Essentials`,
        lectures: [
          {
            id: `lec-${Date.now()}-1`,
            title: `Lesson 1: Practical Workflow`,
            duration: "10m",
            video_url: "",
            is_free_preview: false,
            mode: "file",
          },
        ],
      },
    ]);
  };

  const handleRemoveSection = (secIndex) => {
    if (sections.length <= 1) {
      showToast("At least 1 course section is required", "error");
      return;
    }
    setSections((prev) => prev.filter((_, idx) => idx !== secIndex));
  };

  const handleUpdateSectionName = (secIndex, newName) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[secIndex].section_name = newName;
      return updated;
    });
  };

  // Lecture Operations
  const handleAddLecture = (secIndex) => {
    setSections((prev) => {
      const updated = [...prev];
      const targetSec = updated[secIndex];
      targetSec.lectures.push({
        id: `lec-${Date.now()}`,
        title: `Lesson ${targetSec.lectures.length + 1}: Practical Workflow`,
        duration: "12m",
        video_url: "",
        is_free_preview: false,
        mode: "file",
      });
      return updated;
    });
  };

  const handleRemoveLecture = (secIndex, lecIndex) => {
    setSections((prev) => {
      const updated = [...prev];
      if (updated[secIndex].lectures.length <= 1) {
        showToast("Each section must have at least 1 video lecture", "error");
        return updated;
      }
      updated[secIndex].lectures = updated[secIndex].lectures.filter((_, idx) => idx !== lecIndex);
      return updated;
    });
  };

  const handleUpdateLecture = (secIndex, lecIndex, field, value) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[secIndex].lectures[lecIndex][field] = value;
      return updated;
    });
  };

  // Total lectures count helper
  const totalLecturesCount = sections.reduce((acc, sec) => acc + sec.lectures.length, 0);

  // Get currently selected mentor
  const selectedMentor = mentorsList.find(
    (m) => String(m.id) === String(courseData.mentor_id)
  ) || mentorsList[0] || null;

  // Step Validation & Navigation
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!courseData.title.trim()) {
        showToast("Please enter a course title", "error");
        return;
      }
      if (!courseData.category.trim()) {
        showToast("Please select a category", "error");
        return;
      }
    } else if (currentStep === 2) {
      if (!courseData.mentor_id && mentorsList.length > 0) {
        showToast("Please assign a mentor for this course", "error");
        return;
      }
    } else if (currentStep === 3) {
      if (totalLecturesCount === 0) {
        showToast("Please add at least 1 lecture", "error");
        return;
      }
    } else if (currentStep === 4) {
      const validQuestions = quizQuestions.filter((q) => q.question.trim());
      if (validQuestions.length === 0) {
        showToast("Please provide at least 1 quiz question for certification", "error");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit Final Course Payload
  const handleSubmitCourse = async () => {
    if (!courseData.title.trim()) {
      showToast("Course Title is required", "error");
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      const flattenedLectures = [];
      let globalOrder = 1;

      sections.forEach((sec) => {
        sec.lectures.forEach((lec) => {
          flattenedLectures.push({
            section_name: sec.section_name || "General Module",
            lecture_order: globalOrder++,
            title: lec.title || "Video Lesson",
            duration: lec.duration || "10m",
            video_url: lec.video_url || "",
            is_free_preview: Boolean(lec.is_free_preview),
          });
        });
      });

      const validQuizQuestions = quizQuestions
        .filter((q) => q.question.trim())
        .map((q) => ({
          question: q.question.trim(),
          option_a: q.option_a.trim(),
          option_b: q.option_b.trim(),
          option_c: q.option_c.trim(),
          option_d: q.option_d.trim(),
          correct_option: (q.correct_option || "A").toUpperCase(),
        }));

      const payload = {
        title: courseData.title,
        mentor_id: courseData.mentor_id ? Number(courseData.mentor_id) : null,
        mentor_name: selectedMentor?.name || "KnowWay Instructor",
        category: courseData.category,
        languages: courseData.selectedLanguages.join(", "),
        duration: courseData.duration || "2.5 Hours",
        regular_price: Number(courseData.regular_price) || 2999,
        promo_price: Number(courseData.promo_price) || 499,
        promo_code: courseData.promo_code || "KNOWWAY50",
        thumbnail_url:
          courseData.thumbnail_url ||
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
        description: courseData.description,
        what_you_will_learn: courseData.what_you_will_learn.filter((item) => item.trim() !== ""),
        software_required: courseData.software_required,
        referral_commission_type: courseData.referral_commission_type || "percentage",
        referral_commission_value: Number(courseData.referral_commission_value) || 20,
        lectures: flattenedLectures,
        quiz_questions: validQuizQuestions,
      };

      const res = isEditMode
        ? await updateCourseApi(id, payload)
        : await createCourseApi(payload);

      if (res?.success) {
        showToast(isEditMode ? "🎉 Course updated successfully!" : "🎉 Course published successfully!");
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1200);
      } else {
        showToast(res?.message || (isEditMode ? "Failed to update course" : "Failed to publish course"), "error");
      }
    } catch (err) {
      showToast(err.message || "An unexpected error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const wizardSteps = [
    { number: 1, title: "Course Info", subtitle: "Title & Details", icon: BookOpen },
    { number: 2, title: "Mentor & Objectives", subtitle: "Instructor & Learnings", icon: GraduationCap },
    { number: 3, title: "Curriculum & Videos", subtitle: "Sections & Parts", icon: Video },
    { number: 4, title: "Certificate Quiz", subtitle: "MCQ Assessment", icon: Award },
    { number: 5, title: "Review & Publish", subtitle: isEditMode ? "Save Changes" : "Final Preview", icon: Sparkles },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 antialiased ${
        darkMode ? "dark bg-[#0B0F17] text-[#E2E8F0]" : "bg-[#F4F6FA] text-[#0F172A]"
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

      {/* Floating Island Sidebar */}
      <AdminSidebar
        activeTab="courses"
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

      {/* Main Content Area */}
      <div className="lg:pl-[96px] flex flex-col min-w-0">
        <AdminHeader
          activeTab="courses"
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
          {/* Top Back Action & Page Heading */}
          <div
            className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
            }`}
          >
            <div className="flex items-center gap-4">
              <Link
                to="/admin/dashboard"
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
                    {isEditMode ? "Edit Course Studio" : "Course Creation Studio"}
                  </h1>
                  <span className="text-[11px] font-bold text-[#035BE3] bg-[#035BE3]/10 px-2.5 py-0.5 rounded-full border border-[#035BE3]/20">
                    Step {currentStep} of 5
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                  {isEditMode
                    ? "Edit full curriculum, pricing, video modules, quiz questions and mentor details."
                    : "Upload video lessons, configure certification quiz & publish directly."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admin/dashboard"
                className={`h-11 px-5 rounded-full border text-xs font-semibold transition flex items-center justify-center ${
                  darkMode
                    ? "border-[#222B3D] text-[#94A3B8] hover:bg-[#1E2638]"
                    : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFD]"
                }`}
              >
                Cancel & Exit
              </Link>
            </div>
          </div>

          {/* ======================================================== */}
          {/* STEPPER PROGRESS INDICATOR (5 STEPS FULL ROUNDED PILLS) */}
          {/* ======================================================== */}
          <div
            className={`rounded-full p-2 sm:p-2.5 border ${
              darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
            }`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
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

          {/* ======================================================== */}
          {/* STEP 1: COURSE INFO & BASIC DETAILS */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div
                className={`rounded-[32px] p-6 sm:p-8 border ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div className="flex items-center gap-3 pb-6 border-b border-inherit">
                  <div className="w-10 h-10 rounded-full bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center font-bold shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">Step 1: Course Identity & Overview</h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Define course title, category pills, languages, duration, and thumbnail banner (Upload or URL).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                  {/* Left 2 Cols: Form Inputs */}
                  <div className="lg:col-span-2 space-y-5">
                    {/* Course Title */}
                    <div>
                      <label className="block text-xs font-bold mb-2">
                        Course Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Meta Ads Mastery (Telugu)"
                        value={courseData.title}
                        onChange={(e) =>
                          setCourseData({ ...courseData, title: e.target.value })
                        }
                        className={`w-full h-12 rounded-full border px-5 text-xs outline-none focus:border-[#035BE3] font-medium transition ${
                          darkMode
                            ? "bg-[#0B0F17] border-[#222B3D] text-white"
                            : "bg-[#F8FAFD] border-[#E2E8F0]"
                        }`}
                      />
                    </div>

                    {/* Category Selector with Custom Category Support */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold">
                          Select Category <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowCustomCategoryInput(!showCustomCategoryInput)}
                          className="text-xs font-bold text-[#035BE3] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{showCustomCategoryInput ? "Hide Custom Category" : "+ Add Custom Category"}</span>
                        </button>
                      </div>

                      {/* Custom Category Input Box */}
                      {showCustomCategoryInput && (
                        <div
                          className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 ${
                            darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-blue-50/70 border-blue-200"
                          }`}
                        >
                          <input
                            type="text"
                            placeholder="Type new custom category name (e.g. AI Prompting, VFX, 3D Art)..."
                            value={customCategoryText}
                            onChange={(e) => setCustomCategoryText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddCustomCategory();
                              }
                            }}
                            className={`flex-1 h-10 rounded-xl px-4 text-xs outline-none border ${
                              darkMode
                                ? "bg-[#131926] border-[#222B3D] text-white placeholder-gray-500"
                                : "bg-white border-[#DCE5F5] text-[#0F172A] placeholder-gray-400"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomCategory}
                            className="h-10 px-5 rounded-xl bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add & Select</span>
                          </button>
                        </div>
                      )}

                      {/* Category Pills */}
                      <div className="flex flex-wrap gap-2">
                        {categoryList.map((cat) => {
                          const isSelected = courseData.category === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() =>
                                setCourseData({ ...courseData, category: cat })
                              }
                              className={`h-9 px-4 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                  ? "bg-[#035BE3] text-white shadow-xs"
                                  : darkMode
                                  ? "bg-[#0B0F17] border border-[#222B3D] text-[#94A3B8] hover:border-[#035BE3]"
                                  : "bg-[#F4F6FB] border border-[#E2E8F0] text-[#556377] hover:border-[#035BE3]"
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                              <span>{cat}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Category Direct Edit */}
                      <div className="pt-1">
                        <span className="text-[11px] font-semibold text-[#64748B]">Active Category Name:</span>
                        <input
                          type="text"
                          required
                          value={courseData.category}
                          onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                          placeholder="Category name"
                          className={`mt-1 w-full h-10 rounded-xl border px-4 text-xs font-bold outline-none ${
                            darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Languages Multi-Select */}
                    <div>
                      <label className="block text-xs font-bold mb-2">
                        Course Audio Languages <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableLanguages.map((lang) => {
                          const isSelected = courseData.selectedLanguages.includes(lang);
                          return (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => handleToggleLanguage(lang)}
                              className={`h-9 px-4 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                  ? "bg-emerald-600 text-white shadow-xs"
                                  : darkMode
                                  ? "bg-[#0B0F17] border border-[#222B3D] text-[#94A3B8] hover:border-emerald-500"
                                  : "bg-[#F4F6FB] border border-[#E2E8F0] text-[#556377] hover:border-emerald-500"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                              <span>{lang}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Duration & Software Required */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold mb-2">
                          Estimated Total Duration
                        </label>
                        <div className="relative">
                          <Clock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                          <input
                            type="text"
                            placeholder="e.g. 1.53 Hours / 6 Hours"
                            value={courseData.duration}
                            onChange={(e) =>
                              setCourseData({ ...courseData, duration: e.target.value })
                            }
                            className={`w-full h-12 rounded-full border pl-11 pr-5 text-xs outline-none focus:border-[#035BE3] ${
                              darkMode
                                ? "bg-[#0B0F17] border-[#222B3D] text-white"
                                : "bg-[#F8FAFD] border-[#E2E8F0]"
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-2">
                          Software / Tools Required
                        </label>
                        <div className="relative">
                          <Wrench className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                          <input
                            type="text"
                            placeholder="e.g. CapCut, InShot, VN Video Editor"
                            value={courseData.software_required}
                            onChange={(e) =>
                              setCourseData({
                                ...courseData,
                                software_required: e.target.value,
                              })
                            }
                            className={`w-full h-12 rounded-full border pl-11 pr-5 text-xs outline-none focus:border-[#035BE3] ${
                              darkMode
                                ? "bg-[#0B0F17] border-[#222B3D] text-white"
                                : "bg-[#F8FAFD] border-[#E2E8F0]"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* PRICING CONFIGURATION (REAL PRICE + PROMO PRICE) */}
                    {/* ======================================================== */}
                    <div
                      className={`p-6 rounded-[24px] border space-y-4 shadow-sm transition-colors ${
                        darkMode
                          ? "bg-[#131926] border-[#222B3D]"
                          : "bg-white border-[#DCE5F5]"
                      }`}
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-inherit">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center font-bold">
                            ₹
                          </div>
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#035BE3]">
                              Course Pricing Structure
                            </h3>
                            <p className="text-[11px] text-[#64748B] mt-0.5">
                              Specify standard real price and special promocode offer price
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Real / Regular Price */}
                        <div
                          className={`p-4 rounded-2xl border ${
                            darkMode
                              ? "bg-[#0B0F17] border-[#222B3D]"
                              : "bg-[#F8FAFD] border-[#E2E8F0]"
                          }`}
                        >
                          <label className="block text-xs font-bold mb-1.5 text-gray-700 dark:text-gray-300">
                            Real / Regular Price <span className="text-red-500">*</span>
                          </label>
                          <p className="text-[10.5px] text-[#94A3B8] mb-2">Original crossed-out price</p>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-xs text-gray-400">
                              ₹
                            </span>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              placeholder="2999"
                              value={courseData.regular_price}
                              onChange={(e) =>
                                setCourseData({ ...courseData, regular_price: e.target.value })
                              }
                              className={`w-full h-11 rounded-xl border pl-8 pr-4 text-xs font-bold outline-none focus:border-[#035BE3] shadow-xs ${
                                darkMode
                                  ? "bg-[#131926] border-[#2B374E] text-white"
                                  : "bg-white border-[#DCE5F5] text-[#0F172A]"
                              }`}
                            />
                          </div>
                        </div>

                        {/* With Promocode Price */}
                        <div
                          className={`p-4 rounded-2xl border ${
                            darkMode
                              ? "bg-[#0B0F17] border-emerald-900/40"
                              : "bg-emerald-50/50 border-emerald-200"
                          }`}
                        >
                          <label className="block text-xs font-bold mb-1.5 text-emerald-700 dark:text-emerald-400">
                            With Promocode Price <span className="text-red-500">*</span>
                          </label>
                          <p className="text-[10.5px] text-emerald-600/80 dark:text-emerald-500/80 mb-2">Discounted active price</p>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                              ₹
                            </span>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              placeholder="499"
                              value={courseData.promo_price}
                              onChange={(e) =>
                                setCourseData({ ...courseData, promo_price: e.target.value })
                              }
                              className={`w-full h-11 rounded-xl border pl-8 pr-4 text-xs font-extrabold outline-none focus:border-[#035BE3] shadow-xs ${
                                darkMode
                                  ? "bg-[#131926] border-emerald-800/60 text-emerald-400"
                                  : "bg-white border-emerald-300 text-emerald-700"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* THUMBNAIL UPLOAD / URL DUAL INPUT */}
                    {/* ======================================================== */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold">
                          Course Cover Thumbnail (16:9 Image)
                        </label>
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                          <button
                            type="button"
                            onClick={() => setThumbnailMode("file")}
                            className={`h-8 px-4 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                              thumbnailMode === "file"
                                ? "bg-[#035BE3] text-white shadow-xs"
                                : "text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
                            }`}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Image</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setThumbnailMode("url")}
                            className={`h-8 px-4 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                              thumbnailMode === "url"
                                ? "bg-[#035BE3] text-white shadow-xs"
                                : "text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
                            }`}
                          >
                            <Link2 className="w-3.5 h-3.5" />
                            <span>Image URL</span>
                          </button>
                        </div>
                      </div>

                      {thumbnailMode === "file" ? (
                        <div
                          onClick={() => thumbInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-[26px] p-6 text-center cursor-pointer transition-colors ${
                            darkMode
                              ? "border-[#222B3D] hover:border-[#035BE3] bg-[#0B0F17]/50"
                              : "border-[#CBD5E1] hover:border-[#035BE3] bg-[#F8FAFD]"
                          }`}
                        >
                          <input
                            type="file"
                            ref={thumbInputRef}
                            onChange={handleThumbnailFileUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          {isUploadingThumb ? (
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 className="w-8 h-8 animate-spin text-[#035BE3]" />
                              <p className="text-xs font-bold">Uploading image to Cloudinary...</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-12 h-12 rounded-full bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center">
                                <UploadCloud className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="text-xs font-bold">
                                  Click to browse or drag & drop image
                                </p>
                                <p className="text-[11px] text-[#64748B] mt-0.5">
                                  Supports PNG, JPG, WebP (16:9 Recommended)
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="relative">
                          <Link2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                          <input
                            type="url"
                            placeholder="https://res.cloudinary.com/... or image link"
                            value={courseData.thumbnail_url}
                            onChange={(e) =>
                              setCourseData({
                                ...courseData,
                                thumbnail_url: e.target.value,
                              })
                            }
                            className={`w-full h-12 rounded-full border pl-11 pr-5 text-xs outline-none focus:border-[#035BE3] ${
                              darkMode
                                ? "bg-[#0B0F17] border-[#222B3D] text-white"
                                : "bg-[#F8FAFD] border-[#E2E8F0]"
                            }`}
                          />
                        </div>
                      )}
                    </div>

                    {/* About Course Description */}
                    <div>
                      <label className="block text-xs font-bold mb-2">
                        About Course (Comprehensive Description)
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Meta Ads Mastery is a practical course that teaches learners how to create, manage, test, retarget, report, and scale campaigns on Facebook and Instagram..."
                        value={courseData.description}
                        onChange={(e) =>
                          setCourseData({
                            ...courseData,
                            description: e.target.value,
                          })
                        }
                        className={`w-full rounded-[26px] border p-5 text-xs outline-none focus:border-[#035BE3] resize-none leading-relaxed ${
                          darkMode
                            ? "bg-[#0B0F17] border-[#222B3D] text-white"
                            : "bg-[#F8FAFD] border-[#E2E8F0]"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Right 1 Col: Live 16:9 Thumbnail Preview */}
                  <div>
                    <span className="block text-xs font-bold mb-2 text-[#64748B]">
                      16:9 Thumbnail Card Preview
                    </span>
                    <div
                      className={`rounded-[28px] border overflow-hidden transition-colors ${
                        darkMode ? "border-[#222B3D] bg-[#0B0F17]" : "border-[#E2E8F0] bg-[#F8FAFD]"
                      }`}
                    >
                      <div className="relative aspect-video w-full bg-[#1A2234] overflow-hidden flex items-center justify-center">
                        {courseData.thumbnail_url ? (
                          <img
                            src={courseData.thumbnail_url}
                            alt="Course Cover"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";
                            }}
                          />
                        ) : (
                          <div className="text-center p-4 text-[#94A3B8]">
                            <ImageIcon className="w-8 h-8 mx-auto mb-1.5 opacity-60" />
                            <p className="text-[11px]">16:9 Aspect Ratio Preview</p>
                          </div>
                        )}
                        <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                          {courseData.category}
                        </div>
                        <div className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full bg-[#035BE3] text-white text-[10px] font-bold">
                          {courseData.selectedLanguages.join(", ")}
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <h4 className="text-sm font-bold truncate">
                          {courseData.title || "Course Title Preview"}
                        </h4>
                        <p className="text-xs text-[#64748B] line-clamp-2">
                          {courseData.description || "Brief course overview and practical concepts covered."}
                        </p>
                        <div className="pt-3 flex items-center justify-between text-xs text-[#64748B] font-semibold border-t border-inherit">
                          <span>⏱️ {courseData.duration}</span>
                          <span className="text-[#035BE3]">KnowWay Certified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: MENTOR & LEARNING OBJECTIVES */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div
                className={`rounded-[32px] p-6 sm:p-8 border ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div className="flex items-center gap-3 pb-6 border-b border-inherit">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">Step 2: Assign Instructor & What Students Will Learn</h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Assign an expert mentor and build interactive learning checklist items.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                  {/* Left Col: Mentor Selection */}
                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold">
                          Select Instructor / Mentor <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] text-[#64748B]">
                          {mentorsList.length} Mentors Available
                        </span>
                      </div>

                      <select
                        value={courseData.mentor_id}
                        onChange={(e) =>
                          setCourseData({ ...courseData, mentor_id: e.target.value })
                        }
                        className={`w-full h-12 rounded-full border px-5 text-xs outline-none focus:border-[#035BE3] font-medium transition cursor-pointer ${
                          darkMode
                            ? "bg-[#0B0F17] border-[#222B3D] text-white"
                            : "bg-[#F8FAFD] border-[#E2E8F0]"
                        }`}
                      >
                        <option value="">-- Choose Instructor --</option>
                        {mentorsList.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} — ({m.role_title})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Selected Mentor Visual Card Preview */}
                    {selectedMentor && (
                      <div
                        className={`p-5 rounded-[26px] border flex items-center gap-4 transition-colors ${
                          darkMode
                            ? "bg-[#0B0F17] border-[#222B3D]"
                            : "bg-[#F8FAFD] border-[#E2E8F0]"
                        }`}
                      >
                        <img
                          src={
                            selectedMentor.photo_url ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                          }
                          alt={selectedMentor.name}
                          className="w-16 h-16 rounded-full object-cover border border-[#E2E8F0] shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold truncate">{selectedMentor.name}</h4>
                          <p className="text-xs text-[#035BE3] font-semibold truncate">
                            {selectedMentor.role_title}
                          </p>
                          <span className="inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            {selectedMentor.experience_badge || "Lead Instructor"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Certificate Badge Toggle */}
                    <div
                      className={`h-16 px-5 rounded-full border flex items-center justify-between ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-[#035BE3]" />
                        <div>
                          <p className="text-xs font-bold">Verified KnowWay Certificate</p>
                          <p className="text-[11px] text-[#64748B]">
                            Issue verified certificate upon 100% course completion
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={courseData.certificate_enabled}
                        onChange={(e) =>
                          setCourseData({
                            ...courseData,
                            certificate_enabled: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded text-[#035BE3] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Right Col: What You'll Learn Checklist Builder */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold">What You'll Learn (Checklist)</h3>
                        <p className="text-[11px] text-[#64748B]">
                          Key outcomes shown on course detail page
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddLearnPoint}
                        className="h-9 px-4 rounded-full bg-[#035BE3]/10 text-[#035BE3] hover:bg-[#035BE3]/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Bullet</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {courseData.what_you_will_learn.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-[#035BE3]/10 text-[#035BE3] text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={item}
                            placeholder="e.g. Master Meta Pixel installation & audience targeting"
                            onChange={(e) => handleUpdateLearnPoint(idx, e.target.value)}
                            className={`flex-1 h-12 rounded-full border px-5 text-xs outline-none focus:border-[#035BE3] ${
                              darkMode
                                ? "bg-[#0B0F17] border-[#222B3D] text-white"
                                : "bg-[#F8FAFD] border-[#E2E8F0]"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveLearnPoint(idx)}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: CURRICULUM & MULTI-SECTION VIDEO LESSONS */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div
                className={`rounded-[32px] p-6 sm:p-8 border ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-inherit">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold shrink-0">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold">Step 3: Multi-Section Video Curriculum</h2>
                      <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        Upload video files directly (.mp4, .mov) to Cloudinary or paste stream links, and set locked/preview.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                      {totalLecturesCount} Total Video Parts
                    </span>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="h-11 px-5 bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-semibold rounded-full transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Section</span>
                    </button>
                  </div>
                </div>

                {/* Multi-Section Accordions / Cards */}
                <div className="space-y-6 mt-6">
                  {sections.map((sec, secIdx) => (
                    <div
                      key={sec.id}
                      className={`rounded-[28px] border p-6 transition-colors ${
                        darkMode
                          ? "bg-[#0B0F17] border-[#222B3D]"
                          : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    >
                      {/* Section Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-inherit">
                        <div className="flex items-center gap-3 flex-1 max-w-md">
                          <span className="h-10 px-4 rounded-full bg-[#035BE3]/10 text-[#035BE3] text-xs font-bold flex items-center justify-center shrink-0">
                            Section {secIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={sec.section_name}
                            onChange={(e) => handleUpdateSectionName(secIdx, e.target.value)}
                            placeholder="Section Title (e.g. Introduction)"
                            className={`w-full h-11 rounded-full border px-5 text-xs font-bold outline-none focus:border-[#035BE3] ${
                              darkMode
                                ? "bg-[#131926] border-[#222B3D] text-white"
                                : "bg-white border-[#E2E8F0]"
                            }`}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddLecture(secIdx)}
                            className="h-10 px-4 bg-[#035BE3]/10 text-[#035BE3] hover:bg-[#035BE3]/20 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Part</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveSection(secIdx)}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                            title="Delete Section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Video Lectures List in this Section */}
                      <div className="space-y-4 mt-5">
                        {sec.lectures.map((lec, lecIdx) => {
                          const isUploading = uploadingLectures[lec.id] || false;

                          return (
                            <div
                              key={lec.id}
                              className={`p-5 rounded-[24px] border space-y-3 transition-colors ${
                                darkMode
                                  ? "bg-[#131926] border-[#222B3D]"
                                  : "bg-white border-[#E2E8F0]"
                              }`}
                            >
                              {/* Row 1: Part Number, Title, Duration, Free Preview / Locked, Trash */}
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center justify-center shrink-0">
                                  {lecIdx + 1}
                                </span>

                                <div className="flex-1">
                                  <input
                                    type="text"
                                    value={lec.title}
                                    placeholder="Lecture Title (e.g. Audience Targeting)"
                                    onChange={(e) =>
                                      handleUpdateLecture(secIdx, lecIdx, "title", e.target.value)
                                    }
                                    className={`w-full h-12 rounded-full border px-5 text-xs outline-none focus:border-[#035BE3] font-medium ${
                                      darkMode
                                        ? "bg-[#0B0F17] border-[#222B3D] text-white"
                                        : "bg-[#F8FAFD] border-[#E2E8F0]"
                                    }`}
                                  />
                                </div>

                                <div className="w-28 shrink-0">
                                  <input
                                    type="text"
                                    value={lec.duration}
                                    placeholder="e.g. 15m"
                                    onChange={(e) =>
                                      handleUpdateLecture(secIdx, lecIdx, "duration", e.target.value)
                                    }
                                    className={`w-full h-12 rounded-full border px-4 text-xs outline-none focus:border-[#035BE3] text-center font-mono ${
                                      darkMode
                                        ? "bg-[#0B0F17] border-[#222B3D] text-white"
                                        : "bg-[#F8FAFD] border-[#E2E8F0]"
                                    }`}
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateLecture(
                                      secIdx,
                                      lecIdx,
                                      "is_free_preview",
                                      !lec.is_free_preview
                                    )
                                  }
                                  className={`h-12 px-5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition cursor-pointer ${
                                    lec.is_free_preview
                                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                      : "bg-gray-100 dark:bg-gray-800 text-[#64748B] border border-transparent"
                                  }`}
                                >
                                  {lec.is_free_preview ? (
                                    <>
                                      <Unlock className="w-3.5 h-3.5" />
                                      <span>Free Preview</span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-3.5 h-3.5" />
                                      <span>Locked</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveLecture(secIdx, lecIdx)}
                                  className="w-12 h-12 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-red-500 hover:bg-red-500/10 transition shrink-0 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Row 2: Video Upload or URL Selector */}
                              <div className="pt-3 border-t border-inherit/60 flex flex-col md:flex-row md:items-center gap-3">
                                {/* Mode Switcher */}
                                <div className="h-11 flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-full shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateLecture(secIdx, lecIdx, "mode", "file")}
                                    className={`h-9 px-3.5 rounded-full text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                      lec.mode !== "url"
                                        ? "bg-[#035BE3] text-white shadow-xs"
                                        : "text-[#64748B]"
                                    }`}
                                  >
                                    <FileVideo className="w-3 h-3" />
                                    <span>Upload Video</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateLecture(secIdx, lecIdx, "mode", "url")}
                                    className={`h-9 px-3.5 rounded-full text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                      lec.mode === "url"
                                        ? "bg-[#035BE3] text-white shadow-xs"
                                        : "text-[#64748B]"
                                    }`}
                                  >
                                    <Link2 className="w-3 h-3" />
                                    <span>Video Link</span>
                                  </button>
                                </div>

                                {/* Upload Field or URL Input */}
                                <div className="flex-1">
                                  {lec.mode === "url" ? (
                                    <div className="relative">
                                      <Link2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                                      <input
                                        type="text"
                                        value={lec.video_url}
                                        placeholder="Cloudinary Stream URL / Public ID"
                                        onChange={(e) =>
                                          handleUpdateLecture(secIdx, lecIdx, "video_url", e.target.value)
                                        }
                                        className={`w-full h-11 rounded-full border pl-11 pr-5 text-xs outline-none focus:border-[#035BE3] font-mono text-[11px] ${
                                          darkMode
                                            ? "bg-[#0B0F17] border-[#222B3D] text-white"
                                            : "bg-[#F8FAFD] border-[#E2E8F0]"
                                        }`}
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <label
                                        className={`flex-1 h-11 flex items-center justify-between border border-dashed rounded-full px-5 cursor-pointer text-xs font-semibold transition ${
                                          darkMode
                                            ? "border-[#222B3D] bg-[#0B0F17] hover:border-[#035BE3]"
                                            : "border-[#CBD5E1] bg-[#F8FAFD] hover:border-[#035BE3]"
                                        }`}
                                      >
                                        <input
                                          type="file"
                                          accept="video/*"
                                          onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) handleVideoFileUpload(secIdx, lecIdx, f);
                                          }}
                                          className="hidden"
                                        />
                                        {isUploading ? (
                                          <div className="flex items-center gap-2 text-[#035BE3]">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>Uploading video to Cloudinary...</span>
                                          </div>
                                        ) : lec.video_url ? (
                                          <div className="flex items-center gap-2 text-emerald-600 truncate">
                                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate font-mono text-[11px]">{lec.video_url}</span>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-2 text-[#64748B]">
                                            <UploadCloud className="w-3.5 h-3.5 text-[#035BE3]" />
                                            <span>Choose video file (.mp4, .mov)</span>
                                          </div>
                                        )}
                                        <span className="text-[10px] text-[#035BE3] font-bold bg-[#035BE3]/10 px-2.5 py-1 rounded-full">
                                          Browse
                                        </span>
                                      </label>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 4: CERTIFICATE ASSESSMENT & MCQ QUIZ BUILDER */}
          {/* ======================================================== */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div
                className={`rounded-[32px] p-6 sm:p-8 border ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-inherit">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold">Step 4: Certificate Assessment & MCQ Quiz</h2>
                      <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        Create multiple-choice questions for the end-of-course assessment. Students must pass this test to claim their accredited certificate.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-3.5 py-1.5 rounded-full border border-amber-200 dark:border-amber-800">
                      {quizQuestions.length} Questions Configured
                    </span>
                    <button
                      type="button"
                      onClick={handleAddQuizQuestion}
                      className="h-11 px-5 bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-semibold rounded-full transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Question</span>
                    </button>
                  </div>
                </div>

                {/* Quiz Questions List */}
                <div className="space-y-6 mt-6">
                  {quizQuestions.map((q, qIdx) => (
                    <div
                      key={q.id || qIdx}
                      className={`rounded-[28px] border p-6 transition-colors space-y-4 ${
                        darkMode
                          ? "bg-[#0B0F17] border-[#222B3D]"
                          : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    >
                      {/* Card Header: Question Number & Delete */}
                      <div className="flex items-center justify-between gap-3 pb-3 border-b border-inherit">
                        <div className="flex items-center gap-2.5">
                          <span className="h-8 px-3.5 rounded-full bg-[#035BE3]/10 text-[#035BE3] text-xs font-bold flex items-center justify-center">
                            Question #{qIdx + 1}
                          </span>
                          <span className={`text-xs font-medium ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                            Multiple Choice Question
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveQuizQuestion(qIdx)}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Question Text */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold block">
                          Question Prompt <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => handleUpdateQuizQuestion(qIdx, "question", e.target.value)}
                          placeholder="e.g. What is the recommended strategy for Meta Ads scaling?"
                          className={`w-full h-12 rounded-full border px-5 text-xs outline-none focus:border-[#035BE3] font-medium ${
                            darkMode
                              ? "bg-[#131926] border-[#222B3D] text-white"
                              : "bg-white border-[#E2E8F0]"
                          }`}
                        />
                      </div>

                      {/* 4 Options Grid (2x2) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                        {/* Option A */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#64748B] flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] flex items-center justify-center font-bold">
                              A
                            </span>
                            Option A
                          </label>
                          <input
                            type="text"
                            value={q.option_a}
                            onChange={(e) => handleUpdateQuizQuestion(qIdx, "option_a", e.target.value)}
                            placeholder="Enter option A"
                            className={`w-full h-11 rounded-full border px-4 text-xs outline-none focus:border-[#035BE3] ${
                              darkMode
                                ? "bg-[#131926] border-[#222B3D] text-white"
                                : "bg-white border-[#E2E8F0]"
                            }`}
                          />
                        </div>

                        {/* Option B */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#64748B] flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] flex items-center justify-center font-bold">
                              B
                            </span>
                            Option B
                          </label>
                          <input
                            type="text"
                            value={q.option_b}
                            onChange={(e) => handleUpdateQuizQuestion(qIdx, "option_b", e.target.value)}
                            placeholder="Enter option B"
                            className={`w-full h-11 rounded-full border px-4 text-xs outline-none focus:border-[#035BE3] ${
                              darkMode
                                ? "bg-[#131926] border-[#222B3D] text-white"
                                : "bg-white border-[#E2E8F0]"
                            }`}
                          />
                        </div>

                        {/* Option C */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#64748B] flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] flex items-center justify-center font-bold">
                              C
                            </span>
                            Option C
                          </label>
                          <input
                            type="text"
                            value={q.option_c}
                            onChange={(e) => handleUpdateQuizQuestion(qIdx, "option_c", e.target.value)}
                            placeholder="Enter option C"
                            className={`w-full h-11 rounded-full border px-4 text-xs outline-none focus:border-[#035BE3] ${
                              darkMode
                                ? "bg-[#131926] border-[#222B3D] text-white"
                                : "bg-white border-[#E2E8F0]"
                            }`}
                          />
                        </div>

                        {/* Option D */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#64748B] flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] flex items-center justify-center font-bold">
                              D
                            </span>
                            Option D
                          </label>
                          <input
                            type="text"
                            value={q.option_d}
                            onChange={(e) => handleUpdateQuizQuestion(qIdx, "option_d", e.target.value)}
                            placeholder="Enter option D"
                            className={`w-full h-11 rounded-full border px-4 text-xs outline-none focus:border-[#035BE3] ${
                              darkMode
                                ? "bg-[#131926] border-[#222B3D] text-white"
                                : "bg-white border-[#E2E8F0]"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Correct Option Selector */}
                      <div className="pt-2 border-t border-inherit/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          Correct Option (Answer Key):
                        </span>

                        <div className="flex items-center gap-2">
                          {["A", "B", "C", "D"].map((optKey) => {
                            const isSelected = (q.correct_option || "A").toUpperCase() === optKey;
                            return (
                              <button
                                key={optKey}
                                type="button"
                                onClick={() => handleUpdateQuizQuestion(qIdx, "correct_option", optKey)}
                                className={`h-9 px-4 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                  isSelected
                                    ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30"
                                    : darkMode
                                    ? "bg-[#131926] border border-[#222B3D] text-[#94A3B8] hover:text-white"
                                    : "bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]"
                                }`}
                              >
                                <span>Option {optKey}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add More Questions bottom button */}
                <div className="mt-6 pt-4 border-t border-inherit flex justify-center">
                  <button
                    type="button"
                    onClick={handleAddQuizQuestion}
                    className={`h-11 px-6 rounded-full border border-dashed text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
                      darkMode
                        ? "border-[#2B374E] text-[#94A3B8] hover:text-white hover:border-[#035BE3]"
                        : "border-[#CBD5E1] text-[#64748B] hover:text-[#035BE3] hover:border-[#035BE3]"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Another Question</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 5: REVIEW & PUBLISH */}
          {/* ======================================================== */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div
                className={`rounded-[32px] p-6 sm:p-8 border ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div className="flex items-center gap-3 pb-6 border-b border-inherit">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">Step 5: Review Course & Final Publish</h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Verify course details, assigned mentor, video curriculum, and certification quiz before publishing to the live catalog.
                    </p>
                  </div>
                </div>

                {/* Review Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                  {/* Left 2 Cols: Summary Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Course Headline Card */}
                    <div
                      className={`p-6 rounded-[26px] border ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    >
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-[#035BE3] text-white text-[10px] font-bold">
                          {courseData.category}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                          {courseData.selectedLanguages.join(", ")}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold">
                          ⏱️ {courseData.duration}
                        </span>
                      </div>

                      <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                        {courseData.title || "Untitled Course"}
                      </h3>
                      <p className={`text-xs mt-2 leading-relaxed ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        {courseData.description || "No description provided."}
                      </p>

                      <div className={`mt-4 pt-4 border-t border-inherit flex flex-wrap gap-4 text-xs font-semibold ${
                        darkMode ? "text-[#94A3B8]" : "text-[#64748B]"
                      }`}>
                        <span>💰 Real: ₹{courseData.regular_price} • Promo: ₹{courseData.promo_price}</span>
                        <span>🛠️ Software: {courseData.software_required || "None required"}</span>
                        <span>📜 Quiz: {quizQuestions.length} Questions</span>
                      </div>
                    </div>

                    {/* What You'll Learn Summary */}
                    <div
                      className={`p-6 rounded-[26px] border ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    >
                      <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-[#64748B]">
                        Key Learning Takeaways ({courseData.what_you_will_learn.length})
                      </h4>
                      <ul className="space-y-2">
                        {courseData.what_you_will_learn.map((item, i) => (
                          <li key={i} className={`flex items-start gap-2.5 text-xs ${darkMode ? "text-gray-200" : "text-[#1E293B]"}`}>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Curriculum Summary Breakdown */}
                    <div
                      className={`p-6 rounded-[26px] border ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                          Curriculum ({sections.length} Sections • {totalLecturesCount} Video Parts)
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {sections.map((sec, sIdx) => (
                          <div
                            key={sIdx}
                            className={`p-4 rounded-[20px] border ${
                              darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                            }`}
                          >
                            <p className="text-xs font-bold text-[#035BE3] mb-2">
                              {sIdx + 1}. {sec.section_name} ({sec.lectures.length} parts)
                            </p>
                            <div className="space-y-1.5 pl-3 border-l-2 border-inherit">
                              {sec.lectures.map((lec, lIdx) => (
                                <div
                                  key={lIdx}
                                  className={`flex items-center justify-between text-xs ${
                                    darkMode ? "text-gray-300" : "text-[#64748B]"
                                  }`}
                                >
                                  <span className="truncate pr-2">
                                    • {lec.title} ({lec.duration})
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 border ${
                                      lec.is_free_preview
                                        ? (darkMode ? "bg-emerald-950/50 text-emerald-400 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-200")
                                        : (darkMode ? "bg-gray-800 text-gray-400 border-gray-700" : "bg-gray-100 text-gray-500 border-gray-200")
                                    }`}
                                  >
                                    {lec.is_free_preview ? "Free Preview" : "Locked"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certificate Assessment Quiz Summary */}
                    <div
                      className={`p-6 rounded-[26px] border ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                          Certification Quiz ({quizQuestions.length} Questions)
                        </h4>
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          Passing Grade: 60%
                        </span>
                      </div>

                      <div className="space-y-3">
                        {quizQuestions.map((q, qIdx) => (
                          <div
                            key={qIdx}
                            className={`p-3.5 rounded-[18px] border text-xs ${
                              darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                            }`}
                          >
                            <p className="font-semibold mb-1.5">
                              {qIdx + 1}. {q.question || "Untitled Question"}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                              <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                Correct: Option {q.correct_option || "A"}
                              </span>
                              <span className="truncate">
                                • {q[`option_${(q.correct_option || "a").toLowerCase()}`]}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right 1 Col: Mentor & Action Card */}
                  <div className="space-y-6">
                    {/* Mentor Card */}
                    <div
                      className={`p-6 rounded-[26px] border text-center ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-3">
                        Assigned Mentor
                      </span>
                      {selectedMentor ? (
                        <div>
                          <img
                            src={
                              selectedMentor.photo_url ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                            }
                            alt={selectedMentor.name}
                            className="w-20 h-20 rounded-full object-cover border mx-auto mb-3"
                          />
                          <h4 className="text-base font-bold">{selectedMentor.name}</h4>
                          <p className="text-xs text-[#035BE3] font-semibold">
                            {selectedMentor.role_title}
                          </p>
                          <span className="inline-block mt-2 text-[10px] font-bold px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800">
                            {selectedMentor.experience_badge || "Instructor"}
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-[#94A3B8]">No mentor assigned yet.</p>
                      )}
                    </div>

                    {/* Publish Action Box */}
                    <div
                      className={`p-6 rounded-[26px] border text-center space-y-3 ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}
                    >
                      <h4 className="text-sm font-bold">
                        {isEditMode ? "Save & Apply Updates" : "Ready to Launch?"}
                      </h4>
                      <p className="text-xs text-[#64748B]">
                        {isEditMode
                          ? "Click below to save all modified curriculum, video lectures, quiz questions and pricing."
                          : "Click below to publish this course and make it live in your database."}
                      </p>
                      <button
                        type="button"
                        onClick={handleSubmitCourse}
                        disabled={isSubmitting}
                        className="w-full h-12 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#035BE3]/20 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>{isEditMode ? "Saving Changes..." : "Publishing Course..."}</span>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>{isEditMode ? "Save & Update Course" : "Publish Course to KnowWay"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEPPER BOTTOM NAVIGATION (PREV / NEXT / PUBLISH) */}
          {/* ======================================================== */}
          <div
            className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex items-center justify-between gap-4 ${
              darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
            }`}
          >
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className={`h-12 px-6 rounded-full border text-xs font-semibold transition flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                darkMode
                  ? "border-[#222B3D] text-[#E2E8F0] hover:bg-[#1E2638]"
                  : "border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFD]"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            <div className="text-xs font-semibold text-[#64748B] hidden sm:block">
              Step {currentStep} of 5: {wizardSteps[currentStep - 1]?.title}
            </div>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="h-12 px-7 bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-semibold rounded-full transition flex items-center gap-2 cursor-pointer shadow-md shadow-[#035BE3]/20"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitCourse}
                disabled={isSubmitting}
                className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-full transition flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? isEditMode
                      ? "Updating..."
                      : "Publishing..."
                    : isEditMode
                    ? "Confirm & Save Changes"
                    : "Confirm & Publish"}
                </span>
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
