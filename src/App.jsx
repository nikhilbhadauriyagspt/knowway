import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SuperAdminLoginPage from "./superadmin/SuperAdminLoginPage";
import SuperAdminDashboard from "./superadmin/SuperAdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Student Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Super Admin Routes */}
        <Route path="/admin/login" element={<SuperAdminLoginPage />} />
        <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
