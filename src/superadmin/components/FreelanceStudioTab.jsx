import React, { useState, useEffect, useRef } from "react";
import {
  Briefcase,
  Plus,
  Play,
  Video,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Globe,
  Users,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  RefreshCw,
  X,
  Save,
  Loader2,
  UploadCloud,
  Link2,
} from "lucide-react";
import {
  getAdminFreelanceModulesApi,
  createFreelanceModuleApi,
  updateFreelanceModuleApi,
  deleteFreelanceModuleApi,
  createFreelanceLessonApi,
  updateFreelanceLessonApi,
  deleteFreelanceLessonApi,
  getAdminFreelanceApplicationsApi,
  updateFreelanceApplicationStatusApi,
  uploadVideoApi,
  getAdminFreelanceTestimonialsApi,
  createAdminFreelanceTestimonialApi,
  updateAdminFreelanceTestimonialApi,
  deleteAdminFreelanceTestimonialApi,
} from "../../services/api";

export default function FreelanceStudioTab({ darkMode }) {
  const [activeSubTab, setActiveSubTab] = useState("curriculum"); // 'curriculum' | 'applications' | 'testimonials'
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [applications, setApplications] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [moduleForm, setModuleForm] = useState({
    module_number: "01",
    title: "",
    subtitle: "",
    order_index: 1,
    is_published: true,
  });

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [videoInputType, setVideoInputType] = useState("upload"); // 'upload' | 'url'
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const videoFileInputRef = useRef(null);

  const [lessonForm, setLessonForm] = useState({
    module_id: null,
    lesson_number: "1",
    title: "",
    duration: "18:00 Mins",
    video_url: "",
    language: "Hindi",
    order_index: 1,
    is_published: true,
  });

  // Testimonial Modal State
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    location: "",
    skill: "Video Editing",
    badge: "Freelancer",
    story: "",
    earned: "₹35,000/mo",
    rating: 5,
    is_approved: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Fetch Data
  const loadData = async () => {
    try {
      setLoading(true);
      const [modsRes, appsRes, testRes] = await Promise.allSettled([
        getAdminFreelanceModulesApi(),
        getAdminFreelanceApplicationsApi(),
        getAdminFreelanceTestimonialsApi(),
      ]);

      if (modsRes.status === "fulfilled" && modsRes.value?.success) {
        setModules(modsRes.value.modules || []);
      }
      if (appsRes.status === "fulfilled" && appsRes.value?.success) {
        setApplications(appsRes.value.applications || []);
      }
      if (testRes.status === "fulfilled" && testRes.value?.success) {
        setTestimonials(testRes.value.testimonials || []);
      }
    } catch (err) {
      console.error("Failed to load freelance admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Module Create/Update
  const handleSaveModule = async (e) => {
    e.preventDefault();
    if (!moduleForm.title.trim()) return;

    try {
      setIsSaving(true);
      if (editingModule) {
        await updateFreelanceModuleApi(editingModule.id, moduleForm);
      } else {
        await createFreelanceModuleApi(moduleForm);
      }
      setShowModuleModal(false);
      setEditingModule(null);
      loadData();
    } catch (err) {
      alert("Error saving module: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteModule = async (id) => {
    if (!window.confirm("Are you sure? All lessons under this module will also be deleted.")) return;
    try {
      await deleteFreelanceModuleApi(id);
      loadData();
    } catch (err) {
      alert("Error deleting module: " + err.message);
    }
  };

  // Video File Upload Handler (Direct file upload like courses)
  const handleVideoFileUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a valid video file (.mp4, .mov, .webm, etc.)");
      return;
    }

    setIsUploadingVideo(true);
    setUploadProgressText("Uploading video to Cloudinary...");

    try {
      const res = await uploadVideoApi(file, "knowway_freelance/lectures");
      if (res?.success && res.data?.url) {
        setLessonForm((prev) => ({
          ...prev,
          video_url: res.data.url,
          duration: res.data.duration ? `${res.data.duration} Mins` : prev.duration,
        }));
        setUploadProgressText("Video uploaded successfully!");
      } else {
        alert(res?.message || "Failed to upload video to Cloudinary");
      }
    } catch (err) {
      alert(err.message || "Error uploading video to Cloudinary");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Handle Lesson Create/Update
  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim() || !lessonForm.video_url.trim()) {
      alert("Please enter title and either upload a video or provide a video URL.");
      return;
    }

    try {
      setIsSaving(true);
      if (editingLesson) {
        await updateFreelanceLessonApi(editingLesson.id, lessonForm);
      } else {
        await createFreelanceLessonApi(lessonForm);
      }
      setShowLessonModal(false);
      setEditingLesson(null);
      loadData();
    } catch (err) {
      alert("Error saving lesson: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLesson = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video lecture?")) return;
    try {
      await deleteFreelanceLessonApi(id);
      loadData();
    } catch (err) {
      alert("Error deleting lesson: " + err.message);
    }
  };

  // Handle Application Status
  const handleUpdateAppStatus = async (id, newStatus) => {
    try {
      await updateFreelanceApplicationStatusApi(id, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  // Handle Testimonial Save/Delete
  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    if (!testimonialForm.name.trim() || !testimonialForm.story.trim()) {
      alert("Please provide both student name and testimonial story.");
      return;
    }

    try {
      setIsSaving(true);
      if (editingTestimonial) {
        await updateAdminFreelanceTestimonialApi(editingTestimonial.id, testimonialForm);
      } else {
        await createAdminFreelanceTestimonialApi(testimonialForm);
      }
      setShowTestimonialModal(false);
      setEditingTestimonial(null);
      loadData();
    } catch (err) {
      alert("Error saving testimonial: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await deleteAdminFreelanceTestimonialApi(id);
      loadData();
    } catch (err) {
      alert("Error deleting testimonial: " + err.message);
    }
  };

  const handleToggleTestimonialApproval = async (item) => {
    try {
      await updateAdminFreelanceTestimonialApi(item.id, {
        ...item,
        is_approved: !item.is_approved,
      });
      loadData();
    } catch (err) {
      alert("Error toggling approval: " + err.message);
    }
  };

  const filteredTestimonials = testimonials.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      (t.skill && t.skill.toLowerCase().includes(q)) ||
      (t.badge && t.badge.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-5 ${
          darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
        }`}
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#035BE3]/10 text-[#035BE3] border border-[#035BE3]/20 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Freelance Management Studio</span>
          </div>
          <h2
            className={`text-xl sm:text-2xl font-black ${
              darkMode ? "text-white" : "text-[#0F172A]"
            }`}
          >
            Freelance Accelerator Studio
          </h2>
          <p
            className={`text-xs mt-1 ${
              darkMode ? "text-[#94A3B8]" : "text-[#556377]"
            }`}
          >
            Manage modules, upload secure video lessons (DRM protected), manage student spotlight testimonials, and review client applications.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-2xl border flex items-center gap-1 ${
              darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
            }`}
          >
            <button
              onClick={() => setActiveSubTab("curriculum")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubTab === "curriculum"
                  ? "bg-[#035BE3] text-white shadow-xs"
                  : darkMode
                  ? "text-[#8A99AD] hover:text-white"
                  : "text-[#556377] hover:text-[#0F172A]"
              }`}
            >
              Modules & Lessons ({modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)})
            </button>
            <button
              onClick={() => setActiveSubTab("testimonials")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubTab === "testimonials"
                  ? "bg-[#035BE3] text-white shadow-xs"
                  : darkMode
                  ? "text-[#8A99AD] hover:text-white"
                  : "text-[#556377] hover:text-[#0F172A]"
              }`}
            >
              Testimonials ({testimonials.length})
            </button>
            <button
              onClick={() => setActiveSubTab("applications")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "applications"
                  ? "bg-[#035BE3] text-white shadow-xs"
                  : darkMode
                  ? "text-[#8A99AD] hover:text-white"
                  : "text-[#556377] hover:text-[#0F172A]"
              }`}
            >
              <span>Applications ({applications.length})</span>
              {applications.filter((a) => a.status === "pending").length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          </div>

          <button
            onClick={loadData}
            title="Refresh"
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition cursor-pointer ${
              darkMode
                ? "border-[#222B3D] text-[#8A99AD] hover:text-white hover:bg-[#1E2638]"
                : "border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#035BE3]" : ""}`} />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUBTAB 1: CURRICULUM MODULES & VIDEO LESSONS */}
      {/* ======================================================== */}
      {activeSubTab === "curriculum" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3
              className={`text-base font-bold ${
                darkMode ? "text-white" : "text-[#0F172A]"
              }`}
            >
              Freelancing Video Curriculum ({modules.length} Modules)
            </h3>
            <button
              onClick={() => {
                setEditingModule(null);
                setModuleForm({
                  module_number: String(modules.length + 1).padStart(2, "0"),
                  title: "",
                  subtitle: "",
                  order_index: modules.length + 1,
                  is_published: true,
                });
                setShowModuleModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Module</span>
            </button>
          </div>

          {modules.length === 0 ? (
            <div
              className={`p-12 rounded-3xl border text-center space-y-3 ${
                darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
              }`}
            >
              <Video className="w-10 h-10 text-[#8A99AD] mx-auto opacity-40" />
              <h4 className="text-base font-bold">No Modules Found</h4>
              <p className="text-xs text-[#8A99AD] max-w-sm mx-auto">
                Click &ldquo;Create Module&rdquo; to start publishing freelance lessons for students.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {modules.map((mod) => (
                <div
                  key={mod.id}
                  className={`rounded-3xl border p-6 transition-all ${
                    darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
                  }`}
                >
                  {/* Module Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-inherit">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-[#035BE3]/10 text-[#035BE3] font-black text-sm flex items-center justify-center shrink-0">
                        {mod.module_number}
                      </span>
                      <div>
                        <h4
                          className={`text-base font-bold ${
                            darkMode ? "text-white" : "text-[#0F172A]"
                          }`}
                        >
                          {mod.title}
                        </h4>
                        <p className="text-xs text-[#8A99AD] mt-0.5">{mod.subtitle || "No description"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingLesson(null);
                          setVideoInputType("upload");
                          setUploadProgressText("");
                          setLessonForm({
                            module_id: mod.id,
                            lesson_number: String((mod.lessons?.length || 0) + 1),
                            title: "",
                            duration: "18:00 Mins",
                            video_url: "",
                            language: "Hindi",
                            order_index: (mod.lessons?.length || 0) + 1,
                            is_published: true,
                          });
                          setShowLessonModal(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl border border-[#035BE3]/40 text-[#035BE3] hover:bg-[#035BE3]/10 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Lesson</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingModule(mod);
                          setModuleForm({
                            module_number: mod.module_number,
                            title: mod.title,
                            subtitle: mod.subtitle || "",
                            order_index: mod.order_index,
                            is_published: Boolean(mod.is_published),
                          });
                          setShowModuleModal(true);
                        }}
                        className={`p-2 rounded-xl border border-inherit transition cursor-pointer ${
                          darkMode ? "text-[#8A99AD] hover:text-white" : "text-[#556377] hover:text-[#0F172A]"
                        }`}
                        title="Edit Module"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteModule(mod.id)}
                        className="p-2 rounded-xl border border-inherit text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                        title="Delete Module"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Lessons List under this Module */}
                  <div className="space-y-2.5 pt-4">
                    {mod.lessons?.length === 0 ? (
                      <p className="text-xs text-[#8A99AD] italic py-2">
                        No video lessons in this module yet. Click &ldquo;Add Lesson&rdquo; above.
                      </p>
                    ) : (
                      mod.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFD] border-[#E2E8F0]"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                                darkMode ? "bg-gray-800 text-[#8A99AD]" : "bg-gray-100 text-[#64748B]"
                              }`}
                            >
                              {lesson.lesson_number}
                            </span>
                            <div className="min-w-0">
                              <h5
                                className={`text-xs sm:text-sm font-bold truncate ${
                                  darkMode ? "text-white" : "text-[#0F172A]"
                                }`}
                              >
                                {lesson.title}
                              </h5>
                              <div className="flex items-center gap-2 text-[10px] text-[#8A99AD] mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{lesson.duration}</span>
                                </span>
                                <span>•</span>
                                <span className="px-2 py-0.2 rounded-md bg-blue-500/10 text-[#035BE3] font-bold">
                                  {lesson.language}
                                </span>
                                <span>•</span>
                                <span className="truncate max-w-[220px] font-mono text-gray-500">
                                  {lesson.video_url}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <button
                              onClick={() => {
                                setEditingLesson(lesson);
                                setVideoInputType(
                                  lesson.video_url?.includes("cloudinary") || !lesson.video_url?.includes("youtube")
                                    ? "upload"
                                    : "url"
                                );
                                setLessonForm({
                                  module_id: lesson.module_id,
                                  lesson_number: lesson.lesson_number,
                                  title: lesson.title,
                                  duration: lesson.duration,
                                  video_url: lesson.video_url,
                                  language: lesson.language || "Hindi",
                                  order_index: lesson.order_index,
                                  is_published: Boolean(lesson.is_published),
                                });
                                setShowLessonModal(true);
                              }}
                              className={`p-1.5 rounded-lg border border-inherit transition cursor-pointer ${
                                darkMode ? "text-[#8A99AD] hover:text-white" : "text-[#556377] hover:text-[#0F172A]"
                              }`}
                              title="Edit Lesson"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="p-1.5 rounded-lg border border-inherit text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                              title="Delete Lesson"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 2: STUDENT FREELANCE APPLICATIONS */}
      {/* ======================================================== */}
      {activeSubTab === "applications" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3
              className={`text-base font-bold ${
                darkMode ? "text-white" : "text-[#0F172A]"
              }`}
            >
              Student Application Submissions ({applications.length})
            </h3>

            <div
              className={`h-10 px-3.5 rounded-2xl border flex items-center gap-2 ${
                darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
              }`}
            >
              <Search className="w-4 h-4 text-[#8A99AD]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student or skill..."
                className="bg-transparent text-xs outline-none w-48 sm:w-60"
              />
            </div>
          </div>

          <div
            className={`rounded-3xl border overflow-hidden ${
              darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`border-b ${
                    darkMode ? "bg-[#0E1420] border-[#222B3D] text-[#8A99AD]" : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]"
                  }`}
                >
                  <tr>
                    <th className="py-3.5 px-5 font-bold uppercase text-[10px]">Student Details</th>
                    <th className="py-3.5 px-5 font-bold uppercase text-[10px]">Skill & Exp</th>
                    <th className="py-3.5 px-5 font-bold uppercase text-[10px]">Availability</th>
                    <th className="py-3.5 px-5 font-bold uppercase text-[10px]">Portfolio Link</th>
                    <th className="py-3.5 px-5 font-bold uppercase text-[10px]">Date</th>
                    <th className="py-3.5 px-5 font-bold uppercase text-[10px]">Status</th>
                    <th className="py-3.5 px-5 font-bold uppercase text-[10px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs text-[#8A99AD]">
                        No freelance applications received yet.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => (
                      <tr
                        key={app.id}
                        className={`transition-colors ${
                          darkMode ? "hover:bg-[#1E2638]/40" : "hover:bg-[#F8FAFD]"
                        }`}
                      >
                        <td className="py-4 px-5">
                          <div
                            className={`font-bold ${
                              darkMode ? "text-white" : "text-[#0F172A]"
                            }`}
                          >
                            {app.name}
                          </div>
                          <div className="text-[11px] text-[#8A99AD] flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3 h-3 text-emerald-500" />
                            <a href={`https://wa.me/91${app.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:underline text-emerald-500 font-bold">
                              {app.phone}
                            </a>
                            {app.email && (
                              <>
                                <span>•</span>
                                <span>{app.email}</span>
                              </>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <span className="font-bold text-[#035BE3] block">{app.skill}</span>
                          <span className="text-[10px] text-[#8A99AD]">{app.experience_level}</span>
                        </td>

                        <td className="py-4 px-5 text-[#8A99AD]">
                          {app.hours_available || "Part-time"}
                        </td>

                        <td className="py-4 px-5">
                          {app.portfolio_url ? (
                            <a
                              href={app.portfolio_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#035BE3] hover:underline"
                            >
                              <span>View Work</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-[#8A99AD]">—</span>
                          )}
                        </td>

                        <td className="py-4 px-5 text-[#8A99AD]">
                          {app.created_at
                            ? new Date(app.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })
                            : "—"}
                        </td>

                        <td className="py-4 px-5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              app.status === "approved"
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                : app.status === "contacted"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : app.status === "rejected"
                                ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            }`}
                          >
                            {app.status.toUpperCase()}
                          </span>
                        </td>

                        <td className="py-4 px-5">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                            className={`h-8 px-2 rounded-lg border text-xs font-semibold outline-none cursor-pointer ${
                              darkMode ? "bg-[#0E1420] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0]"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
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

      {/* ======================================================== */}
      {/* SUBTAB 3: FREELANCER TESTIMONIALS SPOTLIGHT */}
      {/* ======================================================== */}
      {activeSubTab === "testimonials" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3
                className={`text-base font-bold ${
                  darkMode ? "text-white" : "text-[#0F172A]"
                }`}
              >
                Freelance Spotlight Testimonials ({testimonials.length})
              </h3>
              <p
                className={`text-xs mt-0.5 ${
                  darkMode ? "text-[#94A3B8]" : "text-[#556377]"
                }`}
              >
                Manage student success stories shown in the student Freelance Spotlight horizontal slider.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`h-10 px-3.5 rounded-2xl border flex items-center gap-2 ${
                  darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                }`}
              >
                <Search className="w-4 h-4 text-[#8A99AD]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search testimonials..."
                  className="bg-transparent text-xs outline-none w-40 sm:w-52"
                />
              </div>

              <button
                onClick={() => {
                  setEditingTestimonial(null);
                  setTestimonialForm({
                    name: "",
                    location: "",
                    skill: "Video Editing",
                    badge: "Freelancer",
                    story: "",
                    earned: "₹35,000/mo",
                    rating: 5,
                    is_approved: true,
                  });
                  setShowTestimonialModal(true);
                }}
                className="h-10 px-4 rounded-xl bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Testimonial</span>
              </button>
            </div>
          </div>

          <div
            className={`rounded-3xl border overflow-hidden ${
              darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`border-b ${
                    darkMode
                      ? "bg-[#0E1420] border-[#222B3D] text-[#8A99AD]"
                      : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]"
                  }`}
                >
                  <tr>
                    <th className="py-3.5 px-5 font-bold uppercase text-[10px]">Student / Freelancer</th>
                    <th className="py-3.5 px-5 font-bold uppercase text-[10px]">Skill & Role</th>
                    <th className="py-3.5 px-5 font-bold uppercase text-[10px]">Monthly Earned</th>
                    <th className="py-3.5 px-5 font-bold uppercase text-[10px] max-w-[260px]">Story / Experience</th>
                    <th className="py-3.5 px-5 font-bold uppercase text-[10px]">Status</th>
                    <th className="py-3.5 px-5 font-bold uppercase text-[10px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    darkMode ? "divide-[#222B3D]" : "divide-[#E2E8F0]"
                  }`}
                >
                  {filteredTestimonials.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-xs text-[#8A99AD]">
                        No testimonials found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredTestimonials.map((item) => (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          darkMode ? "hover:bg-[#1E2638]/40" : "hover:bg-[#F8FAFD]"
                        }`}
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl bg-linear-to-tr ${
                                item.avatar_bg || "from-amber-400 to-orange-500"
                              } text-white font-black text-xs flex items-center justify-center shrink-0`}
                            >
                              {item.name?.charAt(0) || "S"}
                            </div>
                            <div>
                              <div
                                className={`font-bold ${
                                  darkMode ? "text-white" : "text-[#0F172A]"
                                }`}
                              >
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#8A99AD]">
                                {item.location || "India"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <span className="font-bold text-[#035BE3] block">{item.skill}</span>
                          <span className="text-[10px] text-[#8A99AD]">{item.badge}</span>
                        </td>

                        <td className="py-4 px-5">
                          <span className="font-bold font-mono text-emerald-500">
                            {item.earned}
                          </span>
                        </td>

                        <td className="py-4 px-5 max-w-[260px]">
                          <p
                            className={`text-xs line-clamp-2 italic ${
                              darkMode ? "text-[#94A3B8]" : "text-[#556377]"
                            }`}
                          >
                            &ldquo;{item.story}&rdquo;
                          </p>
                        </td>

                        <td className="py-4 px-5">
                          <button
                            onClick={() => handleToggleTestimonialApproval(item)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                              item.is_approved
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20"
                                : "bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20"
                            }`}
                            title="Click to toggle live spotlight approval"
                          >
                            {item.is_approved ? "APPROVED & LIVE" : "HIDDEN"}
                          </button>
                        </td>

                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingTestimonial(item);
                                setTestimonialForm({
                                  name: item.name,
                                  location: item.location || "",
                                  skill: item.skill,
                                  badge: item.badge || "",
                                  story: item.story,
                                  earned: item.earned || "",
                                  rating: item.rating || 5,
                                  is_approved: Boolean(item.is_approved),
                                });
                                setShowTestimonialModal(true);
                              }}
                              className="p-1.5 rounded-lg border border-inherit text-[#8A99AD] hover:text-[#035BE3] transition cursor-pointer"
                              title="Edit Testimonial"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTestimonial(item.id)}
                              className="p-1.5 rounded-lg border border-inherit text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                              title="Delete Testimonial"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

      {/* ======================================================== */}
      {/* MODAL 3: CREATE / EDIT TESTIMONIAL */}
      {/* ======================================================== */}
      {showTestimonialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div
            className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 ${
              darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            <button
              onClick={() => setShowTestimonialModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-inherit flex items-center justify-center text-[#8A99AD] hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black mb-1">
              {editingTestimonial ? "Edit Freelance Testimonial" : "Add Student Testimonial"}
            </h3>
            <p className="text-xs text-[#8A99AD] mb-4">
              Publish or edit stories displayed on the Student Freelance Spotlight horizontal slider.
            </p>

            <form onSubmit={handleSaveTestimonial} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                    Student Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full h-10 px-3 rounded-xl border text-xs outline-none ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                    City / State
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.location}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, location: e.target.value })}
                    placeholder="e.g. Delhi"
                    className={`w-full h-10 px-3 rounded-xl border text-xs outline-none ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                    Skill <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={testimonialForm.skill}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, skill: e.target.value })}
                    placeholder="e.g. Video Editing & Reels"
                    className={`w-full h-10 px-3 rounded-xl border text-xs outline-none ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.badge}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, badge: e.target.value })}
                    placeholder="e.g. Short-Form Editor"
                    className={`w-full h-10 px-3 rounded-xl border text-xs outline-none ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                    Monthly Earnings
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.earned}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, earned: e.target.value })}
                    placeholder="e.g. ₹40,000/mo"
                    className={`w-full h-10 px-3 rounded-xl border text-xs outline-none ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                    Live Status
                  </label>
                  <select
                    value={testimonialForm.is_approved ? "1" : "0"}
                    onChange={(e) =>
                      setTestimonialForm({ ...testimonialForm, is_approved: e.target.value === "1" })
                    }
                    className={`w-full h-10 px-3 rounded-xl border text-xs outline-none cursor-pointer ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                  >
                    <option value="1">Approved & Live</option>
                    <option value="0">Hidden / Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                  Testimonial Story <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={testimonialForm.story}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, story: e.target.value })}
                  placeholder="Share how the course helped them close clients and achieve income..."
                  className={`w-full p-3 rounded-xl border text-xs outline-none resize-none ${
                    darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full h-11 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer !mt-5 shadow-xs disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{editingTestimonial ? "Save Changes" : "Publish Testimonial"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: CREATE / EDIT MODULE */}
      {/* ======================================================== */}
      {showModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div
            className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 ${
              darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            <button
              onClick={() => setShowModuleModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-inherit flex items-center justify-center text-[#8A99AD] hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black mb-1">
              {editingModule ? "Edit Freelance Module" : "Create New Module"}
            </h3>
            <p className="text-xs text-[#8A99AD] mb-4">
              Group related freelancing video lessons together.
            </p>

            <form onSubmit={handleSaveModule} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                    Number
                  </label>
                  <input
                    type="text"
                    required
                    value={moduleForm.module_number}
                    onChange={(e) => setModuleForm({ ...moduleForm, module_number: e.target.value })}
                    placeholder="01"
                    className={`w-full h-10 px-3 rounded-xl border text-xs outline-none ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                    Module Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                    placeholder="Module 1 : Foundations of Freelancing"
                    className={`w-full h-10 px-3 rounded-xl border text-xs outline-none ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                  Subtitle / Learning Roadmap
                </label>
                <input
                  type="text"
                  value={moduleForm.subtitle}
                  onChange={(e) => setModuleForm({ ...moduleForm, subtitle: e.target.value })}
                  placeholder="Launch your career with the 3 pillars and 1 Lakh roadmap"
                  className={`w-full h-10 px-3 rounded-xl border text-xs outline-none ${
                    darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full h-11 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer !mt-5 shadow-xs disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{editingModule ? "Save Changes" : "Create Module"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CREATE / EDIT LESSON WITH SECURE VIDEO LINK */}
      {/* ======================================================== */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div
            className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 ${
              darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            <button
              onClick={() => setShowLessonModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-inherit flex items-center justify-center text-[#8A99AD] hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black mb-1">
              {editingLesson ? "Edit Freelance Video Lesson" : "Add Video Lesson"}
            </h3>
            <p className="text-xs text-[#8A99AD] mb-4">
              Enter secure video source. Central DRM & watermark protection applies automatically.
            </p>

            <form onSubmit={handleSaveLesson} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                  Parent Module <span className="text-rose-500">*</span>
                </label>
                <select
                  value={lessonForm.module_id || ""}
                  onChange={(e) => setLessonForm({ ...lessonForm, module_id: Number(e.target.value) })}
                  className={`w-full h-10 px-3 rounded-xl border text-xs outline-none ${
                    darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                  }`}
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.module_number} - {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                    Lesson #
                  </label>
                  <input
                    type="text"
                    required
                    value={lessonForm.lesson_number}
                    onChange={(e) => setLessonForm({ ...lessonForm, lesson_number: e.target.value })}
                    placeholder="1"
                    className={`w-full h-10 px-3 rounded-xl border text-xs outline-none ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                    Lesson Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    placeholder="Three Foundations of Freelancing Success"
                    className={`w-full h-10 px-3 rounded-xl border text-xs outline-none ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    placeholder="18:45 Mins"
                    className={`w-full h-10 px-3 rounded-xl border text-xs outline-none ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#8A99AD] block mb-1">
                    Language
                  </label>
                  <select
                    value={lessonForm.language}
                    onChange={(e) => setLessonForm({ ...lessonForm, language: e.target.value })}
                    className={`w-full h-10 px-3 rounded-xl border text-xs outline-none ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                    }`}
                  >
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                  </select>
                </div>
              </div>

              {/* Video Source Option: Upload Video File OR Enter URL */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#8A99AD]">
                    Lesson Video Source <span className="text-rose-500">*</span>
                  </label>
                  {/* Selector Tabs: Direct File Upload vs External Link */}
                  <div
                    className={`flex items-center p-0.5 rounded-lg border text-[11px] font-bold ${
                      darkMode ? "bg-[#0A0E17] border-[#222B3D]" : "bg-[#F1F5F9] border-[#E2E8F0]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setVideoInputType("upload")}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                        videoInputType === "upload"
                          ? "bg-[#035BE3] text-white shadow-xs"
                          : darkMode
                          ? "text-[#8A99AD] hover:text-white"
                          : "text-[#556377] hover:text-[#0F172A]"
                      }`}
                    >
                      <UploadCloud className="w-3 h-3" />
                      <span>Upload Video File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoInputType("url")}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                        videoInputType === "url"
                          ? "bg-[#035BE3] text-white shadow-xs"
                          : darkMode
                          ? "text-[#8A99AD] hover:text-white"
                          : "text-[#556377] hover:text-[#0F172A]"
                      }`}
                    >
                      <Link2 className="w-3 h-3" />
                      <span>Paste URL</span>
                    </button>
                  </div>
                </div>

                {videoInputType === "upload" ? (
                  <div className="space-y-2">
                    <label
                      className={`w-full border-2 border-dashed rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                        darkMode
                          ? "border-[#222B3D] bg-[#0E1420] hover:border-[#035BE3]"
                          : "border-[#CBD5E1] bg-[#F8FAFD] hover:border-[#035BE3]"
                      }`}
                    >
                      <input
                        type="file"
                        ref={videoFileInputRef}
                        accept="video/mp4,video/mov,video/webm,video/quicktime,video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleVideoFileUpload(file);
                        }}
                        disabled={isUploadingVideo}
                        className="hidden"
                      />
                      {isUploadingVideo ? (
                        <div className="py-2 space-y-2">
                          <Loader2 className="w-7 h-7 text-[#035BE3] animate-spin mx-auto" />
                          <p className="text-xs font-bold text-[#035BE3]">
                            {uploadProgressText || "Uploading Video..."}
                          </p>
                          <p className="text-[10px] text-[#8A99AD]">
                            Uploading to Cloudinary storage. Please wait...
                          </p>
                        </div>
                      ) : lessonForm.video_url ? (
                        <div className="py-1 space-y-1.5 w-full">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-emerald-500">Video Uploaded & Ready!</p>
                          <p className="text-[11px] font-mono text-[#8A99AD] truncate max-w-sm mx-auto px-2">
                            {lessonForm.video_url}
                          </p>
                          <span className="inline-block mt-1 text-[10px] font-bold text-[#035BE3] underline">
                            Click here to choose a different video file
                          </span>
                        </div>
                      ) : (
                        <div className="py-2 space-y-1">
                          <div className="w-10 h-10 rounded-xl bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center mx-auto mb-2">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <p
                            className={`text-xs font-bold ${
                              darkMode ? "text-white" : "text-[#0F172A]"
                            }`}
                          >
                            Click to upload video file (.mp4, .mov, .webm)
                          </p>
                          <p className="text-[10px] text-[#8A99AD]">
                            Directly uploads to The Skillpreneur secure Cloudinary storage
                          </p>
                        </div>
                      )}
                    </label>

                    {lessonForm.video_url && (
                      <div className="flex items-center justify-between text-[11px] px-1 text-[#8A99AD]">
                        <span>Stream Ready</span>
                        <button
                          type="button"
                          onClick={() => setLessonForm({ ...lessonForm, video_url: "" })}
                          className="text-rose-500 hover:underline cursor-pointer font-semibold"
                        >
                          Remove file
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      required={videoInputType === "url"}
                      value={lessonForm.video_url}
                      onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                      placeholder="https://www.youtube.com/embed/... or https://res.cloudinary.com/..."
                      className={`w-full h-10 px-3 rounded-xl border text-xs outline-none font-mono ${
                        darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
                      }`}
                    />
                  </div>
                )}

                <span className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>DRM student watermark overlay will automatically protect this stream</span>
                </span>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full h-11 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer !mt-5 shadow-xs disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{editingLesson ? "Save Changes" : "Publish Lesson"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
