import { Bell, CalendarCheck, FileText, ListTodo } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SEO from '../../components/SEO';
import { useT } from '../../i18n/LanguageContext';

type EmployeeModuleKey = 'attendance' | 'tasks' | 'daily-reports' | 'notifications';

const MODULES: Record<
  EmployeeModuleKey,
  { icon: LucideIcon; labelKey: string }
> = {
  attendance: { icon: CalendarCheck, labelKey: 'portal.myAttendance' },
  tasks: { icon: ListTodo, labelKey: 'portal.myTasks' },
  'daily-reports': { icon: FileText, labelKey: 'portal.myDailyReports' },
  notifications: { icon: Bell, labelKey: 'portal.notifications' },
};

/**
 * Temporary placeholder for employee modules implemented in later phases.
 */
export default function EmployeeModulePage({ module }: { module: EmployeeModuleKey }) {
  const t = useT();
  const meta = MODULES[module];

  return (
    <>
      <SEO title={`${t(meta.labelKey)} | MANISH ELECTRICALS`} />
      <div className="portal-page">
        <header className="portal-page-head">
          <div>
            <span className="eyebrow">{t('portal.employeePortal')}</span>
            <h1>{t(meta.labelKey)}</h1>
          </div>
        </header>

        <div className="state-panel">
          <div className="state-icon">
            <meta.icon aria-hidden="true" size={26} />
          </div>
          <h3>{t(meta.labelKey)}</h3>
          <p>{t('portal.moduleComingSoon')}</p>
        </div>
      </div>
    </>
  );
}