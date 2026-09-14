import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  CalendarCheck,
  CalendarDays,
  FileText,
  ListTodo,
  MapPin,
  UserRound,
} from 'lucide-react';
import SEO from '../../components/SEO';
import { useAuth } from '../../auth/AuthContext';
import { useT } from '../../i18n/LanguageContext';

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  const t = useT();
  const emp = user?.employee;

  const quick = [
    { to: '/employee/profile', labelKey: 'portal.myProfile', icon: UserRound },
    { to: '/employee/attendance', labelKey: 'portal.myAttendance', icon: CalendarCheck },
    { to: '/employee/tasks', labelKey: 'portal.myTasks', icon: ListTodo },
    { to: '/employee/daily-reports', labelKey: 'portal.myDailyReports', icon: FileText },
    { to: '/employee/notifications', labelKey: 'portal.notifications', icon: Bell },
  ];

  return (
    <>
      <SEO title="Employee Dashboard | MANISH ELECTRICALS" />
      <div className="portal-page">
        <header className="portal-page-head">
          <div>
            <span className="eyebrow">{t('portal.employeePortal')}</span>
            <h1>{t('portal.welcomeTitle')}</h1>
            <p className="text-muted">{t('portal.welcomeSubtitle')}</p>
          </div>
        </header>

        <div className="grid cols-2 portal-topRow">
          <div className="card employee-hero">
            <div className="customer-avatar-lg" aria-hidden="true">
              {emp?.profilePhoto ? (
                <img src={emp.profilePhoto} alt="" />
              ) : (
                (emp?.fullName ?? user?.loginId ?? 'U').charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: 4 }}>{emp?.fullName || user?.loginId}</h2>
              <div className="employee-chips">
                <span className="badge">{emp?.employeeId || user?.loginId}</span>
                {emp?.designation && <span className="badge outline">{emp.designation}</span>}
                {emp?.status && <span className="badge outline">{emp.status}</span>}
              </div>
              <p className="text-muted" style={{ margin: 0, marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                {emp?.workLocation && (
                  <>
                    <MapPin aria-hidden="true" size={16} /> {emp.workLocation}
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="card">
            <h2 style={{ fontSize: '1rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarDays aria-hidden="true" size={18} style={{ color: 'var(--c-accent)' }} />
              {t('portal.quickAccess')}
            </h2>
            <div className="employee-quick">
              {quick.slice(0, 4).map((q) => {
                const Icon = q.icon;
                return (
                  <Link key={q.to} to={q.to} className="card portal-tile">
                    <div className="icon-wrap">
                      <Icon aria-hidden="true" size={22} />
                    </div>
                    <span>{t(q.labelKey)}</span>
                    <ArrowRight aria-hidden="true" size={16} className="portal-tile-arrow" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}