import { BadgeCheck, CalendarCheck, HardHat, RadioTower, ShieldCheck, Timer, Users, Zap } from 'lucide-react';
import SEO from '../../components/SEO';
import PageHero from '../../components/PageHero';
import Reveal from '../../components/Reveal';
import SectionHeading from '../../components/SectionHeading';
import StatCounter from '../../components/StatCounter';
import { useT } from '../../i18n/LanguageContext';

export default function AboutPage() {
  const t = useT();

  const focus = [
    { icon: ShieldCheck, title: t('about.reliability'), desc: t('about.reliabilityDesc') },
    { icon: Users, title: t('about.professionalWorkforce'), desc: t('about.professionalWorkforceDesc') },
    { icon: HardHat, title: t('about.safety'), desc: t('about.safetyDesc') },
    { icon: BadgeCheck, title: t('about.quality'), desc: t('about.qualityDesc') },
    { icon: CalendarCheck, title: t('about.discipline'), desc: t('about.disciplineDesc') },
    { icon: Timer, title: t('about.timely'), desc: t('about.timelyDesc') },
  ];

  return (
    <>
      <SEO
        title="About Us | MANISH ELECTRICALS — Electrical Labour Contractor Surat"
        description="MANISH ELECTRICALS, established in 2001, provides electrical labour supply and field workforce support to Torrent Power Ltd and local customers in Surat with 20+ years of experience."
      />
      <PageHero
        eyebrow="Est. 2001"
        title={t('about.heading')}
        desc={t('about.desc')}
        crumbs={[{ label: t('about.heading') }]}
      />

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="about-split">
            <Reveal>
              <span className="eyebrow">{t('about.storyHeading')}</span>
              <h2 style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)' }}>
                {t('home.about.heading')}
              </h2>
              <div style={{ display: 'grid', gap: 18, marginTop: 8 }}>
                <p style={{ fontSize: '1.05rem' }}>{t('about.story1')}</p>
                <p style={{ fontSize: '1.05rem' }}>{t('about.story2')}</p>
                <p className="text-muted" style={{ fontSize: '1.05rem' }}>{t('about.story3')}</p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="about-graphic" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '100%', minHeight: '350px', position: 'relative', boxShadow: 'var(--shadow-card)' }}>
                <img src="/assets/images/office/office-team.jpg" alt="Corporate office team reviewing electrical blueprints" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} loading="lazy" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Focus */}
      <section className="section section-light" style={{ paddingTop: 76 }}>
        <div className="container">
          <SectionHeading centered eyebrow="Our Principles" title={t('about.focusHeading')} sub={t('about.focusSub')} />
          <div className="grid cols-3">
            {focus.map((f, i) => (
              <Reveal key={f.title} delay={i * 50}>
                <article className="card icon-card" style={{ background: '#fff', boxShadow: 'var(--shadow-card-light)' }}>
                  <div className="icon-wrap light">
                    <f.icon aria-hidden="true" size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.05rem' }}>{f.title}</h3>
                  <p className="text-muted" style={{ color: 'var(--tx-light-muted)', margin: 0 }}>
                    {f.desc}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <div className="field-support-banner" style={{ background: '#fff', borderColor: 'rgba(15,23,42,0.1)' }}>
              <div className="icon-wrap">
                <RadioTower aria-hidden="true" size={26} />
              </div>
              <div>
                <h3 style={{ marginBottom: 4, color: 'var(--tx-light)' }}>{t('about.fieldSupport')}</h3>
                <p className="text-muted" style={{ margin: 0, color: 'var(--tx-light-muted)' }}>
                  {t('about.fieldSupportDesc')}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* At a glance */}
      <section className="section">
        <div className="container">
          <SectionHeading centered eyebrow={t('common.status')} title={t('about.glanceHeading')} />
          <div className="grid cols-4">
            <Reveal>
              <div className="milestone">
                <StatCounter value={t('home.stats.establishedValue')} label={t('about.glanceEstablished')} />
              </div>
            </Reveal>
            <Reveal delay={60}>
              <div className="milestone">
                <StatCounter value={t('home.stats.yearsValue')} label={t('about.glanceYears')} numericValue={20} />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="milestone">
                <StatCounter value={t('home.stats.employeesValue')} label={t('about.glanceEmployees')} numericValue={90} />
              </div>
            </Reveal>
            <Reveal delay={180}>
              <div className="milestone">
                <div className="stat-value" style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2rem)' }}>
                  {t('home.clients.torrentName')}
                </div>
                <div className="text-muted" style={{ marginTop: 4, fontWeight: 600 }}>
                  {t('about.glanceClient')}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}