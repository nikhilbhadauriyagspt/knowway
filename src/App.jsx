import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import PackageDetailPage from "./pages/PackageDetailPage";
import SuperAdminLoginPage from "./superadmin/SuperAdminLoginPage";
import SuperAdminDashboard from "./superadmin/SuperAdminDashboard";
import CreateCoursePage from "./superadmin/CreateCoursePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Student Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/course/:id" element={<CourseDetailPage />} />
        <Route path="/package/:id" element={<PackageDetailPage />} />
        <Route path="/packages/:id" element={<PackageDetailPage />} />
        <Route path="/package" element={<PackageDetailPage />} />
        <Route path="/packages" element={<PackageDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Super Admin Routes */}
        <Route path="/admin/login" element={<SuperAdminLoginPage />} />
        <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/admin/courses/create" element={<CreateCoursePage />} />
        <Route path="/admin/courses/edit/:id" element={<CreateCoursePage />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
