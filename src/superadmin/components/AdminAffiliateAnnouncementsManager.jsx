import React, { useState } from "react";
import {
  Megaphone,
  Plus,
  Pencil,
  Trash2,
  Pin,
  PinOff,
  ExternalLink,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Award,
  Wallet,
  Zap,
} from "lucide-react";

export default function AdminAffiliateAnnouncementsManager({
  darkMode,
  announcements = [],
  loading = false,
  onSave,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const initialFormData = {
    title: "",
    content: "",
    category: "contest",
    priority: "normal",
    badge_text: "",
    action_label: "",
    action_url: "",
    is_pinned: false,
    is_active: true,
  };

  const [formData, setFormData] = useState(initialFormData);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      content: item.content || "",
      category: item.category || "general",
      priority: item.priority || "normal",
      badge_text: item.badge_text || "",
      action_label: item.action_label || "",
      action_url: item.action_url || "",
      is_pinned: Boolean(item.is_pinned),
      is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Title and content are required.");
      return;
    }
    setIsSaving(true);
    try {
      await onSave(formData, editingItem ? editingItem.id : null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePin = async (item) => {
    await onSave({ ...item, is_pinned: !item.is_pinned }, item.id);
  };

  const handleToggleActive = async (item) => {
    await onSave({ ...item, is_active: !item.is_active }, item.id);
  };

  const filteredList = announcements.filter((a) => {
    const matchSearch =
      (a.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.content || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.badge_text || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || a.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 text-xs ${
              darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-white border-[#E2E8F0]"
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#8A99AD]" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full text-xs"
            />
          </div>

          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold outline-none cursor-pointer ${
              darkMode ? "bg-[#0E1420] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            <option value="all">All Categories</option>
            <option value="contest">🏆 Contests & Bonuses</option>
            <option value="payout">💰 Payouts & System</option>
            <option value="promo">🚀 Marketing Packs</option>
            <option value="general">📢 General News</option>
          </select>
        </div>

        <button
          onClick={openCreateModal}
          className="h-9 px-4 rounded-xl bg-[#035BE3] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post Announcement</span>
        </button>
      </div>

      {/* Announcements Table */}
      <div
        className={`rounded-[24px] border overflow-hidden transition-colors ${
          darkMode ? "bg-[#131926] border-[#222B3D]" : "bg-white border-[#E2E8F0] shadow-xs"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className={`border-b uppercase text-[10px] tracking-wider ${
                  darkMode
                    ? "bg-[#0B0F17] border-[#222B3D] text-[#94A3B8]"
                    : "bg-[#F8FAFD] border-[#E2E8F0] text-[#64748B]"
                }`}
              >
                <th className="py-3.5 px-5 font-bold">Status</th>
                <th className="py-3.5 px-5 font-bold">Announcement Title & Details</th>
                <th className="py-3.5 px-5 font-bold">Category</th>
                <th className="py-3.5 px-5 font-bold">Priority</th>
                <th className="py-3.5 px-5 font-bold">Action Link</th>
                <th className="py-3.5 px-5 font-bold">Date Posted</th>
                <th className="py-3.5 px-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? "divide-[#1E2638]" : "divide-[#F1F5F9]"}`}>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8A99AD]">
                    Loading affiliate announcements...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8A99AD]">
                    <Megaphone className="w-8 h-8 mx-auto text-[#8A99AD] mb-2 opacity-40" />
                    <p className="font-semibold">No announcements found.</p>
                    <p className="text-[11px] mt-1 text-[#8A99AD]">
                      Click "Post Announcement" to broadcast news or leader contests to your affiliates.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      darkMode ? "hover:bg-[#1E2638]/50" : "hover:bg-[#F8FAFD]"
                    }`}
                  >
                    {/* Status & Pin */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleActive(item)}
                          title={item.is_active ? "Active (Click to Deactivate)" : "Inactive (Click to Activate)"}
                          className="cursor-pointer"
                        >
                          {item.is_active ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
                              Inactive
                            </span>
                          )}
                        </button>
                        {Boolean(item.is_pinned) && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                            <Pin className="w-2.5 h-2.5" /> Pinned
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Title & Preview */}
                    <td className="py-4 px-5 max-w-sm">
                      <div className="flex items-center gap-2">
                        {item.badge_text && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-[#035BE3] border border-blue-500/20 shrink-0">
                            {item.badge_text}
                          </span>
                        )}
                        <h4 className="font-bold text-xs truncate">{item.title}</h4>
                      </div>
                      <p className="text-[11px] text-[#8A99AD] line-clamp-1 mt-1">
                        {item.content}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-5">
                      <span className="capitalize font-semibold text-xs text-[#8A99AD]">
                        {item.category === "contest"
                          ? "🏆 Contest"
                          : item.category === "payout"
                          ? "💰 Payout"
                          : item.category === "promo"
                          ? "🚀 Promo"
                          : "📢 General"}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-4 px-5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                          item.priority === "urgent"
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : item.priority === "high"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-blue-500/10 text-[#035BE3] border-blue-500/20"
                        }`}
                      >
                        {item.priority || "normal"}
                      </span>
                    </td>

                    {/* Action link */}
                    <td className="py-4 px-5">
                      {item.action_url ? (
                        <a
                          href={item.action_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#035BE3] hover:underline"
                        >
                          <span>{item.action_label || "Visit Link"}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-[#8A99AD]">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 text-[11px] text-[#8A99AD]">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleTogglePin(item)}
                          title={item.is_pinned ? "Unpin Announcement" : "Pin to Top"}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            item.is_pinned
                              ? "bg-amber-500/15 border-amber-500/30 text-amber-500"
                              : darkMode
                              ? "border-[#222B3D] text-[#8A99AD] hover:text-white"
                              : "border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]"
                          }`}
                        >
                          {item.is_pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => openEditModal(item)}
                          title="Edit Announcement"
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            darkMode
                              ? "border-[#222B3D] text-[#8A99AD] hover:text-[#035BE3]"
                              : "border-[#E2E8F0] text-[#64748B] hover:text-[#035BE3]"
                          }`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          title="Delete"
                          className="p-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition cursor-pointer"
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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div
            className={`w-full max-w-lg rounded-[28px] border p-6 shadow-2xl transition-all ${
              darkMode ? "bg-[#131926] border-[#222B3D] text-white" : "bg-white border-[#E2E8F0] text-[#0F172A]"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <div>
                <h3 className="text-base font-bold">
                  {editingItem ? "Edit Affiliate Announcement" : "Create Affiliate Announcement"}
                </h3>
                <p className="text-xs text-[#8A99AD] mt-0.5">
                  Publish leader contests, incentive milestones, or payout updates.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-inherit flex items-center justify-center text-[#8A99AD] hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#8A99AD] uppercase block mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Diwal Leaderboard Contest — Win ₹50,000 Cash!"
                  className={`h-9 w-full rounded-xl border px-3 text-xs outline-none ${
                    darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#8A99AD] uppercase block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`h-9 w-full rounded-xl border px-3 text-xs outline-none ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                    }`}
                  >
                    <option value="contest">🏆 Contests & Bonuses</option>
                    <option value="payout">💰 Payouts & System</option>
                    <option value="promo">🚀 Marketing Packs</option>
                    <option value="general">📢 General News</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#8A99AD] uppercase block mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className={`h-9 w-full rounded-xl border px-3 text-xs outline-none ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                    }`}
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8A99AD] uppercase block mb-1">
                  Tag / Badge Text (Optional)
                </label>
                <input
                  type="text"
                  value={formData.badge_text}
                  onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                  placeholder="e.g. Cash Prize • Payout Milestone • VIP Access"
                  className={`h-9 w-full rounded-xl border px-3 text-xs outline-none ${
                    darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8A99AD] uppercase block mb-1">
                  Announcement Content / Instructions *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write full details about rules, payout schedules, guidelines or leaderboard criteria..."
                  className={`w-full rounded-xl border p-3 text-xs outline-none ${
                    darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#8A99AD] uppercase block mb-1">
                    Button Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.action_label}
                    onChange={(e) => setFormData({ ...formData, action_label: e.target.value })}
                    placeholder="e.g. View Leaderboard"
                    className={`h-9 w-full rounded-xl border px-3 text-xs outline-none ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#8A99AD] uppercase block mb-1">
                    Button Link / URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.action_url}
                    onChange={(e) => setFormData({ ...formData, action_url: e.target.value })}
                    placeholder="e.g. https://... or /affiliate/dashboard"
                    className={`h-9 w-full rounded-xl border px-3 text-xs outline-none ${
                      darkMode ? "bg-[#0E1420] border-[#222B3D]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_pinned}
                    onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                    className="rounded text-[#035BE3]"
                  />
                  <span className="text-xs font-semibold">📌 Pin to Top</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded text-[#035BE3]"
                  />
                  <span className="text-xs font-semibold">🟢 Publish as Active</span>
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full h-11 rounded-xl bg-[#035BE3] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  {isSaving ? "Publishing Announcement..." : editingItem ? "Save Changes" : "Post Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
