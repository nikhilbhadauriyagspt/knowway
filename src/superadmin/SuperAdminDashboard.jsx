import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
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
  Plus,
  GraduationCap,
  BookOpen,
  Key,
  Cloud,
  Check,
  X,
  Play,
  Video,
  FileText,
  Clock,
  Globe,
  Pencil,
  IndianRupee,
} from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import DashboardCharts from "./components/DashboardCharts";
import {
  isAdminAuthenticated,
  getAdminUser,
  getAdminProfileApi,
  getAdminStatsApi,
  getAllUsersApi,
  deleteUserApi,
  getMentorsApi,
  createMentorApi,
  deleteMentorApi,
  getCoursesApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
  getPackagesApi,
  getPackageBySlugApi,
  createPackageApi,
  updatePackageApi,
  deletePackageApi,
  getSystemSettingsApi,
  saveSystemSettingsApi,
  testSmtpApi,
  uploadImageApi,
  API_BASE_URL,
} from "../services/api";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  // Theme & Layout States
  const [searchParams] = useSearchParams();
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
  const [internalTab, setInternalTab] = useState("dashboard");
  const tabFromUrl = searchParams.get("tab");
  const activeTab = tabFromUrl || internalTab;
  const setActiveTab = (t) => setInternalTab(t);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Data States
  const [adminUser, setAdminUser] = useState(getAdminUser());
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPackages: 4,
    totalCourses: 0,
    totalMentors: 0,
    totalRevenue: 0,
    conversionRate: "14.8%",
  });
  const [usersList, setUsersList] = useState([]);
  const [mentorsList, setMentorsList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [packagesList, setPackagesList] = useState([]);

  // Package Studio Modal State
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [uploadingPackageImg, setUploadingPackageImg] = useState(false);
  const [packageFormData, setPackageFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    image_url: "/images/packages/pro.png",
    mrp_price: 11800,
    promo_price: 7999,
    mrp_note: "Full access to value-packed courses, ideal for beginners, freelancers, content creators",
    promo_note: "Launch your Freelance career with high-value courses + lifetime access, tools, and community.",
    total_hours: "25+ Hours",
    enrolled_students: "45K+ Students Enrolled",
    overview_heading: "Unlock lifetime access, certification, and community support to grow, earn, and thrive confidently.",
    overview_desc: "A complete ecosystem designed for individuals who are serious about building their freelance career that leads to real results.",
    what_you_will_learn: [
      "Learn Artificial Intelligence tools to improve productivity and work smarter.",
      "Master Video Editing with Premiere Pro, Filmora, and create engaging content.",
      "Learn freelancing skills to find clients and start earning online.",
    ],
    faqs: [
      {
        question: "What’s included in this package?",
        answer: "The package includes full lifetime access to in-demand courses, verifiable certification, and community.",
      },
    ],
    course_ids: [],
  });

  const [cloudinarySettings, setCloudinarySettings] = useState({
    cloud_name: "",
    api_key: "",
    api_secret: "",
    upload_preset: "",
  });
  const [smtpSettings, setSmtpSettings] = useState({
    smtp_host: "",
    smtp_port: "587",
    smtp_user: "",
    smtp_pass: "",
    smtp_from_name: "KnowWay LearnSpace",
    smtp_from_email: "",
    smtp_is_active: "false",
  });
  const [testEmailTarget, setTestEmailTarget] = useState("");
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modals & Sub-forms States
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null); // Course currently being edited (pricing / details)
  const [isSavingCourse, setIsSavingCourse] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // { type: 'user'|'mentor'|'course', id, name }
  const [isProcessing, setIsProcessing] = useState(false);

  // New Mentor Form State
  const [mentorPhotoUploading, setMentorPhotoUploading] = useState(false);
  const [newMentor, setNewMentor] = useState({
    name: "",
    role_title: "",
    photo_url: "",
    bio: "",
    experience_badge: "5+ Yrs Exp",
    expertise: "",
    social_linkedin: "",
    social_instagram: "",
  });

  // New Course Form State
  const [newCourse, setNewCourse] = useState({
    title: "",
    mentor_id: "",
    category: "Digital Marketing",
    languages: "Hindi, English",
    duration: "4.5 Hours",
    thumbnail_url: "",
    description: "",
    what_you_will_learn: ["", "", ""],
    software_required: "",
    lectures: [
      {
        section_name: "Introduction",
        title: "Course Overview & Mindset",
        duration: "5m",
        video_url: "",
        is_free_preview: true,
      },
      {
        section_name: "Module 1",
        title: "Core Framework & Tool Setup",
        duration: "18m",
        video_url: "",
        is_free_preview: false,
      },
    ],
  });

  // Toast Helper
  const showToast = (message, type = "success") => {
    setNotificationMsg({ message, type });
    setTimeout(() => {
      setNotificationMsg(null);
    }, 3500);
  };

  // Fetch all dashboard & management data
  const fetchDashboardData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // 1. Stats
      try {
        const statsRes = await getAdminStatsApi();
        if (statsRes?.stats) setStats(statsRes.stats);
      } catch (e) {
        console.warn("Stats notice:", e.message);
      }

      // 2. Users
      try {
        const usersRes = await getAllUsersApi();
        if (usersRes?.users) setUsersList(usersRes.users);
      } catch (e) {
        console.warn("Users notice:", e.message);
      }

      // 3. Mentors
      try {
        const mentorsRes = await getMentorsApi();
        if (mentorsRes?.mentors) setMentorsList(mentorsRes.mentors);
      } catch (e) {
        console.warn("Mentors notice:", e.message);
      }

      // 4. Courses
      try {
        const coursesRes = await getCoursesApi();
        if (coursesRes?.courses) setCoursesList(coursesRes.courses);
      } catch (e) {
        console.warn("Courses notice:", e.message);
      }

      // 5. Packages
      try {
        const packagesRes = await getPackagesApi();
        if (packagesRes?.packages) setPackagesList(packagesRes.packages);
      } catch (e) {
        console.warn("Packages notice:", e.message);
      }

      // 5. Cloudinary & SMTP Settings
      try {
        const settingsRes = await getSystemSettingsApi();
        if (settingsRes?.settings) {
          setCloudinarySettings({
            cloud_name: settingsRes.settings.cloudinary_cloud_name || "",
            api_key: settingsRes.settings.cloudinary_api_key || "",
            api_secret: settingsRes.settings.cloudinary_api_secret || "",
            upload_preset: settingsRes.settings.cloudinary_upload_preset || "",
          });
          setSmtpSettings({
            smtp_host: settingsRes.settings.smtp_host || "",
            smtp_port: settingsRes.settings.smtp_port || "587",
            smtp_user: settingsRes.settings.smtp_user || "",
            smtp_pass: settingsRes.settings.smtp_pass || "",
            smtp_from_name: settingsRes.settings.smtp_from_name || "KnowWay LearnSpace",
            smtp_from_email: settingsRes.settings.smtp_from_email || "",
            smtp_is_active: settingsRes.settings.smtp_is_active || "false",
          });
        }
      } catch (e) {
        console.warn("Settings notice:", e.message);
      }
    } catch (err) {
      console.error("Data load error:", err);
      showToast("Connection notice: " + err.message, "error");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate("/admin/login", { replace: true });
      return;
    }
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) fetchDashboardData();
    });
    return () => {
      isMounted = false;
    };
  }, [navigate, fetchDashboardData]);

  // Handle Mentor Submission
  const handleCreateMentor = async (e) => {
    e.preventDefault();
    if (!newMentor.name || !newMentor.role_title) {
      showToast("Mentor name and role are required", "error");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await createMentorApi(newMentor);
      if (res?.success) {
        showToast("Mentor added successfully!");
        setShowMentorModal(false);
        setNewMentor({
          name: "",
          role_title: "",
          photo_url: "",
          bio: "",
          experience_badge: "5+ Yrs Exp",
          expertise: "",
          social_linkedin: "",
          social_instagram: "",
        });
        fetchDashboardData();
      } else {
        showToast(res?.message || "Failed to create mentor", "error");
      }
    } catch (err) {
      showToast(err.message || "Error creating mentor", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Course Submission
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.category) {
      showToast("Course title and category are required", "error");
      return;
    }
    setIsProcessing(true);
    try {
      const selectedMentor = mentorsList.find((m) => String(m.id) === String(newCourse.mentor_id));
      const payload = {
        ...newCourse,
        mentor_name: selectedMentor?.name || "Knowway Instructor",
        what_you_will_learn: newCourse.what_you_will_learn.filter((item) => item.trim() !== ""),
      };

      const res = await createCourseApi(payload);
      if (res?.success) {
        showToast("Course & lectures published successfully!");
        setShowCourseModal(false);
        fetchDashboardData();
      } else {
        showToast(res?.message || "Failed to create course", "error");
      }
    } catch (err) {
      showToast(err.message || "Error creating course", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Save Course Pricing & Details Edit
  const handleSaveCourseEdit = async (e) => {
    e.preventDefault();
    if (!editingCourse) return;
    setIsSavingCourse(true);
    try {
      const res = await updateCourseApi(editingCourse.id, {
        title: editingCourse.title,
        category: editingCourse.category,
        languages: editingCourse.languages,
        duration: editingCourse.duration,
        regular_price: Number(editingCourse.regular_price) || 2999,
        promo_price: Number(editingCourse.promo_price) || 499,
        promo_code: editingCourse.promo_code || "KNOWWAY50",
      });

      if (res?.success) {
        showToast("Course pricing & details updated successfully!");
        setEditingCourse(null);
        await fetchDashboardData();
      } else {
        showToast(res?.message || "Failed to update course", "error");
      }
    } catch (err) {
      showToast(err.message || "Error updating course", "error");
    } finally {
      setIsSavingCourse(false);
    }
  };

  // Handle Save Cloudinary Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await saveSystemSettingsApi({
        cloudinary_cloud_name: cloudinarySettings.cloud_name,
        cloudinary_api_key: cloudinarySettings.api_key,
        cloudinary_api_secret: cloudinarySettings.api_secret,
        cloudinary_upload_preset: cloudinarySettings.upload_preset,
      });
      if (res?.success) {
        showToast("Cloudinary API credentials saved & active!");
      }
    } catch (err) {
      showToast(err.message || "Error saving credentials", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Save SMTP Settings
  const handleSaveSmtpSettings = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await saveSystemSettingsApi(smtpSettings);
      if (res?.success) {
        showToast("SMTP Mail configuration saved successfully!");
      }
    } catch (err) {
      showToast(err.message || "Error saving SMTP settings", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Test SMTP Connection
  const handleTestSmtp = async () => {
    if (!smtpSettings.smtp_host || !smtpSettings.smtp_user || !smtpSettings.smtp_pass) {
      showToast("Please enter SMTP Host, User and Password before testing", "error");
      return;
    }
    setIsTestingSmtp(true);
    try {
      const res = await testSmtpApi({
        host: smtpSettings.smtp_host,
        port: smtpSettings.smtp_port,
        user: smtpSettings.smtp_user,
        pass: smtpSettings.smtp_pass,
        from_name: smtpSettings.smtp_from_name,
        from_email: smtpSettings.smtp_from_email,
        target_email: testEmailTarget.trim() || smtpSettings.smtp_user,
      });
      if (res?.success) {
        showToast(res.message || "Test email sent successfully!");
      }
    } catch (err) {
      showToast(err.message || "SMTP test failed", "error");
    } finally {
      setIsTestingSmtp(false);
    }
  };

  // Handle Unified Deletion
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsProcessing(true);
    try {
      if (itemToDelete.type === "user") {
        await deleteUserApi(itemToDelete.id);
        setUsersList((prev) => prev.filter((u) => u.id !== itemToDelete.id));
        showToast("Student deleted.");
      } else if (itemToDelete.type === "mentor") {
        await deleteMentorApi(itemToDelete.id);
        setMentorsList((prev) => prev.filter((m) => m.id !== itemToDelete.id));
        showToast("Mentor removed.");
      } else if (itemToDelete.type === "course") {
        await deleteCourseApi(itemToDelete.id);
        setCoursesList((prev) => prev.filter((c) => c.id !== itemToDelete.id));
        showToast("Course removed.");
      } else if (itemToDelete.type === "package") {
        await deletePackageApi(itemToDelete.id);
        setPackagesList((prev) => prev.filter((p) => p.id !== itemToDelete.id));
        showToast("Package removed.");
      }
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setIsProcessing(false);
      setItemToDelete(null);
    }
  };

  // Package Management Handlers
  const handleOpenCreatePackage = () => {
    setEditingPackageId(null);
    setPackageFormData({
      name: "",
      slug: "",
      tagline: "",
      image_url: "/images/packages/pro.png",
      mrp_price: 11800,
      promo_price: 7999,
      mrp_note: "Full access to 9 value-packed courses, ideal for beginners, freelancers, content creators",
      promo_note: "Launch your Freelance career with 9+ High Value courses + lifetime access, tools, and community.",
      total_hours: "25+ Hours",
      enrolled_students: "45K+ Students Enrolled",
      overview_heading: "Unlock lifetime access, certification, and community support to grow, earn, and thrive confidently.",
      overview_desc: "A complete ecosystem designed for individuals who are serious about building their freelance career that leads to real results.",
      what_you_will_learn: [
        "Learn Artificial Intelligence tools to improve productivity and work smarter.",
        "Master Video Editing with Premiere Pro, Filmora, and create engaging content.",
        "Learn freelancing skills to find clients and start earning online.",
      ],
      faqs: [
        {
          question: "What’s included in this package?",
          answer: "The package includes full lifetime access to in-demand courses, verifiable certification, and community.",
        },
      ],
      course_ids: coursesList.map((c) => c.id),
    });
    setIsPackageModalOpen(true);
  };

  const handleOpenEditPackage = async (pkg) => {
    setEditingPackageId(pkg.id);
    let linkedCourseIds = [];
    try {
      const res = await getPackageBySlugApi(pkg.slug || pkg.id);
      if (res && res.package && Array.isArray(res.package.courses)) {
        linkedCourseIds = res.package.courses.map((c) => c.id);
      }
    } catch {
      linkedCourseIds = [];
    }

    setPackageFormData({
      name: pkg.name || "",
      slug: pkg.slug || "",
      tagline: pkg.tagline || "",
      image_url: pkg.image_url || "/images/packages/pro.png",
      mrp_price: pkg.mrp_price || 11800,
      promo_price: pkg.promo_price || 7999,
      mrp_note: pkg.mrp_note || "Full access to value-packed courses",
      promo_note: pkg.promo_note || "Launch your career with high-value courses",
      total_hours: pkg.total_hours || "25+ Hours",
      enrolled_students: pkg.enrolled_students || "45K+ Students Enrolled",
      overview_heading: pkg.overview_heading || "Unlock lifetime access, certification, and community support",
      overview_desc: pkg.overview_desc || "A complete ecosystem designed for individuals who are serious about building their career",
      what_you_will_learn: Array.isArray(pkg.what_you_will_learn) && pkg.what_you_will_learn.length > 0 ? pkg.what_you_will_learn : [
        "Learn Artificial Intelligence tools to improve productivity and work smarter.",
        "Master Video Editing with Premiere Pro, Filmora, and create engaging content."
      ],
      faqs: Array.isArray(pkg.faqs) && pkg.faqs.length > 0 ? pkg.faqs : [
        {
          question: "What’s included in this package?",
          answer: "The package includes full lifetime access to in-demand courses, verifiable certification, and community.",
        }
      ],
      course_ids: linkedCourseIds,
    });
    setIsPackageModalOpen(true);
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    if (!packageFormData.name.trim()) {
      showToast("Please enter package name", "error");
      return;
    }

    setIsProcessing(true);
    try {
      if (editingPackageId) {
        await updatePackageApi(editingPackageId, packageFormData);
        showToast("Package updated successfully!");
      } else {
        await createPackageApi(packageFormData);
        showToast("Package created successfully!");
      }
      setIsPackageModalOpen(false);
      // Refresh list
      const res = await getPackagesApi();
      if (res && res.packages) setPackagesList(res.packages);
    } catch (err) {
      showToast(err.message || "Failed to save package", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadPackageImg = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPackageImg(true);
    try {
      const res = await uploadImageApi(file, "knowway_packages");
      if (res && res.url) {
        setPackageFormData((prev) => ({ ...prev, image_url: res.url }));
        showToast("Package banner uploaded to Cloudinary!");
      }
    } catch (err) {
      showToast(err.message || "Upload failed", "error");
    } finally {
      setUploadingPackageImg(false);
    }
  };

  // Filtered lists for active search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return usersList;
    const q = searchQuery.toLowerCase();
    return usersList.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q));
  }, [usersList, searchQuery]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return coursesList;
    const q = searchQuery.toLowerCase();
    return coursesList.filter((c) => c.title?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q) || c.mentor_name?.toLowerCase().includes(q));
  }, [coursesList, searchQuery]);

  const filteredMentors = useMemo(() => {
    if (!searchQuery.trim()) return mentorsList;
    const q = searchQuery.toLowerCase();
    return mentorsList.filter((m) => m.name?.toLowerCase().includes(q) || m.role_title?.toLowerCase().includes(q));
  }, [mentorsList, searchQuery]);

  const filteredPackages = useMemo(() => {
    if (!searchQuery.trim()) return packagesList;
    const q = searchQuery.toLowerCase();
    return packagesList.filter((p) => p.name?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q) || p.tagline?.toLowerCase().includes(q));
  }, [packagesList, searchQuery]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 antialiased ${
        darkMode ? "bg-[#0B0F17] text-[#E2E8F0]" : "bg-[#F4F6FA] text-[#0F172A]"
      }`}
    >
      {/* Toast Notification Banner */}
      {notificationMsg && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl border flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-3 duration-200 ${
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

      {/* Floating Hover-Expandable Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
          activeTab={activeTab}
          adminUser={adminUser}
          setMobileOpen={setMobileOpen}
          onRefresh={fetchDashboardData}
          isRefreshing={isRefreshing}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main
          className={`p-4 sm:p-6 lg:p-8 w-full space-y-6 transition-all duration-300 ${
            sidebarHovered ? "lg:pl-[196px]" : "lg:pl-8"
          }`}
        >
          {/* ======================================================== */}
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {/* ======================================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Clean Welcome Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Welcome back, {adminUser?.name || "Super Admin"} 👋
                  </h2>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                    Live overview of courses, instructors, students, and platform metrics.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setActiveTab("courses")}
                    className="px-4 py-2 bg-[#035BE3] hover:bg-[#024bc0] text-white font-semibold text-xs rounded-full transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Manage Courses</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("mentors")}
                    className={`px-4 py-2 rounded-full border text-xs font-semibold transition flex items-center gap-2 ${
                      darkMode ? "border-[#222B3D] bg-[#131926] text-white hover:border-[#035BE3]" : "border-[#E2E8F0] bg-white text-[#0F172A] hover:border-[#035BE3]"
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-[#035BE3]" />
                    <span>Mentors ({mentorsList.length})</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* 1. Total Courses */}
                <div
                  className={`rounded-[26px] p-5 sm:p-6 border transition-colors ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                      Published Courses
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[#EFF4FF] text-[#035BE3] flex items-center justify-center border border-[#035BE3]/15">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold">
                      {coursesList.length}
                    </span>
                    <span className="text-[11px] font-bold text-[#035BE3] bg-[#EFF4FF] px-2.5 py-0.5 rounded-full border border-[#035BE3]/20">
                      Active
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#64748B]">Multi-language video modules</p>
                </div>

                {/* 2. Total Mentors */}
                <div
                  className={`rounded-[26px] p-5 sm:p-6 border transition-colors ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                      Instructors / Mentors
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF4E6] text-[#FA8C03] flex items-center justify-center border border-[#FA8C03]/20">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold">
                      {mentorsList.length}
                    </span>
                    <span className="text-[11px] font-bold text-[#FA8C03] bg-[#FFF4E6] px-2.5 py-0.5 rounded-full border border-[#FA8C03]/20">
                      Assigned
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#64748B]">Verified Industry Experts</p>
                </div>

                {/* 3. Total Students */}
                <div
                  className={`rounded-[26px] p-5 sm:p-6 border transition-colors ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                      Total Students
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[#EFF4FF] text-[#035BE3] flex items-center justify-center border border-[#035BE3]/15">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold">
                      {usersList.length}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      MySQL Live
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#64748B]">Active registered learners</p>
                </div>

                {/* 4. Cloudinary Storage */}
                <div
                  className={`rounded-[26px] p-5 sm:p-6 border transition-colors ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                      Cloud Storage
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                      <Cloud className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-base sm:text-lg font-bold truncate">
                      {cloudinarySettings.cloud_name ? "Connected" : "Setup Needed"}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Cloudinary
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#64748B]">Video & image CDN stream</p>
                </div>
              </div>

              {/* Multi-Chart Analytics Suite */}
              <DashboardCharts darkMode={darkMode} usersCount={usersList.length} />
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: INSTRUCTORS & MENTORS MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === "mentors" && (
            <div className="space-y-6">
              <div
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div>
                  <h2 className="text-base sm:text-lg font-bold">Instructors & Mentors Directory</h2>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                    Add and manage mentors who will be assigned to courses during creation.
                  </p>
                </div>

                <button
                  onClick={() => setShowMentorModal(true)}
                  className="px-5 py-2.5 bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-semibold rounded-full transition flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Mentor</span>
                </button>
              </div>

              {/* Mentors Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className={`rounded-[28px] p-6 border flex flex-col justify-between transition-colors ${
                      darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3.5 mb-4">
                        <img
                          src={mentor.photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                          alt={mentor.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-[#E2E8F0]"
                        />
                        <div className="min-w-0">
                          <h3 className="text-base font-bold truncate">{mentor.name}</h3>
                          <p className="text-xs text-[#035BE3] font-semibold truncate">{mentor.role_title}</p>
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                            {mentor.experience_badge || "Mentor"}
                          </span>
                        </div>
                      </div>

                      <p className={`text-xs line-clamp-3 leading-relaxed ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        {mentor.bio || "Industry practitioner guiding students with structured digital roadmaps."}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-inherit flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#64748B]">
                        Expertise: {mentor.expertise || "General"}
                      </span>
                      <button
                        onClick={() => setItemToDelete({ type: "mentor", id: mentor.id, name: mentor.name })}
                        className="p-2 text-[#94A3B8] hover:text-red-600 hover:bg-red-500/10 rounded-full transition cursor-pointer"
                        title="Delete Mentor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: COURSE & VIDEO MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              <div
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div>
                  <h2 className="text-base sm:text-lg font-bold">Course & Video Curriculum</h2>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                    Upload courses, assign mentors, and configure part-by-part locked/unlocked video lessons.
                  </p>
                </div>

                <Link
                  to="/admin/courses/create"
                  className="px-5 py-2.5 bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-semibold rounded-full transition flex items-center gap-2 cursor-pointer shadow-sm shrink-0 no-underline"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Course</span>
                </Link>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className={`rounded-[28px] overflow-hidden border flex flex-col justify-between transition-colors ${
                      darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                  >
                    <div>
                      {/* Thumbnail with overlay */}
                      <div className="relative aspect-video w-full bg-[#1E2638] overflow-hidden">
                        <img
                          src={course.thumbnail_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                          {course.category}
                        </div>
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#035BE3] text-white text-[10px] font-bold">
                          {course.languages}
                        </div>
                      </div>

                      {/* Course Content */}
                      <div className="p-5">
                        <h3 className="text-base font-bold line-clamp-1">{course.title}</h3>
                        <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                          {course.description || "Practical, step-by-step digital learning curriculum."}
                        </p>

                        {/* Dual Pricing Display */}
                        <div className={`mt-3.5 pt-3 border-t flex items-center justify-between ${darkMode ? "border-[#222B3D]" : "border-gray-100"}`}>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Real Price</span>
                            <span className="text-xs font-semibold text-[#94A3B8] line-through">
                              ₹{Number(course.regular_price || 2999).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                              With Promocode
                            </span>
                            <span className="text-sm font-extrabold text-[#035BE3] dark:text-blue-400">
                              ₹{Number(course.promo_price || 499).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#64748B]">
                          <span className="flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-[#035BE3]" />
                            {course.mentor_name || "Instructor Assigned"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {course.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between border-t border-inherit mt-2">
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {course.lectures_count || course.total_lectures || 0} Lectures Included
                      </span>

                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/admin/courses/edit/${course.id}`}
                          className="p-2 text-[#035BE3] hover:bg-[#035BE3]/10 rounded-full transition cursor-pointer"
                          title="Edit Course Studio"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setItemToDelete({ type: "course", id: course.id, name: course.title })}
                          className="p-2 text-[#94A3B8] hover:text-red-600 hover:bg-red-500/10 rounded-full transition cursor-pointer"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: PACKAGE STUDIO & COURSE BUNDLES */}
          {/* ======================================================== */}
          {activeTab === "packages" && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div
                className={`rounded-[28px] p-6 sm:p-8 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center border border-[#035BE3]/15 shrink-0">
                    <Layers3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">Package Studio & Course Bundles</h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Configure training bundles (Pro, Supreme, Premium, etc.). Set pricing, banner, and select which courses are included.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <Link
                    to="/admin/packages/create"
                    className="px-5 py-2.5 bg-[#035BE3] hover:bg-[#024bc0] text-white font-semibold text-xs rounded-full transition shadow-xs flex items-center gap-2 cursor-pointer no-underline"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Package</span>
                  </Link>
                </div>
              </div>

              {/* Packages Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`rounded-[28px] border overflow-hidden flex flex-col justify-between transition-all hover:shadow-md ${
                      darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                  >
                    <div>
                      {/* Image Preview Banner */}
                      <div className="relative aspect-[16/10] bg-[#EFF4FF] dark:bg-gray-800 overflow-hidden flex items-center justify-center p-4">
                        <img
                          src={pkg.image_url || "/images/packages/pro.png"}
                          alt={pkg.name}
                          className="max-h-full max-w-full object-contain transition-transform hover:scale-105 duration-300"
                          onError={(e) => {
                            e.currentTarget.src = "/images/packages/pro.png";
                          }}
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                            {pkg.total_courses || 0} Courses Included
                          </span>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold">{pkg.name}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#035BE3]/10 text-[#035BE3]">
                            /{pkg.slug}
                          </span>
                        </div>

                        <p className={`text-xs mt-2 line-clamp-2 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                          {pkg.tagline || "High-value skill package designed for digital career success."}
                        </p>

                        {/* Pricing Box */}
                        <div className="mt-4 p-3 rounded-2xl bg-[#F8FAFD] dark:bg-[#0B0F17] border border-[#E2E8F0] dark:border-[#222B3D] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400">Offer Price</span>
                            <div className="text-sm font-extrabold text-[#035BE3]">
                              ₹{Number(pkg.promo_price || 7999).toLocaleString("en-IN")}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-gray-400">MRP</span>
                            <div className="text-xs font-semibold text-gray-400 line-through">
                              ₹{Number(pkg.mrp_price || 11800).toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-[11px] text-[#64748B]">
                          <span>{pkg.total_hours || "25+ Hours"}</span>
                          <span>{pkg.enrolled_students || "45K+ Students"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="p-5 pt-0 border-t border-inherit mt-3 flex items-center justify-between">
                      <Link
                        to={`/package/${pkg.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#035BE3] hover:underline"
                      >
                        <span>View Live Page</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/admin/packages/edit/${pkg.slug || pkg.id}`}
                          className="p-2 text-[#035BE3] hover:bg-[#035BE3]/10 rounded-full transition cursor-pointer"
                          title="Edit Package Studio"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setItemToDelete({ type: "package", id: pkg.id, name: pkg.name })}
                          className="p-2 text-[#94A3B8] hover:text-red-600 hover:bg-red-500/10 rounded-full transition cursor-pointer"
                          title="Delete Package"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: STUDENTS DIRECTORY */}
          {/* ======================================================== */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div>
                  <h2 className="text-base sm:text-lg font-bold">Registered Students Directory</h2>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                    Live MySQL records with contact details, address, and referral tracking.
                  </p>
                </div>

                <button
                  onClick={fetchDashboardData}
                  disabled={isRefreshing}
                  className="px-4 py-2 bg-[#035BE3] text-white rounded-full text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shrink-0 hover:bg-[#024bc0]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                  <span>Sync DB</span>
                </button>
              </div>

              {/* Users Table */}
              <div
                className={`rounded-[28px] border overflow-hidden ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`border-b text-[#64748B] uppercase text-[10px] tracking-wider ${darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"}`}>
                        <th className="py-3.5 px-6 font-bold"># ID</th>
                        <th className="py-3.5 px-6 font-bold">Student</th>
                        <th className="py-3.5 px-6 font-bold">Email</th>
                        <th className="py-3.5 px-6 font-bold">Phone</th>
                        <th className="py-3.5 px-6 font-bold">Address</th>
                        <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? "divide-[#1E2638]" : "divide-[#F1F5F9]"}`}>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className={`transition-colors ${darkMode ? "hover:bg-[#1E2638]" : "hover:bg-[#F8FAFD]"}`}>
                          <td className="py-4 px-6 font-mono font-bold text-[#94A3B8]">#{user.id}</td>
                          <td className="py-4 px-6 font-bold">{user.name}</td>
                          <td className="py-4 px-6 text-[#64748B]">{user.email}</td>
                          <td className="py-4 px-6 text-[#64748B]">{user.phone}</td>
                          <td className="py-4 px-6 text-[#64748B] max-w-xs truncate">{user.address}</td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => setItemToDelete({ type: "user", id: user.id, name: user.name })}
                              className="p-2 text-[#94A3B8] hover:text-red-600 hover:bg-red-500/10 rounded-full transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: SYSTEM SETTINGS (SMTP / NODEMAILER & CLOUDINARY) */}
          {/* ======================================================== */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center border border-[#035BE3]/15 shrink-0">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold">System, Email (SMTP) & Cloudinary Settings</h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Configure Nodemailer SMTP for live OTP confirmation and Cloudinary keys for streaming course videos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* 1. Nodemailer / SMTP Email & OTP Configuration */}
                <div
                  className={`rounded-[28px] p-6 sm:p-8 border flex flex-col justify-between ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-4 border-b border-inherit mb-5">
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-5 h-5 text-[#035BE3]" />
                        <div>
                          <h3 className="text-sm sm:text-base font-bold">Nodemailer SMTP & OTP Service</h3>
                          <p className={`text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                            Send verification OTPs on signup and password reset.
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                          smtpSettings.smtp_is_active === "true"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : "bg-amber-50 text-amber-600 border border-amber-200"
                        }`}
                      >
                        {smtpSettings.smtp_is_active === "true" ? "🟢 Live SMTP Active" : "🧪 Testing Mode (No Mail)"}
                      </span>
                    </div>

                    <form onSubmit={handleSaveSmtpSettings} className="space-y-4">
                      {/* Active / Test Mode Switch */}
                      <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-[#161B29] dark:text-white">Email Service Status</p>
                          <p className="text-[11px] text-[#64748B] dark:text-gray-400">
                            When inactive, verification OTP defaults to instant test mode.
                          </p>
                        </div>

                        <select
                          value={smtpSettings.smtp_is_active}
                          onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_is_active: e.target.value })}
                          className="px-3 py-1.5 rounded-full bg-white dark:bg-[#0B0F17] border border-blue-200 dark:border-blue-800 text-xs font-bold outline-none cursor-pointer"
                        >
                          <option value="true">Active (Send Real Emails)</option>
                          <option value="false">Test Mode (Fallback OTP)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold mb-1">SMTP Host</label>
                          <input
                            type="text"
                            placeholder="e.g. smtp.gmail.com"
                            value={smtpSettings.smtp_host}
                            onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_host: e.target.value })}
                            className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                              darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold mb-1">Port</label>
                          <input
                            type="text"
                            placeholder="587 / 465"
                            value={smtpSettings.smtp_port}
                            onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_port: e.target.value })}
                            className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                              darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1">SMTP Username / Email</label>
                        <input
                          type="text"
                          placeholder="e.g. info@knowway.com"
                          value={smtpSettings.smtp_user}
                          onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_user: e.target.value })}
                          className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                            darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1">SMTP Password / App Password</label>
                        <input
                          type="password"
                          placeholder="••••••••••••••••••••••••"
                          value={smtpSettings.smtp_pass}
                          onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_pass: e.target.value })}
                          className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                            darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold mb-1">Sender Name</label>
                          <input
                            type="text"
                            placeholder="KnowWay LearnSpace"
                            value={smtpSettings.smtp_from_name}
                            onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_from_name: e.target.value })}
                            className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                              darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1">Sender From Email</label>
                          <input
                            type="text"
                            placeholder="e.g. no-reply@knowway.com"
                            value={smtpSettings.smtp_from_email}
                            onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_from_email: e.target.value })}
                            className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                              darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                            }`}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full h-11 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 !mt-5 shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>{isProcessing ? "Saving..." : "Save SMTP Mail Settings"}</span>
                      </button>
                    </form>

                    {/* Test SMTP Email Box */}
                    <div className="mt-5 pt-4 border-t border-inherit">
                      <p className="text-xs font-bold mb-2">Test SMTP Connection</p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="Enter recipient email to test"
                          value={testEmailTarget}
                          onChange={(e) => setTestEmailTarget(e.target.value)}
                          className={`flex-1 rounded-full border px-4 py-2 text-xs outline-none focus:border-[#035BE3] ${
                            darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={handleTestSmtp}
                          disabled={isTestingSmtp}
                          className="px-4 py-2 rounded-full border border-[#035BE3] text-[#035BE3] hover:bg-[#035BE3] hover:text-white transition text-xs font-semibold shrink-0 cursor-pointer disabled:opacity-50"
                        >
                          {isTestingSmtp ? "Testing..." : "Send Test Email"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Cloudinary Form Card */}
                <div
                  className={`rounded-[28px] p-6 sm:p-8 border ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 pb-4 border-b border-inherit mb-5">
                    <Cloud className="w-5 h-5 text-[#035BE3]" />
                    <div>
                      <h3 className="text-sm sm:text-base font-bold">Cloudinary Video & CDN API</h3>
                      <p className={`text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        High performance video hosting and dynamic CDN delivery.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5">Cloud Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. knowway-media"
                        value={cloudinarySettings.cloud_name}
                        onChange={(e) => setCloudinarySettings({ ...cloudinarySettings, cloud_name: e.target.value })}
                        className={`w-full rounded-2xl border px-4 py-3 text-xs outline-none focus:border-[#035BE3] ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1.5">API Key <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 84729482918492"
                        value={cloudinarySettings.api_key}
                        onChange={(e) => setCloudinarySettings({ ...cloudinarySettings, api_key: e.target.value })}
                        className={`w-full rounded-2xl border px-4 py-3 text-xs outline-none focus:border-[#035BE3] ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1.5">API Secret <span className="text-red-500">*</span></label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••••••••••••••"
                        value={cloudinarySettings.api_secret}
                        onChange={(e) => setCloudinarySettings({ ...cloudinarySettings, api_secret: e.target.value })}
                        className={`w-full rounded-2xl border px-4 py-3 text-xs outline-none focus:border-[#035BE3] ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1.5">Upload Preset (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. course_videos_preset"
                        value={cloudinarySettings.upload_preset}
                        onChange={(e) => setCloudinarySettings({ ...cloudinarySettings, upload_preset: e.target.value })}
                        className={`w-full rounded-2xl border px-4 py-3 text-xs outline-none focus:border-[#035BE3] ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full h-11 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 !mt-6 shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isProcessing ? "Saving..." : "Save & Activate Cloudinary"}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ADD MENTOR POPUP */}
      {/* ======================================================== */}
      {showMentorModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`rounded-[32px] max-w-lg w-full p-6 sm:p-8 border animate-in zoom-in-95 duration-150 ${darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"}`}>
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <h3 className="text-base font-bold">Add New Instructor / Mentor</h3>
              <button onClick={() => setShowMentorModal(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateMentor} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold mb-1">Mentor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yaswanth Sai"
                  value={newMentor.name}
                  onChange={(e) => setNewMentor({ ...newMentor, name: e.target.value })}
                  className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] ${darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Role / Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meta Ads & Growth Specialist"
                  value={newMentor.role_title}
                  onChange={(e) => setNewMentor({ ...newMentor, role_title: e.target.value })}
                  className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] ${darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Mentor Profile Photo (Upload or URL)</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://... or upload photo below"
                      value={newMentor.photo_url}
                      onChange={(e) => setNewMentor({ ...newMentor, photo_url: e.target.value })}
                      className={`flex-1 rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] ${darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"}`}
                    />
                    <label className={`px-3 py-2 rounded-2xl border text-xs font-bold cursor-pointer transition shrink-0 ${mentorPhotoUploading ? "opacity-50" : "bg-[#035BE3] text-white hover:bg-[#024bc0]"}`}>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setMentorPhotoUploading(true);
                          try {
                            const res = await uploadImageApi(file, "knowway_mentors");
                            if (res?.success && res.data?.url) {
                              setNewMentor((prev) => ({ ...prev, photo_url: res.data.url }));
                              showToast("Photo uploaded to Cloudinary!");
                            }
                          } catch (err) {
                            showToast(err.message || "Failed to upload photo", "error");
                          } finally {
                            setMentorPhotoUploading(false);
                          }
                        }}
                      />
                      <span>{mentorPhotoUploading ? "Uploading..." : "Upload Photo"}</span>
                    </label>
                  </div>
                  {newMentor.photo_url && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span className="truncate">Photo attached</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Experience / Bio</label>
                <textarea
                  rows={3}
                  placeholder="Short bio about the mentor..."
                  value={newMentor.bio}
                  onChange={(e) => setNewMentor({ ...newMentor, bio: e.target.value })}
                  className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] resize-none ${darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"}`}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowMentorModal(false)} className="flex-1 py-3 rounded-full border text-xs font-semibold">Cancel</button>
                <button type="submit" disabled={isProcessing} className="flex-1 py-3 rounded-full bg-[#035BE3] text-white text-xs font-semibold">{isProcessing ? "Saving..." : "Create Mentor"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CREATE COURSE POPUP WITH LECTURES */}
      {/* ======================================================== */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className={`rounded-[32px] max-w-2xl w-full p-6 sm:p-8 border my-8 animate-in zoom-in-95 duration-150 ${darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"}`}>
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <div>
                <h3 className="text-base font-bold">Create Course & Video Lessons</h3>
                <p className="text-xs text-[#64748B]">Assign mentor and configure locked/unlocked parts</p>
              </div>
              <button onClick={() => setShowCourseModal(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meta Ads Mastery (Telugu)"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] ${darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Select Mentor Dropdown */}
                <div>
                  <label className="block text-xs font-bold mb-1">Assign Mentor *</label>
                  <select
                    value={newCourse.mentor_id}
                    onChange={(e) => setNewCourse({ ...newCourse, mentor_id: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] ${darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"}`}
                  >
                    <option value="">Select Instructor</option>
                    {mentorsList.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role_title})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Digital Marketing / Video Editing"
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] ${darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Languages</label>
                  <input
                    type="text"
                    placeholder="e.g. Telugu, Hindi"
                    value={newCourse.languages}
                    onChange={(e) => setNewCourse({ ...newCourse, languages: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] ${darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 6.5 Hours"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] ${darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Cover Thumbnail URL (Cloudinary)</label>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/..."
                  value={newCourse.thumbnail_url}
                  onChange={(e) => setNewCourse({ ...newCourse, thumbnail_url: e.target.value })}
                  className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] ${darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"}`}
                />
              </div>

              {/* Lectures Section */}
              <div className="p-4 rounded-2xl border border-inherit space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Video Lectures ({newCourse.lectures.length} parts)</span>
                  <button
                    type="button"
                    onClick={() =>
                      setNewCourse({
                        ...newCourse,
                        lectures: [
                          ...newCourse.lectures,
                          {
                            section_name: `Module ${newCourse.lectures.length}`,
                            title: `New Lecture ${newCourse.lectures.length + 1}`,
                            duration: "10m",
                            video_url: "",
                            is_free_preview: false,
                          },
                        ],
                      })
                    }
                    className="text-xs font-bold text-[#035BE3] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Part</span>
                  </button>
                </div>

                {newCourse.lectures.map((lec, lIdx) => (
                  <div key={lIdx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-700/60 space-y-2 text-xs">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Lecture Title"
                        value={lec.title}
                        onChange={(e) => {
                          const updated = [...newCourse.lectures];
                          updated[lIdx].title = e.target.value;
                          setNewCourse({ ...newCourse, lectures: updated });
                        }}
                        className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-900 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 15m)"
                        value={lec.duration}
                        onChange={(e) => {
                          const updated = [...newCourse.lectures];
                          updated[lIdx].duration = e.target.value;
                          setNewCourse({ ...newCourse, lectures: updated });
                        }}
                        className="w-24 rounded-xl border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-900 outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        placeholder="Cloudinary Video Stream URL / ID"
                        value={lec.video_url}
                        onChange={(e) => {
                          const updated = [...newCourse.lectures];
                          updated[lIdx].video_url = e.target.value;
                          setNewCourse({ ...newCourse, lectures: updated });
                        }}
                        className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-900 outline-none"
                      />

                      <label className="flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={lec.is_free_preview}
                          onChange={(e) => {
                            const updated = [...newCourse.lectures];
                            updated[lIdx].is_free_preview = e.target.checked;
                            setNewCourse({ ...newCourse, lectures: updated });
                          }}
                          className="rounded text-[#035BE3]"
                        />
                        <span>Free Preview</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCourseModal(false)} className="flex-1 py-3 rounded-full border text-xs font-semibold">Cancel</button>
                <button type="submit" disabled={isProcessing} className="flex-1 py-3 rounded-full bg-[#035BE3] text-white text-xs font-semibold">{isProcessing ? "Publishing..." : "Publish Course"}</button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* ======================================================== */}
      {/* MODAL 3: CREATE / EDIT PACKAGE STUDIO */}
      {/* ======================================================== */}
      {isPackageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`rounded-[32px] max-w-3xl w-full p-6 sm:p-8 border my-8 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto ${
              darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-inherit sticky top-0 bg-inherit z-10">
              <div>
                <h3 className="text-base sm:text-lg font-bold">
                  {editingPackageId ? `Edit Package: ${packageFormData.name}` : "Create New Learning Package"}
                </h3>
                <p className="text-xs text-[#64748B]">
                  Configure dynamic pricing, included courses, learnings, and FAQs
                </p>
              </div>
              <button
                onClick={() => setIsPackageModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-5 mt-5">
              {/* 1. Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Package Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pro, Supreme, Elite"
                    value={packageFormData.name}
                    onChange={(e) => setPackageFormData({ ...packageFormData, name: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Custom Slug (URL: /package/slug)</label>
                  <input
                    type="text"
                    placeholder="e.g. pro, supreme (Auto-generated if empty)"
                    value={packageFormData.slug}
                    onChange={(e) => setPackageFormData({ ...packageFormData, slug: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Tagline / Subtitle Pitch</label>
                <textarea
                  rows={2}
                  placeholder="Our step-by-step, skill-focused, and practical growth package..."
                  value={packageFormData.tagline}
                  onChange={(e) => setPackageFormData({ ...packageFormData, tagline: e.target.value })}
                  className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                    darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                  }`}
                />
              </div>

              {/* Banner Image with Upload */}
              <div className="p-4 rounded-2xl border border-inherit space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold">Package Banner Image</label>
                  <label className="cursor-pointer text-xs font-bold text-[#035BE3] hover:underline flex items-center gap-1">
                    <Cloud className="w-3.5 h-3.5" />
                    <span>{uploadingPackageImg ? "Uploading..." : "Upload to Cloudinary"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadPackageImg}
                      className="hidden"
                      disabled={uploadingPackageImg}
                    />
                  </label>
                </div>

                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    placeholder="/images/packages/pro.png or https://res.cloudinary.com/..."
                    value={packageFormData.image_url}
                    onChange={(e) => setPackageFormData({ ...packageFormData, image_url: e.target.value })}
                    className={`flex-1 rounded-2xl border px-4 py-2 text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                    }`}
                  />
                  {packageFormData.image_url && (
                    <img
                      src={packageFormData.image_url}
                      alt="Preview"
                      className="w-10 h-10 object-contain rounded-xl border p-1 bg-white"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>

              {/* 2. Pricing & Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">MRP Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={packageFormData.mrp_price}
                    onChange={(e) => setPackageFormData({ ...packageFormData, mrp_price: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Offer Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={packageFormData.promo_price}
                    onChange={(e) => setPackageFormData({ ...packageFormData, promo_price: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Total Hours Badge</label>
                  <input
                    type="text"
                    value={packageFormData.total_hours}
                    onChange={(e) => setPackageFormData({ ...packageFormData, total_hours: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Students Enrolled Badge</label>
                  <input
                    type="text"
                    value={packageFormData.enrolled_students}
                    onChange={(e) => setPackageFormData({ ...packageFormData, enrolled_students: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                    }`}
                  />
                </div>
              </div>

              {/* 3. Included Courses Multi-Select Checklist (Core Requirement) */}
              <div className="p-4 rounded-2xl border border-inherit space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold">Select Courses to Include in this Package Bundle</span>
                    <p className="text-[11px] text-[#64748B]">
                      {packageFormData.course_ids.length} of {coursesList.length} courses included
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPackageFormData({ ...packageFormData, course_ids: coursesList.map((c) => c.id) })}
                      className="text-[11px] font-bold text-[#035BE3] hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={() => setPackageFormData({ ...packageFormData, course_ids: [] })}
                      className="text-[11px] font-bold text-gray-400 hover:underline cursor-pointer"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {coursesList.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-2">No courses available. Create courses first in Course Management.</p>
                  ) : (
                    coursesList.map((c) => {
                      const isSelected = packageFormData.course_ids.includes(c.id);
                      return (
                        <div
                          key={c.id}
                          onClick={() => {
                            const current = [...packageFormData.course_ids];
                            const next = isSelected ? current.filter((id) => id !== c.id) : [...current, c.id];
                            setPackageFormData({ ...packageFormData, course_ids: next });
                          }}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                            isSelected
                              ? "border-[#035BE3] bg-[#EFF4FF] dark:bg-[#035BE3]/10"
                              : "border-gray-200/70 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="rounded text-[#035BE3] pointer-events-none"
                            />
                            {c.thumbnail_url && (
                              <img
                                src={c.thumbnail_url}
                                alt={c.title}
                                className="w-9 h-7 object-cover rounded-md shrink-0"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate">{c.title}</p>
                              <p className="text-[10px] text-gray-400 truncate">
                                {c.category} • {c.mentor_name || "Instructor"} • {c.duration}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              isSelected
                                ? "bg-[#035BE3] text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                            }`}
                          >
                            {isSelected ? "Included" : "Excluded"}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 4. What you'll learn dynamic checklist */}
              <div className="p-4 rounded-2xl border border-inherit space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">What You'll Learn in this Package ({packageFormData.what_you_will_learn.length} points)</span>
                  <button
                    type="button"
                    onClick={() =>
                      setPackageFormData({
                        ...packageFormData,
                        what_you_will_learn: [...packageFormData.what_you_will_learn, ""],
                      })
                    }
                    className="text-xs font-bold text-[#035BE3] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Point</span>
                  </button>
                </div>

                {packageFormData.what_you_will_learn.map((pt, pIdx) => (
                  <div key={pIdx} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Learning Point #${pIdx + 1}`}
                      value={pt}
                      onChange={(e) => {
                        const updated = [...packageFormData.what_you_will_learn];
                        updated[pIdx] = e.target.value;
                        setPackageFormData({ ...packageFormData, what_you_will_learn: updated });
                      }}
                      className={`flex-1 rounded-xl border px-3 py-2 text-xs outline-none focus:border-[#035BE3] ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = packageFormData.what_you_will_learn.filter((_, i) => i !== pIdx);
                        setPackageFormData({ ...packageFormData, what_you_will_learn: updated });
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* 5. FAQs Section */}
              <div className="p-4 rounded-2xl border border-inherit space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Frequently Asked Questions ({packageFormData.faqs.length} FAQs)</span>
                  <button
                    type="button"
                    onClick={() =>
                      setPackageFormData({
                        ...packageFormData,
                        faqs: [...packageFormData.faqs, { question: "", answer: "" }],
                      })
                    }
                    className="text-xs font-bold text-[#035BE3] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add FAQ</span>
                  </button>
                </div>

                {packageFormData.faqs.map((faq, fIdx) => (
                  <div key={fIdx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-700/60 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) => {
                          const updated = [...packageFormData.faqs];
                          updated[fIdx].question = e.target.value;
                          setPackageFormData({ ...packageFormData, faqs: updated });
                        }}
                        className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 p-2 text-xs bg-white dark:bg-gray-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = packageFormData.faqs.filter((_, i) => i !== fIdx);
                          setPackageFormData({ ...packageFormData, faqs: updated });
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) => {
                        const updated = [...packageFormData.faqs];
                        updated[fIdx].answer = e.target.value;
                        setPackageFormData({ ...packageFormData, faqs: updated });
                      }}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-2 text-xs bg-white dark:bg-gray-900 outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-3 sticky bottom-0 bg-inherit z-10 border-t border-inherit">
                <button
                  type="button"
                  onClick={() => setIsPackageModalOpen(false)}
                  className="flex-1 py-3 rounded-full border text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-3 rounded-full bg-[#035BE3] text-white text-xs font-semibold hover:bg-[#024bc0] transition cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? "Saving Package..." : editingPackageId ? "Update Package" : "Create Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`rounded-[32px] max-w-sm w-full p-6 border text-center ${darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"}`}>
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold">Remove {itemToDelete.type}?</h3>
            <p className="text-xs text-[#64748B] mt-1">Are you sure you want to delete <strong>{itemToDelete.name}</strong>? This action cannot be undone.</p>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setItemToDelete(null)} className="flex-1 py-2.5 rounded-full border text-xs font-semibold">Cancel</button>
              <button onClick={handleConfirmDelete} disabled={isProcessing} className="flex-1 py-2.5 rounded-full bg-red-600 text-white text-xs font-semibold">{isProcessing ? "Deleting..." : "Confirm Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
