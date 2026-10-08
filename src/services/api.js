/**
 * Centralized API Client & Service
 * All frontend components must use this service instead of hardcoding API endpoints.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ADMIN_TOKEN_KEY = "knowway_admin_token";
const ADMIN_USER_KEY = "knowway_admin_user";
const USER_TOKEN_KEY = "knowway_user_token";
const USER_DATA_KEY = "knowway_user_data";

// ============================================================
// TOKEN & SESSION HELPERS
// ============================================================

export const getAdminToken = () => {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
  } catch {
    return "";
  }
};

export const getAdminUser = () => {
  try {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAdminSession = (token, admin) => {
  try {
    if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
    if (admin) localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
  } catch (err) {
    console.error("Failed to save admin session:", err);
  }
};

export const clearAdminSession = () => {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  } catch (err) {
    console.error("Failed to clear admin session:", err);
  }
};

export const isAdminAuthenticated = () => {
  return Boolean(getAdminToken());
};

// Student / User Session
export const getUserToken = () => {
  try {
    return localStorage.getItem(USER_TOKEN_KEY) || "";
  } catch {
    return "";
  }
};

export const getUserData = () => {
  try {
    const raw = localStorage.getItem(USER_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setUserSession = (token, user) => {
  try {
    if (token) localStorage.setItem(USER_TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("knowway_auth_change"));
  } catch (err) {
    console.error("Failed to save user session:", err);
  }
};

export const clearUserSession = () => {
  try {
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    window.dispatchEvent(new Event("knowway_auth_change"));
  } catch (err) {
    console.error("Failed to clear user session:", err);
  }
};

export const isUserAuthenticated = () => {
  return Boolean(getUserToken());
};

// ============================================================
// CORE FETCH HANDLER
// ============================================================

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Attach token if available
  const adminToken = getAdminToken();
  const userToken = getUserToken();

  if (adminToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${adminToken}`;
  } else if (userToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${userToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.warn(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

// ============================================================
// USER AUTHENTICATION APIS (WITH EMAIL OTP)
// ============================================================

export const sendSignupOtpApi = (payload) => {
  return apiRequest("/auth/send-signup-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const registerUserApi = (userData) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const loginUserApi = (credentials) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const sendForgotPasswordOtpApi = (payload) => {
  return apiRequest("/auth/forgot-password-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const resetPasswordApi = (payload) => {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getUserProfileApi = () => {
  return apiRequest("/auth/me");
};

// ============================================================
// SUPER ADMIN AUTH & DASHBOARD APIS
// ============================================================

export const adminLoginApi = (credentials) => {
  return apiRequest("/admin/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const getAdminProfileApi = () => {
  return apiRequest("/admin/me");
};

export const getAdminStatsApi = () => {
  return apiRequest("/admin/stats");
};

export const getAllUsersApi = () => {
  return apiRequest("/admin/users");
};

export const getUserPurchasesApi = (userId) => {
  return apiRequest(`/admin/users/${userId}/purchases`);
};

export const getAllPaymentsApi = () => {
  return apiRequest("/admin/payments");
};

export const deleteUserApi = (id) => {
  return apiRequest(`/admin/users/${id}`, {
    method: "DELETE",
  });
};

// ============================================================
// MENTORS APIS
// ============================================================

export const getMentorsApi = () => {
  return apiRequest("/admin/mentors");
};

export const createMentorApi = (mentorData) => {
  return apiRequest("/admin/mentors", {
    method: "POST",
    body: JSON.stringify(mentorData),
  });
};

export const deleteMentorApi = (id) => {
  return apiRequest(`/admin/mentors/${id}`, {
    method: "DELETE",
  });
};

// ============================================================
// COURSES APIS
// ============================================================

export const getCoursesApi = () => {
  return apiRequest("/admin/courses");
};

export const getCourseByIdApi = (id) => {
  return apiRequest(`/admin/courses/${id}`);
};

export const createCourseApi = (courseData) => {
  return apiRequest("/admin/courses", {
    method: "POST",
    body: JSON.stringify(courseData),
  });
};

export const updateCourseApi = (id, courseData) => {
  return apiRequest(`/admin/courses/${id}`, {
    method: "PUT",
    body: JSON.stringify(courseData),
  });
};

export const deleteCourseApi = (id) => {
  return apiRequest(`/admin/courses/${id}`, {
    method: "DELETE",
  });
};

// ============================================================
// SYSTEM SETTINGS & NODEMAILER / CLOUDINARY
// ============================================================

export const getSystemSettingsApi = () => {
  return apiRequest("/admin/settings");
};

export const saveSystemSettingsApi = (settings) => {
  return apiRequest("/admin/settings", {
    method: "POST",
    body: JSON.stringify({ settings }),
  });
};

export const testSmtpApi = (smtpData) => {
  return apiRequest("/admin/settings/test-smtp", {
    method: "POST",
    body: JSON.stringify(smtpData),
  });
};

// ============================================================
// DIRECT CLOUDINARY FILE UPLOADS
// ============================================================

export const uploadImageApi = async (file, folder = "knowway_images") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const token = getAdminToken();
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/upload/image`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json();
      if (!response.ok) {
      if (response.status === 401 && data.code === "SESSION_EXPIRED_ANOTHER_DEVICE") {
        clearUserSession();
        window.dispatchEvent(
          new CustomEvent("knowway_session_terminated", {
            detail: {
              message:
                data.message ||
                "Your account was logged in from another browser or device. This session has been terminated.",
            },
          })
        );
      }
      const err = new Error(data.message || `Request failed with status ${response.status}`);
      err.code = data.code;
      err.status = response.status;
      throw err;
    }
  return data;
};

export const uploadVideoApi = async (file, folder = "knowway_courses/lectures") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const token = getAdminToken();
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/upload/video`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to upload video");
  }
  return data;
};

// ============================================================
// COURSE QUIZ & CERTIFICATES API
// ============================================================

export const getCourseQuizApi = (courseId) => {
  return apiRequest(`/auth/courses/${courseId}/quiz`);
};

export const submitCourseQuizApi = (courseId, answers, studentName) => {
  return apiRequest(`/auth/courses/${courseId}/quiz/submit`, {
    method: "POST",
    body: JSON.stringify({ answers, student_name: studentName }),
  });
};

export const getMyCertificatesApi = () => {
  return apiRequest("/auth/my-certificates");
};

export const getCertificateByNumberApi = (certificateNo) => {
  return apiRequest(`/auth/certificates/${certificateNo}`);
};

// ============================================================
// PACKAGES API (PUBLIC & ADMIN)
// ============================================================

export const getPackagesApi = () => {
  return apiRequest("/packages");
};

export const getPackageBySlugApi = (slugOrId) => {
  return apiRequest(`/packages/${slugOrId}`);
};

export const createPackageApi = (packageData) => {
  return apiRequest("/packages", {
    method: "POST",
    body: JSON.stringify(packageData),
  });
};

export const updatePackageApi = (id, packageData) => {
  return apiRequest(`/packages/${id}`, {
    method: "PUT",
    body: JSON.stringify(packageData),
  });
};

export const deletePackageApi = (id) => {
  return apiRequest(`/packages/${id}`, {
    method: "DELETE",
  });
};

// ============================================================
// RAZORPAY PAYMENT & ENROLLMENT APIs
// ============================================================

export const getRazorpayKeyApi = () => {
  return apiRequest("/payment/razorpay-key");
};

export const createPaymentOrderApi = (payload) => {
  return apiRequest("/payment/create-order", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const verifyPaymentApi = (payload) => {
  return apiRequest("/payment/verify-payment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getMyPackagesApi = () => {
  return apiRequest("/payment/my-packages");
};

export const getMyCoursesApi = () => {
  return apiRequest("/payment/my-courses");
};

// ============================================================
// STUDENT AFFILIATE & COMMISSIONS APIs
// ============================================================

export const getAffiliateStatsApi = () => {
  return apiRequest("/affiliate/stats");
};

export const getAffiliateReferralsApi = () => {
  return apiRequest("/affiliate/referrals");
};

export const getAffiliateWalletApi = () => {
  return apiRequest("/affiliate/wallet");
};

export const requestAffiliatePayoutApi = (payoutData) => {
  return apiRequest("/affiliate/withdraw", {
    method: "POST",
    body: JSON.stringify(payoutData),
  });
};

export const getAffiliateLeaderboardApi = () => {
  return apiRequest("/affiliate/leaderboard");
};

export const getAffiliateConfigApi = () => {
  return apiRequest("/affiliate/config");
};

export const getPayoutMethodsApi = () => {
  return apiRequest("/affiliate/payout-methods");
};

export const savePayoutMethodApi = (data) => {
  return apiRequest("/affiliate/payout-methods", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const deletePayoutMethodApi = (id) => {
  return apiRequest(`/affiliate/payout-methods/${id}`, {
    method: "DELETE",
  });
};

export const setDefaultPayoutMethodApi = (id) => {
  return apiRequest(`/affiliate/payout-methods/${id}/default`, {
    method: "PUT",
  });
};

export const executeAdminRazorpayxPayoutApi = (payoutId) => {
  return apiRequest(`/admin/affiliate/payouts/${payoutId}/razorpayx`, {
    method: "POST",
  });
};

export const getAdminAffiliateUsersApi = () => {
  return apiRequest("/admin/affiliate/users");
};

export const getAffiliateCommissionRatesApi = () => {
  return apiRequest("/affiliate/commission-rates");
};

// ============================================================
// SUPER ADMIN AFFILIATE & PAYOUTS MANAGEMENT APIs
// ============================================================

export const getAdminAffiliateStatsApi = () => {
  return apiRequest("/admin/affiliate/stats");
};

export const getAdminAffiliatePayoutsApi = () => {
  return apiRequest("/admin/affiliate/payouts");
};

export const updateAdminAffiliatePayoutStatusApi = (payoutId, payload) => {
  return apiRequest(`/admin/affiliate/payouts/${payoutId}/status`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const getAdminAffiliateReferralsApi = () => {
  return apiRequest("/admin/affiliate/referrals");
};

export const updatePackageCommissionApi = (packageId, payload) => {
  return apiRequest(`/admin/commission/package/${packageId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const updateCourseCommissionApi = (courseId, payload) => {
  return apiRequest(`/admin/commission/course/${courseId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const updateBulkCommissionsApi = (payload) => {
  return apiRequest("/admin/commission/bulk", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

// ============================================================
// VIDEO SECURITY & ANTI-PIRACY DRM APIs
// ============================================================

export const getVideoSecurityConfigApi = () => {
  return apiRequest("/auth/video-security-config");
};

export const getAdminVideoSecurityApi = () => {
  return apiRequest("/admin/video-security");
};

export const saveAdminVideoSecurityApi = (settings) => {
  return apiRequest("/admin/video-security", {
    method: "POST",
    body: JSON.stringify({ settings }),
  });
};

// ============================================================
// ADMIN NOTIFICATIONS APIs
// ============================================================

export const getAdminNotificationsApi = () => {
  return apiRequest("/admin/notifications");
};

export const markAllAdminNotificationsReadApi = () => {
  return apiRequest("/admin/notifications/read-all", {
    method: "PUT",
  });
};

export const markAdminNotificationReadApi = (id) => {
  return apiRequest(`/admin/notifications/${id}/read`, {
    method: "PUT",
  });
};

export const clearAdminNotificationsApi = () => {
  return apiRequest("/admin/notifications/clear", {
    method: "DELETE",
  });
};

// ============================================================
// ADMIN ACTIVITY LOGS & AUDIT HISTORY APIs
// ============================================================

export const getAdminActivityLogsApi = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/admin/activity-logs${query ? `?${query}` : ""}`);
};

// ============================================================
// SUB-ADMIN & RBAC ROLES APIs
// ============================================================

export const getAvailableModulesApi = () => {
  return apiRequest("/admin/permissions-modules");
};

export const getSubAdminsApi = () => {
  return apiRequest("/admin/subadmins");
};

export const createSubAdminApi = (payload) => {
  return apiRequest("/admin/subadmins", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateSubAdminApi = (id, payload) => {
  return apiRequest(`/admin/subadmins/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteSubAdminApi = (id) => {
  return apiRequest(`/admin/subadmins/${id}`, {
    method: "DELETE",
  });
};

// ============================================================
// MENTORS UPDATE API
// ============================================================

export const updateMentorApi = (id, payload) => {
  return apiRequest(`/admin/mentors/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

// ============================================================
// PUBLIC WEBSITE SETTINGS & BRANDING APIs
// ============================================================

export const getPublicSettingsApi = () => {
  return apiRequest("/admin/public-settings");
};

// ============================================================
// CUSTOM / LEGAL POLICY PAGES APIs (CMS)
// ============================================================

export const getPublicPagesApi = () => {
  return apiRequest("/admin/public-pages");
};

export const getPublicPageBySlugApi = (slug) => {
  return apiRequest(`/admin/public-pages/${slug}`);
};

export const getAdminPagesApi = () => {
  return apiRequest("/admin/pages");
};

export const createAdminPageApi = (payload) => {
  return apiRequest("/admin/pages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateAdminPageApi = (id, payload) => {
  return apiRequest(`/admin/pages/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteAdminPageApi = (id) => {
  return apiRequest(`/admin/pages/${id}`, {
    method: "DELETE",
  });
};

