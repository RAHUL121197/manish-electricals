import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Flame,
  Gauge,
  Plug,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';
import SEO from '../../components/SEO';
import PageHero from '../../components/PageHero';
import Reveal from '../../components/Reveal';
import SectionHeading from '../../components/SectionHeading';
import { useT } from '../../i18n/LanguageContext';

export default function ServicesPage() {
  const t = useT();

  const services = [
    { icon: Zap, title: t('services.s1Title'), desc: t('services.s1Desc') },
    { icon: Users, title: t('services.s2Title'), desc: t('services.s2Desc') },
    { icon: Wrench, title: t('services.s3Title'), desc: t('services.s3Desc') },
    { icon: Gauge, title: t('services.s4Title'), desc: t('services.s4Desc') },
    { icon: Plug, title: t('services.s5Title'), desc: t('services.s5Desc') },
    { icon: Building2, title: t('services.s6Title'), desc: t('services.s6Desc') },
    { icon: Flame, title: t('services.s7Title'), desc: t('services.s7Desc') },
    { icon: CalendarClock, title: t('services.s8Title'), desc: t('services.s8Desc') },
  ];

  const benefits = [t('services.how1'), t('services.how2'), t('services.how3'), t('services.how4')];

  return (
    <>
      <SEO
        title="Our Services | MANISH ELECTRICALS — Electrical Labour Supply Surat"
        description="Electrical labour supply, field workforce support, maintenance support, meter related field work, installation support and site workforce management in Surat."
      />
      <PageHero
        eyebrow="What We Do"
        title={t('services.heading')}
        desc={t('services.desc')}
        crumbs={[{ label: t('services.heading') }]}
      />

      <section className="section">
        <div className="container">
          <div className="grid cols-2">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={(i % 2) * 80}>
                <article className="card icon-card service-card">
                  <div className="icon-wrap">
                    <s.icon aria-hidden="true" size={26} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: 8 }}>{s.title}</h3>
                    <p className="text-muted" style={{ margin: 0 }}>
                      {s.desc}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-light" style={{ paddingTop: 64 }}>
        <div className="container">
          <div className="benefit-wrap">
            <SectionHeading centered eyebrow="The Working Standard" title={t('services.howHeading')} />
            
            <div className="about-split" style={{ alignItems: 'center' }}>
              <Reveal>
                <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '100%', minHeight: '350px', boxShadow: 'var(--shadow-card)', position: 'relative' }}>
                  <img src="/assets/images/services/electrical-work.jpg" alt="Electrical maintenance technician working on control panel" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} loading="lazy" />
                </div>
              </Reveal>
              <Reveal delay={120}>
                <ul className="check-list" style={{ display: 'grid', gap: '20px' }}>
                  {benefits.map((b) => (
                    <li key={b} style={{ fontSize: '1.05rem' }}>
                      <CheckCircle2 aria-hidden="true" size={24} style={{ color: 'var(--c-primary)' }} />
                      {b}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 40 }}>
                  <Link to="/contact" className="btn btn-primary btn-lg">
                    {t('common.contactUs')} <ArrowRight aria-hidden="true" size={18} />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}