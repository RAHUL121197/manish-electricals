import { ChevronRight, Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageContext';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  desc?: string;
  crumbs?: Crumb[];
}

export default function PageHero({ eyebrow, title, desc, crumbs }: PageHeroProps) {
  const t = useT();

  return (
    <header className="page-hero">
      <div className="container" style={{ position: 'relative' }}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {desc && (
          <p className="text-muted" style={{ maxWidth: 680, fontSize: '1.05rem' }}>
            {desc}
          </p>
        )}
        {crumbs && crumbs.length > 0 && (
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <HomeIcon aria-hidden="true" />
                {t('nav.home')}
              </span>
            </Link>
            {crumbs.map((crumb, idx) =>
              crumb.to ? (
                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <ChevronRight aria-hidden="true" />
                  <Link to={crumb.to}>{crumb.label}</Link>
                </span>
              ) : (
                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <ChevronRight aria-hidden="true" />
                  <span aria-current="page">{crumb.label}</span>
                </span>
              )
            )}
          </nav>
        )}
      </div>
    </header>
  );
}