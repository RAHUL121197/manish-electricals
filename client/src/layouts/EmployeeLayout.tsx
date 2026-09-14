import { Bell, CalendarCheck, FileText, LayoutDashboard, ListTodo, UserRound } from 'lucide-react';
import PortalLayout from './portal/PortalLayout';

export default function EmployeeLayout() {
  return (
    <PortalLayout
      titleKey="portal.employeePortal"
      navItems={[
        { to: '/employee', labelKey: 'portal.dashboard', icon: LayoutDashboard, end: true },
        { to: '/employee/profile', labelKey: 'portal.myProfile', icon: UserRound },
        { to: '/employee/attendance', labelKey: 'portal.myAttendance', icon: CalendarCheck },
        { to: '/employee/tasks', labelKey: 'portal.myTasks', icon: ListTodo },
        { to: '/employee/daily-reports', labelKey: 'portal.myDailyReports', icon: FileText },
        { to: '/employee/notifications', labelKey: 'portal.notifications', icon: Bell },
      ]}
    />
  );
}