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
  Copy,
  Eye,
  Receipt,
  PackageCheck,
  Wallet,
  Building,
  CheckCircle,
  XCircle,
  ArrowDownRight,
  Percent,
  EyeOff,
  Sliders,
  Monitor,
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
  getUserPurchasesApi,
  getAllPaymentsApi,
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
  getAdminAffiliateStatsApi,
  getAdminAffiliatePayoutsApi,
  updateAdminAffiliatePayoutStatusApi,
  getAdminAffiliateReferralsApi,
  executeAdminRazorpayxPayoutApi,
  getAdminAffiliateUsersApi,
  updatePackageCommissionApi,
  updateCourseCommissionApi,
  updateBulkCommissionsApi,
  getAdminVideoSecurityApi,
  saveAdminVideoSecurityApi,
  getAdminNotificationsApi,
  markAllAdminNotificationsReadApi,
  markAdminNotificationReadApi,
  clearAdminNotificationsApi,
  getAdminActivityLogsApi,
  getAvailableModulesApi,
  getSubAdminsApi,
  createSubAdminApi,
  updateSubAdminApi,
  deleteSubAdminApi,
  getAdminPagesApi,
  createAdminPageApi,
  updateAdminPageApi,
  deleteAdminPageApi,
  updateMentorApi,
  getPublicSettingsApi,
  API_BASE_URL,
} from "../services/api";

