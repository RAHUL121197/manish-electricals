import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Bell, ExternalLink, LogOut, Menu, ShieldCheck, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Logo from '../../components/Logo';
import { useAuth } from '../../auth/AuthContext';
import { useT } from '../../i18n/LanguageContext';

export interface PortalNavItem {
  to: string;
  labelKey: string;
  icon: LucideIcon;
  end?: boolean;
}

interface PortalLayoutProps {
  titleKey: string;
  navItems: PortalNavItem[];
}

export default function PortalLayout({ titleKey, navItems }: PortalLayoutProps) {
  const { user, logout } = useAuth();
  const t = useT();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    void logout();
  };

  return (
    <div className="portal">
      <aside className={`portal-side${drawerOpen ? ' open' : ''}`}>
        <div className="portal-brand">
          <Link to={user?.role === 'admin' ? '/admin' : '/employee'} className="brand" aria-label="MANISH ELECTRICALS portal">
            <Logo size={40} />
            <span className="brand-text">
              <strong>MANISH</strong>
              <span>ELECTRICALS</span>
            </span>
          </Link>
          <button
            type="button"
            className="portal-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        <div className="portal-role">
          <ShieldCheck aria-hidden="true" size={16} />
          {t(titleKey)}
        </div>

        <nav className="portal-nav" aria-label="Portal navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setDrawerOpen(false)}
                className={({ isActive }) => (isActive ? 'portal-nav-item active' : 'portal-nav-item')}
              >
                <Icon size={19} aria-hidden="true" />
                <span>{t(item.labelKey)}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="portal-side-foot">
          <Link to="/" className="portal-back-link">
            <ExternalLink aria-hidden="true" size={16} /> {t('portal.backToWebsite')}
          </Link>
          <button type="button" className="portal-logout" onClick={handleLogout}>
            <LogOut aria-hidden="true" size={17} /> {t('portal.logout')}
          </button>
        </div>
      </aside>

      <div className={`portal-overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(false)} aria-hidden="true" />

      <div className="portal-main">
        <header className="portal-top">
          <button type="button" className="portal-burger" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <Menu aria-hidden="true" size={22} />
          </button>
          <span className="portal-top-title">{t(titleKey)}</span>
          <div className="portal-top-actions">
            <Link to="/employee/notifications" className="portal-bell" aria-label={t('portal.notifications')}>
              <Bell aria-hidden="true" size={19} />
            </Link>
            <div className="portal-avatar" aria-hidden="true">
              {user?.employee?.fullName?.charAt(0) ?? user?.loginId?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            <div className="portal-user-chip">
              <strong>{user?.employee?.fullName || user?.loginId}</strong>
              <span>{user?.role === 'admin' ? t('login.admin') : t('login.employee')}</span>
            </div>
          </div>
        </header>

        <div className="portal-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}