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

// User Session
export const getUserToken = () => {
  try {
    return localStorage.getItem(USER_TOKEN_KEY) || "";
  } catch {
    return "";
  }
};

export const setUserSession = (token, user) => {
  try {
    if (token) localStorage.setItem(USER_TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  } catch (err) {
    console.error("Failed to save user session:", err);
  }
};

export const clearUserSession = () => {
  try {
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  } catch (err) {
    console.error("Failed to clear user session:", err);
  }
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

  // Attach admin token if available and not explicitly provided
  const adminToken = getAdminToken();
  if (adminToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${adminToken}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(
        data.message || `Request failed with status ${response.status}`
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      const offlineError = new Error(
        "Unable to connect to backend server. Make sure the backend is running on http://localhost:5000"
      );
      offlineError.status = 0;
      throw offlineError;
    }
    throw err;
  }
}

// ============================================================
// SUPER ADMIN ENDPOINTS
// ============================================================

/**
 * Super Admin Login
 * @param {Object} credentials - { email, password }
 */
export const adminLoginApi = async ({ email, password }) => {
  return apiRequest("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

/**
 * Get Current Super Admin Profile
 */
export const getAdminProfileApi = async () => {
  return apiRequest("/admin/me", {
    method: "GET",
  });
};

/**
 * Get Dashboard Stats & Metrics
 */
export const getAdminStatsApi = async () => {
  return apiRequest("/admin/stats", {
    method: "GET",
  });
};

/**
 * Get All Registered Users (Students)
 */
export const getAllUsersApi = async () => {
  return apiRequest("/admin/users", {
    method: "GET",
  });
};

/**
 * Delete a User by ID
 * @param {number|string} userId
 */
export const deleteUserApi = async (userId) => {
  return apiRequest(`/admin/users/${userId}`, {
    method: "DELETE",
  });
};

// ============================================================
// STUDENT / USER AUTH ENDPOINTS
// ============================================================

/**
 * User Registration (Signup)
 * @param {Object} userData - { name, phone, email, address, password, referralCode }
 */
export const userRegisterApi = async (userData) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

/**
 * User Login
 * @param {Object} credentials - { email, password }
 */
export const userLoginApi = async ({ email, password }) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

// Default export containing all APIs and helpers
const api = {
  BASE_URL: API_BASE_URL,
  getAdminToken,
  getAdminUser,
  setAdminSession,
  clearAdminSession,
  isAdminAuthenticated,
  getUserToken,
  setUserSession,
  clearUserSession,
  adminLoginApi,
  getAdminProfileApi,
  getAdminStatsApi,
  getAllUsersApi,
  deleteUserApi,
  userRegisterApi,
  userLoginApi,
};

export default api;
