import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Camera,
  Loader2,
  Sparkles,
  ArrowUpRight,
  LogOut,
  User as UserIcon,
  BookOpen,
  LayoutDashboard,
  CheckCircle2,
  Package,
} from "lucide-react";
import {
  getUserData,
  getUserToken,
  setUserSession,
  clearUserSession,
  uploadUserAvatarApi,
  getMyPackagesApi,
} from "../services/api";

export default function UserAvatarDropdown({
  user: propUser,
  darkMode = false,
  onProfileClick,
  align = "right",
  showDashboardLink = true,
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(propUser || getUserData());
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);

  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sync state if prop changes
  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    }
  }, [propUser]);

  // Listen to global auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getUserData());
    };
    window.addEventListener("knowway_auth_change", handleAuthChange);
    return () => window.removeEventListener("knowway_auth_change", handleAuthChange);
  }, []);

  // Fetch enrolled packages when dropdown is opened
  useEffect(() => {
    if (isOpen && getUserToken()) {
      let isMounted = true;
      setLoadingPackages(true);
      getMyPackagesApi()
        .then((res) => {
          if (isMounted && res?.success) {
            setPackages(res.purchased_packages || []);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setLoadingPackages(false);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check format and size (max 8MB)
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Image size must be less than 8MB.");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");
      const res = await uploadUserAvatarApi(file);
      if (res?.success && res.user) {
        const token = getUserToken();
        setUserSession(token, res.user);
        setUser(res.user);
      }
    } catch (err) {
      setUploadError(err.message || "Failed to upload photo.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleLogout = () => {
    clearUserSession();
    setIsOpen(false);
    navigate("/", { replace: true });
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const avatarUrl = user?.avatar_url;
  const activePackage = packages[0]; // Most recent active package

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Trigger Button (Minimal Pill / Avatar) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-11 sm:h-12 rounded-full px-2 sm:px-3.5 pr-3 sm:pr-4 flex items-center gap-2.5 transition cursor-pointer select-none ${
          darkMode
            ? "bg-[#131926] text-white hover:bg-[#1A2234]"
            : "bg-white text-[#0F172A] hover:bg-[#F8FAFC]"
        }`}
        title="Account Profile & Settings"
      >
        <div className="w-8 h-8 rounded-full bg-[#035BE3] text-white flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user?.name || "User"}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>{userInitial}</span>
          )}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold leading-none truncate max-w-[95px]">
            {user?.name ? user.name.split(" ")[0] : "Account"}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
            {activePackage ? activePackage.name.split(" ")[0] : "Verified"}
          </p>
        </div>
      </button>

      {/* Minimal Flat Popup Modal / Dropdown (No Heavy Border, No Shadow, Smooth Radius) */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "left" ? "left-0" : "right-0"
          } top-full mt-2.5 w-76 sm:w-84 rounded-[28px] p-5 z-50 animate-in fade-in zoom-in-95 duration-150 transition-all select-none ${
            darkMode
              ? "bg-[#101622] text-[#E2E8F0]"
              : "bg-[#FFFFFF] text-[#0F172A]"
          }`}
          style={{
            boxShadow: "0 0 0 1px " + (darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"),
          }}
        >
          {/* Top Section: Full-Rounded Avatar + Change Photo Trigger */}
          <div className="flex flex-col items-center text-center pb-4">
            <div className="relative group mb-3">
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#035BE3] to-[#024bc0] text-white flex items-center justify-center text-2xl font-black overflow-hidden relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.name || "Profile"}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span>{userInitial}</span>
                )}

                {/* Loading overlay while uploading */}
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Upload / Change Photo Floating Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white flex items-center justify-center transition cursor-pointer disabled:opacity-50"
                title="Change Profile Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* User Name & Email */}
            <h3 className="text-sm font-black leading-snug truncate max-w-[240px]">
              {user?.name || "Student Learner"}
            </h3>
            <p className={`text-xs mt-0.5 truncate max-w-[240px] ${darkMode ? "text-[#8A99AD]" : "text-[#64748B]"}`}>
              {user?.email || "student@knowway.com"}
            </p>

            {/* Student ID badge */}
            <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#035BE3]/10 text-[#035BE3] dark:text-blue-400 font-mono text-[10px] font-bold">
              <span>ID: {user?.student_id || (user?.id ? `KW-2026-${String(user.id).padStart(4, "0")}` : "KW-2026-STUDENT")}</span>
            </div>

            {uploadError && (
              <p className="text-[11px] text-red-500 font-medium mt-1.5">{uploadError}</p>
            )}
          </div>

          {/* Enrolled Package Card with Package Image */}
          <div className="my-2">
            {activePackage ? (
              <div
                className={`p-3 rounded-2xl flex items-center justify-between gap-3 ${
                  darkMode ? "bg-[#182030]" : "bg-[#F8FAFD]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-white dark:bg-[#0E1420] flex items-center justify-center shrink-0 overflow-hidden p-1">
                    <img
                      src={activePackage.image_url || "/images/packages/pro.png"}
                      alt={activePackage.name}
                      className="w-full h-full object-contain rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "/images/packages/pro.png";
                      }}
                    />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold truncate">
                        {activePackage.name}
                      </span>
                      <span className="inline-flex items-center text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Active
                      </span>
                    </div>
                    <p className={`text-[10px] truncate mt-0.5 ${darkMode ? "text-[#8A99AD]" : "text-[#64748B]"}`}>
                      {activePackage.tagline || "All Masterclasses & Certificates"}
                    </p>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => {
                    setIsOpen(false);
                    if (onProfileClick) onProfileClick("upgrade");
                  }}
                  className="px-2.5 py-1.5 rounded-full bg-[#035BE3] text-white text-[10px] font-black hover:bg-[#024bc0] transition shrink-0 flex items-center gap-1 no-underline"
                >
                  <span>Upgrade</span>
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </Link>
              </div>
            ) : (
              <div
                className={`p-3 rounded-2xl flex items-center justify-between gap-3 ${
                  darkMode ? "bg-[#182030]" : "bg-[#F8FAFD]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-bold">No Active Package</p>
                    <p className={`text-[10px] truncate ${darkMode ? "text-[#8A99AD]" : "text-[#64748B]"}`}>
                      Unlock pro skills & masterclasses
                    </p>
                  </div>
                </div>
                <Link
                  to="/courses"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-[#035BE3] text-white text-[10px] font-black hover:bg-[#024bc0] transition shrink-0 flex items-center gap-1 no-underline"
                >
                  <span>Explore</span>
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions List */}
          <div className="pt-2 space-y-1">
            {/* Affiliate Panel Quick Link */}
            <Link
              to="/affiliate/dashboard"
              onClick={() => setIsOpen(false)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition no-underline ${
                darkMode
                  ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                  : "bg-amber-50/70 text-amber-700 hover:bg-amber-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Affiliate Panel</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-black">
                Earn ₹
              </span>
            </Link>

            {/* Dashboard / Learning Link */}
            {showDashboardLink && (
              <Link
                to="/dashboard"
                onClick={() => {
                  setIsOpen(false);
                  if (onProfileClick) onProfileClick("dashboard");
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition no-underline ${
                  darkMode
                    ? "hover:bg-[#182030] text-[#CBD5E1]"
                    : "hover:bg-[#F8FAFD] text-[#334155]"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#035BE3]" />
                <span>My Dashboard</span>
              </Link>
            )}

            {/* Profile & Account Settings */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (onProfileClick) {
                  onProfileClick("profile");
                } else {
                  navigate("/dashboard");
                }
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                darkMode
                  ? "hover:bg-[#182030] text-[#CBD5E1]"
                  : "hover:bg-[#F8FAFD] text-[#334155]"
              }`}
            >
              <UserIcon className="w-4 h-4 text-[#8A99AD]" />
              <span>Profile Settings</span>
            </button>

            {/* Sign Out Button */}
            <div className="pt-1.5 mt-1 border-t border-inherit">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-2xl transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
