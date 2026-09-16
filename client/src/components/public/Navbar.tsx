import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Globe, Mail, Menu, Phone, X } from 'lucide-react';
import Logo from '../Logo';
import { COMPANY, whatsappLink } from '../../lib/company';
import { LANGUAGE_LABELS, useLanguage } from '../../i18n/LanguageContext';
import type { LanguageCode } from '../../i18n/LanguageContext';

const NAV_LINKS = [
  { key: 'home', to: '/' },
  { key: 'about', to: '/about' },
  { key: 'services', to: '/services' },
  { key: 'workforce', to: '/workforce' },
  { key: 'clients', to: '/our-client' },
  { key: 'projects', to: '/projects' },
  { key: 'safety', to: '/safety-quality' },
  { key: 'gallery', to: '/gallery' },
  { key: 'contact', to: '/contact' },
] as const;

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLangOpen(false);
        setDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const lockBody = (locked: boolean) => {
    document.body.style.overflow = locked ? 'hidden' : '';
  };
  useEffect(() => {
    lockBody(drawerOpen);
    return () => lockBody(false);
  }, [drawerOpen]);

  return (
    <header className="site-header no-print">
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-links">
            <a href={`tel:${COMPANY.phone}`}>
              <Phone aria-hidden="true" size={14} /> {COMPANY.phoneDisplay}
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <span aria-hidden="true">WhatsApp</span>
            </a>
            <a href={`mailto:${COMPANY.email}`} className="topbar-email">
              <Mail aria-hidden="true" size={14} /> {COMPANY.email}
            </a>
          </div>

          <div className="topbar-lang" ref={langRef}>
            <button
              type="button"
              className={`lang-toggle${langOpen ? ' open' : ''}`}
              onClick={() => setLangOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label="Select language"
            >
              <Globe aria-hidden="true" size={15} />
              <span>{LANGUAGE_LABELS[lang]}</span>
              <ChevronDown aria-hidden="true" size={14} className="lang-caret" />
            </button>
            {langOpen && (
              <ul className="lang-menu" role="listbox" aria-label="Language">
                {(Object.keys(LANGUAGE_LABELS) as LanguageCode[]).map((code) => (
                  <li key={code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={code === lang}
                      onClick={() => {
                        setLang(code);
                        setLangOpen(false);
                      }}
                    >
                      {LANGUAGE_LABELS[code]}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className={`navbar-wrap${scrolled ? ' scrolled' : ''}`}>
        <div className="container navbar">
          <Link to="/" className="brand" aria-label="MANISH ELECTRICALS home">
            <Logo size={42} />
            <span className="brand-text">
              <strong>MANISH</strong>
              <span>ELECTRICALS</span>
            </span>
          </Link>

          <nav className="nav-desktop" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.key}
                to={link.to}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {t(`nav.${link.key}`)}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="nav-burger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
            >
              <Menu aria-hidden="true" size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className={`nav-drawer-overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      <aside className={`nav-drawer${drawerOpen ? ' open' : ''}`} aria-label="Mobile navigation">
        <div className="drawer-head">
          <Link to="/" className="brand" onClick={() => setDrawerOpen(false)}>
            <Logo size={38} />
            <span className="brand-text">
              <strong>MANISH</strong>
              <span>ELECTRICALS</span>
            </span>
          </Link>
          <button type="button" className="nav-burger" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <X aria-hidden="true" size={24} />
          </button>
        </div>
        <nav className="drawer-nav">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.key}
              to={link.to}
              className={({ isActive }) => (isActive ? 'drawer-link active' : 'drawer-link')}
            >
              {t(`nav.${link.key}`)}
            </NavLink>
          ))}
        </nav>
      </aside>
    </header>
  );
}