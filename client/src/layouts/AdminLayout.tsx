import { BarChart3, CalendarCheck, FileText, FolderKanban, Images, Inbox, LayoutDashboard, ListTodo, Settings, Users } from 'lucide-react';
import PortalLayout from './portal/PortalLayout';

export default function AdminLayout() {
  return (
    <PortalLayout
      titleKey="portal.adminPortal"
      navItems={[
        { to: '/admin', labelKey: 'portal.dashboard', icon: LayoutDashboard, end: true },
        { to: '/admin/employees', labelKey: 'portal.employees', icon: Users },
        { to: '/admin/attendance', labelKey: 'portal.attendance', icon: CalendarCheck },
        { to: '/admin/tasks', labelKey: 'portal.tasks', icon: ListTodo },
        { to: '/admin/daily-reports', labelKey: 'portal.dailyReports', icon: FileText },
        { to: '/admin/projects', labelKey: 'portal.projects', icon: FolderKanban },
        { to: '/admin/gallery', labelKey: 'portal.gallery', icon: Images },
        { to: '/admin/enquiries', labelKey: 'portal.enquiries', icon: Inbox },
        { to: '/admin/reports', labelKey: 'portal.reports', icon: BarChart3 },
        { to: '/admin/settings', labelKey: 'portal.settings', icon: Settings },
      ]}
    />
  );
}