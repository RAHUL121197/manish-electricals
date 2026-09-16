import { Link } from 'react-router-dom';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Logo from '../Logo';
import { COMPANY, whatsappLink } from '../../lib/company';
import { useT } from '../../i18n/LanguageContext';

const QUICK_LINKS = [
  { key: 'about', to: '/about' },
  { key: 'services', to: '/services' },
  { key: 'projects', to: '/projects' },
  { key: 'gallery', to: '/gallery' },
  { key: 'contact', to: '/contact' },
] as const;

const COMPANY_LINKS = [
  { key: 'workforce', to: '/workforce' },
  { key: 'clients', to: '/our-client' },
  { key: 'safety', to: '/safety-quality' },
] as const;

export default function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="brand" aria-label="MANISH ELECTRICALS home">
            <Logo size={46} />
            <span className="brand-text">
              <strong>MANISH</strong>
              <span>ELECTRICALS</span>
            </span>
          </Link>
          <p className="text-muted">{t('footer.tagline')}</p>
          <ul className="footer-meta">
            <li>
              {t('home.stats.yearsValue')} {t('home.stats.yearsLabel')} · {COMPANY.established}
            </li>
            <li>{COMPANY.gst}</li>
            <li>{COMPANY.pfEsc}</li>
          </ul>
        </div>

        <nav className="footer-col" aria-label="Quick links">
          <h3>{t('footer.quickLinks')}</h3>
          <ul>
            {QUICK_LINKS.map((link) => (
              <li key={link.key}>
                <Link to={link.to}>{t(`nav.${link.key}`)}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Company links">
          <h3>{t('footer.company')}</h3>
          <ul>
            {COMPANY_LINKS.map((link) => (
              <li key={link.key}>
                <Link to={link.to}>{t(`nav.${link.key}`)}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-col footer-contact">
          <h3>{t('footer.contactHeading')}</h3>
          <ul>
            <li>
              <MapPin aria-hidden="true" size={16} />
              <span>{COMPANY.address}</span>
            </li>
            <li>
              <Phone aria-hidden="true" size={16} />
              <a href={`tel:${COMPANY.phone}`}>{COMPANY.phoneDisplay}</a>
            </li>
            <li>
              <MessageCircle aria-hidden="true" size={16} />
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                {COMPANY.phoneDisplay}
              </a>
            </li>
            <li>
              <Mail aria-hidden="true" size={16} />
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            </li>
            <li>
              <Clock aria-hidden="true" size={16} />
              <span>{t('contact.respondNote')}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>
            © {year} {COMPANY.name}. {t('footer.rights')}
          </span>
          <span className="text-muted">{t('footer.designedBy')}</span>
        </div>
      </div>
    </footer>
  );
}