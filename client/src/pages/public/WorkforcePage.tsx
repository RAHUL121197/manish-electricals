import { BadgeCheck, CheckCircle2, ClipboardList, MapPin, Users, UserCog, Wrench, Zap } from 'lucide-react';
import SEO from '../../components/SEO';
import PageHero from '../../components/PageHero';
import Reveal from '../../components/Reveal';
import SectionHeading from '../../components/SectionHeading';
import StatCounter from '../../components/StatCounter';
import { useT } from '../../i18n/LanguageContext';

export default function WorkforcePage() {
  const t = useT();

  const roles = [
    { icon: Zap, title: t('workforce.skilledWorkers'), desc: t('workforce.skilledWorkersDesc') },
    { icon: Wrench, title: t('workforce.technicians'), desc: t('workforce.techniciansDesc') },
    { icon: MapPin, title: t('workforce.fieldEmployees'), desc: t('workforce.fieldEmployeesDesc') },
    { icon: UserCog, title: t('workforce.supervisors'), desc: t('workforce.supervisorsDesc') },
    { icon: Users, title: t('workforce.supportStaff'), desc: t('workforce.supportStaffDesc') },
  ];

  const principles = [t('workforce.principle1'), t('workforce.principle2'), t('workforce.principle3'), t('workforce.principle4')];

  return (
    <>
      <SEO
        title="Our Workforce | MANISH ELECTRICALS — 90+ Employees in Surat"
        description="MANISH ELECTRICALS maintains a supervised field workforce of 90+ employees — skilled workers, technicians, field employees, supervisors and support staff in Surat."
      />
      <PageHero
        eyebrow="The Team"
        title={t('workforce.heading')}
        desc={t('workforce.desc')}
        crumbs={[{ label: t('workforce.heading') }]}
      />

      <section className="section" style={{ paddingTop: 80 }}>
        <div className="container">
          <div className="about-split">
            <Reveal>
              <div className="about-graphic" aria-hidden="true">
                <div className="hero-ring r1" style={{ position: 'absolute' }} />
                <div className="hero-core" style={{ position: 'relative' }}>
                  <Users />
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div>
                <span className="eyebrow">{t('workforce.heading')}</span>
                <h2 style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)' }}>{t('home.stats.employeesValue')}</h2>
                <p style={{ fontSize: '1.05rem' }}>{t('workforce.strength')}</p>
                <div className="hero-stats" style={{ marginTop: 24 }}>
                  <div>
                    <StatCounter value={t('home.stats.employeesValue')} label={t('home.stats.employeesLabel')} numericValue={90} />
                  </div>
                  <div>
                    <StatCounter value={t('home.stats.yearsValue')} label={t('home.stats.yearsLabel')} numericValue={20} />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <SectionHeading centered eyebrow="Workforce Categories" title={t('workforce.heading')} sub={t('workforce.desc')} />
          <div className="grid cols-3">
            {roles.map((r, i) => (
              <Reveal key={r.title} delay={i * 60}>
                <article className="card icon-card">
                  <div className="icon-wrap">
                    <r.icon aria-hidden="true" size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem' }}>{r.title}</h3>
                  <p className="text-muted" style={{ margin: 0 }}>
                    {r.desc}
                  </p>
                </article>
              </Reveal>
            ))}
            <Reveal delay={300}>
              <article className="card icon-card">
                <div className="icon-wrap sky">
                  <BadgeCheck aria-hidden="true" size={26} />
                </div>
                <h3 style={{ fontSize: '1.1rem' }}>{t('safety.discipline')}</h3>
                <p className="text-muted" style={{ margin: 0 }}>
                  {t('safety.disciplineDesc')}
                </p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section-light" style={{ paddingTop: 64 }}>
        <div className="container">
          <div className="benefit-wrap">
            <SectionHeading centered eyebrow="Management" title={t('workforce.principlesHeading')} />
            <ul className="check-list grid cols-2" style={{ maxWidth: 760, margin: '0 auto' }}>
              {principles.map((p) => (
                <li key={p}>
                  <CheckCircle2 aria-hidden="true" size={22} />
                  {p}
                </li>
              ))}
            </ul>
            <div style={{ textAlign: 'center', marginTop: 36, color: 'var(--tx-light-muted)', fontSize: '0.92rem', display: 'flex', justifyContent: 'center', gap: 8 }}>
              <ClipboardList aria-hidden="true" size={18} style={{ marginTop: 2 }} />
              <span>{t('home.features.disciplineDesc')}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}