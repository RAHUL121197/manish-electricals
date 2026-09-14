import { Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import { AdminRoute, EmployeeRoute, RedirectIfAuthenticated } from './auth/guards';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import WorkforcePage from './pages/public/WorkforcePage';
import ClientPage from './pages/public/ClientPage';
import ProjectsPage from './pages/public/ProjectsPage';
import SafetyQualityPage from './pages/public/SafetyQualityPage';
import GalleryPage from './pages/public/GalleryPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/public/LoginPage';
import NotFoundPage from './pages/public/NotFoundPage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminModulePage from './pages/admin/ModulePage';
import AdminSettingsPage from './pages/admin/SettingsPage';
import EmployeeDashboardPage from './pages/employee/DashboardPage';
import EmployeeProfilePage from './pages/employee/ProfilePage';
import EmployeeModulePage from './pages/employee/ModulePage';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/workforce" element={<WorkforcePage />} />
        <Route path="/our-client" element={<ClientPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/safety-quality" element={<SafetyQualityPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <LoginPage />
            </RedirectIfAuthenticated>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin portal — admin role only */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="employees" element={<AdminModulePage module="employees" />} />
        <Route path="attendance" element={<AdminModulePage module="attendance" />} />
        <Route path="tasks" element={<AdminModulePage module="tasks" />} />
        <Route path="daily-reports" element={<AdminModulePage module="daily-reports" />} />
        <Route path="projects" element={<AdminModulePage module="projects" />} />
        <Route path="gallery" element={<AdminModulePage module="gallery" />} />
        <Route path="enquiries" element={<AdminModulePage module="enquiries" />} />
        <Route path="reports" element={<AdminModulePage module="reports" />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Employee portal — employee role only */}
      <Route
        path="/employee"
        element={
          <EmployeeRoute>
            <EmployeeLayout />
          </EmployeeRoute>
        }
      >
        <Route index element={<EmployeeDashboardPage />} />
        <Route path="profile" element={<EmployeeProfilePage />} />
        <Route path="attendance" element={<EmployeeModulePage module="attendance" />} />
        <Route path="tasks" element={<EmployeeModulePage module="tasks" />} />
        <Route path="daily-reports" element={<EmployeeModulePage module="daily-reports" />} />
        <Route path="notifications" element={<EmployeeModulePage module="notifications" />} />
      </Route>
    </Routes>
  );
}