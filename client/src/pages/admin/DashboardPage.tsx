import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  Clock,
  Database,
  FileText,
  FolderKanban,
  Images,
  Inbox,
  LayoutDashboard,
  ListTodo,
  Server,
  Settings,
  Users,
} from 'lucide-react';
import SEO from '../../components/SEO';
import { api } from '../../lib/api';
import { useAuth } from '../../auth/AuthContext';
import { useT } from '../../i18n/LanguageContext';

interface HealthData {
  status: string;
  db: string;
  time: string;
}

const QUICK_MODULES = [
  { to: '/admin/employees', labelKey: 'portal.employees', icon: Users },
  { to: '/admin/attendance', labelKey: 'portal.attendance', icon: CalendarCheck },
  { to: '/admin/tasks', labelKey: 'portal.tasks', icon: ListTodo },
  { to: '/admin/daily-reports', labelKey: 'portal.dailyReports', icon: FileText },
  { to: '/admin/projects', labelKey: 'portal.projects', icon: FolderKanban },
  { to: '/admin/gallery', labelKey: 'portal.gallery', icon: Images },
  { to: '/admin/enquiries', labelKey: 'portal.enquiries', icon: Inbox },
  { to: '/admin/reports', labelKey: 'portal.reports', icon: BarChart3 },
  { to: '/admin/settings', labelKey: 'portal.settings', icon: Settings },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const t = useT();
  const [health, setHealth] = useState<HealthData | null>(null);

  useEffect(() => {
    let active = true;
    api
      .get<HealthData>('/api/health')
      .then((data) => active && setHealth(data))
      .catch(() => active && setHealth({ status: 'down', db: 'unavailable', time: '' }));
    return () => {
      active = false;
    };
  }, []);

  const lastLogin = user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : null;

  return (
    <>
      <SEO title="Admin Dashboard | MANISH ELECTRICALS" />
      <div className="portal-page">
        <header className="portal-page-head">
          <div>
            <span className="eyebrow">{t('portal.adminPortal')}</span>
            <h1>{t('portal.welcomeTitle')}</h1>
            <p className="text-muted">
              {user?.employee?.fullName || user?.loginId} · {user?.loginId}
            </p>
          </div>
          {lastLogin && (
            <div className="portal-lastlogin">
              <Clock aria-hidden="true" size={16} />
              <span>
                {t('portal.lastLogin')}: {lastLogin}
              </span>
            </div>
          )}
        </header>

        <div className="grid cols-2 portal-topRow">
          <div className="card portal-welcome">
            <div className="icon-wrap light">
              <LayoutDashboard aria-hidden="true" size={26} />
            </div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 6 }}>{t('portal.dashboardSubtitle')}</h2>
            <p className="text-muted" style={{ margin: 0 }}>
              {t('portal.dashboardHint')}
            </p>
          </div>

          <div className="card portal-status">
            <div className="portal-status-head">
              <span className="portal-status-icon">
                {health?.db === 'ok' ? (
                  <>
                    <Database aria-hidden="true" size={24} />
                    <span className="dot ok" />
                  </>
                ) : (
                  <>
                    <Server aria-hidden="true" size={24} />
                    <span className="dot warn" />
                  </>
                )}
              </span>
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: 2 }}>{t('portal.systemStatus')}</h3>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.88rem' }}>
                  {health?.db === 'ok' ? t('portal.dbConnected') : t('portal.dbUnavailable')}
                </p>
              </div>
            </div>
            {health?.db !== 'ok' && (
              <p className="portal-status-note">{t('portal.dbNote')}</p>
            )}
          </div>
        </div>

        <section>
          <h2 className="portal-section-title">{t('portal.quickAccess')}</h2>
          <div className="grid cols-4" style={{ gap: 16 }}>
            {QUICK_MODULES.map((m) => {
              const Icon = m.icon;
              return (
                <Link key={m.to} to={m.to} className="card portal-tile">
                  <div className="icon-wrap">
                    <Icon aria-hidden="true" size={22} />
                  </div>
                  <span>{t(m.labelKey)}</span>
                  <ArrowRight aria-hidden="true" size={16} className="portal-tile-arrow" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}