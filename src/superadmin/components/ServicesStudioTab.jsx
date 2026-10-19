import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  UploadCloud,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Search,
  Phone,
  Mail,
  MessageSquare,
  Save,
  X,
  Eye,
  EyeOff,
  ArrowUpRight,
  Layers3,
  Check,
  Loader2,
} from "lucide-react";
import {
  getAdminServicesApi,
  createAdminServiceApi,
  updateAdminServiceApi,
  deleteAdminServiceApi,
  getAdminServiceInquiriesApi,
  updateAdminServiceInquiryStatusApi,
  deleteAdminServiceInquiryApi,
  uploadImageApi,
} from "../../services/api";

/* =====================================================================
   SHARED VECTOR ILLUSTRATIONS (FALLBACK WHEN NO CUSTOM IMAGE UPLOADED)
===================================================================== */
export const ServiceVectorIllustration = ({ type = "ads" }) => {
  switch (type) {
    case "ads":
      return (
        <svg viewBox="0 0 360 240" fill="none" className="w-full h-full max-h-[210px]">
          <rect x="30" y="25" width="300" height="190" rx="20" fill="#FFFFFF" stroke="#DCE5F4" strokeWidth="2" />
          <circle cx="115" cy="120" r="52" fill="#EEF3FF" />
          <circle cx="115" cy="120" r="36" fill="#DCE8FF" />
          <circle cx="115" cy="120" r="20" fill="#035BE3" />
          <circle cx="115" cy="120" r="7" fill="#FFFFFF" />
          <path d="M155 80L120 115" stroke="#FA8C03" strokeWidth="4" strokeLinecap="round" />
          <path d="M155 80L143 82L153 92L155 80Z" fill="#FA8C03" />
          <rect x="190" y="58" width="110" height="14" rx="7" fill="#141A29" />
          <rect x="190" y="82" width="80" height="9" rx="4.5" fill="#94A3B8" />
          <rect x="190" y="110" width="110" height="32" rx="10" fill="#F8FAFD" stroke="#E2E8F0" />
          <circle cx="208" cy="126" r="7" fill="#035BE3" />
          <rect x="224" y="122" width="60" height="8" rx="4" fill="#334155" />
          <rect x="190" y="152" width="110" height="32" rx="10" fill="#EEF3FF" />
          <circle cx="208" cy="168" r="7" fill="#FA8C03" />
          <rect x="224" y="164" width="66" height="8" rx="4" fill="#035BE3" />
        </svg>
      );
    case "seo":
      return (
        <svg viewBox="0 0 360 240" fill="none" className="w-full h-full max-h-[210px]">
          <rect x="30" y="25" width="300" height="190" rx="20" fill="#FFFFFF" stroke="#E5DCFF" strokeWidth="2" />
          <rect x="55" y="48" width="250" height="36" rx="18" fill="#F5F0FF" stroke="#DDD1FF" strokeWidth="1.5" />
          <circle cx="78" cy="66" r="8" stroke="#7555E8" strokeWidth="2.5" />
          <line x1="84" y1="72" x2="90" y2="78" stroke="#7555E8" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="104" y="61" width="130" height="10" rx="5" fill="#7555E8" />
          <rect x="55" y="100" width="250" height="46" rx="12" fill="#F8FAFD" stroke="#E2E8F0" />
          <rect x="68" y="112" width="28" height="22" rx="6" fill="#7555E8" />
          <text x="75" y="127" fill="white" fontSize="11" fontWeight="bold">#1</text>
          <rect x="108" y="113" width="120" height="9" rx="4.5" fill="#141A29" />
          <rect x="108" y="128" width="170" height="7" rx="3.5" fill="#94A3B8" />
          <path d="M65 188C110 185 140 165 185 168C230 171 260 148 295 142" stroke="#035BE3" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="295" cy="142" r="6" fill="#035BE3" />
        </svg>
      );
    case "social":
      return (
        <svg viewBox="0 0 360 240" fill="none" className="w-full h-full max-h-[210px]">
          <rect x="30" y="25" width="300" height="190" rx="20" fill="#FFFFFF" stroke="#FFE2CF" strokeWidth="2" />
          <rect x="60" y="45" width="130" height="150" rx="16" fill="#FFF4EC" stroke="#FFD5B8" strokeWidth="1.5" />
          <circle cx="82" cy="67" r="10" fill="#EE7D42" />
          <rect x="98" y="62" width="65" height="8" rx="4" fill="#141A29" />
          <rect x="72" y="86" width="106" height="68" rx="10" fill="#FFFFFF" />
          <circle cx="125" cy="120" r="18" fill="#FFE8D6" />
          <path d="M125 110L128 117L136 118L130 123L132 130L125 126L118 130L120 123L114 118L122 117L125 110Z" fill="#EE7D42" />
          <rect x="72" y="166" width="55" height="8" rx="4" fill="#EE7D42" />
          <rect x="210" y="58" width="95" height="48" rx="14" fill="#EEF3FF" />
          <rect x="226" y="72" width="45" height="8" rx="4" fill="#035BE3" />
          <rect x="226" y="86" width="65" height="7" rx="3.5" fill="#64748B" />
          <rect x="210" y="120" width="95" height="48" rx="14" fill="#F5F0FF" />
          <rect x="226" y="134" width="52" height="8" rx="4" fill="#7555E8" />
          <rect x="226" y="148" width="62" height="7" rx="3.5" fill="#64748B" />
        </svg>
      );
    case "video":
      return (
        <svg viewBox="0 0 360 240" fill="none" className="w-full h-full max-h-[210px]">
          <rect x="30" y="25" width="300" height="190" rx="20" fill="#FFFFFF" stroke="#FFDCE6" strokeWidth="2" />
          <rect x="60" y="45" width="150" height="115" rx="16" fill="#FFF1F5" stroke="#FFCCD9" strokeWidth="1.5" />
          <circle cx="135" cy="102" r="24" fill="#E65C81" />
          <path d="M130 93L145 102L130 111V93Z" fill="white" />
          <rect x="60" y="172" width="240" height="10" rx="5" fill="#F1F5F9" />
          <rect x="60" y="172" width="145" height="10" rx="5" fill="#E65C81" />
          <circle cx="205" cy="177" r="8" fill="#141A29" />
          <rect x="228" y="45" width="72" height="115" rx="14" fill="#EEF3FF" stroke="#DCE5F4" strokeWidth="1.5" />
          <rect x="242" y="126" width="44" height="7" rx="3.5" fill="#035BE3" />
          <rect x="242" y="139" width="30" height="6" rx="3" fill="#94A3B8" />
        </svg>
      );
    case "web":
      return (
        <svg viewBox="0 0 360 240" fill="none" className="w-full h-full max-h-[210px]">
          <rect x="30" y="25" width="300" height="190" rx="20" fill="#FFFFFF" stroke="#DCE5F4" strokeWidth="2" />
          <rect x="52" y="45" width="256" height="24" rx="8" fill="#EEF3FF" />
          <circle cx="66" cy="57" r="4" fill="#FF8A75" />
          <circle cx="78" cy="57" r="4" fill="#FFCE57" />
          <circle cx="90" cy="57" r="4" fill="#52C41A" />
          <rect x="52" y="80" width="140" height="110" rx="12" fill="#F8FAFD" stroke="#E2E8F0" />
          <rect x="66" y="96" width="90" height="10" rx="5" fill="#141A29" />
          <rect x="66" y="114" width="110" height="7" rx="3.5" fill="#94A3B8" />
          <rect x="66" y="127" width="85" height="7" rx="3.5" fill="#94A3B8" />
          <rect x="66" y="150" width="72" height="22" rx="11" fill="#035BE3" />
          <rect x="206" y="80" width="102" height="110" rx="12" fill="#F5F0FF" stroke="#DDD1FF" />
          <circle cx="257" cy="120" r="20" fill="#7555E8" />
          <path d="M251 120L255 124L264 115" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="224" y="154" width="66" height="8" rx="4" fill="#25213B" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 360 240" fill="none" className="w-full h-full max-h-[210px]">
          <rect x="30" y="25" width="300" height="190" rx="20" fill="#FFFFFF" stroke="#C6F6D5" strokeWidth="2" />
          <path d="M85 60H275L245 102H115L85 60Z" fill="#EEF3FF" stroke="#035BE3" strokeWidth="1.5" />
          <path d="M118 112H242L218 150H142L118 112Z" fill="#F5F0FF" stroke="#7555E8" strokeWidth="1.5" />
          <rect x="148" y="160" width="64" height="32" rx="10" fill="#059669" />
          <path d="M173 176L178 181L188 171" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
};

export const THEME_STYLES = {
  blue: {
    label: "Royal Blue",
    cardBg: "bg-[#EEF3FF]/70",
    borderAccent: "border-[#DCE5F4]",
    badgeBg: "bg-[#EEF3FF] text-[#035BE3]",
    dot: "bg-[#035BE3]",
  },
  purple: {
    label: "Lavender Purple",
    cardBg: "bg-[#F5F0FF]/70",
    borderAccent: "border-[#E5DCFF]",
    badgeBg: "bg-[#F5F0FF] text-[#7555E8]",
    dot: "bg-[#7555E8]",
  },
  orange: {
    label: "Warm Orange",
    cardBg: "bg-[#FFF4EC]/80",
    borderAccent: "border-[#FFE2CF]",
    badgeBg: "bg-[#FFF4EC] text-[#EE7D42]",
    dot: "bg-[#EE7D42]",
  },
  pink: {
    label: "Coral Pink",
    cardBg: "bg-[#FFF1F5]/80",
    borderAccent: "border-[#FFDCE6]",
    badgeBg: "bg-[#FFF1F5] text-[#E65C81]",
    dot: "bg-[#E65C81]",
  },
  emerald: {
    label: "Emerald Green",
    cardBg: "bg-[#ECFDF5]/80",
    borderAccent: "border-[#C6F6D5]",
    badgeBg: "bg-[#ECFDF5] text-[#059669]",
    dot: "bg-[#059669]",
  },
};

const VECTOR_OPTIONS = [
  { id: "ads", label: "Paid Ads & Target Vector" },
  { id: "seo", label: "SEO & Google Rank Vector" },
  { id: "social", label: "Social Media & Brand Vector" },
  { id: "video", label: "Video & Reels Editing Vector" },
  { id: "web", label: "Website & UI Design Vector" },
  { id: "funnel", label: "Lead Funnel & Automation Vector" },
];

const EMPTY_FORM = {
  service_number: "07",
  category: "Digital Marketing",
  title: "",
  description: "",
  points: [
    "Complete strategy and account setup",
    "Custom creative design and copywriting",
    "Regular optimization for better results",
    "Transparent weekly performance reports",
  ],
  image_url: "",
  vector_type: "ads",
  theme_color: "blue",
  button_text: "Enquire About This Service",
  order_index: 7,
  is_published: true,
};

export default function ServicesStudioTab({ darkMode }) {
  const [activeSubTab, setActiveSubTab] = useState("services"); // 'services' | 'editor' | 'inquiries'
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState("all");

  // Editor State
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const fileInputRef = useRef(null);
  const cardUploadRef = useRef(null);
  const [quickUploadService, setQuickUploadService] = useState(null);

  const showToast = (text, type = "success") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadStudioData = async () => {
    try {
      setLoading(true);
      const [srvRes, inqRes] = await Promise.allSettled([
        getAdminServicesApi(),
        getAdminServiceInquiriesApi(),
      ]);

      if (srvRes.status === "fulfilled" && srvRes.value?.success) {
        setServices(srvRes.value.services || []);
      }
      if (inqRes.status === "fulfilled" && inqRes.value?.success) {
        setInquiries(inqRes.value.inquiries || []);
      }
    } catch (err) {
      console.error("Failed to load Services Studio data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudioData();
  }, []);

  // Open Editor for Creating a New Service
  const handleStartCreate = () => {
    const nextNum = String(services.length + 1).padStart(2, "0");
    setEditingService(null);
    setServiceForm({
      ...EMPTY_FORM,
      service_number: nextNum,
      order_index: services.length + 1,
    });
    setActiveSubTab("editor");
  };

  // Open Editor for Editing an Existing Service
  const handleStartEdit = (srv) => {
    setEditingService(srv);
    setServiceForm({
      service_number: srv.service_number || "01",
      category: srv.category || "Digital Marketing",
      title: srv.title || "",
      description: srv.description || "",
      points:
        Array.isArray(srv.points) && srv.points.length > 0
          ? [...srv.points]
          : ["", "", "", ""],
      image_url: srv.image_url || "",
      vector_type: srv.vector_type || "ads",
      theme_color: srv.theme_color || "blue",
      button_text: srv.button_text || "Enquire About This Service",
      order_index: srv.order_index || 1,
      is_published: srv.is_published !== false,
    });
    setActiveSubTab("editor");
  };

  // Upload Image from Computer in Editor
  const handleImageFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (PNG, JPG, WEBP, SVG).", "error");
      return;
    }

    try {
      setIsUploadingImage(true);
      const res = await uploadImageApi(file, "skillpreneur_services");
      const uploadedUrl = res?.url || res?.data?.url;
      if (uploadedUrl) {
        setServiceForm((prev) => ({ ...prev, image_url: uploadedUrl }));
        showToast("Service image uploaded successfully!");
      }
    } catch (err) {
      showToast("Image upload failed: " + err.message, "error");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Quick 1-Click Upload Image directly on a Service Card in "Manage Services" tab
  const handleQuickCardImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !quickUploadService) return;

    try {
      setIsUploadingImage(true);
      const res = await uploadImageApi(file, "skillpreneur_services");
      const uploadedUrl = res?.url || res?.data?.url;
      if (uploadedUrl) {
        await updateAdminServiceApi(quickUploadService.id, {
          ...quickUploadService,
          image_url: uploadedUrl,
        });
        showToast(`Updated image for "${quickUploadService.title}"!`);
        loadStudioData();
      }
    } catch (err) {
      showToast("Failed to upload image: " + err.message, "error");
    } finally {
      setIsUploadingImage(false);
      setQuickUploadService(null);
      if (cardUploadRef.current) cardUploadRef.current.value = "";
    }
  };

  // Save Service (Create or Update)
  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!serviceForm.title.trim() || !serviceForm.description.trim()) {
      showToast("Please enter both Service Title and Description.", "error");
      return;
    }

    const cleanedPoints = (serviceForm.points || [])
      .map((p) => String(p).trim())
      .filter(Boolean);

    try {
      setIsSaving(true);
      const payload = {
        ...serviceForm,
        points: cleanedPoints,
      };

      if (editingService) {
        await updateAdminServiceApi(editingService.id, payload);
        showToast("Service updated successfully!");
      } else {
        await createAdminServiceApi(payload);
        showToast("New service added to /services page!");
      }

      await loadStudioData();
      setActiveSubTab("services");
      setEditingService(null);
    } catch (err) {
      showToast("Failed to save service: " + err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Publish Status directly from Card
  const handleTogglePublish = async (srv) => {
    try {
      await updateAdminServiceApi(srv.id, {
        ...srv,
        is_published: !srv.is_published,
      });
      showToast(
        !srv.is_published
          ? `"${srv.title}" is now live on /services!`
          : `"${srv.title}" hidden from public page.`
      );
      loadStudioData();
    } catch (err) {
      showToast("Error updating status: " + err.message, "error");
    }
  };

  // Delete Service
  const handleDeleteService = async (srv) => {
    if (!window.confirm(`Delete "${srv.title}" from Services?`)) return;
    try {
      await deleteAdminServiceApi(srv.id);
      showToast("Service deleted.");
      loadStudioData();
    } catch (err) {
      showToast("Error deleting service: " + err.message, "error");
    }
  };

  // Update Inquiry Status
  const handleInquiryStatusChange = async (inq, newStatus) => {
    try {
      await updateAdminServiceInquiryStatusApi(inq.id, {
        status: newStatus,
        admin_notes: inq.admin_notes || "",
      });
      showToast(`Enquiry marked as ${newStatus.toUpperCase()}`);
      loadStudioData();
    } catch (err) {
      showToast("Error updating enquiry: " + err.message, "error");
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("Delete this service enquiry?")) return;
    try {
      await deleteAdminServiceInquiryApi(id);
      showToast("Enquiry deleted.");
      loadStudioData();
    } catch (err) {
      showToast("Error deleting enquiry: " + err.message, "error");
    }
  };

  // Point Array Helpers
  const handlePointChange = (idx, value) => {
    setServiceForm((prev) => {
      const updated = [...(prev.points || [])];
      updated[idx] = value;
      return { ...prev, points: updated };
    });
  };

  const handleAddPoint = () => {
    setServiceForm((prev) => ({
      ...prev,
      points: [...(prev.points || []), ""],
    }));
  };

  const handleRemovePoint = (idx) => {
    setServiceForm((prev) => ({
      ...prev,
      points: (prev.points || []).filter((_, i) => i !== idx),
    }));
  };

  // Filtered lists
  const filteredServices = services.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      s.title?.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q)
    );
  });

  const filteredInquiries = inquiries.filter((inq) => {
    if (inquiryStatusFilter !== "all" && inq.status !== inquiryStatusFilter) {
      return false;
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      inq.name?.toLowerCase().includes(q) ||
      inq.phone?.toLowerCase().includes(q) ||
      inq.email?.toLowerCase().includes(q) ||
      inq.service_title?.toLowerCase().includes(q)
    );
  });

  const newInquiriesCount = inquiries.filter((i) => i.status === "new").length;
  const publishedCount = services.filter((s) => s.is_published).length;

  const previewTheme = THEME_STYLES[serviceForm.theme_color] || THEME_STYLES.blue;

  return (
    <div className="space-y-6">
      {/* Hidden input for quick card image upload */}
      <input
        ref={cardUploadRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleQuickCardImageUpload}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full px-5 py-3 text-xs font-bold text-white shadow-xl animate-in fade-in slide-in-from-bottom-4 ${
            toastMsg.type === "error" ? "bg-red-600" : "bg-[#035BE3]"
          }`}
        >
          <CheckCircle2 size={16} />
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* ================================================================= */}
      {/* 1. TOP STUDIO HEADER & SUB-TABS BAR                               */}
      {/* ================================================================= */}
      <div
        className={`rounded-[28px] border p-5 sm:p-6 transition-colors ${
          darkMode
            ? "bg-[#131926] border-[#222B3D] text-white"
            : "bg-white border-[#E2E8F0] text-[#0F172A]"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#035BE3]/10 px-3 py-1 text-[11px] font-bold text-[#035BE3] mb-2">
              <Sparkles size={12} />
              <span>Digital Marketing Services CMS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Services Studio & Client Enquiries
            </h2>
            <p
              className={`text-xs sm:text-sm mt-0.5 ${
                darkMode ? "text-[#94A3B8]" : "text-[#64748B]"
              }`}
            >
              Add, edit, upload service images, and manage popup enquiries for the public{" "}
              <code className="font-bold text-[#035BE3]">/services</code> page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/services"
              target="_blank"
              className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition ${
                darkMode
                  ? "border-[#2A354B] bg-[#1A2234] text-slate-200 hover:border-[#035BE3]"
                  : "border-[#DCE5F4] bg-[#F8FAFD] text-[#141A29] hover:border-[#035BE3] hover:text-[#035BE3]"
              }`}
            >
              <span>View Live /services Page</span>
              <ExternalLink size={13} />
            </Link>

            <button
              type="button"
              onClick={handleStartCreate}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#035BE3] px-5 text-xs font-bold text-white shadow-xs transition hover:bg-[#FA8C03] cursor-pointer"
            >
              <Plus size={15} />
              <span>Add New Service</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            className={`rounded-2xl border p-4 ${
              darkMode
                ? "bg-[#1A2234]/70 border-[#263147]"
                : "bg-[#F8FAFD] border-[#E7ECF3]"
            }`}
          >
            <p className="text-[11px] font-semibold text-[#64748B]">
              Total Services
            </p>
            <p className="mt-1 text-2xl font-bold text-[#035BE3]">
              {services.length}
            </p>
          </div>

          <div
            className={`rounded-2xl border p-4 ${
              darkMode
                ? "bg-[#1A2234]/70 border-[#263147]"
                : "bg-[#F8FAFD] border-[#E7ECF3]"
            }`}
          >
            <p className="text-[11px] font-semibold text-[#64748B]">
              Live on Website
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {publishedCount}
            </p>
          </div>

          <div
            className={`rounded-2xl border p-4 ${
              darkMode
                ? "bg-[#1A2234]/70 border-[#263147]"
                : "bg-[#F8FAFD] border-[#E7ECF3]"
            }`}
          >
            <p className="text-[11px] font-semibold text-[#64748B]">
              Popup Form Enquiries
            </p>
            <p className="mt-1 text-2xl font-bold text-[#7555E8]">
              {inquiries.length}
            </p>
          </div>

          <div
            className={`rounded-2xl border p-4 ${
              darkMode
                ? "bg-[#1A2234]/70 border-[#263147]"
                : "bg-[#F8FAFD] border-[#E7ECF3]"
            }`}
          >
            <p className="text-[11px] font-semibold text-[#64748B]">
              New Unread Leads
            </p>
            <p className="mt-1 text-2xl font-bold text-[#FA8C03]">
              {newInquiriesCount}
            </p>
          </div>
        </div>

        {/* Studio Navigation Sub-Tabs + Search Bar */}
        <div className="mt-6 pt-5 border-t border-[#E2E8F0] dark:border-[#222B3D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSubTab("services")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                activeSubTab === "services"
                  ? "bg-[#035BE3] text-white shadow-xs"
                  : darkMode
                  ? "bg-[#1A2234] text-slate-300 hover:text-white"
                  : "bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A]"
              }`}
            >
              <Layers3 size={14} />
              <span>All Services ({services.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (activeSubTab !== "editor") handleStartCreate();
              }}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                activeSubTab === "editor"
                  ? "bg-[#035BE3] text-white shadow-xs"
                  : darkMode
                  ? "bg-[#1A2234] text-slate-300 hover:text-white"
                  : "bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A]"
              }`}
            >
              <Plus size={14} />
              <span>{editingService ? "Edit Service" : "Add Service & Upload Image"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab("inquiries")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                activeSubTab === "inquiries"
                  ? "bg-[#035BE3] text-white shadow-xs"
                  : darkMode
                  ? "bg-[#1A2234] text-slate-300 hover:text-white"
                  : "bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A]"
              }`}
            >
              <MessageSquare size={14} />
              <span>Popup Form Enquiries ({inquiries.length})</span>
              {newInquiriesCount > 0 && (
                <span className="rounded-full bg-[#FA8C03] px-2 py-0.5 text-[10px] font-bold text-white">
                  {newInquiriesCount} New
                </span>
              )}
            </button>
          </div>

          {activeSubTab !== "editor" && (
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeSubTab === "services"
                      ? "Search services..."
                      : "Search enquiries..."
                  }
                  className={`h-9 w-full rounded-full border pl-9 pr-4 text-xs outline-none transition ${
                    darkMode
                      ? "bg-[#1A2234] border-[#2A354B] text-white focus:border-[#035BE3]"
                      : "bg-[#F8FAFD] border-[#DCE5F4] text-[#141A29] focus:border-[#035BE3]"
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={loadStudioData}
                title="Refresh"
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition cursor-pointer ${
                  darkMode
                    ? "border-[#2A354B] bg-[#1A2234] text-slate-300 hover:text-white"
                    : "border-[#DCE5F4] bg-[#F8FAFD] text-[#475569] hover:text-[#035BE3]"
                }`}
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* SUB-TAB 1: MANAGE ALL SERVICES (EXACT FULL-ROW WEBSITE UI)        */}
      {/* ================================================================= */}
      {activeSubTab === "services" && (
        <div className="space-y-5">
          {loading ? (
            <div
              className={`rounded-[28px] border p-12 text-center ${
                darkMode
                  ? "bg-[#131926] border-[#222B3D] text-slate-300"
                  : "bg-white border-[#E2E8F0] text-slate-500"
              }`}
            >
              <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#035BE3]" />
              <p className="mt-2 text-xs font-semibold">
                Loading Digital Marketing Services...
              </p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div
              className={`rounded-[28px] border p-12 text-center space-y-3 ${
                darkMode
                  ? "bg-[#131926] border-[#222B3D] text-slate-300"
                  : "bg-white border-[#E2E8F0] text-slate-600"
              }`}
            >
              <p className="text-base font-bold">No services found</p>
              <button
                type="button"
                onClick={handleStartCreate}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#035BE3] px-5 text-xs font-bold text-white"
              >
                <Plus size={14} />
                <span>Add First Service</span>
              </button>
            </div>
          ) : (
            filteredServices.map((service, index) => {
              const theme =
                THEME_STYLES[service.theme_color] || THEME_STYLES.blue;
              const isEven = index % 2 === 1;

              return (
                <div
                  key={service.id}
                  className={`rounded-[28px] border p-6 sm:p-8 transition-all ${
                    darkMode
                      ? "bg-[#131926] border-[#222B3D]"
                      : `bg-white ${theme.borderAccent} shadow-[0_8px_30px_rgba(20,35,70,0.03)]`
                  } ${!service.is_published ? "opacity-65" : ""}`}
                >
                  {/* Admin Control Bar at Top of Card */}
                  <div
                    className={`mb-5 pb-4 border-b flex flex-wrap items-center justify-between gap-3 ${
                      darkMode ? "border-[#222B3D]" : "border-[#EEF2F8]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
                          service.is_published
                            ? "bg-emerald-500/15 text-emerald-600"
                            : "bg-amber-500/15 text-amber-600"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            service.is_published
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />
                        {service.is_published ? "Published on /services" : "Hidden Draft"}
                      </span>

                      <span className="text-xs font-semibold text-[#64748B]">
                        Order #{service.order_index || index + 1}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* 1-Click Image Upload Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setQuickUploadService(service);
                          cardUploadRef.current?.click();
                        }}
                        className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold transition cursor-pointer ${
                          darkMode
                            ? "border-[#2A354B] bg-[#1A2234] text-slate-200 hover:border-[#035BE3]"
                            : "border-[#DCE5F4] bg-[#F8FAFD] text-[#141A29] hover:border-[#035BE3] hover:text-[#035BE3]"
                        }`}
                      >
                        <UploadCloud size={13} />
                        <span>
                          {service.image_url ? "Change Image" : "Upload Image"}
                        </span>
                      </button>

                      {/* Publish / Unpublish Button */}
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(service)}
                        className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold transition cursor-pointer ${
                          darkMode
                            ? "border-[#2A354B] bg-[#1A2234] text-slate-200"
                            : "border-[#DCE5F4] bg-[#F8FAFD] text-[#475569] hover:text-[#141A29]"
                        }`}
                      >
                        {service.is_published ? (
                          <>
                            <EyeOff size={13} />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye size={13} />
                            <span>Publish</span>
                          </>
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleStartEdit(service)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#035BE3] px-4 text-xs font-bold text-white transition hover:bg-[#FA8C03] cursor-pointer"
                      >
                        <Edit2 size={13} />
                        <span>Edit Details</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteService(service)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Full-Row Card Content (Matches /services UI) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
                    {/* Visual Side (5 cols) */}
                    <div
                      className={`lg:col-span-5 ${
                        isEven ? "lg:order-2" : "lg:order-1"
                      }`}
                    >
                      <div
                        className={`relative flex h-[220px] sm:h-[245px] w-full items-center justify-center overflow-hidden rounded-[22px] border ${theme.borderAccent} ${theme.cardBg} p-4`}
                      >
                        {service.image_url ? (
                          <img
                            src={service.image_url}
                            alt={service.title}
                            className="h-full w-full rounded-[16px] object-contain"
                          />
                        ) : (
                          <ServiceVectorIllustration
                            type={service.vector_type || "ads"}
                          />
                        )}
                      </div>
                    </div>

                    {/* Text Details Side (7 cols) */}
                    <div
                      className={`lg:col-span-7 space-y-3.5 ${
                        isEven ? "lg:order-1" : "lg:order-2"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-3.5 py-1 text-[11.5px] font-bold ${theme.badgeBg}`}
                        >
                          {service.service_number} • {service.category}
                        </span>
                      </div>

                      <h3
                        className={`text-xl sm:text-2xl font-bold ${
                          darkMode ? "text-white" : "text-[#141A29]"
                        }`}
                      >
                        {service.title}
                      </h3>

                      <p
                        className={`text-sm leading-relaxed ${
                          darkMode ? "text-slate-300" : "text-[#59667E]"
                        }`}
                      >
                        {service.description}
                      </p>

                      <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {(service.points || []).map((pt, i) => (
                          <div
                            key={i}
                            className={`flex items-start gap-2 text-[13px] font-medium ${
                              darkMode ? "text-slate-200" : "text-[#2C3649]"
                            }`}
                          >
                            <CheckCircle2
                              size={15}
                              className="mt-0.5 shrink-0 text-[#035BE3]"
                            />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 2: ADD / EDIT SERVICE + IMAGE UPLOAD + LIVE PREVIEW       */}
      {/* ================================================================= */}
      {activeSubTab === "editor" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* LEFT 7 COLS: FORM */}
          <form
            onSubmit={handleSaveService}
            className={`xl:col-span-7 rounded-[28px] border p-6 sm:p-8 space-y-5 ${
              darkMode
                ? "bg-[#131926] border-[#222B3D] text-white"
                : "bg-white border-[#E2E8F0] text-[#141A29]"
            }`}
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#222B3D] pb-4">
              <div>
                <h3 className="text-lg font-bold">
                  {editingService
                    ? `Edit Service: ${editingService.title}`
                    : "Add New Service to /services Page"}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Fill in the details and upload an image or pick a clean vector illustration.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveSubTab("services");
                  setEditingService(null);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DCE5F4] text-[#64748B] hover:text-[#141A29] cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Row 1: Number, Category, Order */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5">
                  Service Number (e.g. 01)
                </label>
                <input
                  type="text"
                  value={serviceForm.service_number}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      service_number: e.target.value,
                    })
                  }
                  placeholder="01"
                  className={`h-11 w-full rounded-xl border px-3.5 text-xs font-semibold outline-none ${
                    darkMode
                      ? "bg-[#1A2234] border-[#2A354B] text-white"
                      : "bg-[#F8FAFD] border-[#DCE5F4] text-[#141A29]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">
                  Category Tag *
                </label>
                <input
                  type="text"
                  required
                  value={serviceForm.category}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, category: e.target.value })
                  }
                  placeholder="e.g. Paid Advertising"
                  className={`h-11 w-full rounded-xl border px-3.5 text-xs font-semibold outline-none ${
                    darkMode
                      ? "bg-[#1A2234] border-[#2A354B] text-white"
                      : "bg-[#F8FAFD] border-[#DCE5F4] text-[#141A29]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={serviceForm.order_index}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      order_index: Number(e.target.value) || 1,
                    })
                  }
                  className={`h-11 w-full rounded-xl border px-3.5 text-xs font-semibold outline-none ${
                    darkMode
                      ? "bg-[#1A2234] border-[#2A354B] text-white"
                      : "bg-[#F8FAFD] border-[#DCE5F4] text-[#141A29]"
                  }`}
                />
              </div>
            </div>

            {/* Service Title */}
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Service Heading / Title *
              </label>
              <input
                type="text"
                required
                value={serviceForm.title}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, title: e.target.value })
                }
                placeholder="e.g. Meta & Google Ads Management"
                className={`h-11 w-full rounded-xl border px-3.5 text-sm font-semibold outline-none ${
                  darkMode
                    ? "bg-[#1A2234] border-[#2A354B] text-white"
                    : "bg-[#F8FAFD] border-[#DCE5F4] text-[#141A29]"
                }`}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Simple Description *
              </label>
              <textarea
                rows={3}
                required
                value={serviceForm.description}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    description: e.target.value,
                  })
                }
                placeholder="Write a simple, clear 2-3 line description of what this service does for the client..."
                className={`w-full rounded-xl border p-3.5 text-xs leading-relaxed outline-none ${
                  darkMode
                    ? "bg-[#1A2234] border-[#2A354B] text-white"
                    : "bg-[#F8FAFD] border-[#DCE5F4] text-[#141A29]"
                }`}
              />
            </div>

            {/* Image Upload & Vector Illustration Picker */}
            <div
              className={`rounded-2xl border p-4 space-y-4 ${
                darkMode
                  ? "bg-[#1A2234]/60 border-[#2A354B]"
                  : "bg-[#F8FAFD] border-[#DCE5F4]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold">
                    Service Image / Vector Illustration
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    Upload your own custom image/vector PNG, or choose a built-in vector style below.
                  </p>
                </div>

                {serviceForm.image_url && (
                  <button
                    type="button"
                    onClick={() =>
                      setServiceForm({ ...serviceForm, image_url: "" })
                    }
                    className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer"
                  >
                    Remove Custom Image (Use Vector)
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Upload from Computer Button */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-24 rounded-xl border-2 border-dashed border-[#035BE3]/50 bg-[#EEF3FF]/50 hover:bg-[#EEF3FF] flex flex-col items-center justify-center gap-1.5 text-[#035BE3] transition cursor-pointer"
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span className="text-xs font-bold">
                          Uploading Image...
                        </span>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={22} />
                        <span className="text-xs font-bold">
                          Click to Upload Image
                        </span>
                        <span className="text-[10px] text-[#64748B]">
                          PNG, JPG, WEBP, SVG
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Paste URL or Pick Built-in Vector */}
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Or Paste Image URL
                    </label>
                    <input
                      type="text"
                      value={serviceForm.image_url}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          image_url: e.target.value,
                        })
                      }
                      placeholder="https://... or leave empty for vector"
                      className={`h-9 w-full rounded-lg border px-3 text-xs outline-none ${
                        darkMode
                          ? "bg-[#131926] border-[#2A354B] text-white"
                          : "bg-white border-[#DCE5F4] text-[#141A29]"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Built-in Vector Style (Used if no custom image)
                    </label>
                    <select
                      value={serviceForm.vector_type}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          vector_type: e.target.value,
                        })
                      }
                      className={`h-9 w-full rounded-lg border px-3 text-xs font-medium outline-none ${
                        darkMode
                          ? "bg-[#131926] border-[#2A354B] text-white"
                          : "bg-white border-[#DCE5F4] text-[#141A29]"
                      }`}
                    >
                      {VECTOR_OPTIONS.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Bullet Points Builder */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold">
                  Service Key Points (Shown with Checkmarks)
                </label>
                <button
                  type="button"
                  onClick={handleAddPoint}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#035BE3] hover:underline cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Point</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {(serviceForm.points || []).map((pt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-[#035BE3]"
                    />
                    <input
                      type="text"
                      value={pt}
                      onChange={(e) => handlePointChange(idx, e.target.value)}
                      placeholder={`Key deliverable point #${idx + 1}`}
                      className={`h-10 flex-1 rounded-xl border px-3.5 text-xs outline-none ${
                        darkMode
                          ? "bg-[#1A2234] border-[#2A354B] text-white"
                          : "bg-[#F8FAFD] border-[#DCE5F4] text-[#141A29]"
                      }`}
                    />
                    {(serviceForm.points || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePoint(idx)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Card Accent Theme & Button Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5">
                  Card Color Theme
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(THEME_STYLES).map(([key, t]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setServiceForm({ ...serviceForm, theme_color: key })
                      }
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                        serviceForm.theme_color === key
                          ? "border-[#035BE3] bg-[#035BE3]/10 text-[#035BE3]"
                          : "border-[#DCE5F4] text-[#64748B]"
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${t.dot}`} />
                      <span>{t.label.split(" ")[1]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">
                  Action Button Text
                </label>
                <input
                  type="text"
                  value={serviceForm.button_text}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      button_text: e.target.value,
                    })
                  }
                  placeholder="Enquire About This Service"
                  className={`h-10 w-full rounded-xl border px-3.5 text-xs font-semibold outline-none ${
                    darkMode
                      ? "bg-[#1A2234] border-[#2A354B] text-white"
                      : "bg-[#F8FAFD] border-[#DCE5F4] text-[#141A29]"
                  }`}
                />
              </div>
            </div>

            {/* Submit Row */}
            <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#222B3D] flex items-center justify-between gap-4">
              <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={serviceForm.is_published}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      is_published: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded accent-[#035BE3]"
                />
                <span>Publish immediately on /services page</span>
              </label>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubTab("services");
                    setEditingService(null);
                  }}
                  className="h-11 rounded-full border border-[#DCE5F4] px-5 text-xs font-bold text-[#64748B] hover:text-[#141A29] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-[#035BE3] px-6 text-xs font-bold text-white shadow-md shadow-[#035BE3]/20 transition hover:bg-[#FA8C03] disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      <span>
                        {editingService ? "Update Service" : "Publish Service"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* RIGHT 5 COLS: LIVE WEBSITE CARD PREVIEW */}
          <div className="xl:col-span-5 space-y-3 sticky top-24">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Live Website Card Preview
              </span>
              <span className="text-[11px] font-semibold text-[#035BE3]">
                Matches /services UI
              </span>
            </div>

            <div
              className={`rounded-[28px] border ${previewTheme.borderAccent} bg-white p-6 shadow-sm text-[#141A29] space-y-5`}
            >
              <div
                className={`flex h-[200px] w-full items-center justify-center overflow-hidden rounded-[20px] border ${previewTheme.borderAccent} ${previewTheme.cardBg} p-4`}
              >
                {serviceForm.image_url ? (
                  <img
                    src={serviceForm.image_url}
                    alt="Preview"
                    className="h-full w-full rounded-[14px] object-contain"
                  />
                ) : (
                  <ServiceVectorIllustration type={serviceForm.vector_type} />
                )}
              </div>

              <div className="space-y-3">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold ${previewTheme.badgeBg}`}
                >
                  {serviceForm.service_number || "01"} •{" "}
                  {serviceForm.category || "Category"}
                </span>

                <h4 className="text-xl font-bold text-[#141A29]">
                  {serviceForm.title || "Your Service Title Here"}
                </h4>

                <p className="text-xs leading-relaxed text-[#59667E]">
                  {serviceForm.description ||
                    "Your simple service description will appear here exactly as visitors see it on the Services page."}
                </p>

                <div className="space-y-2 pt-1">
                  {(serviceForm.points || [])
                    .filter(Boolean)
                    .map((pt, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs font-medium text-[#2C3649]"
                      >
                        <CheckCircle2
                          size={14}
                          className="mt-0.5 shrink-0 text-[#035BE3]"
                        />
                        <span>{pt}</span>
                      </div>
                    ))}
                </div>

                <div className="pt-2">
                  <span className="inline-flex h-10 items-center gap-2 rounded-full bg-[#035BE3] px-5 text-xs font-semibold text-white">
                    <span>
                      {serviceForm.button_text || "Enquire About This Service"}
                    </span>
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 3: SERVICE ENQUIRIES (POPUP FORM LEADS)                   */}
      {/* ================================================================= */}
      {activeSubTab === "inquiries" && (
        <div
          className={`rounded-[28px] border p-6 transition-colors ${
            darkMode
              ? "bg-[#131926] border-[#222B3D] text-white"
              : "bg-white border-[#E2E8F0] text-[#141A29]"
          }`}
        >
          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: `All (${inquiries.length})` },
                {
                  id: "new",
                  label: `New (${
                    inquiries.filter((i) => i.status === "new").length
                  })`,
                },
                {
                  id: "contacted",
                  label: `Contacted (${
                    inquiries.filter((i) => i.status === "contacted").length
                  })`,
                },
                {
                  id: "converted",
                  label: `Converted (${
                    inquiries.filter((i) => i.status === "converted").length
                  })`,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setInquiryStatusFilter(tab.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                    inquiryStatusFilter === tab.id
                      ? "bg-[#035BE3] text-white"
                      : darkMode
                      ? "bg-[#1A2234] text-slate-300"
                      : "bg-[#F1F5F9] text-[#475569]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredInquiries.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <MessageSquare className="mx-auto h-8 w-8 text-[#94A3B8]" />
              <p className="text-sm font-bold">No service enquiries yet</p>
              <p className="text-xs text-[#64748B]">
                When visitors submit the popup enquiry form on `/services`, their details will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className={`rounded-2xl border p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    darkMode
                      ? "bg-[#1A2234]/70 border-[#2A354B]"
                      : "bg-[#F8FAFD] border-[#E4EBF5]"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-sm font-bold">{inq.name}</span>
                      <span className="rounded-full bg-[#EEF3FF] px-3 py-0.5 text-[11px] font-bold text-[#035BE3]">
                        {inq.service_title}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase ${
                          inq.status === "new"
                            ? "bg-amber-500/15 text-amber-600"
                            : inq.status === "converted"
                            ? "bg-emerald-500/15 text-emerald-600"
                            : "bg-blue-500/15 text-blue-600"
                        }`}
                      >
                        {inq.status || "new"}
                      </span>
                      <span className="text-[11px] text-[#94A3B8]">
                        {inq.created_at
                          ? new Date(inq.created_at).toLocaleString()
                          : ""}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
                      <a
                        href={`tel:${inq.phone}`}
                        className="inline-flex items-center gap-1 font-semibold text-[#035BE3] hover:underline"
                      >
                        <Phone size={13} />
                        <span>{inq.phone}</span>
                      </a>
                      <a
                        href={`mailto:${inq.email}`}
                        className="inline-flex items-center gap-1 font-semibold hover:text-[#035BE3]"
                      >
                        <Mail size={13} />
                        <span>{inq.email}</span>
                      </a>
                    </div>

                    {inq.message && (
                      <p
                        className={`text-xs leading-relaxed pt-1 ${
                          darkMode ? "text-slate-300" : "text-[#334155]"
                        }`}
                      >
                        <strong>Requirement:</strong> {inq.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <select
                      value={inq.status || "new"}
                      onChange={(e) =>
                        handleInquiryStatusChange(inq, e.target.value)
                      }
                      className={`h-9 rounded-full border px-3.5 text-xs font-bold outline-none cursor-pointer ${
                        darkMode
                          ? "bg-[#131926] border-[#2A354B] text-white"
                          : "bg-white border-[#DCE5F4] text-[#141A29]"
                      }`}
                    >
                      <option value="new">New Lead</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="closed">Closed</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDeleteInquiry(inq.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                      title="Delete Enquiry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
