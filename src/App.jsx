import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import PackageDetailPage from "./pages/PackageDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import CustomPolicyPage from "./pages/CustomPolicyPage";
import SuperAdminLoginPage from "./superadmin/SuperAdminLoginPage";
import SuperAdminDashboard from "./superadmin/SuperAdminDashboard";
import CreateCoursePage from "./superadmin/CreateCoursePage";
import CreatePackagePage from "./superadmin/CreatePackagePage";
import AffiliatePage from "./pages/AffiliatePage";
import SessionHeartbeatMonitor from "./components/SessionHeartbeatMonitor";

export default function App() {
  return (
    <BrowserRouter>
      {/* Real-time Multi-Device / Concurrent Session Monitor */}
      <SessionHeartbeatMonitor />
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
        <Route path="/checkout/:slug" element={<CheckoutPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/affiliate" element={<AffiliatePage />} />
        <Route path="/affiliate/dashboard" element={<AffiliatePage />} />

        {/* Dynamic Legal & Custom Policy Pages */}
        <Route path="/page/:slug" element={<CustomPolicyPage />} />
        <Route path="/privacy-policy" element={<CustomPolicyPage defaultSlug="privacy-policy" />} />
        <Route path="/terms-and-conditions" element={<CustomPolicyPage defaultSlug="terms-and-conditions" />} />
        <Route path="/terms" element={<CustomPolicyPage defaultSlug="terms-and-conditions" />} />
        <Route path="/refund-policy" element={<CustomPolicyPage defaultSlug="refund-policy" />} />
        <Route path="/disclaimer" element={<CustomPolicyPage defaultSlug="disclaimer" />} />

        {/* Super Admin Routes */}
        <Route path="/admin/login" element={<SuperAdminLoginPage />} />
        <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/admin/courses/create" element={<CreateCoursePage />} />
        <Route path="/admin/courses/edit/:id" element={<CreateCoursePage />} />
        <Route path="/admin/packages/create" element={<CreatePackagePage />} />
        <Route path="/admin/packages/edit/:id" element={<CreatePackagePage />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
