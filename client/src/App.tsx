import { Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import WorkforcePage from './pages/public/WorkforcePage';
import ClientPage from './pages/public/ClientPage';
import ProjectsPage from './pages/public/ProjectsPage';
import SafetyQualityPage from './pages/public/SafetyQualityPage';
import GalleryPage from './pages/public/GalleryPage';
import ContactPage from './pages/public/ContactPage';
import NotFoundPage from './pages/public/NotFoundPage';
import AdminPanel from './pages/admin/AdminPanel';

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
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}