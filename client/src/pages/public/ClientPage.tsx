import { CheckCircle2, Handshake, Users, Zap } from 'lucide-react';
import SEO from '../../components/SEO';
import PageHero from '../../components/PageHero';
import Reveal from '../../components/Reveal';
import SectionHeading from '../../components/SectionHeading';
import { useT } from '../../i18n/LanguageContext';

export default function ClientPage() {
  const t = useT();

  const whys = [t('clients.why1'), t('clients.why2'), t('clients.why3'), t('clients.why4')];

  return (
    <>
      <SEO
        title="Our Client | MANISH ELECTRICALS — Serving Torrent Power Ltd"
        description="MANISH ELECTRICALS has provided labour supply and field workforce support to Torrent Power Ltd for more than 20 years, along with dependable service to local customers in Surat."
      />
      <PageHero
        eyebrow="The Partnership"
        title={t('clients.heading')}
        desc={t('clients.desc')}
        crumbs={[{ label: t('clients.heading') }]}
      />

      <section className="section">
        <div className="container">
          <div className="grid cols-2">
            <Reveal>
              <article className="card client-feature">
                <div className="client-avatar">
                  <Zap aria-hidden="true" size={32} />
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 12 }}>{t('clients.torrentHeading')}</h2>
                <p style={{ fontSize: '1.03rem' }}>{t('clients.torrentDesc')}</p>
                <p className="text-muted" style={{ fontSize: '1rem' }}>
                  {t('clients.torrentDetail')}
                </p>
              </article>
            </Reveal>
            <Reveal delay={100}>
              <article className="card client-feature">
                <div className="client-avatar sky-avatar">
                  <Users aria-hidden="true" size={32} />
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 12 }}>{t('clients.localHeading')}</h2>
                <p style={{ fontSize: '1.03rem' }}>{t('clients.localDesc')}</p>
                <p className="text-muted" style={{ fontSize: '1rem' }}>
                  {t('home.clients.localDesc')}
                </p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section-light" style={{ paddingTop: 64 }}>
        <div className="container">
          <div className="benefit-wrap">
            <SectionHeading centered eyebrow="Long-Term Partnership" title={t('clients.whyHeading')} />
            <ul className="check-list grid cols-2" style={{ maxWidth: 760, margin: '0 auto' }}>
              {whys.map((w) => (
                <li key={w}>
                  <CheckCircle2 aria-hidden="true" size={22} />
                  {w}
                </li>
              ))}
            </ul>
            <div style={{ textAlign: 'center', marginTop: 36 }}>
              <Handshake aria-hidden="true" size={40} color="var(--c-accent)" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}