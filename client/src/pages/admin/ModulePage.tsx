import {
  BarChart3,
  CalendarCheck,
  FileText,
  FolderKanban,
  Images,
  Inbox,
  ListTodo,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SEO from '../../components/SEO';
import { useT } from '../../i18n/LanguageContext';

type ModuleKey =
  | 'employees'
  | 'attendance'
  | 'tasks'
  | 'daily-reports'
  | 'projects'
  | 'gallery'
  | 'enquiries'
  | 'reports';

const MODULES: Record<ModuleKey, { icon: LucideIcon }> = {
  employees: { icon: Users },
  attendance: { icon: CalendarCheck },
  tasks: { icon: ListTodo },
  'daily-reports': { icon: FileText },
  projects: { icon: FolderKanban },
  gallery: { icon: Images },
  enquiries: { icon: Inbox },
  reports: { icon: BarChart3 },
};

/**
 * Temporary placeholder for modules that are implemented in later phases.
 * Each route is replaced with its real feature page as the phases progress.
 */
export default function AdminModulePage({ module }: { module: ModuleKey }) {
  const t = useT();
  const Icon = MODULES[module].icon;
  const titleKey = `portal.${module}` as const;

  return (
    <>
      <SEO title={`${t(titleKey)} | MANISH ELECTRICALS Admin`} />
      <div className="portal-page">
        <header className="portal-page-head">
          <div>
            <span className="eyebrow">{t('portal.adminPortal')}</span>
            <h1>{t(titleKey)}</h1>
          </div>
        </header>

        <div className="state-panel">
          <div className="state-icon">
            <Icon aria-hidden="true" size={26} />
          </div>
          <h3>{t(titleKey)}</h3>
          <p>{t('portal.moduleComingSoon')}</p>
        </div>
      </div>
    </>
  );
}