const DEFAULT_ADMIN_MODULES = [
  { id: "dashboard", name: "Dashboard Overview & Metrics", description: "View revenue, user growth, quick analytics & charts" },
  { id: "courses", name: "Courses Studio & Lectures", description: "Add, edit, price, and curate courses and video lessons" },
  { id: "packages", name: "Package Studio & Bundles", description: "Create course bundles, dynamic pricing & package FAQs" },
  { id: "mentors", name: "Mentors & Instructors Hub", description: "Manage instructors, profiles, badges and bio info" },
  { id: "users", name: "Student Directory & Management", description: "Manage registered students, enrollments & purchases" },
  { id: "payments", name: "Payments & Financial Orders", description: "Monitor Razorpay payment orders, receipts and txn logs" },
  { id: "affiliates", name: "Affiliate Payouts & Partners", description: "Process 1-click RazorpayX payouts & view partner stats" },
  { id: "commissions", name: "2-Tier Commission Matrix", description: "Configure Tier-1 Direct & Tier-2 Sponsor commission rates" },
  { id: "videosecurity", name: "Video Security & DRM Protection", description: "Manage anti-piracy, watermarks & devtools shields" },
  { id: "subadmins", name: "Staff & Sub-Admin Roles (RBAC)", description: "Create staff users, assign permissions and control access" },
  { id: "history", name: "Activity Logs & Audit History", description: "Full system audit trail of admin actions & student events" },
  { id: "pages", name: "Pages & Legal Policies (CMS)", description: "Manage privacy policy, terms, refund policy & custom website pages" },
  { id: "settings", name: "System, SMTP & Cloudinary", description: "Configure Nodemailer mail server & Cloudinary CDN keys" },
];

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  // Theme & Layout States
  const [searchParams, setSearchParams] = useSearchParams();
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
  const getInitialTab = () => {
    const fromUrl = searchParams.get("tab");
    if (fromUrl) return fromUrl;
    try {
      const saved = localStorage.getItem("admin_active_tab");
      if (saved) return saved;
    } catch {}
    return "dashboard";
  };
  const [internalTab, setInternalTab] = useState(getInitialTab);
  const activeTab = searchParams.get("tab") || internalTab || "dashboard";
  const setActiveTab = (t) => {
    setInternalTab(t);
    try {
      localStorage.setItem("admin_active_tab", t);
    } catch {}
    setSearchParams({ tab: t }, { replace: true });
  };
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
  const [paymentsList, setPaymentsList] = useState([]);

  // Video Security & DRM States
  const [videoSecuritySettings, setVideoSecuritySettings] = useState({
    enable_moving_watermark: "true",
    watermark_opacity: "25",
    watermark_interval: "8",
    watermark_show_name: "true",
    watermark_show_student_id: "true",
    watermark_show_email: "true",
    watermark_show_timestamp: "true",
    enable_devtools_shield: "true",
    enable_screen_capture_protection: "true",
    enable_hls_stream_security: "true",
    custom_warning_text: "Restricted Content • Do Not Distribute",
  });
  const [savingVideoSecurity, setSavingVideoSecurity] = useState(false);
  const [previewSimulateBlur, setPreviewSimulateBlur] = useState(false);


  // Notifications State
  const [notificationsList, setNotificationsList] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Activity Logs & Audit Trail State
  const [activityLogsList, setActivityLogsList] = useState([]);
  const [activityLogFilter, setActivityLogFilter] = useState("all");
  const [activityLogSearch, setActivityLogSearch] = useState("");

  // Sub-Admins & RBAC State
  const [subAdminsList, setSubAdminsList] = useState([]);
  const [availableModulesList, setAvailableModulesList] = useState(DEFAULT_ADMIN_MODULES);
  const [showCreateSubAdminModal, setShowCreateSubAdminModal] = useState(false);
  const [editingSubAdmin, setEditingSubAdmin] = useState(null);
  const [isProcessingSubAdmin, setIsProcessingSubAdmin] = useState(false);
  const [newSubAdminData, setNewSubAdminData] = useState({
    name: "",
    email: "",
    password: "",
    role_title: "Course Manager",
    permissions: ["courses", "packages"],
  });

  // Website Branding & Dynamic Settings States
  const [brandingSettings, setBrandingSettings] = useState({
    site_name: "Knowway",
    site_tagline: "Simple learning paths, practical digital skills and useful knowledge designed to help you keep progressing.",
    site_logo: "/images/logo/logo.png",
    contact_email: "support@knowway.in",
    contact_phone: "+91 98765 43210",
    contact_address: "Knowway EdTech Tower, Tech Zone 4, Greater Noida, UP - 201306",
    social_instagram: "https://instagram.com/knowway",
    social_youtube: "https://youtube.com/@knowway",
    social_linkedin: "https://linkedin.com/company/knowway",
    social_telegram: "https://t.me/knowway_official",
    social_twitter: "https://twitter.com/knowway",
    copyright_text: "Knowway. All rights reserved.",
  });
  const [isSavingBranding, setIsSavingBranding] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Custom Pages & Policies CMS States
  const [adminPagesList, setAdminPagesList] = useState([]);
  const [showPageModal, setShowPageModal] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [isProcessingPage, setIsProcessingPage] = useState(false);
  const [pageFormData, setPageFormData] = useState({
    title: "",
    slug: "",
    content: "",
    meta_description: "",
    is_published: true,
    show_in_footer: true,
    show_in_header: false,
    footer_category: "legal",
    sort_order: 0,
  });

  // Edit Mentor Modal State
  const [editingMentor, setEditingMentor] = useState(null);
  const [isProcessingMentor, setIsProcessingMentor] = useState(false);

  // Affiliate & Commissions States
  const [affiliateStats, setAffiliateStats] = useState({
    totalCommissionGenerated: 0,
    totalReferralSales: 0,
    totalPayoutsPaid: 0,
    pendingPayoutAmount: 0,
    pendingPayoutCount: 0,
  });
  const [affiliateTopList, setAffiliateTopList] = useState([]);
  const [affiliatePayoutsList, setAffiliatePayoutsList] = useState([]);
  const [affiliateReferralsList, setAffiliateReferralsList] = useState([]);
  const [affiliateUsersList, setAffiliateUsersList] = useState([]);
  const [executingRzpPayoutId, setExecutingRzpPayoutId] = useState(null);
  const [affiliateSystemSettings, setAffiliateSystemSettings] = useState({
    min_affiliate_withdrawal_amount: "500",
    razorpayx_is_active: "true",
    razorpayx_account_number: "",
  });
  const [affiliateActiveSubTab, setAffiliateActiveSubTab] = useState("payouts"); // 'payouts' | 'referrals' | 'leaderboard'
  const [affiliatePayoutFilter, setAffiliatePayoutFilter] = useState("all"); // 'all' | 'pending' | 'paid' | 'rejected'
  const [affiliateSearch, setAffiliateSearch] = useState("");
  const [payoutActionModal, setPayoutActionModal] = useState(null); // { payout, actionType: 'approve' | 'reject' }
  const [payoutUtrNumber, setPayoutUtrNumber] = useState("");
  const [payoutAdminNote, setPayoutAdminNote] = useState("");
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);

  // Commission Matrix States
  const [commissionActiveTab, setCommissionActiveTab] = useState("packages"); // 'packages' | 'courses'
  const [packageCommissionDrafts, setPackageCommissionDrafts] = useState({});
  const [courseCommissionDrafts, setCourseCommissionDrafts] = useState({});
  const [savingCommissionId, setSavingCommissionId] = useState(null);
  const [isSavingBulkCommissions, setIsSavingBulkCommissions] = useState(false);
  const [commissionSearch, setCommissionSearch] = useState("");

  // Sync package commission drafts when packagesList updates (2-Tier: Direct + Leadership)
  useEffect(() => {
    if (packagesList && packagesList.length > 0) {
      const drafts = {};
      packagesList.forEach((p) => {
        drafts[p.id] = {
          direct_type: p.referral_commission_type || "percentage",
          direct_value: p.referral_commission_value !== undefined && p.referral_commission_value !== null ? p.referral_commission_value : 20,
          leadership_type: p.leadership_commission_type || "percentage",
          leadership_value: p.leadership_commission_value !== undefined && p.leadership_commission_value !== null ? p.leadership_commission_value : 5,
        };
      });
      setPackageCommissionDrafts((prev) => ({ ...drafts, ...prev }));
    }
  }, [packagesList]);

  // Sync course commission drafts when coursesList updates (2-Tier: Direct + Leadership)
  useEffect(() => {
    if (coursesList && coursesList.length > 0) {
      const drafts = {};
      coursesList.forEach((c) => {
        drafts[c.id] = {
          direct_type: c.referral_commission_type || "percentage",
          direct_value: c.referral_commission_value !== undefined && c.referral_commission_value !== null ? c.referral_commission_value : 20,
          leadership_type: c.leadership_commission_type || "percentage",
          leadership_value: c.leadership_commission_value !== undefined && c.leadership_commission_value !== null ? c.leadership_commission_value : 5,
        };
      });
      setCourseCommissionDrafts((prev) => ({ ...drafts, ...prev }));
    }
  }, [coursesList]);

  // User Purchases Modal State
  const [selectedUserPurchases, setSelectedUserPurchases] = useState(null);
  const [loadingPurchasesModal, setLoadingPurchasesModal] = useState(false);

  // Payments Tab Filters
  const [paymentsSearch, setPaymentsSearch] = useState("");
  const [paymentsFilter, setPaymentsFilter] = useState("all");

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
  const [razorpaySettings, setRazorpaySettings] = useState({
    razorpay_key_id: "",
    razorpay_key_secret: "",
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
    try {
      getAdminVideoSecurityApi()
        .then((res) => {
          if (res?.success && res.settings) {
            setVideoSecuritySettings((prev) => ({ ...prev, ...res.settings }));
          }
        })
        .catch(() => {});
    } catch (_) {}
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

      // 6. Payments & Transactions
      try {
        const payRes = await getAllPaymentsApi();
        if (payRes?.payments) setPaymentsList(payRes.payments);
      } catch (e) {
        console.warn("Payments notice:", e.message);
      }

      // 7. Cloudinary & SMTP Settings
      try {
        const settingsRes = await getSystemSettingsApi();
        if (settingsRes?.settings) {
          setCloudinarySettings({
            cloud_name: settingsRes.settings.cloudinary_cloud_name || "",
            api_key: settingsRes.settings.cloudinary_api_key || "",
            api_secret: settingsRes.settings.cloudinary_api_secret || "",
            upload_preset: settingsRes.settings.cloudinary_upload_preset || "",
          });
          setRazorpaySettings({
            razorpay_key_id: settingsRes.settings.razorpay_key_id || "",
            razorpay_key_secret: settingsRes.settings.razorpay_key_secret || "",
          });
          if (settingsRes.settings.min_affiliate_withdrawal_amount !== undefined) {
            setAffiliateSystemSettings({
              min_affiliate_withdrawal_amount: String(settingsRes.settings.min_affiliate_withdrawal_amount || "500"),
              razorpayx_is_active: String(settingsRes.settings.razorpayx_is_active !== "false"),
              razorpayx_account_number: settingsRes.settings.razorpayx_account_number || "",
            });
          }
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


      // 9. Notifications, Activity Logs & Sub-Admins Data
      try {
        // Fetch pages and branding
        getAdminPagesApi().then((res) => {
          if (res?.success && Array.isArray(res.pages)) setAdminPagesList(res.pages);
        }).catch(() => {});

        getPublicSettingsApi().then((res) => {
          if (res?.success && res.settings) {
            setBrandingSettings((prev) => ({ ...prev, ...res.settings }));
          }
        }).catch(() => {});

        const [notifRes, logsRes, subsRes, modsRes] = await Promise.all([
          getAdminNotificationsApi().catch(() => null),
          getAdminActivityLogsApi().catch(() => null),
          getSubAdminsApi().catch(() => null),
          getAvailableModulesApi().catch(() => null),
        ]);

        if (notifRes?.success) {
          setNotificationsList(notifRes.notifications || []);
          setUnreadNotificationsCount(notifRes.unread_count || 0);
        }
        if (logsRes?.success) {
          setActivityLogsList(logsRes.logs || []);
        }
        if (subsRes?.success) {
          setSubAdminsList(subsRes.subadmins || []);
        }
        if (modsRes?.success && modsRes.modules && modsRes.modules.length > 0) {
          setAvailableModulesList(modsRes.modules);
        }
      } catch (e) {
        console.warn("Notifications & logs notice:", e.message);
      }

      // 8. Affiliate & Payouts Data
      try {
        const [affStatsRes, affPayoutsRes, affRefsRes] = await Promise.all([
          getAdminAffiliateStatsApi().catch(() => null),
          getAdminAffiliatePayoutsApi().catch(() => null),
          getAdminAffiliateReferralsApi().catch(() => null),
        ]);
        if (affStatsRes?.stats) {
          setAffiliateStats(affStatsRes.stats);
          if (affStatsRes.topAffiliates) setAffiliateTopList(affStatsRes.topAffiliates);
        }
        if (affPayoutsRes?.payouts) setAffiliatePayoutsList(affPayoutsRes.payouts);
        if (affRefsRes?.referrals) setAffiliateReferralsList(affRefsRes.referrals);
        if (affUsersRes?.users) setAffiliateUsersList(affUsersRes.users);
      } catch (e) {
        console.warn("Affiliate data notice:", e.message);
      }
    } catch (err) {
      console.error("Data load error:", err);
      showToast("Connection notice: " + err.message, "error");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Handle Payout Status Update (Approve / Reject)
  const handleUpdatePayoutStatus = async (e) => {
    e?.preventDefault();
    if (!payoutActionModal?.payout) return;
    setIsProcessingPayout(true);
    try {
      const statusToSet = payoutActionModal.actionType === "approve" ? "paid" : "rejected";
      const res = await updateAdminAffiliatePayoutStatusApi(payoutActionModal.payout.id, {
        status: statusToSet,
        utr_number: payoutUtrNumber.trim() || undefined,
        admin_note: payoutAdminNote.trim() || undefined,
      });
      if (res?.success) {
        showToast(res.message || `Payout request #${payoutActionModal.payout.id} updated!`);
        setPayoutActionModal(null);
        setPayoutUtrNumber("");
        setPayoutAdminNote("");
        fetchDashboardData();
      } else {
        showToast(res?.message || "Failed to update payout request", "error");
      }
    } catch (err) {
      showToast(err.message || "Failed to update payout request", "error");
    } finally {
      setIsProcessingPayout(false);
    }
  };

  // Handle Save Single Package Commission (2-Tier)
  const handleSavePackageCommission = async (pkgId) => {
    const draft = packageCommissionDrafts[pkgId];
    if (!draft) return;
    setSavingCommissionId(`pkg-${pkgId}`);
    try {
      const res = await updatePackageCommissionApi(pkgId, {
        referral_commission_type: draft.direct_type,
        referral_commission_value: draft.direct_value,
        leadership_commission_type: draft.leadership_type,
        leadership_commission_value: draft.leadership_value,
      });
      if (res?.success) {
        showToast(res.message || "Package 2-tier commissions updated!");
        fetchDashboardData();
      } else {
        showToast(res?.message || "Failed to update package commission", "error");
      }
    } catch (err) {
      showToast(err.message || "Error updating package commission", "error");
    } finally {
      setSavingCommissionId(null);
    }
  };

  // Handle Save Single Course Commission (2-Tier)
  const handleSaveVideoSecurity = async () => {
    setSavingVideoSecurity(true);
    try {
      const res = await saveAdminVideoSecurityApi(videoSecuritySettings);
      if (res?.success) {
        setNotificationMsg({
          type: "success",
          message: "Video Security & DRM Protection settings saved successfully!",
        });
      } else {
        setNotificationMsg({
          type: "error",
          message: res?.message || "Failed to save video security settings.",
        });
      }
    } catch (err) {
      setNotificationMsg({
        type: "error",
        message: err.message || "Failed to update video security.",
      });
    } finally {
      setSavingVideoSecurity(false);
      setTimeout(() => setNotificationMsg(null), 4000);
    }
  };

  const handleSaveCourseCommission = async (courseId) => {
    const draft = courseCommissionDrafts[courseId];
    if (!draft) return;
    setSavingCommissionId(`crs-${courseId}`);
    try {
      const res = await updateCourseCommissionApi(courseId, {
        referral_commission_type: draft.direct_type,
        referral_commission_value: draft.direct_value,
        leadership_commission_type: draft.leadership_type,
        leadership_commission_value: draft.leadership_value,
      });
      if (res?.success) {
        showToast(res.message || "Course 2-tier commissions updated!");
        fetchDashboardData();
      } else {
        showToast(res?.message || "Failed to update course commission", "error");
      }
    } catch (err) {
      showToast(err.message || "Error updating course commission", "error");
    } finally {
      setSavingCommissionId(null);
    }
  };

  // Handle Bulk Save All Package & Course Commissions (2-Tier)
  const handleBulkSaveCommissions = async () => {
    setIsSavingBulkCommissions(true);
    try {
      const packagesPayload = packagesList.map((p) => {
        const d = packageCommissionDrafts[p.id] || {};
        return {
          id: p.id,
          referral_commission_type: d.direct_type || p.referral_commission_type || "percentage",
          referral_commission_value: d.direct_value !== undefined ? d.direct_value : (p.referral_commission_value || 20),
          leadership_commission_type: d.leadership_type || p.leadership_commission_type || "percentage",
          leadership_commission_value: d.leadership_value !== undefined ? d.leadership_value : (p.leadership_commission_value || 5),
        };
      });

      const coursesPayload = coursesList.map((c) => {
        const d = courseCommissionDrafts[c.id] || {};
        return {
          id: c.id,
          referral_commission_type: d.direct_type || c.referral_commission_type || "percentage",
          referral_commission_value: d.direct_value !== undefined ? d.direct_value : (c.referral_commission_value || 20),
          leadership_commission_type: d.leadership_type || c.leadership_commission_type || "percentage",
          leadership_commission_value: d.leadership_value !== undefined ? d.leadership_value : (c.leadership_commission_value || 5),
        };
      });

      const res = await updateBulkCommissionsApi({
        packages: packagesPayload,
        courses: coursesPayload,
      });

      if (res?.success) {
        showToast(res.message || "All 2-tier commission rates saved successfully!");
        fetchDashboardData();
      } else {
        showToast(res?.message || "Failed to save commission rates", "error");
      }
    } catch (err) {
      showToast(err.message || "Error saving commission rates", "error");
    } finally {
      setIsSavingBulkCommissions(false);
    }
  };

  // Handle View User Purchases (Modal)
  const handleViewUserPurchases = async (user) => {
    setLoadingPurchasesModal(true);
    setSelectedUserPurchases({ user, packages: [], courses: [], payments: [], total_spent: 0 });
    try {
      const res = await getUserPurchasesApi(user.id);
      if (res?.success) {
        setSelectedUserPurchases(res);
      }
    } catch (err) {
      showToast("Could not load user purchases: " + err.message, "error");
    } finally {
      setLoadingPurchasesModal(false);
    }
  };

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



  // Notification Action Handlers
  const handleMarkAllNotificationsRead = async () => {
    try {
      await markAllAdminNotificationsReadApi();
      setNotificationsList((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadNotificationsCount(0);
    } catch (err) {
      console.error("Failed to mark notifications read:", err);
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      await markAdminNotificationReadApi(id);
      setNotificationsList((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const handleClearReadNotifications = async () => {
    try {
      await clearAdminNotificationsApi();
      setNotificationsList((prev) => prev.filter((n) => !n.is_read));
      showToast("Cleared read notifications");
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  // Sub-Admin Management Handlers
  const handleCreateSubAdmin = async (e) => {
    e.preventDefault();
    if (!newSubAdminData.name || !newSubAdminData.email || !newSubAdminData.password) {
      showToast("Please fill all required fields", "error");
      return;
    }
    setIsProcessingSubAdmin(true);
    try {
      const res = await createSubAdminApi(newSubAdminData);
      if (res?.success) {
        showToast(res.message || "Sub-Admin created successfully!");
        setShowCreateSubAdminModal(false);
        setNewSubAdminData({
          name: "",
          email: "",
          password: "",
          role_title: "Course Manager",
          permissions: ["courses", "packages"],
        });
        fetchDashboardData();
      } else {
        showToast(res?.message || "Failed to create sub-admin", "error");
      }
    } catch (err) {
      showToast(err.message || "Error creating sub-admin", "error");
    } finally {
      setIsProcessingSubAdmin(false);
    }
  };

  const handleUpdateSubAdmin = async (e) => {
    e.preventDefault();
    if (!editingSubAdmin) return;
    setIsProcessingSubAdmin(true);
    try {
      const res = await updateSubAdminApi(editingSubAdmin.id, editingSubAdmin);
      if (res?.success) {
        showToast("Sub-Admin updated successfully!");
        setEditingSubAdmin(null);
        fetchDashboardData();
      } else {
        showToast(res?.message || "Failed to update sub-admin", "error");
      }
    } catch (err) {
      showToast(err.message || "Error updating sub-admin", "error");
    } finally {
      setIsProcessingSubAdmin(false);
    }
  };

  const handleDeleteSubAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Sub-Admin?")) return;
    try {
      const res = await deleteSubAdminApi(id);
      if (res?.success) {
        showToast("Sub-Admin removed.");
        fetchDashboardData();
      } else {
        showToast(res?.message || "Delete failed", "error");
      }
    } catch (err) {
      showToast(err.message || "Error deleting sub-admin", "error");
    }
  };

  const handleToggleSubAdminStatus = async (subAdmin) => {
    try {
      const newStatus = !subAdmin.is_active;
      const res = await updateSubAdminApi(subAdmin.id, { is_active: newStatus });
      if (res?.success) {
        showToast(`Sub-Admin ${subAdmin.name} ${newStatus ? "Activated" : "Deactivated"}`);
        fetchDashboardData();
      } else {
        showToast(res?.message || "Failed to update status", "error");
      }
    } catch (err) {
      showToast(err.message || "Error updating status", "error");
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const res = await getAdminActivityLogsApi();
      if (res?.success && res.logs) {
        setActivityLogsList(res.logs);
        showToast("Activity logs refreshed");
      }
    } catch (err) {
      console.error("Failed to fetch activity logs:", err);
    }
  };

  // ============================================================
  // WEBSITE BRANDING & CONTACT INFO HANDLERS
  // ============================================================
  const handleSaveBrandingSettings = async (e) => {
    if (e) e.preventDefault();
    setIsSavingBranding(true);
    try {
      const res = await saveSystemSettingsApi({ settings: brandingSettings });
      if (res?.success) {
        showToast("Website branding, logo & contact info updated successfully!");
      } else {
        showToast(res?.message || "Failed to save branding settings.", "error");
      }
    } catch (err) {
      showToast(err.message || "Error saving branding settings", "error");
    } finally {
      setIsSavingBranding(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const res = await uploadImageApi(file);
      if (res?.success && res.url) {
        setBrandingSettings((prev) => ({ ...prev, site_logo: res.url }));
        showToast("Logo uploaded! Click 'Save Branding Settings' to publish.");
      } else {
        showToast(res?.message || "Failed to upload logo.", "error");
      }
    } catch (err) {
      showToast(err.message || "Error uploading logo", "error");
    } finally {
      setUploadingLogo(false);
    }
  };

  // ============================================================
  // CUSTOM PAGES & CMS HANDLERS
  // ============================================================
  const handleOpenCreatePageModal = () => {
    setEditingPage(null);
    setPageFormData({
      title: "",
      slug: "",
      content: "<h2>1. Section Title</h2><p>Write your detailed policy or custom page content here...</p>",
      meta_description: "",
      is_published: true,
      show_in_footer: true,
      show_in_header: false,
      footer_category: "legal",
      sort_order: adminPagesList.length + 1,
    });
    setShowPageModal(true);
  };

  const handleOpenEditPageModal = (page) => {
    setEditingPage(page);
    setPageFormData({
      title: page.title || "",
      slug: page.slug || "",
      content: page.content || "",
      meta_description: page.meta_description || "",
      is_published: page.is_published !== false && page.is_published !== 0,
      show_in_footer: page.show_in_footer !== false && page.show_in_footer !== 0,
      show_in_header: page.show_in_header === true || page.show_in_header === 1,
      footer_category: page.footer_category || "legal",
      sort_order: page.sort_order || 0,
    });
    setShowPageModal(true);
  };

  const handleSavePage = async (e) => {
    if (e) e.preventDefault();
    if (!pageFormData.title.trim() || !pageFormData.content.trim()) {
      showToast("Page Title and Content are required.", "error");
      return;
    }

    setIsProcessingPage(true);
    try {
      if (editingPage) {
        const res = await updateAdminPageApi(editingPage.id, pageFormData);
        if (res?.success) {
          showToast("Page updated successfully!");
          setShowPageModal(false);
          fetchDashboardData();
        } else {
          showToast(res?.message || "Failed to update page.", "error");
        }
      } else {
        const res = await createAdminPageApi(pageFormData);
        if (res?.success) {
          showToast("New page published successfully!");
          setShowPageModal(false);
          fetchDashboardData();
        } else {
          showToast(res?.message || "Failed to publish page.", "error");
        }
      }
    } catch (err) {
      showToast(err.message || "Error saving page", "error");
    } finally {
      setIsProcessingPage(false);
    }
  };

  const handleDeletePage = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete page '${title}'?`)) return;
    try {
      const res = await deleteAdminPageApi(id);
      if (res?.success) {
        showToast("Page deleted successfully.");
        fetchDashboardData();
      } else {
        showToast(res?.message || "Failed to delete page.", "error");
      }
    } catch (err) {
      showToast(err.message || "Error deleting page", "error");
    }
  };

  // ============================================================
  // MENTOR EDITING HANDLER
  // ============================================================
  const handleSaveMentorEdit = async (e) => {
    if (e) e.preventDefault();
    if (!editingMentor) return;
    setIsProcessingMentor(true);
    try {
      const res = await updateMentorApi(editingMentor.id, editingMentor);
      if (res?.success) {
        showToast("Mentor details updated successfully!");
        setEditingMentor(null);
        fetchDashboardData();
      } else {
        showToast(res?.message || "Failed to update mentor.", "error");
      }
    } catch (err) {
      showToast(err.message || "Error updating mentor", "error");
    } finally {
      setIsProcessingMentor(false);
    }
  };

  // Handle 1-Click RazorpayX Instant Auto Payout
  const handleExecuteRazorpayxPayout = async (payoutId) => {
    if (!window.confirm(`Initiate instant 1-click RazorpayX direct transfer for Payout #${payoutId}?`)) {
      return;
    }
    setExecutingRzpPayoutId(payoutId);
    try {
      const res = await executeAdminRazorpayxPayoutApi(payoutId);
      if (res?.success) {
        showToast(res.message || "RazorpayX Payout processed successfully!");
        fetchDashboardData();
      } else {
        showToast(res?.message || "RazorpayX payout failed", "error");
      }
    } catch (err) {
      showToast(err.message || "Failed to execute RazorpayX payout", "error");
    } finally {
      setExecutingRzpPayoutId(null);
    }
  };

  // Handle Save Affiliate & RazorpayX System Settings
  const handleSaveAffiliateSystemSettings = async (e) => {
    e?.preventDefault();
    setIsProcessing(true);
    try {
      const res = await saveSystemSettingsApi(affiliateSystemSettings);
      if (res?.success) {
        showToast("Affiliate & RazorpayX withdrawal settings saved successfully!");
        fetchDashboardData();
      } else {
        showToast(res?.message || "Failed to save settings", "error");
      }
    } catch (err) {
      showToast(err.message || "Failed to save settings", "error");
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

  // Handle Save Razorpay Settings
  const handleSaveRazorpaySettings = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await saveSystemSettingsApi(razorpaySettings);
      if (res?.success) {
        showToast("Razorpay API credentials saved & active!");
      }
    } catch (err) {
      showToast(err.message || "Error saving Razorpay settings", "error");
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

  const [copiedStudentId, setCopiedStudentId] = useState(null);

  const handleCopyStudentId = (idVal) => {
    if (!idVal) return;
    navigator.clipboard.writeText(idVal);
    setCopiedStudentId(idVal);
    setTimeout(() => setCopiedStudentId(null), 2000);
  };

  // Filtered lists for active search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return usersList;
    const q = searchQuery.toLowerCase();
    return usersList.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(q) ||
        u.student_id?.toLowerCase().includes(q)
    );
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

  // Filtered Payments & Orders List
  const filteredPayments = useMemo(() => {
    let list = paymentsList;
    if (paymentsFilter === "package") {
      list = list.filter((p) => p.item_type === "package" || p.package_id);
    } else if (paymentsFilter === "course") {
      list = list.filter((p) => p.item_type === "course" || p.course_id);
    } else if (paymentsFilter === "paid") {
      list = list.filter((p) => p.status === "paid");
    } else if (paymentsFilter === "pending") {
      list = list.filter((p) => p.status === "pending" || p.status === "failed");
    }

    if (paymentsSearch.trim()) {
      const q = paymentsSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.user_name?.toLowerCase().includes(q) ||
          p.user_email?.toLowerCase().includes(q) ||
          p.student_id?.toLowerCase().includes(q) ||
          p.package_name?.toLowerCase().includes(q) ||
          p.course_name?.toLowerCase().includes(q) ||
          p.razorpay_order_id?.toLowerCase().includes(q) ||
          p.razorpay_payment_id?.toLowerCase().includes(q) ||
          p.referral_code?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [paymentsList, paymentsFilter, paymentsSearch]);

  // Filtered Affiliate Payouts & Referrals
  const filteredAffiliatePayouts = useMemo(() => {
    let list = affiliatePayoutsList;
    if (affiliatePayoutFilter !== "all") {
      list = list.filter((p) => p.status === affiliatePayoutFilter);
    }
    if (affiliateSearch.trim()) {
      const q = affiliateSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.user_name?.toLowerCase().includes(q) ||
          p.user_email?.toLowerCase().includes(q) ||
          p.student_id?.toLowerCase().includes(q) ||
          p.upi_id?.toLowerCase().includes(q) ||
          p.account_holder_name?.toLowerCase().includes(q) ||
          p.account_number?.toLowerCase().includes(q) ||
          p.utr_number?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [affiliatePayoutsList, affiliatePayoutFilter, affiliateSearch]);



  const filteredActivityLogs = useMemo(() => {
    let list = activityLogsList;
    if (activityLogFilter !== "all") {
      list = list.filter((log) => log.category === activityLogFilter);
    }
    if (activityLogSearch.trim()) {
      const q = activityLogSearch.toLowerCase();
      list = list.filter(
        (log) =>
          log.action?.toLowerCase().includes(q) ||
          log.details?.toLowerCase().includes(q) ||
          log.admin_name?.toLowerCase().includes(q) ||
          log.category?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activityLogsList, activityLogFilter, activityLogSearch]);

  const filteredAffiliateUsers = useMemo(() => {
    let list = affiliateUsersList;
    if (affiliateSearch.trim()) {
      const q = affiliateSearch.toLowerCase();
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.student_id?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q) ||
          u.referral_code?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [affiliateUsersList, affiliateSearch]);

  const filteredAffiliateReferrals = useMemo(() => {
    let list = affiliateReferralsList;
    if (affiliateSearch.trim()) {
      const q = affiliateSearch.toLowerCase();
      list = list.filter(
        (r) =>
          r.referrer_name?.toLowerCase().includes(q) ||
          r.referrer_email?.toLowerCase().includes(q) ||
          r.referrer_student_id?.toLowerCase().includes(q) ||
          r.referrer_referral_code?.toLowerCase().includes(q) ||
          r.item_title?.toLowerCase().includes(q) ||
          r.buyer_name?.toLowerCase().includes(q) ||
          r.buyer_email?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [affiliateReferralsList, affiliateSearch]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 antialiased ${
        darkMode ? "dark bg-[#0B0F17] text-[#E2E8F0]" : "bg-[#F4F6FA] text-[#0F172A]"
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
          <span>{notificationMsg.message || notificationMsg.text}</span>
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
              {filteredCourses.length === 0 ? (
                <div
                  className={`rounded-[28px] border p-12 text-center max-w-lg mx-auto space-y-4 ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center mx-auto border border-[#035BE3]/20">
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                      No Courses Found
                    </h3>
                    <p className={`text-xs mt-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      No courses match your search query. Try searching for another topic or create a new course.
                    </p>
                  </div>
                  <Link
                    to="/admin/courses/create"
                    className="px-6 py-2.5 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition inline-flex items-center gap-2 cursor-pointer shadow-sm no-underline"
                  >
                    <Plus size={14} />
                    <span>Create New Course</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className={`rounded-[28px] overflow-hidden border flex flex-col justify-between transition-all duration-200 hover:shadow-lg ${
                        darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                      }`}
                    >
                      <div>
                        {/* Thumbnail with overlay */}
                        <div className="relative aspect-video w-full bg-[#1E2638] overflow-hidden">
                          <img
                            src={course.thumbnail_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
                          <h3 className={`text-base font-bold line-clamp-1 ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                            {course.title}
                          </h3>
                          <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                            {course.description || "Practical, step-by-step digital learning curriculum."}
                          </p>

                          {/* Dual Pricing Display */}
                          <div className={`mt-4 p-3 rounded-2xl border flex items-center justify-between ${
                            darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                          }`}>
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

                          <div className={`mt-3.5 flex items-center justify-between text-xs font-semibold ${
                            darkMode ? "text-[#94A3B8]" : "text-[#64748B]"
                          }`}>
                            <span className="flex items-center gap-1.5 truncate max-w-[140px]">
                              <GraduationCap className="w-3.5 h-3.5 text-[#035BE3] shrink-0" />
                              <span className="truncate">{course.mentor_name || "Instructor Assigned"}</span>
                            </span>
                            <span className="flex items-center gap-1.5 shrink-0">
                              <Clock className="w-3.5 h-3.5 text-[#035BE3]" />
                              <span>{course.duration || "2.5h"}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-0 flex items-center justify-between border-t border-inherit mt-2">
                        <span className={`text-[10.5px] font-bold px-2.5 py-1 rounded-full border ${
                          darkMode
                            ? "bg-emerald-950/50 text-emerald-400 border-emerald-800"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          {course.lectures_count || course.total_lectures || 0} Lectures Included
                        </span>

                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/admin/courses/edit/${course.id}`}
                            className={`p-2 rounded-xl border transition cursor-pointer ${
                              darkMode
                                ? "bg-[#035BE3]/15 border-[#035BE3]/30 text-blue-400 hover:bg-[#035BE3] hover:text-white"
                                : "bg-[#035BE3]/10 border-[#035BE3]/20 text-[#035BE3] hover:bg-[#035BE3] hover:text-white"
                            }`}
                            title="Edit Course Studio"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setItemToDelete({ type: "course", id: course.id, name: course.title })}
                            className={`p-2 rounded-xl border transition cursor-pointer ${
                              darkMode
                                ? "border-transparent text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
                                : "border-transparent text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                            }`}
                            title="Delete Course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                      <div className={`relative aspect-[16/10] overflow-hidden flex items-center justify-center p-4 ${
                        darkMode ? "bg-[#101935]" : "bg-[#EFF4FF]"
                      }`}>
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
                        <div className={`mt-4 p-3 rounded-2xl border flex items-center justify-between ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                        }`}>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400">Offer Price</span>
                            <div className="text-sm font-extrabold text-[#035BE3] dark:text-blue-400">
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

                        <div className={`mt-3 flex items-center justify-between text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
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
                className={`rounded-[28px] border overflow-hidden transition-colors ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`border-b uppercase text-[10px] tracking-wider ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D] text-[#94A3B8]" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#64748B]"
                      }`}>
                        <th className="py-3.5 px-6 font-bold"># ID</th>
                        <th className="py-3.5 px-6 font-bold">Student ID</th>
                        <th className="py-3.5 px-6 font-bold">Student Name</th>
                        <th className="py-3.5 px-6 font-bold">Contact</th>
                        <th className="py-3.5 px-6 font-bold">Active Package</th>
                        <th className="py-3.5 px-6 font-bold">Courses</th>
                        <th className="py-3.5 px-6 font-bold">Total Spent</th>
                        <th className="py-3.5 px-6 font-bold">Referral</th>
                        <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? "divide-[#1E2638]" : "divide-[#F1F5F9]"}`}>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-[#64748B]">
                            <Users className="w-8 h-8 mx-auto text-[#94A3B8] mb-2 opacity-50" />
                            <p className="font-semibold">No students found matching your search.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => {
                          const displayStudentId = user.student_id || `KW-2026-${String(user.id).padStart(4, "0")}`;
                          const isCopied = copiedStudentId === displayStudentId;

                          return (
                            <tr key={user.id} className={`transition-colors ${darkMode ? "hover:bg-[#1E2638]" : "hover:bg-[#F8FAFD]"}`}>
                              <td className="py-4 px-6 font-mono font-bold text-[#94A3B8]">#{user.id}</td>
                              <td className="py-4 px-6">
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono font-bold text-[11px] border ${
                                  darkMode
                                    ? "bg-[#035BE3]/15 border-[#035BE3]/30 text-blue-400"
                                    : "bg-[#035BE3]/10 border-[#035BE3]/20 text-[#035BE3]"
                                }`}>
                                  <span>{displayStudentId}</span>
                                  <button
                                    onClick={() => handleCopyStudentId(displayStudentId)}
                                    className="hover:text-black dark:hover:text-white transition cursor-pointer p-0.5"
                                    title="Copy Student ID"
                                  >
                                    {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                              </td>
                              <td className={`py-4 px-6 font-bold text-sm ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                                {user.name}
                              </td>
                              <td className="py-4 px-6">
                                <p className={`font-medium leading-none ${darkMode ? "text-gray-200" : "text-[#1E293B]"}`}>
                                  {user.email}
                                </p>
                                <p className={`text-[10.5px] mt-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                                  {user.phone || "No Phone"}
                                </p>
                              </td>
                              <td className="py-4 px-6">
                                {user.active_packages && user.active_packages.length > 0 ? (
                                  <span className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2.5 py-1 rounded-full border ${
                                    darkMode
                                      ? "bg-blue-950/50 text-blue-400 border-blue-900/60"
                                      : "bg-blue-50 text-[#035BE3] border-blue-200"
                                  }`}>
                                    <Layers3 size={11} />
                                    <span>{user.active_packages[0]}</span>
                                    {user.active_packages.length > 1 && ` (+${user.active_packages.length - 1})`}
                                  </span>
                                ) : (
                                  <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                                    darkMode ? "bg-gray-800/60 border-gray-700 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-500"
                                  }`}>
                                    Standard (Free)
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-6">
                                <span className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2.5 py-1 rounded-lg border ${
                                  darkMode
                                    ? "bg-purple-950/50 text-purple-400 border-purple-900/50"
                                    : "bg-purple-50 text-purple-700 border-purple-200"
                                }`}>
                                  <BookOpen size={11} />
                                  <span>{user.courses_count || 0} Unlocked</span>
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <span className={`font-black text-xs ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                                  ₹{Number(user.total_spent || 0).toLocaleString("en-IN")}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                {user.referral_code ? (
                                  <span className={`font-mono text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border ${
                                    darkMode
                                      ? "bg-emerald-950/50 text-emerald-400 border-emerald-800"
                                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  }`}>
                                    {user.referral_code}
                                  </span>
                                ) : (
                                  <span className="text-[#94A3B8] font-medium">—</span>
                                )}
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleViewUserPurchases(user)}
                                    className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold text-[11px] transition cursor-pointer ${
                                      darkMode
                                        ? "bg-[#035BE3]/15 border-[#035BE3]/30 text-blue-400 hover:bg-[#035BE3] hover:text-white"
                                        : "bg-[#035BE3]/10 border-[#035BE3]/20 text-[#035BE3] hover:bg-[#035BE3] hover:text-white"
                                    }`}
                                    title="View Purchased Packages & Courses"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Purchases</span>
                                  </button>
                                  <button
                                    onClick={() => setItemToDelete({ type: "user", id: user.id, name: user.name })}
                                    className={`p-1.5 rounded-xl border transition cursor-pointer ${
                                      darkMode
                                        ? "border-transparent text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
                                        : "border-transparent text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                                    }`}
                                    title="Delete Student"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: PAYMENTS & TRANSACTIONS LIVE REVENUE DASHBOARD */}
          {/* ======================================================== */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              {/* Header Capsule */}
              <div
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                }`}
              >
                <div>
                  <h2 className={`text-base sm:text-lg font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                    Payments & Transactions Hub
                  </h2>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                    Real-time payment logs, Razorpay order IDs, verification signatures & sales receipts.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-full border font-bold text-xs flex items-center gap-1.5 ${
                    darkMode
                      ? "bg-emerald-950/50 border-emerald-800 text-emerald-400"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }`}>
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>Total Real Revenue: ₹{Number(stats.totalRevenue || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <button
                    onClick={fetchDashboardData}
                    disabled={isRefreshing}
                    className="px-4 py-2 bg-[#035BE3] text-white rounded-full text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shrink-0 hover:bg-[#024bc0] shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                    <span>Sync Payments</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {[
                    { id: "all", label: "All Orders" },
                    { id: "paid", label: "Paid / Success" },
                    { id: "package", label: "Packages Only" },
                    { id: "course", label: "Courses Only" },
                    { id: "pending", label: "Pending" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setPaymentsFilter(f.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                        paymentsFilter === f.id
                          ? "bg-[#035BE3] border-[#035BE3] text-white shadow-xs"
                          : darkMode
                          ? "bg-[#131926] border-[#222B3D] text-[#94A3B8] hover:text-white hover:border-[#035BE3]"
                          : "bg-white border-[#E2E8F0] text-[#556377] hover:bg-[#F8FAFD] hover:text-[#0F172A]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by student, email, order ID..."
                    value={paymentsSearch}
                    onChange={(e) => setPaymentsSearch(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2 rounded-full border text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  />
                </div>
              </div>

              {/* Transactions Table */}
              <div
                className={`rounded-[28px] border overflow-hidden transition-colors ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`border-b uppercase text-[10px] tracking-wider ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D] text-[#94A3B8]" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#64748B]"
                      }`}>
                        <th className="py-3.5 px-6 font-bold"># Order ID</th>
                        <th className="py-3.5 px-6 font-bold">Student</th>
                        <th className="py-3.5 px-6 font-bold">Item Purchased</th>
                        <th className="py-3.5 px-6 font-bold">Amount Paid</th>
                        <th className="py-3.5 px-6 font-bold">Payment ID (Razorpay)</th>
                        <th className="py-3.5 px-6 font-bold">Status</th>
                        <th className="py-3.5 px-6 font-bold">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? "divide-[#1E2638]" : "divide-[#F1F5F9]"}`}>
                      {filteredPayments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-[#64748B]">
                            <Receipt className="w-8 h-8 mx-auto text-[#94A3B8] mb-2 opacity-50" />
                            <p className="font-semibold">No payment transactions found matching the filter.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredPayments.map((p) => {
                          const isPaid = p.status === "paid";
                          const isPkg = p.item_type === "package" || Boolean(p.package_id);
                          const itemName = p.package_name || p.course_name || "Custom Item";
                          const rzpId = p.razorpay_payment_id || p.razorpay_order_id;
                          const isCopied = copiedStudentId === rzpId;

                          return (
                            <tr key={p.id} className={`transition-colors ${darkMode ? "hover:bg-[#1E2638]" : "hover:bg-[#F8FAFD]"}`}>
                              <td className="py-4 px-6 font-mono text-[11px] font-bold text-[#94A3B8]">
                                {p.razorpay_order_id || `#ORD-${p.id}`}
                              </td>
                              <td className="py-4 px-6">
                                <p className={`font-bold leading-none ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                                  {p.user_name || p.student_name || "Student"}
                                </p>
                                <p className={`text-[10.5px] mt-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                                  {p.user_email || "—"}
                                </p>
                              </td>
                              <td className="py-4 px-6">
                                <span className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2.5 py-1 rounded-full border ${
                                  isPkg
                                    ? (darkMode ? "bg-blue-950/50 text-blue-400 border-blue-900/60" : "bg-blue-50 text-[#035BE3] border-blue-200")
                                    : (darkMode ? "bg-purple-950/50 text-purple-400 border-purple-900/50" : "bg-purple-50 text-purple-700 border-purple-200")
                                }`}>
                                  {isPkg ? <Layers3 size={11} /> : <BookOpen size={11} />}
                                  <span>{itemName}</span>
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-1.5">
                                  <span className={`font-black text-xs ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                                    ₹{Number(p.amount || 0).toLocaleString("en-IN")}
                                  </span>
                                  {p.referral_code && (
                                    <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-md border ${
                                      darkMode
                                        ? "bg-emerald-950/50 text-emerald-400 border-emerald-800"
                                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    }`}>
                                      Ref: {p.referral_code}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className={`inline-flex items-center gap-1.5 font-mono text-[11px] ${darkMode ? "text-gray-300" : "text-[#64748B]"}`}>
                                  <span>{p.razorpay_payment_id || "—"}</span>
                                  {p.razorpay_payment_id && (
                                    <button
                                      onClick={() => handleCopyStudentId(p.razorpay_payment_id)}
                                      className="hover:text-black dark:hover:text-white transition cursor-pointer p-0.5"
                                      title="Copy Razorpay Payment ID"
                                    >
                                      {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10.5px] uppercase border ${
                                  isPaid
                                    ? (darkMode ? "bg-emerald-950/50 text-emerald-400 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-200")
                                    : (darkMode ? "bg-amber-950/50 text-amber-400 border-amber-800" : "bg-amber-50 text-amber-700 border-amber-200")
                                }`}>
                                  {isPaid ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                                  <span>{p.status}</span>
                                </span>
                              </td>
                              <td className={`py-4 px-6 text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                                {p.created_at ? new Date(p.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                              </td>
                            </tr>
                          );
                        })
                      )}
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
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex items-center justify-between ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center border border-[#035BE3]/15 shrink-0">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`text-base sm:text-lg font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                      System, Email (SMTP) & Cloudinary Settings
                    </h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Configure Nodemailer SMTP for live OTP confirmation and Cloudinary keys for streaming course videos.
                    </p>
                  </div>
                </div>
              </div>

                            {/* ================= WEBSITE BRANDING & CONTACT INFO CARD ================= */}
              <div
                className={`rounded-[28px] p-6 sm:p-8 border transition-colors mb-6 ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-inherit mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center border border-[#035BE3]/15 shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                        Website Branding, Logo & Support Contact
                      </h3>
                      <p className={`text-xs ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        Updates here automatically sync live to Header, Footer, and Contact sections across the entire platform.
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border shrink-0 ${
                    darkMode ? "bg-blue-950/50 text-blue-400 border-blue-900" : "bg-blue-50 text-[#035BE3] border-blue-200"
                  }`}>
                    🟢 Live Frontend Sync
                  </span>
                </div>

                <form onSubmit={handleSaveBrandingSettings} className="space-y-6">
                  {/* Row 1: Logo & Platform Name */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className={`block text-xs font-bold mb-2 ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                        Platform Logo
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl border p-1 bg-white shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={brandingSettings.site_logo || "/images/logo/logo.png"}
                            alt="Site Logo"
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => { e.currentTarget.src = "/images/logo/logo.png"; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="px-3.5 py-2 bg-[#035BE3] hover:bg-[#024bc0] text-white rounded-full text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition">
                            <Cloud className="w-3.5 h-3.5" />
                            <span>{uploadingLogo ? "Uploading..." : "Upload New Logo"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                              disabled={uploadingLogo}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                        Platform / Website Name
                      </label>
                      <input
                        type="text"
                        value={brandingSettings.site_name || ""}
                        onChange={(e) => setBrandingSettings({ ...brandingSettings, site_name: e.target.value })}
                        placeholder="Knowway"
                        className={`w-full h-10 rounded-xl border px-3.5 text-xs font-semibold outline-none focus:border-[#035BE3] ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                        Copyright Footer Note
                      </label>
                      <input
                        type="text"
                        value={brandingSettings.copyright_text || ""}
                        onChange={(e) => setBrandingSettings({ ...brandingSettings, copyright_text: e.target.value })}
                        placeholder="Knowway. All rights reserved."
                        className={`w-full h-10 rounded-xl border px-3.5 text-xs font-semibold outline-none focus:border-[#035BE3] ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Row 2: Tagline */}
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                      Website Tagline / Mission Motto
                    </label>
                    <input
                      type="text"
                      value={brandingSettings.site_tagline || ""}
                      onChange={(e) => setBrandingSettings({ ...brandingSettings, site_tagline: e.target.value })}
                      placeholder="Simple learning paths, practical digital skills and useful knowledge..."
                      className={`w-full h-10 rounded-xl border px-3.5 text-xs font-semibold outline-none focus:border-[#035BE3] ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                      }`}
                    />
                  </div>

                  {/* Row 3: Support Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                        Support Email Address
                      </label>
                      <input
                        type="email"
                        value={brandingSettings.contact_email || ""}
                        onChange={(e) => setBrandingSettings({ ...brandingSettings, contact_email: e.target.value })}
                        placeholder="support@knowway.in"
                        className={`w-full h-10 rounded-xl border px-3.5 text-xs font-semibold outline-none focus:border-[#035BE3] ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                        Support Phone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={brandingSettings.contact_phone || ""}
                        onChange={(e) => setBrandingSettings({ ...brandingSettings, contact_phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className={`w-full h-10 rounded-xl border px-3.5 text-xs font-semibold outline-none focus:border-[#035BE3] ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                        Office Address
                      </label>
                      <input
                        type="text"
                        value={brandingSettings.contact_address || ""}
                        onChange={(e) => setBrandingSettings({ ...brandingSettings, contact_address: e.target.value })}
                        placeholder="City, State, Country"
                        className={`w-full h-10 rounded-xl border px-3.5 text-xs font-semibold outline-none focus:border-[#035BE3] ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Row 4: Social Media Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className={`block text-[11px] font-bold mb-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        Instagram URL
                      </label>
                      <input
                        type="text"
                        value={brandingSettings.social_instagram || ""}
                        onChange={(e) => setBrandingSettings({ ...brandingSettings, social_instagram: e.target.value })}
                        placeholder="https://instagram.com/..."
                        className={`w-full h-9 rounded-xl border px-3 text-xs outline-none focus:border-[#035BE3] ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[11px] font-bold mb-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        YouTube URL
                      </label>
                      <input
                        type="text"
                        value={brandingSettings.social_youtube || ""}
                        onChange={(e) => setBrandingSettings({ ...brandingSettings, social_youtube: e.target.value })}
                        placeholder="https://youtube.com/..."
                        className={`w-full h-9 rounded-xl border px-3 text-xs outline-none focus:border-[#035BE3] ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[11px] font-bold mb-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        LinkedIn URL
                      </label>
                      <input
                        type="text"
                        value={brandingSettings.social_linkedin || ""}
                        onChange={(e) => setBrandingSettings({ ...brandingSettings, social_linkedin: e.target.value })}
                        placeholder="https://linkedin.com/..."
                        className={`w-full h-9 rounded-xl border px-3 text-xs outline-none focus:border-[#035BE3] ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[11px] font-bold mb-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        Telegram URL
                      </label>
                      <input
                        type="text"
                        value={brandingSettings.social_telegram || ""}
                        onChange={(e) => setBrandingSettings({ ...brandingSettings, social_telegram: e.target.value })}
                        placeholder="https://t.me/..."
                        className={`w-full h-9 rounded-xl border px-3 text-xs outline-none focus:border-[#035BE3] ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSavingBranding}
                      className="px-6 py-2.5 bg-[#035BE3] hover:bg-[#024bc0] text-white rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isSavingBranding ? "Saving Branding..." : "Save & Publish Branding Info"}</span>
                    </button>
                  </div>
                </form>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* 1. Nodemailer / SMTP Email & OTP Configuration */}
                <div
                  className={`rounded-[28px] p-6 sm:p-8 border flex flex-col justify-between transition-colors ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-4 border-b border-inherit mb-5">
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-5 h-5 text-[#035BE3]" />
                        <div>
                          <h3 className={`text-sm sm:text-base font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                            Nodemailer SMTP & OTP Service
                          </h3>
                          <p className={`text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                            Send verification OTPs on signup and password reset.
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0 border ${
                          smtpSettings.smtp_is_active === "true"
                            ? (darkMode ? "bg-emerald-950/50 text-emerald-400 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-200")
                            : (darkMode ? "bg-amber-950/50 text-amber-400 border-amber-800" : "bg-amber-50 text-amber-700 border-amber-200")
                        }`}
                      >
                        {smtpSettings.smtp_is_active === "true" ? "🟢 Live SMTP Active" : "🧪 Testing Mode (No Mail)"}
                      </span>
                    </div>

                    <form onSubmit={handleSaveSmtpSettings} className="space-y-4">
                      {/* Active / Test Mode Switch */}
                      <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                      }`}>
                        <div>
                          <p className={`text-xs font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>Email Service Status</p>
                          <p className={`text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                            When inactive, verification OTP defaults to instant test mode.
                          </p>
                        </div>

                        <select
                          value={smtpSettings.smtp_is_active}
                          onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_is_active: e.target.value })}
                          className={`px-3 py-1.5 rounded-full border text-xs font-bold outline-none cursor-pointer ${
                            darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#CBD5E1] text-[#0F172A]"
                          }`}
                        >
                          <option value="true">Active (Send Real Emails)</option>
                          <option value="false">Test Mode (Fallback OTP)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className={`block text-xs font-bold mb-1 ${darkMode ? "text-gray-200" : "text-[#1E293B]"}`}>
                            SMTP Host
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. smtp.gmail.com"
                            value={smtpSettings.smtp_host}
                            onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_host: e.target.value })}
                            className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                              darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`block text-xs font-bold mb-1 ${darkMode ? "text-gray-200" : "text-[#1E293B]"}`}>
                            Port
                          </label>
                          <input
                            type="text"
                            placeholder="587 / 465"
                            value={smtpSettings.smtp_port}
                            onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_port: e.target.value })}
                            className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                              darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-1 ${darkMode ? "text-gray-200" : "text-[#1E293B]"}`}>
                          SMTP Username / Email
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. info@knowway.com"
                          value={smtpSettings.smtp_user}
                          onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_user: e.target.value })}
                          className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                            darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-1 ${darkMode ? "text-gray-200" : "text-[#1E293B]"}`}>
                          SMTP Password / App Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••••••••••••••••••"
                          value={smtpSettings.smtp_pass}
                          onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_pass: e.target.value })}
                          className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                            darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={`block text-xs font-bold mb-1 ${darkMode ? "text-gray-200" : "text-[#1E293B]"}`}>
                            Sender Name
                          </label>
                          <input
                            type="text"
                            placeholder="KnowWay LearnSpace"
                            value={smtpSettings.smtp_from_name}
                            onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_from_name: e.target.value })}
                            className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                              darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-bold mb-1 ${darkMode ? "text-gray-200" : "text-[#1E293B]"}`}>
                            Sender From Email
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. no-reply@knowway.com"
                            value={smtpSettings.smtp_from_email}
                            onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_from_email: e.target.value })}
                            className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                              darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                            }`}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full h-11 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 !mt-5 shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>{isProcessing ? "Saving..." : "Save SMTP Mail Settings"}</span>
                      </button>
                    </form>

                    {/* Test SMTP Email Box */}
                    <div className="mt-5 pt-4 border-t border-inherit">
                      <p className={`text-xs font-bold mb-2 ${darkMode ? "text-white" : "text-[#0F172A]"}`}>Test SMTP Connection</p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="Enter recipient email to test"
                          value={testEmailTarget}
                          onChange={(e) => setTestEmailTarget(e.target.value)}
                          className={`flex-1 rounded-full border px-4 py-2 text-xs outline-none focus:border-[#035BE3] ${
                            darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
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
                  className={`rounded-[28px] p-6 sm:p-8 border transition-colors ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-2.5 pb-4 border-b border-inherit mb-5">
                    <Cloud className="w-5 h-5 text-[#035BE3]" />
                    <div>
                      <h3 className={`text-sm sm:text-base font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                        Cloudinary Video & CDN API
                      </h3>
                      <p className={`text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        High performance video hosting and dynamic CDN delivery.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${darkMode ? "text-gray-200" : "text-[#1E293B]"}`}>
                        Cloud Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. knowway-media"
                        value={cloudinarySettings.cloud_name}
                        onChange={(e) => setCloudinarySettings({ ...cloudinarySettings, cloud_name: e.target.value })}
                        className={`w-full rounded-2xl border px-4 py-3 text-xs outline-none focus:border-[#035BE3] ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${darkMode ? "text-gray-200" : "text-[#1E293B]"}`}>
                        API Key <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 84729482918492"
                        value={cloudinarySettings.api_key}
                        onChange={(e) => setCloudinarySettings({ ...cloudinarySettings, api_key: e.target.value })}
                        className={`w-full rounded-2xl border px-4 py-3 text-xs outline-none focus:border-[#035BE3] ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${darkMode ? "text-gray-200" : "text-[#1E293B]"}`}>
                        API Secret <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••••••••••••••"
                        value={cloudinarySettings.api_secret}
                        onChange={(e) => setCloudinarySettings({ ...cloudinarySettings, api_secret: e.target.value })}
                        className={`w-full rounded-2xl border px-4 py-3 text-xs outline-none focus:border-[#035BE3] ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${darkMode ? "text-gray-200" : "text-[#1E293B]"}`}>
                        Upload Preset (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. course_videos_preset"
                        value={cloudinarySettings.upload_preset}
                        onChange={(e) => setCloudinarySettings({ ...cloudinarySettings, upload_preset: e.target.value })}
                        className={`w-full rounded-2xl border px-4 py-3 text-xs outline-none focus:border-[#035BE3] ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full h-11 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 !mt-6 shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isProcessing ? "Saving..." : "Save & Activate Cloudinary"}</span>
                    </button>
                  </form>
                </div>


                {/* 4. Affiliate & RazorpayX Payout Settings Card */}
                <div
                  className={`rounded-[28px] p-6 sm:p-8 border lg:col-span-2 transition-colors ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-2.5 pb-4 border-b border-inherit mb-5">
                    <Wallet className="w-5 h-5 text-[#035BE3]" />
                    <div>
                      <h3 className={`text-sm sm:text-base font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                        Affiliate Withdrawal & RazorpayX System Settings
                      </h3>
                      <p className={`text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        Configure dynamic minimum payout thresholds and 1-click RazorpayX automated bank transfers.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveAffiliateSystemSettings} className="space-y-4 max-w-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${darkMode ? "text-gray-200" : "text-[#1E293B]"}`}>
                          Minimum Withdrawal Limit (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          placeholder="500"
                          value={affiliateSystemSettings.min_affiliate_withdrawal_amount}
                          onChange={(e) => setAffiliateSystemSettings({ ...affiliateSystemSettings, min_affiliate_withdrawal_amount: e.target.value })}
                          className={`w-full rounded-2xl border px-4 py-3 text-xs outline-none focus:border-[#035BE3] ${
                            darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                          }`}
                        />
                        <p className="text-[10.5px] text-[#64748B] mt-1">
                          Students cannot submit withdrawal requests for amounts below this threshold.
                        </p>
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${darkMode ? "text-gray-200" : "text-[#1E293B]"}`}>
                          RazorpayX Account Number (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 7878780080312456"
                          value={affiliateSystemSettings.razorpayx_account_number}
                          onChange={(e) => setAffiliateSystemSettings({ ...affiliateSystemSettings, razorpayx_account_number: e.target.value })}
                          className={`w-full rounded-2xl border px-4 py-3 text-xs outline-none focus:border-[#035BE3] font-mono ${
                            darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                          }`}
                        />
                        <p className="text-[10.5px] text-[#64748B] mt-1">
                          Used for RazorpayX Payout Account routing.
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="h-11 px-8 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isProcessing ? "Saving..." : "Save Affiliate Withdrawal Settings"}</span>
                    </button>
                  </form>
                </div>

                {/* 3. Razorpay Payment Gateway Settings Card */}
                <div
                  className={`rounded-[28px] p-6 sm:p-8 border lg:col-span-2 transition-colors ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-2.5 pb-4 border-b border-inherit mb-5">
                    <CreditCard className="w-5 h-5 text-[#035BE3]" />
                    <div>
                      <h3 className={`text-sm sm:text-base font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                        Razorpay Payment Gateway API
                      </h3>
                      <p className={`text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                        Live & Test credentials for processing UPI, Cards, NetBanking, and Instant Checkout.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveRazorpaySettings} className="space-y-4 max-w-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${darkMode ? "text-gray-200" : "text-[#1E293B]"}`}>
                          Razorpay Key ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. rzp_live_xxxxxxxx or rzp_test_xxxxxxxx"
                          value={razorpaySettings.razorpay_key_id}
                          onChange={(e) => setRazorpaySettings({ ...razorpaySettings, razorpay_key_id: e.target.value })}
                          className={`w-full rounded-2xl border px-4 py-3 text-xs outline-none focus:border-[#035BE3] ${
                            darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${darkMode ? "text-gray-200" : "text-[#1E293B]"}`}>
                          Razorpay Key Secret <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••••••••••••••••••"
                          value={razorpaySettings.razorpay_key_secret}
                          onChange={(e) => setRazorpaySettings({ ...razorpaySettings, razorpay_key_secret: e.target.value })}
                          className={`w-full rounded-2xl border px-4 py-3 text-xs outline-none focus:border-[#035BE3] ${
                            darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                          }`}
                        />
                      </div>
                    </div>

                    <p className={`text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      🔒 Stored securely in database settings. Used dynamically to generate payment orders and verify Webhook/Checkout signatures.
                    </p>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="h-11 px-8 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isProcessing ? "Saving..." : "Save Razorpay Credentials"}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: AFFILIATE & COMMISSION PAYOUTS MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === "affiliates" && (
            <div className="space-y-6">
              {/* Header Capsule */}
              <div
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center border border-[#035BE3]/15 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`text-base sm:text-lg font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                      Affiliate & Commission Hub
                    </h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Review student referral earnings, process bank/UPI payout withdrawals, and track partner performance.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setActiveTab("commissions")}
                    className="px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer hover:bg-amber-500 hover:text-white"
                  >
                    <Percent className="w-3.5 h-3.5" />
                    <span>Commission Matrix Rules</span>
                  </button>
                  <Link
                    to="/affiliate"
                    target="_blank"
                    className={`px-4 py-2 rounded-full border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                      darkMode
                        ? "border-[#222B3D] bg-[#0B0F17] text-[#94A3B8] hover:text-white hover:border-[#035BE3]"
                        : "border-[#E2E8F0] bg-[#F8FAFD] text-[#556377] hover:text-[#0F172A] hover:border-[#035BE3]"
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Student Portal Preview</span>
                  </Link>
                  <button
                    onClick={fetchDashboardData}
                    disabled={isRefreshing}
                    className="px-4 py-2 bg-[#035BE3] text-white rounded-full text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer hover:bg-[#024bc0] shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                    <span>Sync Affiliate Data</span>
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* 1. Total Commissions Generated */}
                <div
                  className={`rounded-[26px] p-5 sm:p-6 border transition-colors ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Total Commissions
                    </span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className={`text-2xl font-black ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                      ₹{Number(affiliateStats.totalCommissionGenerated || 0).toLocaleString("en-IN")}
                    </h3>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                      {affiliateStats.totalReferralSales || 0} Successful Referral Sales
                    </p>
                  </div>
                </div>

                {/* 2. Total Paid Out */}
                <div
                  className={`rounded-[26px] p-5 sm:p-6 border transition-colors ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Total Paid Out
                    </span>
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-[#035BE3] flex items-center justify-center">
                      <Wallet className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className={`text-2xl font-black ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                      ₹{Number(affiliateStats.totalPayoutsPaid || 0).toLocaleString("en-IN")}
                    </h3>
                    <p className={`text-[11px] font-semibold mt-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Processed & Sent to Bank/UPI
                    </p>
                  </div>
                </div>

                {/* 3. Pending Payout Requests */}
                <div
                  className={`rounded-[26px] p-5 sm:p-6 border transition-colors ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Pending Payouts
                    </span>
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className={`text-2xl font-black ${affiliateStats.pendingPayoutCount > 0 ? "text-amber-500" : darkMode ? "text-white" : "text-[#0F172A]"}`}>
                      ₹{Number(affiliateStats.pendingPayoutAmount || 0).toLocaleString("en-IN")}
                    </h3>
                    <p className="text-[11px] text-amber-500 font-semibold mt-1">
                      {affiliateStats.pendingPayoutCount || 0} Requests Awaiting Approval
                    </p>
                  </div>
                </div>

                {/* 4. Active Top Affiliates */}
                <div
                  className={`rounded-[26px] p-5 sm:p-6 border transition-colors ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Top Partners
                    </span>
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className={`text-2xl font-black ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                      {affiliateTopList.length}
                    </h3>
                    <p className={`text-[11px] font-semibold mt-1 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Top Referral Earners Ranked
                    </p>
                  </div>
                </div>
              </div>

              {/* Subtabs Switcher & Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                  <button
                    onClick={() => setAffiliateActiveSubTab("payouts")}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
                      affiliateActiveSubTab === "payouts"
                        ? "bg-[#035BE3] border-[#035BE3] text-white shadow-xs"
                        : darkMode
                        ? "bg-[#131926] border-[#222B3D] text-[#94A3B8] hover:text-white"
                        : "bg-white border-[#E2E8F0] text-[#556377] hover:text-[#0F172A]"
                    }`}
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Payout Requests</span>
                    {affiliateStats.pendingPayoutCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[10px] font-black">
                        {affiliateStats.pendingPayoutCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setAffiliateActiveSubTab("referrals")}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
                      affiliateActiveSubTab === "referrals"
                        ? "bg-[#035BE3] border-[#035BE3] text-white shadow-xs"
                        : darkMode
                        ? "bg-[#131926] border-[#222B3D] text-[#94A3B8] hover:text-white"
                        : "bg-white border-[#E2E8F0] text-[#556377] hover:text-[#0F172A]"
                    }`}
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Referrals Ledger ({affiliateReferralsList.length})</span>
                  </button>

                  <button
                    onClick={() => setAffiliateActiveSubTab("leaderboard")}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
                      affiliateActiveSubTab === "leaderboard"
                        ? "bg-[#035BE3] border-[#035BE3] text-white shadow-xs"
                        : darkMode
                        ? "bg-[#131926] border-[#222B3D] text-[#94A3B8] hover:text-white"
                        : "bg-white border-[#E2E8F0] text-[#556377] hover:text-[#0F172A]"
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Top Affiliate Partners</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {affiliateActiveSubTab === "payouts" && (
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      {[
                        { id: "all", label: "All" },
                        { id: "pending", label: "Pending" },
                        { id: "paid", label: "Paid" },
                        { id: "rejected", label: "Rejected" },
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setAffiliatePayoutFilter(f.id)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                            affiliatePayoutFilter === f.id
                              ? "bg-slate-900 dark:bg-white text-white dark:text-black border-transparent"
                              : darkMode
                              ? "border-[#222B3D] text-[#94A3B8] hover:text-white"
                              : "border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="relative w-full md:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search student, UPI, UTR..."
                      value={affiliateSearch}
                      onChange={(e) => setAffiliateSearch(e.target.value)}
                      className={`w-full pl-9 pr-4 py-2 rounded-full border text-xs outline-none focus:border-[#035BE3] ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* SUBTAB 1: PAYOUT REQUESTS TABLE */}
              {affiliateActiveSubTab === "payouts" && (
                <div
                  className={`rounded-[28px] border overflow-hidden transition-colors ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                  }`}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className={`border-b uppercase text-[10px] tracking-wider ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-[#94A3B8]" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#64748B]"
                        }`}>
                          <th className="py-3.5 px-6 font-bold"># ID & Student</th>
                          <th className="py-3.5 px-6 font-bold">Requested Amount</th>
                          <th className="py-3.5 px-6 font-bold">Payout Mode & Details</th>
                          <th className="py-3.5 px-6 font-bold">Status</th>
                          <th className="py-3.5 px-6 font-bold">UTR / Admin Note</th>
                          <th className="py-3.5 px-6 font-bold">Requested Date</th>
                          <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? "divide-[#1E2638]" : "divide-[#F1F5F9]"}`}>
                        {filteredAffiliatePayouts.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-[#64748B]">
                              <Wallet className="w-8 h-8 mx-auto text-[#94A3B8] mb-2 opacity-50" />
                              <p className="font-semibold">No payout requests found matching the filter.</p>
                            </td>
                          </tr>
                        ) : (
                          filteredAffiliatePayouts.map((p) => {
                            const isPending = p.status === "pending";
                            const isPaid = p.status === "paid" || p.status === "approved";
                            const isRejected = p.status === "rejected";

                            return (
                              <tr key={p.id} className={`transition-colors ${darkMode ? "hover:bg-[#1E2638]" : "hover:bg-[#F8FAFD]"}`}>
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[11px] font-bold text-[#94A3B8]">#{p.id}</span>
                                    <div>
                                      <p className={`font-bold leading-tight ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                                        {p.user_name || "Partner Student"}
                                      </p>
                                      <p className={`text-[10.5px] mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                                        {p.student_id ? `ID: ${p.student_id}` : p.user_email}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-4 px-6">
                                  <span className={`font-black text-sm ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                                    ₹{Number(p.amount || 0).toLocaleString("en-IN")}
                                  </span>
                                </td>

                                <td className="py-4 px-6">
                                  {p.payout_method === "upi" ? (
                                    <div className="space-y-0.5">
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                        UPI Transfer
                                      </span>
                                      <div className="flex items-center gap-1 font-mono text-[11px] font-bold">
                                        <span>{p.upi_id}</span>
                                        <button
                                          onClick={() => handleCopyStudentId(p.upi_id)}
                                          className="p-1 hover:text-[#035BE3] transition cursor-pointer"
                                          title="Copy UPI ID"
                                        >
                                          {copiedStudentId === p.upi_id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-0.5 text-[11px]">
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[#035BE3] border border-blue-200 dark:border-blue-800">
                                        Bank Account ({p.bank_name || "Bank"})
                                      </span>
                                      <div className="flex items-center gap-1 font-mono">
                                        <span className="font-bold">A/C: {p.account_number}</span>
                                        <button
                                          onClick={() => handleCopyStudentId(p.account_number)}
                                          className="p-0.5 hover:text-[#035BE3] transition cursor-pointer"
                                          title="Copy Account Number"
                                        >
                                          {copiedStudentId === p.account_number ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                                        </button>
                                      </div>
                                      <p className="text-[10px] text-[#64748B]">IFSC: {p.ifsc_code} • {p.account_holder_name}</p>
                                    </div>
                                  )}
                                </td>

                                <td className="py-4 px-6">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10.5px] uppercase border ${
                                    isPaid
                                      ? (darkMode ? "bg-emerald-950/50 text-emerald-400 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-200")
                                      : isPending
                                      ? (darkMode ? "bg-amber-950/50 text-amber-400 border-amber-800" : "bg-amber-50 text-amber-700 border-amber-200")
                                      : (darkMode ? "bg-red-950/50 text-red-400 border-red-800" : "bg-red-50 text-red-700 border-red-200")
                                  }`}>
                                    {isPaid && <CheckCircle2 size={11} />}
                                    {isPending && <Clock size={11} />}
                                    {isRejected && <AlertCircle size={11} />}
                                    <span>{p.status}</span>
                                  </span>
                                </td>

                                <td className="py-4 px-6">
                                  {p.utr_number ? (
                                    <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-600">
                                      <span>UTR: {p.utr_number}</span>
                                    </div>
                                  ) : p.admin_note ? (
                                    <p className="text-[11px] text-[#64748B] italic max-w-xs truncate" title={p.admin_note}>
                                      {p.admin_note}
                                    </p>
                                  ) : (
                                    <span className="text-[#94A3B8]">—</span>
                                  )}
                                </td>

                                <td className={`py-4 px-6 text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                                  {p.requested_at ? new Date(p.requested_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                                </td>

                                <td className="py-4 px-6 text-right">
                                  {isPending ? (
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() => {
                                          setPayoutActionModal({ payout: p, actionType: "approve" });
                                          setPayoutUtrNumber("");
                                          setPayoutAdminNote("");
                                        }}
                                        className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition flex items-center gap-1 cursor-pointer shadow-xs"
                                      >
                                        <Check className="w-3 h-3" />
                                        <span>Approve & Pay</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          setPayoutActionModal({ payout: p, actionType: "reject" });
                                          setPayoutUtrNumber("");
                                          setPayoutAdminNote("");
                                        }}
                                        className="px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 font-bold text-[11px] transition cursor-pointer"
                                      >
                                        <span>Reject</span>
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-[11px] font-bold text-[#94A3B8]">Settled</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}


              {/* ======================================================== */}
              {/* SUBTAB: COMPREHENSIVE AFFILIATE PARTNERS & ANALYTICS */}
              {/* ======================================================== */}
              {affiliateActiveSubTab === "partners" && (
                <div
                  className={`rounded-[28px] border overflow-hidden transition-colors ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                  }`}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className={`border-b uppercase text-[10px] tracking-wider ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-[#94A3B8]" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#64748B]"
                        }`}>
                          <th className="py-3.5 px-6 font-bold">Partner Student</th>
                          <th className="py-3.5 px-6 font-bold">Contact Info</th>
                          <th className="py-3.5 px-6 font-bold">Referral Code</th>
                          <th className="py-3.5 px-6 font-bold">Wallet Balance</th>
                          <th className="py-3.5 px-6 font-bold">Lifetime Earned</th>
                          <th className="py-3.5 px-6 font-bold">2-Tier Split (L1 / L2)</th>
                          <th className="py-3.5 px-6 font-bold">Total Withdrawn</th>
                          <th className="py-3.5 px-6 font-bold">Referral Sales</th>
                          <th className="py-3.5 px-6 font-bold">Payouts Count</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? "divide-[#1E2638]" : "divide-[#F1F5F9]"}`}>
                        {filteredAffiliateUsers.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-12 text-center text-[#64748B]">
                              <Users className="w-8 h-8 mx-auto text-[#94A3B8] mb-2 opacity-50" />
                              <p className="font-semibold">No affiliate partners found matching search criteria.</p>
                            </td>
                          </tr>
                        ) : (
                          filteredAffiliateUsers.map((u) => {
                            const walletBal = Number(u.current_balance || 0);
                            const totalEarned = Number(u.total_earned || 0);
                            const directEarned = Number(u.direct_earnings || 0);
                            const leadEarned = Number(u.leadership_earnings || 0);
                            const totalWithdrawn = Number(u.total_withdrawn || 0);
                            const refCount = Number(u.total_referral_sales || 0);
                            const payoutCount = Number(u.total_payout_requests || 0);

                            return (
                              <tr key={u.id} className={`transition-colors ${darkMode ? "hover:bg-[#1E2638]" : "hover:bg-[#F8FAFD]"}`}>
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                      {(u.name || "U")[0].toUpperCase()}
                                    </div>
                                    <div>
                                      <p className={`font-bold leading-tight ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                                        {u.name}
                                      </p>
                                      <p className="font-mono text-[10.5px] text-[#64748B] mt-0.5">
                                        {u.student_id || `ID: KW${u.id}`}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-4 px-6">
                                  <p className={`text-xs ${darkMode ? "text-gray-300" : "text-[#0F172A]"}`}>{u.email}</p>
                                  <p className="text-[10.5px] text-[#64748B]">{u.phone || "—"}</p>
                                </td>

                                <td className="py-4 px-6">
                                  <span className="font-mono text-[11px] font-black px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-[#035BE3] border border-blue-200 dark:border-blue-900">
                                    {u.referral_code || `KW${u.id}`}
                                  </span>
                                </td>

                                <td className="py-4 px-6">
                                  <span className={`font-black text-sm ${
                                    walletBal > 0 ? "text-amber-500" : darkMode ? "text-gray-400" : "text-gray-600"
                                  }`}>
                                    ₹{walletBal.toLocaleString("en-IN")}
                                  </span>
                                </td>

                                <td className="py-4 px-6">
                                  <span className={`font-black text-sm ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                                    ₹{totalEarned.toLocaleString("en-IN")}
                                  </span>
                                </td>

                                <td className="py-4 px-6">
                                  <div className="space-y-0.5 text-[11px]">
                                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                                      <span>🟢 L1 Direct:</span>
                                      <span>₹{directEarned.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                                      <span>⭐ L2 Sponsor:</span>
                                      <span>₹{leadEarned.toLocaleString("en-IN")}</span>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-4 px-6">
                                  <span className={`font-bold text-xs ${darkMode ? "text-gray-300" : "text-[#0F172A]"}`}>
                                    ₹{totalWithdrawn.toLocaleString("en-IN")}
                                  </span>
                                </td>

                                <td className="py-4 px-6">
                                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#035BE3] font-bold text-xs border border-blue-200 dark:border-blue-900">
                                    {refCount} Sales
                                  </span>
                                </td>

                                <td className="py-4 px-6">
                                  <span className="font-mono text-xs font-semibold text-[#8A99AD]">
                                    {payoutCount} reqs
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: REFERRALS LEDGER TABLE */}
              {affiliateActiveSubTab === "referrals" && (
                <div
                  className={`rounded-[28px] border overflow-hidden transition-colors ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                  }`}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className={`border-b uppercase text-[10px] tracking-wider ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-[#94A3B8]" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#64748B]"
                        }`}>
                          <th className="py-3.5 px-6 font-bold"># Ref ID</th>
                          <th className="py-3.5 px-6 font-bold">Tier / Level</th>
                          <th className="py-3.5 px-6 font-bold">Affiliate Beneficiary</th>
                          <th className="py-3.5 px-6 font-bold">Buyer (Student)</th>
                          <th className="py-3.5 px-6 font-bold">Item Purchased</th>
                          <th className="py-3.5 px-6 font-bold">Sale Price</th>
                          <th className="py-3.5 px-6 font-bold">Commission Earned</th>
                          <th className="py-3.5 px-6 font-bold">Commission Rate</th>
                          <th className="py-3.5 px-6 font-bold">Date</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? "divide-[#1E2638]" : "divide-[#F1F5F9]"}`}>
                        {filteredAffiliateReferrals.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-12 text-center text-[#64748B]">
                              <Receipt className="w-8 h-8 mx-auto text-[#94A3B8] mb-2 opacity-50" />
                              <p className="font-semibold">No referral commissions recorded yet.</p>
                            </td>
                          </tr>
                        ) : (
                          filteredAffiliateReferrals.map((r) => {
                            const isPkg = r.item_type === "package";
                            const isLeadership = r.commission_tier === "leadership" || Number(r.tier_level) === 2;
                            return (
                              <tr key={r.id} className={`transition-colors ${darkMode ? "hover:bg-[#1E2638]" : "hover:bg-[#F8FAFD]"}`}>
                                <td className="py-4 px-6 font-mono text-[11px] font-bold text-[#94A3B8]">
                                  #{r.id}
                                </td>

                                <td className="py-4 px-6">
                                  {isLeadership ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                      ⭐ Level 2 (Leadership)
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                      🟢 Level 1 (Direct)
                                    </span>
                                  )}
                                </td>

                                <td className="py-4 px-6">
                                  <p className={`font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                                    {r.referrer_name}
                                  </p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="font-mono text-[10px] text-[#64748B]">{r.referrer_student_id}</span>
                                    <span className="px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/50 text-[#035BE3] border border-blue-200 dark:border-blue-900 font-mono text-[9.5px] font-bold">
                                      {r.referral_code_used || r.referrer_referral_code}
                                    </span>
                                  </div>
                                  {isLeadership && r.direct_referrer_name && (
                                    <p className="text-[10px] text-[#8A99AD] mt-0.5">
                                      ↳ Via Direct Referrer: <span className="font-semibold text-amber-500">{r.direct_referrer_name}</span>
                                    </p>
                                  )}
                                </td>

                                <td className="py-4 px-6">
                                  <p className={`font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                                    {r.buyer_name || "New Student"}
                                  </p>
                                  <p className="text-[10.5px] text-[#64748B]">{r.buyer_email || r.referred_student_id}</p>
                                </td>

                                <td className="py-4 px-6">
                                  <span className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2.5 py-1 rounded-full border ${
                                    isPkg
                                      ? (darkMode ? "bg-blue-950/50 text-blue-400 border-blue-900/60" : "bg-blue-50 text-[#035BE3] border-blue-200")
                                      : (darkMode ? "bg-purple-950/50 text-purple-400 border-purple-900/50" : "bg-purple-50 text-purple-700 border-purple-200")
                                  }`}>
                                    {isPkg ? <Layers3 size={11} /> : <BookOpen size={11} />}
                                    <span>{r.item_title}</span>
                                  </span>
                                </td>

                                <td className="py-4 px-6">
                                  <span className={`font-bold text-xs ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                                    ₹{Number(r.sale_amount || 0).toLocaleString("en-IN")}
                                  </span>
                                </td>

                                <td className="py-4 px-6">
                                  <span className={`font-black text-xs ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                                    +₹{Number(r.commission_amount || 0).toLocaleString("en-IN")}
                                  </span>
                                </td>

                                <td className="py-4 px-6">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    r.commission_type === "percentage"
                                      ? "bg-purple-50 dark:bg-purple-950/40 text-purple-600 border-purple-200 dark:border-purple-800"
                                      : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-200 dark:border-emerald-800"
                                  }`}>
                                    {r.commission_type === "percentage" ? `${r.commission_rate_applied}% Share` : `₹${r.commission_rate_applied} Flat`}
                                  </span>
                                </td>

                                <td className={`py-4 px-6 text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                                  {r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: TOP 10 AFFILIATE PARTNERS TABLE */}
              {affiliateActiveSubTab === "leaderboard" && (
                <div
                  className={`rounded-[28px] border overflow-hidden transition-colors ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                  }`}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className={`border-b uppercase text-[10px] tracking-wider ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-[#94A3B8]" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#64748B]"
                        }`}>
                          <th className="py-3.5 px-6 font-bold">Rank</th>
                          <th className="py-3.5 px-6 font-bold">Partner Details</th>
                          <th className="py-3.5 px-6 font-bold">Contact Info</th>
                          <th className="py-3.5 px-6 font-bold">Total Referral Sales</th>
                          <th className="py-3.5 px-6 font-bold">Total Commissions Earned</th>
                          <th className="py-3.5 px-6 font-bold">Current Wallet Balance</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? "divide-[#1E2638]" : "divide-[#F1F5F9]"}`}>
                        {affiliateTopList.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-[#64748B]">
                              <TrendingUp className="w-8 h-8 mx-auto text-[#94A3B8] mb-2 opacity-50" />
                              <p className="font-semibold">No active affiliate partners with recorded sales yet.</p>
                            </td>
                          </tr>
                        ) : (
                          affiliateTopList.map((partner, index) => (
                            <tr key={partner.id} className={`transition-colors ${darkMode ? "hover:bg-[#1E2638]" : "hover:bg-[#F8FAFD]"}`}>
                              <td className="py-4 px-6">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                                  index === 0
                                    ? "bg-amber-400 text-black shadow-xs"
                                    : index === 1
                                    ? "bg-slate-300 text-slate-900"
                                    : index === 2
                                    ? "bg-amber-700 text-white"
                                    : darkMode
                                    ? "bg-gray-800 text-gray-300"
                                    : "bg-gray-100 text-gray-700"
                                }`}>
                                  #{index + 1}
                                </div>
                              </td>

                              <td className="py-4 px-6">
                                <p className={`font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                                  {partner.name}
                                </p>
                                <p className="font-mono text-[10.5px] text-[#64748B]">{partner.student_id || `User #${partner.id}`}</p>
                              </td>

                              <td className="py-4 px-6">
                                <p className={`text-xs ${darkMode ? "text-gray-300" : "text-[#0F172A]"}`}>{partner.email}</p>
                                <p className="text-[10.5px] text-[#64748B]">{partner.phone || "—"}</p>
                              </td>

                              <td className="py-4 px-6">
                                <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                                  darkMode ? "bg-blue-950/50 text-blue-400 border border-blue-900/60" : "bg-blue-50 text-[#035BE3] border border-blue-200"
                                }`}>
                                  {partner.total_sales || 0} Successful Sales
                                </span>
                              </td>

                              <td className="py-4 px-6">
                                <span className={`font-black text-sm ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                                  ₹{Number(partner.total_earned || 0).toLocaleString("en-IN")}
                                </span>
                              </td>

                              <td className="py-4 px-6">
                                <span className={`font-black text-xs ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                                  ₹{Number(partner.wallet_balance || 0).toLocaleString("en-IN")}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}

          {/* ======================================================== */}
          {/* TAB 8: SUB-ADMINS & ROLE-BASED ACCESS CONTROL (RBAC) */}
          {/* ======================================================== */}
                    {/* ======================================================== */}
          {/* TAB: 2-TIER COMMISSION MATRIX */}
          {/* ======================================================== */}
          {activeTab === "commissions" && (
            <div className="space-y-6">
              {/* Header Capsule */}
              <div
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${
                    darkMode ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-600 border-amber-200"
                  }`}>
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`text-base sm:text-lg font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                      2-Tier Affiliate Commission Matrix
                    </h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Configure Tier-1 Direct Referral payout & Tier-2 Leadership Sponsor reward for all packages & courses.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 p-1 rounded-full border ${
                    darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-slate-100 border-[#E2E8F0]"
                  }`}>
                    <button
                      type="button"
                      onClick={() => setCommissionActiveTab("packages")}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                        commissionActiveTab === "packages"
                          ? "bg-[#035BE3] text-white shadow-xs"
                          : darkMode ? "text-[#94A3B8] hover:text-white" : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      Skill Packages ({packagesList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommissionActiveTab("courses")}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                        commissionActiveTab === "courses"
                          ? "bg-[#035BE3] text-white shadow-xs"
                          : darkMode ? "text-[#94A3B8] hover:text-white" : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      Individual Courses ({coursesList.length})
                    </button>
                  </div>
                </div>
              </div>

              {/* 1. SKILL PACKAGES COMMISSION VIEW */}
              {commissionActiveTab === "packages" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {packagesList
                      .filter((p) =>
                        !commissionSearch.trim() ||
                        p.name?.toLowerCase().includes(commissionSearch.toLowerCase()) ||
                        p.slug?.toLowerCase().includes(commissionSearch.toLowerCase())
                      )
                      .map((pkg) => {
                        const draft = packageCommissionDrafts[pkg.id] || {
                          direct_type: pkg.referral_commission_type || "percentage",
                          direct_value: pkg.referral_commission_value !== undefined && pkg.referral_commission_value !== null ? pkg.referral_commission_value : 20,
                          leadership_type: pkg.leadership_commission_type || "percentage",
                          leadership_value: pkg.leadership_commission_value !== undefined && pkg.leadership_commission_value !== null ? pkg.leadership_commission_value : 5,
                        };
                        const pkgPrice = Number(pkg.price || 999);
                        const isDirectFlat = draft.direct_type === "flat";
                        const directVal = Number(draft.direct_value) || 0;
                        const directEarning = isDirectFlat ? directVal : Math.round((pkgPrice * directVal) / 100);

                        const isLeadFlat = draft.leadership_type === "flat";
                        const leadVal = Number(draft.leadership_value) || 0;
                        const leadEarning = isLeadFlat ? leadVal : Math.round((pkgPrice * leadVal) / 100);

                        const totalPayout = directEarning + leadEarning;
                        const isSavingThis = savingCommissionId === `pkg-${pkg.id}`;

                        return (
                          <div
                            key={pkg.id}
                            className={`rounded-[28px] border p-5 sm:p-6 flex flex-col justify-between transition-all ${
                              darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1]"
                            }`}
                          >
                            <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                {pkg.thumbnail_url && (
                                  <img
                                    src={pkg.thumbnail_url}
                                    alt={pkg.name}
                                    className={`w-14 h-11 object-cover rounded-xl border shrink-0 ${
                                      darkMode ? "bg-gray-900 border-[#222B3D]" : "bg-slate-100 border-[#E2E8F0]"
                                    }`}
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  />
                                )}
                                <div className="min-w-0 flex-1">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                                    darkMode
                                      ? "bg-blue-950/50 text-blue-400 border-blue-900"
                                      : "bg-blue-50 text-[#035BE3] border-blue-200"
                                  }`}>
                                    {pkg.badge_text || "Package"}
                                  </span>
                                  <h3 className={`text-xs font-bold mt-1 line-clamp-1 ${darkMode ? "text-white" : "text-[#0F172A]"}`} title={pkg.name}>
                                    {pkg.name}
                                  </h3>
                                  <p className={`text-[10.5px] truncate ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                                    {(pkg.course_count || (pkg.course_ids ? pkg.course_ids.length : 0))} Courses Included
                                  </p>
                                </div>
                              </div>

                              <div className={`flex items-baseline gap-2 pb-2 border-b ${
                                darkMode ? "border-[#222B3D]" : "border-[#F1F5F9]"
                              }`}>
                                <span className={`text-lg font-black ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                                  ₹{pkgPrice.toLocaleString("en-IN")}
                                </span>
                                {pkg.regular_price > 0 && (
                                  <span className={`text-xs line-through ${darkMode ? "text-[#94A3B8]" : "text-slate-400"}`}>
                                    ₹{Number(pkg.regular_price).toLocaleString("en-IN")}
                                  </span>
                                )}
                                <span className={`text-[10.5px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>Active Price</span>
                              </div>

                              {/* LEVEL 1: DIRECT REFERRAL COMMISSION */}
                              <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                                darkMode ? "bg-[#0B0F17] border-emerald-900/40" : "bg-emerald-50/70 border-emerald-200"
                              }`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className={`text-xs font-black ${darkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                                      Tier 1: Direct Referrer
                                    </span>
                                  </div>
                                  <div className={`flex items-center gap-1 p-0.5 rounded-full border ${
                                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-emerald-100/70 border-emerald-200"
                                  }`}>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setPackageCommissionDrafts((prev) => ({
                                          ...prev,
                                          [pkg.id]: { ...draft, direct_type: "percentage" },
                                        }))
                                      }
                                      className={`h-5 px-2 rounded-full text-[10px] font-bold transition cursor-pointer ${
                                        !isDirectFlat
                                          ? "bg-emerald-600 text-white shadow-xs"
                                          : darkMode ? "text-[#94A3B8] hover:text-white" : "text-emerald-800 hover:text-emerald-950"
                                      }`}
                                    >
                                      % Rate
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setPackageCommissionDrafts((prev) => ({
                                          ...prev,
                                          [pkg.id]: { ...draft, direct_type: "flat" },
                                        }))
                                      }
                                      className={`h-5 px-2 rounded-full text-[10px] font-bold transition cursor-pointer ${
                                        isDirectFlat
                                          ? "bg-emerald-600 text-white shadow-xs"
                                          : darkMode ? "text-[#94A3B8] hover:text-white" : "text-emerald-800 hover:text-emerald-950"
                                      }`}
                                    >
                                      ₹ Flat
                                    </button>
                                  </div>
                                </div>

                                <div className="relative">
                                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs ${
                                    darkMode ? "text-gray-400" : "text-slate-400"
                                  }`}>
                                    {isDirectFlat ? "₹" : "%"}
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step={isDirectFlat ? "10" : "1"}
                                    value={draft.direct_value}
                                    onChange={(e) =>
                                      setPackageCommissionDrafts((prev) => ({
                                        ...prev,
                                        [pkg.id]: { ...draft, direct_value: e.target.value },
                                      }))
                                    }
                                    placeholder={isDirectFlat ? "200" : "25"}
                                    className={`w-full h-9 rounded-xl border pl-7 pr-3 text-xs font-bold outline-none focus:border-emerald-500 transition-colors ${
                                      darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                                    }`}
                                  />
                                </div>

                                <div className="flex items-center justify-between text-[11px] pt-0.5">
                                  <span className={darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}>Direct Referrer gets:</span>
                                  <span className={`font-black ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                                    ₹{directEarning.toLocaleString("en-IN")} {isDirectFlat ? "(Flat)" : `(${draft.direct_value}%)`}
                                  </span>
                                </div>
                              </div>

                              {/* LEVEL 2: LEADERSHIP SPONSOR COMMISSION */}
                              <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                                darkMode ? "bg-[#0B0F17] border-amber-900/40" : "bg-amber-50/70 border-amber-200"
                              }`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                    <span className={`text-xs font-black ${darkMode ? "text-amber-400" : "text-amber-700"}`}>
                                      Tier 2: Leadership Sponsor
                                    </span>
                                  </div>
                                  <div className={`flex items-center gap-1 p-0.5 rounded-full border ${
                                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-amber-100/70 border-amber-200"
                                  }`}>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setPackageCommissionDrafts((prev) => ({
                                          ...prev,
                                          [pkg.id]: { ...draft, leadership_type: "percentage" },
                                        }))
                                      }
                                      className={`h-5 px-2 rounded-full text-[10px] font-bold transition cursor-pointer ${
                                        !isLeadFlat
                                          ? "bg-amber-500 text-white shadow-xs"
                                          : darkMode ? "text-[#94A3B8] hover:text-white" : "text-amber-800 hover:text-amber-950"
                                      }`}
                                    >
                                      % Rate
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setPackageCommissionDrafts((prev) => ({
                                          ...prev,
                                          [pkg.id]: { ...draft, leadership_type: "flat" },
                                        }))
                                      }
                                      className={`h-5 px-2 rounded-full text-[10px] font-bold transition cursor-pointer ${
                                        isLeadFlat
                                          ? "bg-amber-500 text-white shadow-xs"
                                          : darkMode ? "text-[#94A3B8] hover:text-white" : "text-amber-800 hover:text-amber-950"
                                      }`}
                                    >
                                      ₹ Flat
                                    </button>
                                  </div>
                                </div>

                                <div className="relative">
                                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs ${
                                    darkMode ? "text-gray-400" : "text-slate-400"
                                  }`}>
                                    {isLeadFlat ? "₹" : "%"}
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step={isLeadFlat ? "10" : "1"}
                                    value={draft.leadership_value}
                                    onChange={(e) =>
                                      setPackageCommissionDrafts((prev) => ({
                                        ...prev,
                                        [pkg.id]: { ...draft, leadership_value: e.target.value },
                                      }))
                                    }
                                    placeholder={isLeadFlat ? "50" : "5"}
                                    className={`w-full h-9 rounded-xl border pl-7 pr-3 text-xs font-bold outline-none focus:border-amber-500 transition-colors ${
                                      darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                                    }`}
                                  />
                                </div>

                                <div className="flex items-center justify-between text-[11px] pt-0.5">
                                  <span className={darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}>Sponsor gets:</span>
                                  <span className={`font-black ${darkMode ? "text-amber-400" : "text-amber-600"}`}>
                                    ₹{leadEarning.toLocaleString("en-IN")} {isLeadFlat ? "(Flat)" : `(${draft.leadership_value}%)`}
                                  </span>
                                </div>
                              </div>

                              {/* Total Payout Summary */}
                              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                                darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-blue-50/70 border-blue-200"
                              }`}>
                                <span className={`text-[11px] font-bold ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>Total Payout (2-Tiers):</span>
                                <span className="font-black text-[#035BE3]">
                                  ₹{totalPayout.toLocaleString("en-IN")} / sale
                                </span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className={`pt-4 mt-4 border-t ${darkMode ? "border-[#222B3D]" : "border-[#F1F5F9]"}`}>
                              <button
                                type="button"
                                onClick={() => handleSavePackageCommission(pkg.id)}
                                disabled={isSavingThis}
                                className="w-full h-9 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{isSavingThis ? "Saving Rates..." : "Update Package 2-Tier Rate"}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* 2. INDIVIDUAL COURSES COMMISSION VIEW */}
              {commissionActiveTab === "courses" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {coursesList
                      .filter((c) =>
                        !commissionSearch.trim() ||
                        c.title?.toLowerCase().includes(commissionSearch.toLowerCase()) ||
                        c.category?.toLowerCase().includes(commissionSearch.toLowerCase()) ||
                        c.mentor_name?.toLowerCase().includes(commissionSearch.toLowerCase())
                      )
                      .map((crs) => {
                        const draft = courseCommissionDrafts[crs.id] || {
                          direct_type: crs.referral_commission_type || "percentage",
                          direct_value: crs.referral_commission_value !== undefined && crs.referral_commission_value !== null ? crs.referral_commission_value : 20,
                          leadership_type: crs.leadership_commission_type || "percentage",
                          leadership_value: crs.leadership_commission_value !== undefined && crs.leadership_commission_value !== null ? crs.leadership_commission_value : 5,
                        };
                        const promoPrice = Number(crs.promo_price || 499);
                        const isDirectFlat = draft.direct_type === "flat";
                        const directVal = Number(draft.direct_value) || 0;
                        const directEarning = isDirectFlat ? directVal : Math.round((promoPrice * directVal) / 100);

                        const isLeadFlat = draft.leadership_type === "flat";
                        const leadVal = Number(draft.leadership_value) || 0;
                        const leadEarning = isLeadFlat ? leadVal : Math.round((promoPrice * leadVal) / 100);

                        const totalPayout = directEarning + leadEarning;
                        const isSavingThis = savingCommissionId === `crs-${crs.id}`;

                        return (
                          <div
                            key={crs.id}
                            className={`rounded-[28px] border p-5 sm:p-6 flex flex-col justify-between transition-all ${
                              darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1]"
                            }`}
                          >
                            <div className="space-y-4">
                              {/* Header Course Info */}
                              <div className="flex items-start gap-3">
                                {crs.thumbnail_url && (
                                  <img
                                    src={crs.thumbnail_url}
                                    alt={crs.title}
                                    className={`w-14 h-11 object-cover rounded-xl border shrink-0 ${
                                      darkMode ? "bg-gray-900 border-[#222B3D]" : "bg-slate-100 border-[#E2E8F0]"
                                    }`}
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  />
                                )}
                                <div className="min-w-0 flex-1">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                                    darkMode
                                      ? "bg-purple-950/50 text-purple-400 border-purple-900"
                                      : "bg-purple-50 text-purple-600 border-purple-200"
                                  }`}>
                                    {crs.category || "Course"}
                                  </span>
                                  <h3 className={`text-xs font-bold mt-1 line-clamp-1 ${darkMode ? "text-white" : "text-[#0F172A]"}`} title={crs.title}>
                                    {crs.title}
                                  </h3>
                                  <p className={`text-[10.5px] truncate ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                                    {crs.mentor_name || "Instructor"} • {crs.duration}
                                  </p>
                                </div>
                              </div>

                              {/* Price Info */}
                              <div className={`flex items-baseline gap-2 pb-2 border-b ${
                                darkMode ? "border-[#222B3D]" : "border-[#F1F5F9]"
                              }`}>
                                <span className={`text-lg font-black ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                                  ₹{promoPrice.toLocaleString("en-IN")}
                                </span>
                                {crs.regular_price > 0 && (
                                  <span className={`text-xs line-through ${darkMode ? "text-[#94A3B8]" : "text-slate-400"}`}>
                                    ₹{Number(crs.regular_price).toLocaleString("en-IN")}
                                  </span>
                                )}
                                <span className={`text-[10.5px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>Active Price</span>
                              </div>

                              {/* LEVEL 1: DIRECT REFERRAL COMMISSION */}
                              <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                                darkMode ? "bg-[#0B0F17] border-emerald-900/40" : "bg-emerald-50/70 border-emerald-200"
                              }`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className={`text-xs font-black ${darkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                                      Tier 1: Direct Referrer
                                    </span>
                                  </div>
                                  <div className={`flex items-center gap-1 p-0.5 rounded-full border ${
                                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-emerald-100/70 border-emerald-200"
                                  }`}>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setCourseCommissionDrafts((prev) => ({
                                          ...prev,
                                          [crs.id]: { ...draft, direct_type: "percentage" },
                                        }))
                                      }
                                      className={`h-5 px-2 rounded-full text-[10px] font-bold transition cursor-pointer ${
                                        !isDirectFlat
                                          ? "bg-emerald-600 text-white shadow-xs"
                                          : darkMode ? "text-[#94A3B8] hover:text-white" : "text-emerald-800 hover:text-emerald-950"
                                      }`}
                                    >
                                      % Rate
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setCourseCommissionDrafts((prev) => ({
                                          ...prev,
                                          [crs.id]: { ...draft, direct_type: "flat" },
                                        }))
                                      }
                                      className={`h-5 px-2 rounded-full text-[10px] font-bold transition cursor-pointer ${
                                        isDirectFlat
                                          ? "bg-emerald-600 text-white shadow-xs"
                                          : darkMode ? "text-[#94A3B8] hover:text-white" : "text-emerald-800 hover:text-emerald-950"
                                      }`}
                                    >
                                      ₹ Flat
                                    </button>
                                  </div>
                                </div>

                                <div className="relative">
                                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs ${
                                    darkMode ? "text-gray-400" : "text-slate-400"
                                  }`}>
                                    {isDirectFlat ? "₹" : "%"}
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step={isDirectFlat ? "10" : "1"}
                                    value={draft.direct_value}
                                    onChange={(e) =>
                                      setCourseCommissionDrafts((prev) => ({
                                        ...prev,
                                        [crs.id]: { ...draft, direct_value: e.target.value },
                                      }))
                                    }
                                    placeholder={isDirectFlat ? "100" : "20"}
                                    className={`w-full h-9 rounded-xl border pl-7 pr-3 text-xs font-bold outline-none focus:border-emerald-500 transition-colors ${
                                      darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                                    }`}
                                  />
                                </div>

                                <div className="flex items-center justify-between text-[11px] pt-0.5">
                                  <span className={darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}>Direct Referrer gets:</span>
                                  <span className={`font-black ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                                    ₹{directEarning.toLocaleString("en-IN")} {isDirectFlat ? "(Flat)" : `(${draft.direct_value}%)`}
                                  </span>
                                </div>
                              </div>

                              {/* LEVEL 2: LEADERSHIP SPONSOR COMMISSION */}
                              <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                                darkMode ? "bg-[#0B0F17] border-amber-900/40" : "bg-amber-50/70 border-amber-200"
                              }`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                    <span className={`text-xs font-black ${darkMode ? "text-amber-400" : "text-amber-700"}`}>
                                      Tier 2: Leadership Sponsor
                                    </span>
                                  </div>
                                  <div className={`flex items-center gap-1 p-0.5 rounded-full border ${
                                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-amber-100/70 border-amber-200"
                                  }`}>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setCourseCommissionDrafts((prev) => ({
                                          ...prev,
                                          [crs.id]: { ...draft, leadership_type: "percentage" },
                                        }))
                                      }
                                      className={`h-5 px-2 rounded-full text-[10px] font-bold transition cursor-pointer ${
                                        !isLeadFlat
                                          ? "bg-amber-500 text-white shadow-xs"
                                          : darkMode ? "text-[#94A3B8] hover:text-white" : "text-amber-800 hover:text-amber-950"
                                      }`}
                                    >
                                      % Rate
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setCourseCommissionDrafts((prev) => ({
                                          ...prev,
                                          [crs.id]: { ...draft, leadership_type: "flat" },
                                        }))
                                      }
                                      className={`h-5 px-2 rounded-full text-[10px] font-bold transition cursor-pointer ${
                                        isLeadFlat
                                          ? "bg-amber-500 text-white shadow-xs"
                                          : darkMode ? "text-[#94A3B8] hover:text-white" : "text-amber-800 hover:text-amber-950"
                                      }`}
                                    >
                                      ₹ Flat
                                    </button>
                                  </div>
                                </div>

                                <div className="relative">
                                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs ${
                                    darkMode ? "text-gray-400" : "text-slate-400"
                                  }`}>
                                    {isLeadFlat ? "₹" : "%"}
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step={isLeadFlat ? "10" : "1"}
                                    value={draft.leadership_value}
                                    onChange={(e) =>
                                      setCourseCommissionDrafts((prev) => ({
                                        ...prev,
                                        [crs.id]: { ...draft, leadership_value: e.target.value },
                                      }))
                                    }
                                    placeholder={isLeadFlat ? "50" : "5"}
                                    className={`w-full h-9 rounded-xl border pl-7 pr-3 text-xs font-bold outline-none focus:border-amber-500 transition-colors ${
                                      darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                                    }`}
                                  />
                                </div>

                                <div className="flex items-center justify-between text-[11px] pt-0.5">
                                  <span className={darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}>Sponsor gets:</span>
                                  <span className={`font-black ${darkMode ? "text-amber-400" : "text-amber-600"}`}>
                                    ₹{leadEarning.toLocaleString("en-IN")} {isLeadFlat ? "(Flat)" : `(${draft.leadership_value}%)`}
                                  </span>
                                </div>
                              </div>

                              {/* Total Payout Summary */}
                              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                                darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-blue-50/70 border-blue-200"
                              }`}>
                                <span className={`text-[11px] font-bold ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>Total Payout (2-Tiers):</span>
                                <span className="font-black text-[#035BE3]">
                                  ₹{totalPayout.toLocaleString("en-IN")} / sale
                                </span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className={`pt-4 mt-4 border-t ${darkMode ? "border-[#222B3D]" : "border-[#F1F5F9]"}`}>
                              <button
                                type="button"
                                onClick={() => handleSaveCourseCommission(crs.id)}
                                disabled={isSavingThis}
                                className="w-full h-9 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{isSavingThis ? "Saving Rates..." : "Update Course 2-Tier Rate"}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
          
{activeTab === "subadmins" && (
            <div className="space-y-6">
              {/* Header Capsule */}
              <div
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/15 shrink-0">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`text-base sm:text-lg font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                      Sub-Admins & Role-Based Access Control (RBAC)
                    </h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Create staff user accounts with granular module permissions. Sub-Admins only see features they are assigned to.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCreateSubAdminModal(true)}
                  className="px-5 py-2.5 bg-[#035BE3] hover:bg-[#024bc0] text-white rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Sub-Admin</span>
                </button>
              </div>

              {/* Sub-Admins Table */}
              <div
                className={`rounded-[28px] border overflow-hidden transition-colors ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`border-b uppercase text-[10px] tracking-wider ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D] text-[#94A3B8]" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#64748B]"
                      }`}>
                        <th className="py-3.5 px-6 font-bold">Admin Member</th>
                        <th className="py-3.5 px-6 font-bold">Role & Title</th>
                        <th className="py-3.5 px-6 font-bold">Assigned Module Permissions</th>
                        <th className="py-3.5 px-6 font-bold">Status</th>
                        <th className="py-3.5 px-6 font-bold">Created Date</th>
                        <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? "divide-[#1E2638]" : "divide-[#F1F5F9]"}`}>
                      {subAdminsList.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-[#64748B]">
                            <Key className="w-8 h-8 mx-auto text-[#94A3B8] mb-2 opacity-50" />
                            <p className="font-semibold">No Sub-Admins created yet. Click "+ Create Sub-Admin" to grant access.</p>
                          </td>
                        </tr>
                      ) : (
                        subAdminsList.map((sa) => {
                          const isSuper = sa.role === "superadmin";
                          const isActive = sa.is_active !== false && sa.is_active !== 0;
                          const perms = Array.isArray(sa.permissions) ? sa.permissions : [];

                          return (
                            <tr key={sa.id} className={`transition-colors ${darkMode ? "hover:bg-[#1E2638]" : "hover:bg-[#F8FAFD]"}`}>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                                    isSuper ? "bg-linear-to-tr from-amber-500 to-amber-600" : "bg-linear-to-tr from-purple-600 to-indigo-600"
                                  }`}>
                                    {(sa.name || "A")[0]?.toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <p className={`font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                                        {sa.name}
                                      </p>
                                      {isSuper && (
                                        <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase border border-amber-500/20">
                                          Super
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-[#64748B] mt-0.5">{sa.email}</p>
                                  </div>
                                </div>
                              </td>

                              <td className="py-4 px-6">
                                <span className={`font-bold text-xs px-2.5 py-1 rounded-full border ${
                                  isSuper
                                    ? (darkMode ? "bg-amber-950/40 text-amber-400 border-amber-800" : "bg-amber-50 text-amber-700 border-amber-200")
                                    : (darkMode ? "bg-purple-950/40 text-purple-400 border-purple-800" : "bg-purple-50 text-purple-700 border-purple-200")
                                }`}>
                                  {sa.role_title || (isSuper ? "Super Administrator" : "Staff Member")}
                                </span>
                              </td>

                              <td className="py-4 px-6">
                                {isSuper ? (
                                  <span className={`font-bold text-[11px] ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                                    👑 Full Unrestricted Access (All Modules)
                                  </span>
                                ) : perms.length === 0 ? (
                                  <span className="text-[11px] text-red-500 font-semibold">No permissions assigned</span>
                                ) : (
                                  <div className="flex flex-wrap gap-1.5 max-w-md">
                                    {perms.map((pKey) => {
                                      const mod = (availableModulesList || DEFAULT_ADMIN_MODULES).find((m) => m.id === pKey);
                                      return (
                                        <span
                                          key={pKey}
                                          className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] border ${
                                            darkMode
                                              ? "bg-blue-950/50 text-blue-400 border-blue-900"
                                              : "bg-blue-50 text-[#035BE3] border-blue-200"
                                          }`}
                                        >
                                          {mod ? mod.name.split(" ")[0] : pKey}
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                              </td>

                              <td className="py-4 px-6">
                                {isSuper ? (
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                    darkMode ? "bg-emerald-950/50 text-emerald-400 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  }`}>
                                    Always Active
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleToggleSubAdminStatus(sa)}
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                                      isActive
                                        ? (darkMode ? "bg-emerald-950/50 text-emerald-400 border-emerald-800 hover:bg-emerald-900/60" : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100")
                                        : (darkMode ? "bg-red-950/50 text-red-400 border-red-800 hover:bg-red-900/60" : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100")
                                    }`}
                                  >
                                    {isActive ? "🟢 Active" : "🔴 Deactivated"}
                                  </button>
                                )}
                              </td>

                              <td className={`py-4 px-6 text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                                {sa.created_at ? new Date(sa.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                              </td>

                              <td className="py-4 px-6 text-right">
                                {!isSuper ? (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => setEditingSubAdmin({ ...sa, new_password: "" })}
                                      className={`p-1.5 rounded-full transition cursor-pointer ${
                                        darkMode ? "hover:bg-[#1E2638] text-[#94A3B8] hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-[#035BE3]"
                                      }`}
                                      title="Edit Permissions & Details"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSubAdmin(sa.id)}
                                      className={`p-1.5 rounded-full transition cursor-pointer ${
                                        darkMode ? "hover:bg-red-950/40 text-gray-400 hover:text-red-400" : "hover:bg-red-50 text-slate-400 hover:text-red-600"
                                      }`}
                                      title="Delete Sub-Admin"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <span className={`text-[11px] font-bold ${darkMode ? "text-[#94A3B8]" : "text-slate-400"}`}>Owner</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 9: ACTIVITY & AUDIT HISTORY LOGS */}
          {/* ======================================================== */}
          {activeTab === "history" && (
            <div className="space-y-6">
              {/* Header Capsule */}
              <div
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 text-[#035BE3] flex items-center justify-center border border-blue-500/15 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`text-base sm:text-lg font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                      Activity & Audit History Logs
                    </h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Complete real-time timeline of all admin changes, user registrations, course/package sales, and affiliate payouts.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={activityLogFilter}
                    onChange={(e) => setActivityLogFilter(e.target.value)}
                    className={`h-9 px-3 rounded-full text-xs font-semibold border outline-none cursor-pointer ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  >
                    <option value="all">All Activity Categories</option>
                    <option value="admin">Staff & Admin (RBAC)</option>
                    <option value="auth">User Signups & Auth</option>
                    <option value="payment">Purchases & Orders</option>
                    <option value="affiliate">Affiliate & Payouts</option>
                    <option value="course">Courses & Content</option>
                    <option value="package">Skill Packages</option>
                    <option value="security">Video Security</option>
                  </select>

                  <button
                    onClick={fetchActivityLogs}
                    className="p-2 bg-[#035BE3] hover:bg-[#024bc0] text-white rounded-full transition cursor-pointer shadow-xs shrink-0"
                    title="Refresh Logs"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Logs Table */}
              <div
                className={`rounded-[28px] border overflow-hidden transition-colors ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`border-b uppercase text-[10px] tracking-wider ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D] text-[#94A3B8]" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#64748B]"
                      }`}>
                        <th className="py-3.5 px-6 font-bold">Timestamp</th>
                        <th className="py-3.5 px-6 font-bold">Category</th>
                        <th className="py-3.5 px-6 font-bold">Action</th>
                        <th className="py-3.5 px-6 font-bold">Performed By / Actor</th>
                        <th className="py-3.5 px-6 font-bold">Details</th>
                        <th className="py-3.5 px-6 font-bold text-right">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? "divide-[#1E2638]" : "divide-[#F1F5F9]"}`}>
                      {activityLogsList.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-[#64748B]">
                            <Clock className="w-8 h-8 mx-auto text-[#94A3B8] mb-2 opacity-50" />
                            <p className="font-semibold">No activity history recorded for this filter.</p>
                          </td>
                        </tr>
                      ) : (
                        activityLogsList
                          .filter((log) => activityLogFilter === "all" || log.category === activityLogFilter)
                          .map((log) => {
                            const catColors = {
                              admin: darkMode ? "bg-purple-950/50 text-purple-400 border-purple-900" : "bg-purple-50 text-purple-700 border-purple-200",
                              auth: darkMode ? "bg-blue-950/50 text-blue-400 border-blue-900" : "bg-blue-50 text-[#035BE3] border-blue-200",
                              payment: darkMode ? "bg-emerald-950/50 text-emerald-400 border-emerald-900" : "bg-emerald-50 text-emerald-700 border-emerald-200",
                              affiliate: darkMode ? "bg-amber-950/50 text-amber-400 border-amber-900" : "bg-amber-50 text-amber-700 border-amber-200",
                              course: darkMode ? "bg-indigo-950/50 text-indigo-400 border-indigo-900" : "bg-indigo-50 text-indigo-700 border-indigo-200",
                              package: darkMode ? "bg-sky-950/50 text-sky-400 border-sky-900" : "bg-sky-50 text-sky-700 border-sky-200",
                              security: darkMode ? "bg-rose-950/50 text-rose-400 border-rose-900" : "bg-rose-50 text-rose-700 border-rose-200",
                            };
                            return (
                              <tr key={log.id} className={`transition-colors ${darkMode ? "hover:bg-[#1E2638]" : "hover:bg-[#F8FAFD]"}`}>
                                <td className={`py-4 px-6 font-mono text-[11px] whitespace-nowrap ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                                  {log.created_at ? new Date(log.created_at).toLocaleString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  }) : "—"}
                                </td>

                                <td className="py-4 px-6">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${catColors[log.category] || (darkMode ? "bg-gray-800 text-gray-300 border-gray-700" : "bg-gray-100 text-gray-700 border-gray-200")}`}>
                                    {log.category}
                                  </span>
                                </td>

                                <td className="py-4 px-6 font-bold">
                                  <span className={`font-mono text-xs ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                                    {log.action}
                                  </span>
                                </td>

                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center font-bold text-[10px]">
                                      {(log.admin_name || "S")[0]?.toUpperCase()}
                                    </div>
                                    <span className={`font-semibold text-xs ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                                      {log.admin_name || "System Process"}
                                    </span>
                                  </div>
                                </td>

                                <td className="py-4 px-6">
                                  <p className={`text-xs ${darkMode ? "text-gray-300" : "text-[#0F172A]"}`}>
                                    {log.details}
                                  </p>
                                </td>

                                <td className={`py-4 px-6 text-right font-mono text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                                  {log.ip_address || "127.0.0.1"}
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: CUSTOM PAGES & LEGAL POLICIES CMS */}
          {/* ======================================================== */}
          {activeTab === "pages" && (
            <div className="space-y-6">
              {/* Header Capsule */}
              <div
                className={`rounded-full px-6 sm:px-8 py-4 sm:py-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 text-[#035BE3] flex items-center justify-center border border-blue-500/15 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`text-base sm:text-lg font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                      Pages & Legal Policies (CMS)
                    </h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                      Create and manage Privacy Policy, Terms, Refund Policy, and custom public pages.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleOpenCreatePageModal}
                  className="px-5 py-2.5 bg-[#035BE3] hover:bg-[#024bc0] text-white rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Page</span>
                </button>
              </div>

              {/* Pages Table */}
              <div
                className={`rounded-[28px] border overflow-hidden transition-colors ${
                  darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`border-b uppercase text-[10px] tracking-wider ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D] text-[#94A3B8]" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#64748B]"
                      }`}>
                        <th className="py-3.5 px-6 font-bold">Page Title</th>
                        <th className="py-3.5 px-6 font-bold">URL Slug</th>
                        <th className="py-3.5 px-6 font-bold">Category</th>
                        <th className="py-3.5 px-6 font-bold">Status</th>
                        <th className="py-3.5 px-6 font-bold">Footer Link</th>
                        <th className="py-3.5 px-6 font-bold">Last Updated</th>
                        <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? "divide-[#1E2638]" : "divide-[#F1F5F9]"}`}>
                      {adminPagesList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-[#64748B]">
                            <FileText className="w-8 h-8 mx-auto text-[#94A3B8] mb-2 opacity-50" />
                            <p className="font-semibold">No custom pages found. Click "+ Create New Page" to publish one.</p>
                          </td>
                        </tr>
                      ) : (
                        adminPagesList.map((p) => (
                          <tr key={p.id} className={`transition-colors ${darkMode ? "hover:bg-[#1E2638]" : "hover:bg-[#F8FAFD]"}`}>
                            <td className="py-4 px-6 font-bold">
                              <span className={`${darkMode ? "text-white" : "text-[#0F172A]"}`}>{p.title}</span>
                            </td>

                            <td className="py-4 px-6 font-mono text-[11px] text-[#035BE3]">
                              /page/{p.slug}
                            </td>

                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                p.footer_category === "legal"
                                  ? (darkMode ? "bg-purple-950/50 text-purple-400 border-purple-900" : "bg-purple-50 text-purple-700 border-purple-200")
                                  : (darkMode ? "bg-blue-950/50 text-blue-400 border-blue-900" : "bg-blue-50 text-[#035BE3] border-blue-200")
                              }`}>
                                {p.footer_category || "legal"}
                              </span>
                            </td>

                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                p.is_published
                                  ? (darkMode ? "bg-emerald-950/50 text-emerald-400 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-200")
                                  : (darkMode ? "bg-amber-950/50 text-amber-400 border-amber-800" : "bg-amber-50 text-amber-700 border-amber-200")
                              }`}>
                                {p.is_published ? "Published" : "Draft"}
                              </span>
                            </td>

                            <td className="py-4 px-6">
                              <span className={`text-xs ${p.show_in_footer ? "text-emerald-600 font-bold" : "text-gray-400"}`}>
                                {p.show_in_footer ? "✓ Visible in Footer" : "— Hidden"}
                              </span>
                            </td>

                            <td className={`py-4 px-6 text-[11px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
                              {p.updated_at ? new Date(p.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                            </td>

                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  to={`/page/${p.slug}`}
                                  target="_blank"
                                  className={`p-1.5 rounded-full transition cursor-pointer ${
                                    darkMode ? "hover:bg-[#1E2638] text-[#94A3B8] hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-[#035BE3]"
                                  }`}
                                  title="Live Preview Page"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => handleOpenEditPageModal(p)}
                                  className={`p-1.5 rounded-full transition cursor-pointer ${
                                    darkMode ? "hover:bg-[#1E2638] text-[#94A3B8] hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-[#035BE3]"
                                  }`}
                                  title="Edit Page Content"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePage(p.id, p.title)}
                                  className={`p-1.5 rounded-full transition cursor-pointer ${
                                    darkMode ? "hover:bg-red-950/40 text-gray-400 hover:text-red-400" : "hover:bg-red-50 text-slate-400 hover:text-red-600"
                                  }`}
                                  title="Delete Page"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {activeTab === "videosecurity" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Top Banner / Header */}
              <div
                className={`p-6 sm:p-8 rounded-[32px] border relative overflow-hidden ${
                  darkMode
                    ? "bg-[#131926] border-[#222B3D] text-white"
                    : "bg-white border-slate-200/90 text-slate-900 shadow-sm"
                }`}
              >
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#035BE3] text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Enterprise Anti-Piracy & DRM Engine</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                      Video Security & Digital Rights Management
                    </h2>
                    <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                      Configure multi-layered video piracy protection, dynamic moving user watermarks, screen recording blur triggers, and DevTools lockout across all student course players.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      onClick={fetchDashboardData}
                      className={`h-11 px-4 rounded-full border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        darkMode
                          ? "border-[#222B3D] bg-[#131926] text-white hover:bg-[#1A2234]"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 shadow-xs"
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                      <span>Refresh</span>
                    </button>
                    <button
                      onClick={handleSaveVideoSecurity}
                      disabled={savingVideoSecurity}
                      className="h-11 px-6 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-black transition flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
                    >
                      {savingVideoSecurity ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span>{savingVideoSecurity ? "Saving Settings..." : "Save DRM Settings"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid: Settings Columns + Live Interactive Simulator */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left 7 Cols: Security Toggles & Rules */}
                <div className="lg:col-span-7 space-y-6">

                  {/* Level 1: Dynamic Moving Watermark */}
                  <div
                    className={`p-6 rounded-[28px] border transition ${
                      darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-slate-200/90 text-slate-900 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-inherit">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-[#035BE3] flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm sm:text-base">Level 1: Dynamic Moving Watermark</h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-[#035BE3]">
                              Visual Leak Defense
                            </span>
                          </div>
                          <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                            Floats the logged-in student's Name, Email & ID at random screen positions to prevent screen record distribution.
                          </p>
                        </div>
                      </div>

                      {/* Master Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={videoSecuritySettings?.enable_moving_watermark === "true" || videoSecuritySettings?.enable_moving_watermark === true}
                          onChange={(e) =>
                            setVideoSecuritySettings((prev) => ({
                              ...prev,
                              enable_moving_watermark: e.target.checked ? "true" : "false",
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#035BE3]"></div>
                      </label>
                    </div>

                    <div className="pt-5 space-y-4">
                      {/* Watermark Opacity Slider */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className={darkMode ? "text-slate-400" : "text-slate-600"}>Watermark Transparency / Opacity</span>
                          <span className="text-[#035BE3]">{videoSecuritySettings?.watermark_opacity || 25}%</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="90"
                          step="5"
                          value={videoSecuritySettings?.watermark_opacity || 25}
                          onChange={(e) =>
                            setVideoSecuritySettings((prev) => ({
                              ...prev,
                              watermark_opacity: e.target.value,
                            }))
                          }
                          className="w-full accent-[#035BE3] cursor-pointer"
                        />
                        <div className={`flex justify-between text-[10px] ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                          <span>5% (Very Subtle)</span>
                          <span>25% (Recommended)</span>
                          <span>90% (Bold Visible)</span>
                        </div>
                      </div>

                      {/* Watermark Interval (Jump Speed) */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className={darkMode ? "text-slate-400" : "text-slate-600"}>Movement Interval (Position Hop)</span>
                          <span className="text-[#035BE3]">{videoSecuritySettings?.watermark_interval || 8} seconds</span>
                        </div>
                        <input
                          type="range"
                          min="3"
                          max="25"
                          step="1"
                          value={videoSecuritySettings?.watermark_interval || 8}
                          onChange={(e) =>
                            setVideoSecuritySettings((prev) => ({
                              ...prev,
                              watermark_interval: e.target.value,
                            }))
                          }
                          className="w-full accent-[#035BE3] cursor-pointer"
                        />
                        <div className={`flex justify-between text-[10px] ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                          <span>3s (Rapid Hop)</span>
                          <span>8s (Balanced)</span>
                          <span>25s (Slow Shift)</span>
                        </div>
                      </div>

                      {/* Display Data Elements */}
                      <div className="pt-2 space-y-2">
                        <span className={`text-xs font-bold ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Included Floating Metadata:</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { key: "watermark_show_name", label: "Student Name" },
                            { key: "watermark_show_student_id", label: "KW Student ID" },
                            { key: "watermark_show_email", label: "Email Address" },
                            { key: "watermark_show_timestamp", label: "Timestamp" },
                          ].map((item) => {
                            const isChecked =
                              videoSecuritySettings?.[item.key] === "true" ||
                              videoSecuritySettings?.[item.key] === true;
                            return (
                              <label
                                key={item.key}
                                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                                  isChecked
                                    ? "border-[#035BE3] bg-blue-500/10 text-[#035BE3]"
                                    : darkMode
                                    ? "border-[#222B3D] text-slate-400 hover:bg-[#1A2234]"
                                    : "border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) =>
                                    setVideoSecuritySettings((prev) => ({
                                      ...prev,
                                      [item.key]: e.target.checked ? "true" : "false",
                                    }))
                                  }
                                  className="rounded text-[#035BE3] accent-[#035BE3]"
                                />
                                <span>{item.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom Warning Label */}
                      <div className="pt-2 space-y-1.5">
                        <label className={`text-xs font-bold ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Custom Security Watermark Banner Text</label>
                        <input
                          type="text"
                          value={videoSecuritySettings?.custom_warning_text || ""}
                          onChange={(e) =>
                            setVideoSecuritySettings((prev) => ({
                              ...prev,
                              custom_warning_text: e.target.value,
                            }))
                          }
                          placeholder="Restricted Content • Do Not Distribute"
                          className={`w-full h-10 px-4 rounded-xl border text-xs font-bold outline-none focus:border-[#035BE3] ${
                            darkMode
                              ? "bg-[#0B0F17] border-[#222B3D] text-white"
                              : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-xs"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Level 2: DevTools & Inspect Lockout Shield */}
                  <div
                    className={`p-6 rounded-[28px] border transition ${
                      darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-slate-200/90 text-slate-900 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm sm:text-base">Level 2: DevTools & Inspect Lockout</h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-500">
                              Code & Source Shield
                            </span>
                          </div>
                          <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                            Disables Right-Click context menus, F12 developer console, Ctrl+Shift+I, Ctrl+U page source, and disables HTML5 video download buttons.
                          </p>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={videoSecuritySettings?.enable_devtools_shield === "true" || videoSecuritySettings?.enable_devtools_shield === true}
                          onChange={(e) =>
                            setVideoSecuritySettings((prev) => ({
                              ...prev,
                              enable_devtools_shield: e.target.checked ? "true" : "false",
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-inherit text-xs">
                      <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                        darkMode ? "bg-gray-800/40 border-gray-700/50 text-slate-300" : "bg-slate-50 border-slate-200/70 text-slate-700"
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="font-semibold text-[11px]">F12 & Shortcuts Blocked</span>
                      </div>
                      <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                        darkMode ? "bg-gray-800/40 border-gray-700/50 text-slate-300" : "bg-slate-50 border-slate-200/70 text-slate-700"
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="font-semibold text-[11px]">Right-Click Disabled</span>
                      </div>
                      <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                        darkMode ? "bg-gray-800/40 border-gray-700/50 text-slate-300" : "bg-slate-50 border-slate-200/70 text-slate-700"
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="font-semibold text-[11px]">nodownload Enforced</span>
                      </div>
                    </div>
                  </div>

                  {/* Level 3: Screen Capture & Blur Blocker */}
                  <div
                    className={`p-6 rounded-[28px] border transition ${
                      darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-slate-200/90 text-slate-900 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                          <EyeOff className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm sm:text-base">Level 3: Screen Recorder & Unfocus Blur Shield</h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500/10 text-red-500">
                              Real-Time Obfuscation
                            </span>
                          </div>
                          <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                            Automatically blurs the video player if the student tabs away, launches screen recorder software, or attempts PrintScreen screenshots.
                          </p>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={videoSecuritySettings?.enable_screen_capture_protection === "true" || videoSecuritySettings?.enable_screen_capture_protection === true}
                          onChange={(e) =>
                            setVideoSecuritySettings((prev) => ({
                              ...prev,
                              enable_screen_capture_protection: e.target.checked ? "true" : "false",
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-inherit text-xs">
                      <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                        darkMode ? "bg-gray-800/40 border-gray-700/50 text-slate-300" : "bg-slate-50 border-slate-200/70 text-slate-700"
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="font-semibold text-[11px]">Auto-Blur on Window Inactivity/Unfocus</span>
                      </div>
                      <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                        darkMode ? "bg-gray-800/40 border-gray-700/50 text-slate-300" : "bg-slate-50 border-slate-200/70 text-slate-700"
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="font-semibold text-[11px]">PrintScreen Key Cleared & Blocked</span>
                      </div>
                    </div>
                  </div>

                  {/* Level 4: Stream DRM & Tokenized HLS */}
                  <div
                    className={`p-6 rounded-[28px] border transition ${
                      darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-slate-200/90 text-slate-900 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm sm:text-base">Level 4: Tokenized Stream & DRM Guard</h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/10 text-purple-500">
                              Enterprise DRM
                            </span>
                          </div>
                          <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                            Enforces temporary expiring signed playback URLs and HLS chunk verification to prevent direct file scraping.
                          </p>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={videoSecuritySettings?.enable_hls_stream_security === "true" || videoSecuritySettings?.enable_hls_stream_security === true}
                          onChange={(e) =>
                            setVideoSecuritySettings((prev) => ({
                              ...prev,
                              enable_hls_stream_security: e.target.checked ? "true" : "false",
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>

                </div>

                {/* Right 5 Cols: Interactive Live Preview Simulator */}
                <div className="lg:col-span-5 space-y-6">
                  <div
                    className={`p-6 rounded-[28px] border sticky top-24 transition ${
                      darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-slate-200/90 text-slate-900 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-inherit">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-[#035BE3]" />
                        <h3 className="font-bold text-sm">Live Student Player Simulator</h3>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                        Real-Time
                      </span>
                    </div>

                    <p className={`text-xs my-3 leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                      This preview updates instantaneously when you toggle settings on the left. Notice how watermark opacity, student tags, and blur behave on the student screen.
                    </p>

                    {/* Simulated Player Box */}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner flex flex-col justify-between p-4">
                      
                      {/* Video Background Mockup */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xs">
                          <Play className="w-8 h-8 text-white fill-white ml-1" />
                        </div>
                      </div>

                      {/* Header bar mock */}
                      <div className="relative z-10 flex items-center justify-between text-[11px] text-white/70">
                        <span className="font-semibold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                          Lesson 04: Advanced Funnel Optimization
                        </span>
                        <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-md border border-white/10">
                          1080p HD
                        </span>
                      </div>

                      {/* Moving Dynamic Watermark Simulator */}
                      {(videoSecuritySettings?.enable_moving_watermark === "true" || videoSecuritySettings?.enable_moving_watermark === true) && (
                        <div
                          className="absolute pointer-events-none select-none transition-all duration-1000 ease-in-out"
                          style={{
                            top: "35%",
                            left: "25%",
                            opacity: (Number(videoSecuritySettings?.watermark_opacity) || 25) / 100,
                          }}
                        >
                          <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-xs text-white border border-white/20 shadow-2xl text-[10px] font-mono leading-tight space-y-0.5">
                            {(videoSecuritySettings?.watermark_show_name === "true" || videoSecuritySettings?.watermark_show_name === true) && (
                              <p className="font-black text-amber-300">Aman Sharma</p>
                            )}
                            {(videoSecuritySettings?.watermark_show_student_id === "true" || videoSecuritySettings?.watermark_show_student_id === true) && (
                              <p className="text-cyan-300 font-bold">KW1042 • Verified Student</p>
                            )}
                            {(videoSecuritySettings?.watermark_show_email === "true" || videoSecuritySettings?.watermark_show_email === true) && (
                              <p className="text-white/80">aman.sharma@example.com</p>
                            )}
                            {(videoSecuritySettings?.watermark_show_timestamp === "true" || videoSecuritySettings?.watermark_show_timestamp === true) && (
                              <p className="text-[9px] text-gray-400">UTC: 2026-10-09 14:32</p>
                            )}
                            {videoSecuritySettings?.custom_warning_text && (
                              <p className="text-[8px] text-red-400 tracking-wider uppercase font-bold pt-0.5">
                                {videoSecuritySettings?.custom_warning_text}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Screen Recorder Blur Trigger Simulation Overlay */}
                      {previewSimulateBlur && (
                        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-20 flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-150">
                          <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mb-2">
                            <EyeOff className="w-6 h-6" />
                          </div>
                          <h4 className="text-xs font-black text-white">Screen Recording / Capture Protected</h4>
                          <p className="text-[10px] text-gray-400 max-w-xs mt-1">
                            Playback is masked while screen recording or unfocused window is active.
                          </p>
                        </div>
                      )}

                      {/* Bottom control bar mockup */}
                      <div className="relative z-10 flex items-center justify-between text-[10px] text-white/60 pt-2">
                        <span>04:12 / 18:40</span>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[9px]">
                            DRM Protected
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Test Blur Simulator Button */}
                    <div className="pt-4 space-y-3">
                      <button
                        type="button"
                        onClick={() => setPreviewSimulateBlur((prev) => !prev)}
                        className={`w-full h-10 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                          previewSimulateBlur
                            ? "bg-red-500 text-white border-red-500 shadow-xs"
                            : darkMode
                            ? "bg-[#0B0F17] border-[#222B3D] text-white hover:bg-[#1A2234]"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>
                          {previewSimulateBlur ? "Disable Blur Simulation" : "Simulate Screen Capture Trigger"}
                        </span>
                      </button>

                      <div className={`p-3.5 rounded-xl border text-[11px] space-y-1.5 ${
                        darkMode
                          ? "bg-blue-950/20 border-blue-900/40 text-blue-200/70"
                          : "bg-blue-50/70 border-blue-100 text-slate-600"
                      }`}>
                        <p className="font-bold text-[#035BE3] dark:text-blue-400">Shield Status Overview:</p>
                        <p>• Watermark: <strong className={darkMode ? "text-white" : "text-slate-900"}>{videoSecuritySettings?.enable_moving_watermark === "true" || videoSecuritySettings?.enable_moving_watermark === true ? "ACTIVE" : "DISABLED"}</strong></p>
                        <p>• DevTools Block: <strong className={darkMode ? "text-white" : "text-slate-900"}>{videoSecuritySettings?.enable_devtools_shield === "true" || videoSecuritySettings?.enable_devtools_shield === true ? "ACTIVE" : "DISABLED"}</strong></p>
                        <p>• Capture Blur: <strong className={darkMode ? "text-white" : "text-slate-900"}>{videoSecuritySettings?.enable_screen_capture_protection === "true" || videoSecuritySettings?.enable_screen_capture_protection === true ? "ACTIVE" : "DISABLED"}</strong></p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL: PAYOUT ACTION APPROVE / REJECT MODAL */}
      {/* ======================================================== */}
      {payoutActionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`rounded-[32px] max-w-lg w-full p-6 sm:p-8 border shadow-2xl animate-in zoom-in-95 duration-150 ${
              darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  payoutActionModal.actionType === "approve"
                    ? "bg-emerald-500/15 text-emerald-600"
                    : "bg-red-500/15 text-red-600"
                }`}>
                  {payoutActionModal.actionType === "approve" ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    {payoutActionModal.actionType === "approve" ? "Approve Payout & Mark Paid" : "Reject Payout Request"}
                  </h3>
                  <p className="text-xs text-[#64748B]">Payout Request #{payoutActionModal.payout?.id}</p>
                </div>
              </div>
              <button
                onClick={() => setPayoutActionModal(null)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payout Details Card */}
            <div className={`p-4 rounded-2xl border my-5 space-y-2.5 ${
              darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">Student Partner:</span>
                <span className="text-xs font-bold">{payoutActionModal.payout?.user_name} ({payoutActionModal.payout?.student_id || payoutActionModal.payout?.user_email})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">Withdrawal Amount:</span>
                <span className="text-base font-black text-emerald-500">₹{Number(payoutActionModal.payout?.amount || 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-inherit">
                <span className="text-xs text-[#64748B]">Destination:</span>
                <span className="text-xs font-bold">
                  {payoutActionModal.payout?.payout_method === "upi"
                    ? `UPI: ${payoutActionModal.payout?.upi_id}`
                    : `Bank A/C: ${payoutActionModal.payout?.account_number} (${payoutActionModal.payout?.bank_name})`}
                </span>
              </div>
            </div>

            <form onSubmit={handleUpdatePayoutStatus} className="space-y-4">
              {payoutActionModal.actionType === "approve" ? (
                <>
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Bank / UPI Transaction UTR / Reference ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. UTR194829384918 or UPI/392849204"
                      value={payoutUtrNumber}
                      onChange={(e) => setPayoutUtrNumber(e.target.value)}
                      className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] font-mono ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                      }`}
                    />
                    <p className="text-[10.5px] text-[#64748B] mt-1">
                      The UTR will be visible to the student on their affiliate earnings dashboard.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Admin Note (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Transferred via IMPS / HDFC UPI"
                      value={payoutAdminNote}
                      onChange={(e) => setPayoutAdminNote(e.target.value)}
                      className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                      }`}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs">
                    ⚠️ Rejecting this request will automatically return <strong>₹{Number(payoutActionModal.payout?.amount || 0).toLocaleString("en-IN")}</strong> back into {payoutActionModal.payout?.user_name}&apos;s wallet balance.
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Rejection Reason *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Invalid UPI ID / Bank IFSC code error. Please update your payout info."
                      value={payoutAdminNote}
                      onChange={(e) => setPayoutAdminNote(e.target.value)}
                      className={`w-full rounded-2xl border px-4 py-2.5 text-xs outline-none focus:border-[#035BE3] resize-none ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                      }`}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setPayoutActionModal(null)}
                  className="flex-1 py-2.5 rounded-full border text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPayout}
                  className={`flex-1 py-2.5 rounded-full text-white text-xs font-bold transition cursor-pointer shadow-xs ${
                    payoutActionModal.actionType === "approve"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isProcessingPayout
                    ? "Updating..."
                    : payoutActionModal.actionType === "approve"
                    ? "Confirm & Mark Paid"
                    : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ADD MENTOR POPUP */}
      {/* ======================================================== */}
      
      {/* ======================================================== */}
      {/* MODAL: CREATE SUB-ADMIN (RBAC PERMISSIONS) */}
      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* MODAL: CREATE / EDIT CUSTOM POLICY PAGE */}
      {/* ======================================================== */}
      {showPageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-2xl rounded-[32px] border p-6 sm:p-8 flex flex-col max-h-[90vh] shadow-2xl transition-colors ${
              darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-inherit shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 text-[#035BE3] flex items-center justify-center font-bold text-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    {editingPage ? `Edit '${editingPage.title}'` : "Create New Website Page"}
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Publish policy guidelines, terms of service, or public landing docs.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPageModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer text-[#94A3B8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePage} className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">Page Title *</label>
                  <input
                    type="text"
                    required
                    value={pageFormData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                      setPageFormData({ ...pageFormData, title, slug: editingPage ? pageFormData.slug : autoSlug });
                    }}
                    placeholder="e.g. Refund & Cancellation Policy"
                    className={`w-full h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">URL Slug *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] font-mono">/page/</span>
                    <input
                      type="text"
                      required
                      value={pageFormData.slug}
                      onChange={(e) => setPageFormData({ ...pageFormData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]+/g, "") })}
                      placeholder="refund-policy"
                      className={`w-full h-10 rounded-xl border pl-16 pr-3 text-xs font-mono font-semibold outline-none focus:border-[#035BE3] ${
                        darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">Footer Category</label>
                  <select
                    value={pageFormData.footer_category}
                    onChange={(e) => setPageFormData({ ...pageFormData, footer_category: e.target.value })}
                    className={`w-full h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:border-[#035BE3] cursor-pointer ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  >
                    <option value="legal">Legal & Policy (Privacy, Terms, Refund)</option>
                    <option value="quick_links">Quick Explore Links</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    value={pageFormData.sort_order}
                    onChange={(e) => setPageFormData({ ...pageFormData, sort_order: Number(e.target.value) })}
                    className={`w-full h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">Meta Description (SEO)</label>
                <input
                  type="text"
                  value={pageFormData.meta_description}
                  onChange={(e) => setPageFormData({ ...pageFormData, meta_description: e.target.value })}
                  placeholder="Brief summary of this policy for learners and search engines..."
                  className={`w-full h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:border-[#035BE3] ${
                    darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                  }`}
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={pageFormData.is_published}
                    onChange={(e) => setPageFormData({ ...pageFormData, is_published: e.target.checked })}
                    className="w-4 h-4 rounded text-[#035BE3] cursor-pointer"
                  />
                  <span>Published Live</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={pageFormData.show_in_footer}
                    onChange={(e) => setPageFormData({ ...pageFormData, show_in_footer: e.target.checked })}
                    className="w-4 h-4 rounded text-[#035BE3] cursor-pointer"
                  />
                  <span>Display in Website Footer</span>
                </label>
              </div>

              {/* Rich Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold">Page Content (HTML / Formatted Text) *</label>
                  <span className="text-[10.5px] text-[#64748B]">Accepts standard HTML tags (&lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;)</span>
                </div>
                <textarea
                  rows={10}
                  required
                  value={pageFormData.content}
                  onChange={(e) => setPageFormData({ ...pageFormData, content: e.target.value })}
                  placeholder="<h2>1. Overview</h2><p>Content goes here...</p>"
                  className={`w-full rounded-2xl border p-3.5 text-xs font-mono font-medium outline-none focus:border-[#035BE3] ${
                    darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                  }`}
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-inherit flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowPageModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-[#64748B] hover:text-[#0F172A] dark:hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPage}
                  className="px-6 py-2.5 bg-[#035BE3] hover:bg-[#024bc0] text-white rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isProcessingPage ? "Publishing..." : editingPage ? "Update Page" : "Publish Page"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT MENTOR DETAILS */}
      {/* ======================================================== */}
      {editingMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-lg rounded-[32px] border p-6 sm:p-8 flex flex-col max-h-[90vh] shadow-2xl transition-colors ${
              darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-inherit shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 text-[#035BE3] flex items-center justify-center font-bold text-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Edit Mentor Profile</h3>
                  <p className="text-[11px] text-[#64748B]">Update bio, photo, badge & social links.</p>
                </div>
              </div>
              <button
                onClick={() => setEditingMentor(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer text-[#94A3B8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMentorEdit} className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">Mentor Name *</label>
                  <input
                    type="text"
                    required
                    value={editingMentor.name || ""}
                    onChange={(e) => setEditingMentor({ ...editingMentor, name: e.target.value })}
                    className={`w-full h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">Role / Designation *</label>
                  <input
                    type="text"
                    required
                    value={editingMentor.role_title || ""}
                    onChange={(e) => setEditingMentor({ ...editingMentor, role_title: e.target.value })}
                    placeholder="e.g. Digital Skills Mentor"
                    className={`w-full h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">Photo URL</label>
                <input
                  type="text"
                  value={editingMentor.photo_url || ""}
                  onChange={(e) => setEditingMentor({ ...editingMentor, photo_url: e.target.value })}
                  placeholder="https://..."
                  className={`w-full h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:border-[#035BE3] ${
                    darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">Experience Badge</label>
                  <input
                    type="text"
                    value={editingMentor.experience_badge || ""}
                    onChange={(e) => setEditingMentor({ ...editingMentor, experience_badge: e.target.value })}
                    placeholder="e.g. Senior Mentor"
                    className={`w-full h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">Expertise Tags</label>
                  <input
                    type="text"
                    value={editingMentor.expertise || ""}
                    onChange={(e) => setEditingMentor({ ...editingMentor, expertise: e.target.value })}
                    placeholder="e.g. AI Tools, Video Editing"
                    className={`w-full h-10 rounded-xl border px-3 text-xs font-semibold outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">Bio & Description</label>
                <textarea
                  rows={3}
                  value={editingMentor.bio || ""}
                  onChange={(e) => setEditingMentor({ ...editingMentor, bio: e.target.value })}
                  className={`w-full rounded-xl border p-3 text-xs font-medium outline-none focus:border-[#035BE3] ${
                    darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold mb-1 text-[#64748B]">LinkedIn URL</label>
                  <input
                    type="text"
                    value={editingMentor.social_linkedin || ""}
                    onChange={(e) => setEditingMentor({ ...editingMentor, social_linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className={`w-full h-9 rounded-xl border px-3 text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold mb-1 text-[#64748B]">Instagram URL</label>
                  <input
                    type="text"
                    value={editingMentor.social_instagram || ""}
                    onChange={(e) => setEditingMentor({ ...editingMentor, social_instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className={`w-full h-9 rounded-xl border px-3 text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-inherit flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingMentor(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-[#64748B] hover:text-[#0F172A] dark:hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingMentor}
                  className="px-6 py-2.5 bg-[#035BE3] hover:bg-[#024bc0] text-white rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isProcessingMentor ? "Saving..." : "Save Mentor Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateSubAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`rounded-[32px] max-w-xl w-full p-6 sm:p-8 border shadow-2xl animate-in zoom-in-95 duration-150 ${
              darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-purple-500/15 text-purple-600 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Create New Sub-Admin</h3>
                  <p className="text-xs text-[#64748B]">Assign credentials and selective module permissions</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateSubAdminModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubAdmin} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={newSubAdminData.name}
                    onChange={(e) => setNewSubAdminData({ ...newSubAdminData, name: e.target.value })}
                    className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Role Title / Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Course Manager, Support Lead"
                    value={newSubAdminData.role_title}
                    onChange={(e) => setNewSubAdminData({ ...newSubAdminData, role_title: e.target.value })}
                    className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Login Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="subadmin@knowway.com"
                    value={newSubAdminData.email}
                    onChange={(e) => setNewSubAdminData({ ...newSubAdminData, email: e.target.value })}
                    className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newSubAdminData.password}
                    onChange={(e) => setNewSubAdminData({ ...newSubAdminData, password: e.target.value })}
                    className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  />
                </div>
              </div>

              {/* Dynamic Module Permissions Checkboxes */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#8A99AD]">
                    Select Module Permissions
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const allKeys = availableModulesList.map((m) => m.id);
                      const isAll = newSubAdminData.permissions.length === allKeys.length;
                      setNewSubAdminData({
                        ...newSubAdminData,
                        permissions: isAll ? [] : allKeys,
                      });
                    }}
                    className="text-[11px] font-bold text-[#035BE3] hover:underline cursor-pointer"
                  >
                    {newSubAdminData.permissions.length === availableModulesList.length ? "Deselect All" : "Select All Modules"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 scrollbar-thin">
                  {(availableModulesList && availableModulesList.length > 0 ? availableModulesList : DEFAULT_ADMIN_MODULES).map((mod) => {
                    const isChecked = newSubAdminData.permissions.includes(mod.id);
                    return (
                      <label
                        key={mod.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                          isChecked
                            ? "border-[#035BE3] bg-blue-500/5 dark:bg-blue-950/20 ring-1 ring-[#035BE3]"
                            : darkMode
                            ? "border-[#222B3D] bg-[#0B0F17]/60"
                            : "border-slate-200 bg-slate-50/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...newSubAdminData.permissions, mod.id]
                              : newSubAdminData.permissions.filter((p) => p !== mod.id);
                            setNewSubAdminData({ ...newSubAdminData, permissions: updated });
                          }}
                          className="rounded text-[#035BE3] focus:ring-[#035BE3] mt-0.5"
                        />
                        <div>
                          <p className="text-xs font-bold leading-tight">{mod.name}</p>
                          <p className="text-[10px] text-[#8A99AD] line-clamp-1 mt-0.5">{mod.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateSubAdminModal(false)}
                  className="flex-1 py-2.5 rounded-full border text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingSubAdmin}
                  className="flex-1 py-2.5 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isProcessingSubAdmin ? "Creating..." : "Confirm & Create Sub-Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT SUB-ADMIN (RBAC PERMISSIONS) */}
      {/* ======================================================== */}
      {editingSubAdmin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`rounded-[32px] max-w-xl w-full p-6 sm:p-8 border shadow-2xl animate-in zoom-in-95 duration-150 ${
              darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-500/15 text-[#035BE3] flex items-center justify-center">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Edit Sub-Admin Access</h3>
                  <p className="text-xs text-[#64748B]">Update role & module permissions for {editingSubAdmin.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingSubAdmin(null)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubAdmin} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingSubAdmin.name}
                    onChange={(e) => setEditingSubAdmin({ ...editingSubAdmin, name: e.target.value })}
                    className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Role Title</label>
                  <input
                    type="text"
                    value={editingSubAdmin.role_title}
                    onChange={(e) => setEditingSubAdmin({ ...editingSubAdmin, role_title: e.target.value })}
                    className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editingSubAdmin.email}
                    onChange={(e) => setEditingSubAdmin({ ...editingSubAdmin, email: e.target.value })}
                    className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Reset Password (Optional)</label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={editingSubAdmin.password || ""}
                    onChange={(e) => setEditingSubAdmin({ ...editingSubAdmin, password: e.target.value })}
                    className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs outline-none focus:border-[#035BE3] ${
                      darkMode ? "bg-[#0B0F17] border-[#222B3D] text-white" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  />
                </div>
              </div>

              {/* Permissions Checkboxes */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#8A99AD]">
                    Allowed Module Permissions
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const allKeys = availableModulesList.map((m) => m.id);
                      const currentPerms = Array.isArray(editingSubAdmin.permissions) ? editingSubAdmin.permissions : [];
                      const isAll = currentPerms.length === allKeys.length;
                      setEditingSubAdmin({
                        ...editingSubAdmin,
                        permissions: isAll ? [] : allKeys,
                      });
                    }}
                    className="text-[11px] font-bold text-[#035BE3] hover:underline cursor-pointer"
                  >
                    Select / Deselect All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 scrollbar-thin">
                  {(availableModulesList && availableModulesList.length > 0 ? availableModulesList : DEFAULT_ADMIN_MODULES).map((mod) => {
                    const currentPerms = Array.isArray(editingSubAdmin.permissions) ? editingSubAdmin.permissions : [];
                    const isChecked = currentPerms.includes(mod.id);
                    return (
                      <label
                        key={mod.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                          isChecked
                            ? "border-[#035BE3] bg-blue-500/5 dark:bg-blue-950/20 ring-1 ring-[#035BE3]"
                            : darkMode
                            ? "border-[#222B3D] bg-[#0B0F17]/60"
                            : "border-slate-200 bg-slate-50/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...currentPerms, mod.id]
                              : currentPerms.filter((p) => p !== mod.id);
                            setEditingSubAdmin({ ...editingSubAdmin, permissions: updated });
                          }}
                          className="rounded text-[#035BE3] focus:ring-[#035BE3] mt-0.5"
                        />
                        <div>
                          <p className="text-xs font-bold leading-tight">{mod.name}</p>
                          <p className="text-[10px] text-[#8A99AD] line-clamp-1 mt-0.5">{mod.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingSubAdmin(null)}
                  className="flex-1 py-2.5 rounded-full border text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingSubAdmin}
                  className="flex-1 py-2.5 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isProcessingSubAdmin ? "Saving..." : "Save Permissions"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {/* ======================================================== */}
      {/* USER PURCHASES & ENROLLMENT BREAKDOWN MODAL */}
      {/* ======================================================== */}
      {selectedUserPurchases && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`rounded-[32px] max-w-3xl w-full p-6 sm:p-8 border my-8 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col justify-between ${
              darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-inherit shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#035BE3] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md shadow-[#035BE3]/30">
                  {selectedUserPurchases.user?.name ? selectedUserPurchases.user.name.charAt(0).toUpperCase() : "S"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold">{selectedUserPurchases.user?.name}</h3>
                    <span className="font-mono text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-[#035BE3]/10 text-[#035BE3] border border-[#035BE3]/20">
                      {selectedUserPurchases.user?.student_id || `KW-2026-${selectedUserPurchases.user?.id}`}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {selectedUserPurchases.user?.email} • {selectedUserPurchases.user?.phone || "No Phone"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserPurchases(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
              {/* Summary Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className={`p-4 rounded-2xl border ${darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"}`}>
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block">Total Amount Paid</span>
                  <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                    ₹{Number(selectedUserPurchases.total_spent || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className={`p-4 rounded-2xl border ${darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"}`}>
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block">Active Packages</span>
                  <span className="text-base sm:text-lg font-black text-[#035BE3] dark:text-blue-400">
                    {selectedUserPurchases.packages?.length || 0} Bundles
                  </span>
                </div>
                <div className={`p-4 rounded-2xl border ${darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"}`}>
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block">Unlocked Courses</span>
                  <span className="text-base sm:text-lg font-black text-purple-600 dark:text-purple-400">
                    {selectedUserPurchases.courses?.length || 0} Courses
                  </span>
                </div>
              </div>

              {/* 1. Active Packages Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Layers3 className="w-4 h-4 text-[#035BE3]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Enrolled Skill Packages</h4>
                </div>

                {selectedUserPurchases.packages && selectedUserPurchases.packages.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedUserPurchases.packages.map((pkg) => (
                      <div
                        key={pkg.id || pkg.package_id}
                        className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {pkg.image_url && (
                            <img
                              src={pkg.image_url}
                              alt={pkg.name}
                              className="w-10 h-10 object-contain rounded-xl border p-1 bg-white shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <h5 className={`text-xs font-bold truncate ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                              {pkg.name}
                            </h5>
                            <p className="text-[10px] text-[#64748B]">
                              Enrolled: {pkg.enrolled_at ? new Date(pkg.enrolled_at).toLocaleDateString("en-IN") : "Active"}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 border ${
                          darkMode
                            ? "bg-emerald-950/50 text-emerald-400 border-emerald-800"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          Lifetime Active
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#64748B] italic p-3 rounded-xl border border-dashed border-inherit">
                    No active Skill Packages purchased yet.
                  </p>
                )}
              </div>

              {/* 2. Unlocked Courses Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#035BE3]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Unlocked Video Masterclasses</h4>
                </div>

                {selectedUserPurchases.courses && selectedUserPurchases.courses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedUserPurchases.courses.map((crs) => (
                      <div
                        key={crs.id}
                        className={`p-3 rounded-2xl border flex items-center gap-3 ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                        }`}
                      >
                        {crs.thumbnail_url && (
                          <img
                            src={crs.thumbnail_url}
                            alt={crs.title}
                            className="w-12 h-9 object-cover rounded-lg shrink-0 bg-gray-900"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <h5 className={`text-xs font-bold truncate ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                            {crs.title}
                          </h5>
                          <p className="text-[10.5px] text-[#64748B] truncate">
                            {crs.category} • {crs.mentor_name || "Instructor"} • {crs.duration}
                          </p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-bold shrink-0 border ${
                          darkMode
                            ? "bg-blue-950/50 text-blue-400 border-blue-900/60"
                            : "bg-blue-50 text-[#035BE3] border-blue-200"
                        }`}>
                          Unlocked
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#64748B] italic p-3 rounded-xl border border-dashed border-inherit">
                    No individual courses unlocked yet.
                  </p>
                )}
              </div>

              {/* 3. Transaction Receipts */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#035BE3]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Payment Transactions & Receipts</h4>
                </div>

                {selectedUserPurchases.payments && selectedUserPurchases.payments.length > 0 ? (
                  <div className="border rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className={`border-b text-[10px] uppercase font-bold tracking-wider ${
                          darkMode ? "bg-[#0B0F17] border-[#222B3D] text-[#94A3B8]" : "bg-[#F8FAFD] border-[#E2E8F0] text-[#64748B]"
                        }`}>
                          <th className="py-2.5 px-4">Item</th>
                          <th className="py-2.5 px-4">Amount</th>
                          <th className="py-2.5 px-4">Razorpay ID</th>
                          <th className="py-2.5 px-4">Status</th>
                          <th className="py-2.5 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? "divide-[#1E2638]" : "divide-[#F1F5F9]"}`}>
                        {selectedUserPurchases.payments.map((p) => (
                          <tr key={p.id} className={`transition-colors ${darkMode ? "hover:bg-[#1E2638]" : "hover:bg-[#F8FAFD]"}`}>
                            <td className={`py-2.5 px-4 font-bold ${darkMode ? "text-white" : "text-[#0F172A]"}`}>
                              {p.package_name || p.course_name || p.item_type || "Purchase"}
                            </td>
                            <td className={`py-2.5 px-4 font-black ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                              ₹{Number(p.amount || 0).toLocaleString("en-IN")}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-[10.5px] text-[#64748B]">{p.razorpay_payment_id || p.razorpay_order_id || "—"}</td>
                            <td className="py-2.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase border ${
                                p.status === "paid"
                                  ? (darkMode ? "bg-emerald-950/50 text-emerald-400 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-200")
                                  : (darkMode ? "bg-amber-950/50 text-amber-400 border-amber-800" : "bg-amber-50 text-amber-700 border-amber-200")
                              }`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-[10.5px] text-[#64748B]">
                              {p.created_at ? new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-[#64748B] italic p-3 rounded-xl border border-dashed border-inherit">
                    No payment transaction records found.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Bottom */}
            <div className="pt-4 border-t border-inherit flex justify-end shrink-0">
              <button
                onClick={() => setSelectedUserPurchases(null)}
                className="px-6 py-2.5 rounded-full bg-[#035BE3] text-white text-xs font-bold hover:bg-[#024bc0] transition cursor-pointer"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
