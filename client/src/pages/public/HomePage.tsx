import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarCheck,
  CalendarClock,
  Flame,
  Gauge,
  HardHat,
  MapPin,
  MessageCircle,
  Phone,
  Plug,
  RadioTower,
  ShieldCheck,
  Timer,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';
import SEO from '../../components/SEO';
import Reveal from '../../components/Reveal';
import SectionHeading from '../../components/SectionHeading';
import StatCounter from '../../components/StatCounter';
import Logo from '../../components/Logo';
import { useT } from '../../i18n/LanguageContext';
import { COMPANY, whatsappLink } from '../../lib/company';

export default function HomePage() {
  const t = useT();

  const features = [
    { icon: ShieldCheck, title: t('home.features.reliability'), desc: t('home.features.reliabilityDesc') },
    { icon: Users, title: t('home.features.professionalWorkforce'), desc: t('home.features.professionalWorkforceDesc') },
    { icon: HardHat, title: t('home.features.safety'), desc: t('home.features.safetyDesc') },
    { icon: BadgeCheck, title: t('home.features.quality'), desc: t('home.features.qualityDesc') },
    { icon: CalendarCheck, title: t('home.features.discipline'), desc: t('home.features.disciplineDesc') },
    { icon: Timer, title: t('home.features.timely'), desc: t('home.features.timelyDesc') },
  ];

  const services = [
    { icon: Zap, label: t('home.services.item1') },
    { icon: Users, label: t('home.services.item2') },
    { icon: Wrench, label: t('home.services.item3') },
    { icon: Gauge, label: t('home.services.item4') },
    { icon: Plug, label: t('home.services.item5') },
    { icon: Building2, label: t('home.services.item6') },
    { icon: Flame, label: t('home.services.item7') },
    { icon: CalendarClock, label: t('home.services.item8') },
  ];

  return (
    <>
      <SEO
        title="MANISH ELECTRICALS | Electrical Labour Supply & Workforce Contractor in Surat"
        description="MANISH ELECTRICALS is an established electrical labour contractor in Surat with 20+ years of experience, serving Torrent Power Ltd and local customers since 2001."
        keywords={[
          'Electrical Contractor Surat',
          'Electrical Labour Supply Surat',
          'Electrical Labour Contractor',
          'Electrical Workforce',
          'Labour Supply Contractor Surat',
        ]}
      />

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-gridlines" aria-hidden="true" />
        <div className="container hero-inner">
          <Reveal>
            <span className="hero-badge">
              <Zap aria-hidden="true" />
              {t('home.hero.eyebrow')}
            </span>
            <h1 style={{ color: '#fff' }}>
              {COMPANY.name.split(' ')[0]}{' '}
              <span className="gradient-text">{COMPANY.name.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="hero-tagline">{t('home.hero.tagline')}</p>
            <p className="hero-support">{t('home.hero.support')}</p>
            <div className="hero-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">
                {t('home.hero.contact')} <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link to="/services" className="btn btn-outline btn-lg">
                {t('home.hero.services')}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="hero-visual" style={{ position: 'relative', width: '100%', height: '100%', minHeight: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
              <img src="/assets/images/hero/hero-bg.jpg" alt="Electrical maintenance team working on utility pole" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top right, rgba(2, 6, 23, 0.8), transparent)' }}></div>
              <div className="hero-core" style={{ position: 'absolute', bottom: '30px', left: '30px', zIndex: 2 }}>
                <Zap size={32} color="var(--c-accent)" />
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="hero-stats" role="list" aria-label="Company statistics">
            <div role="listitem">
              <StatCounter value={t('home.stats.yearsValue')} label={t('home.stats.yearsLabel')} numericValue={20} />
            </div>
            <div role="listitem">
              <StatCounter value={t('home.stats.employeesValue')} label={t('home.stats.employeesLabel')} numericValue={90} />
            </div>
            <div role="listitem">
              <StatCounter value={t('home.stats.establishedValue')} label={t('home.stats.establishedLabel')} />
            </div>
            <div role="listitem">
              <StatCounter value={t('home.stats.workforceValue')} label={t('home.stats.workforceLabel')} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Why Choose Us"
            centered
            title={t('home.features.heading')}
            sub={t('home.features.sub')}
          />
          <div className="grid cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 60}>
                <article className="card icon-card">
                  <div className="icon-wrap">
                    <f.icon aria-hidden="true" size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.12rem' }}>{f.title}</h3>
                  <p className="text-muted" style={{ margin: 0 }}>
                    {f.desc}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="field-support-banner">
              <div className="icon-wrap sky">
                <RadioTower aria-hidden="true" size={26} />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <h3 style={{ marginBottom: 4 }}>{t('home.features.fieldSupport')}</h3>
                <p className="text-muted" style={{ margin: 0 }}>
                  {t('home.features.fieldSupportDesc')}
                </p>
              </div>
              <div style={{ flex: '1 1 300px', height: '120px', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                 <img src="/assets/images/services/field-work.jpg" alt="Lineworker maintaining elevated utility pole" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ SERVICES (light) ============ */}
      <section className="section section-light" style={{ paddingTop: 76 }}>
        <div className="container">
          <SectionHeading
            centered
            eyebrow="What We Do"
            title={t('home.services.heading')}
            sub={t('home.services.sub')}
          />
          <div className="grid cols-4">
            {services.map((s, i) => (
              <Reveal key={s.label} delay={i * 40}>
                <article className="card icon-card" style={{ background: '#fff', boxShadow: 'var(--shadow-card-light)' }}>
                  <div className="icon-wrap light">
                    <s.icon aria-hidden="true" size={24} />
                  </div>
                  <h3 style={{ fontSize: '1rem', marginBottom: 0 }}>{s.label}</h3>
                </article>
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/services" className="btn btn-outline-dark">
              {t('home.hero.services')} <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ ABOUT PREVIEW ============ */}
      <section className="section">
        <div className="container">
          <div className="about-split">
            <Reveal>
              <div className="about-panel" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ height: '240px', width: '100%' }}>
                  <img src="/assets/images/about/about-team.jpg" alt="Professional electrical team wearing safety gear inspecting equipment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                </div>
                <div style={{ padding: '36px 44px' }}>
                  <Logo size={64} />
                  <p style={{ marginTop: 22, fontSize: '1.02rem', lineHeight: 1.7 }}>
                    {t('home.about.text1')}
                  </p>
                  <p className="text-muted" style={{ fontSize: '1.02rem', lineHeight: 1.7 }}>
                    {t('home.about.text2')}
                  </p>
                  <Link to="/about" className="btn btn-primary" style={{ marginTop: 10 }}>
                    {t('home.about.cta')} <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div>
                <span className="eyebrow">Since 2001</span>
                <h2 style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)' }}>{t('home.about.heading')}</h2>
                <p className="text-muted" style={{ fontSize: '1.05rem' }}>
                  {t('home.about.sub')}
                </p>
                <div className="milestone-grid">
                  <div className="milestone">
                    <StatCounter value={t('home.stats.establishedValue')} label={t('home.stats.establishedLabel')} />
                  </div>
                  <div className="milestone">
                    <StatCounter value={t('home.stats.yearsValue')} label={t('home.stats.yearsLabel')} numericValue={20} />
                  </div>
                  <div className="milestone">
                    <StatCounter value={t('home.stats.employeesValue')} label={t('home.stats.employeesLabel')} numericValue={90} />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ CLIENTS ============ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHeading centered eyebrow="Who We Serve" title={t('home.clients.heading')} sub={t('home.clients.sub')} />
          <div className="grid cols-2">
            <Reveal>
              <article className="card client-card">
                <div className="client-avatar">
                  <Zap aria-hidden="true" size={30} />
                </div>
                <div>
                  <h3 style={{ marginBottom: 6 }}>{t('home.clients.torrentName')}</h3>
                  <p className="text-muted" style={{ margin: 0 }}>
                    {t('home.clients.torrentDesc')}
                  </p>
                </div>
              </article>
            </Reveal>
            <Reveal delay={100}>
              <article className="card client-card">
                <div className="client-avatar sky-avatar">
                  <Users aria-hidden="true" size={30} />
                </div>
                <div>
                  <h3 style={{ marginBottom: 6 }}>{t('home.clients.localHeading')}</h3>
                  <p className="text-muted" style={{ margin: 0 }}>
                    {t('home.clients.localDesc')}
                  </p>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="cta-banner">
              <h2>{t('home.cta.heading')}</h2>
              <p>{t('home.cta.sub')}</p>
              <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 0 }}>
                <a href={`tel:${COMPANY.phone}`} className="btn btn-primary btn-lg">
                  <Phone aria-hidden="true" size={18} /> {COMPANY.phoneDisplay}
                </a>
                <a
                  href={whatsappLink(`Hello ${COMPANY.name}, I would like to enquire about workforce services.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-lg"
                >
                  <MessageCircle aria-hidden="true" size={18} /> {t('common.whatsapp')}
                </a>
                <Link to="/contact" className="btn btn-outline btn-lg">
                  <MapPin aria-hidden="true" size={18} /> {t('home.hero.contact')}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}