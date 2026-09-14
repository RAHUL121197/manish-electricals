import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import SEO from '../../components/SEO';
import { useT } from '../../i18n/LanguageContext';

export default function NotFoundPage() {
  const t = useT();

  return (
    <>
      <SEO title="Page Not Found | MANISH ELECTRICALS" />
      <section className="login-page">
        <div className="container" style={{ textAlign: 'center', maxWidth: 520 }}>
          <div className="state-icon" style={{ width: 84, height: 84 }}>
            <Compass aria-hidden="true" size={40} />
          </div>
          <h1 style={{ fontSize: '3rem' }}>404</h1>
          <p className="text-muted" style={{ marginBottom: 28 }}>
            {t('common.somethingWentWrong')}
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            <ArrowLeft aria-hidden="true" size={18} /> {t('common.backToHome')}
          </Link>
        </div>
      </section>
    </>
  );
}