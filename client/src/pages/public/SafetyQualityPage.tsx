import { BadgeCheck, ClipboardCheck, HardHat, RadioTower, ShieldCheck, Timer, UserCheck } from 'lucide-react';
import SEO from '../../components/SEO';
import PageHero from '../../components/PageHero';
import Reveal from '../../components/Reveal';
import SectionHeading from '../../components/SectionHeading';
import { useT } from '../../i18n/LanguageContext';

export default function SafetyQualityPage() {
  const t = useT();

  const items = [
    { icon: ShieldCheck, title: t('safety.workplaceSafety'), desc: t('safety.workplaceSafetyDesc') },
    { icon: HardHat, title: t('safety.ppe'), desc: t('safety.ppeDesc') },
    { icon: UserCheck, title: t('safety.discipline'), desc: t('safety.disciplineDesc') },
    { icon: RadioTower, title: t('safety.supervision'), desc: t('safety.supervisionDesc') },
    { icon: BadgeCheck, title: t('safety.qualityControl'), desc: t('safety.qualityControlDesc') },
    { icon: Timer, title: t('safety.timelyReporting'), desc: t('safety.timelyReportingDesc') },
    { icon: ClipboardCheck, title: t('safety.compliance'), desc: t('safety.complianceDesc') },
  ];

  return (
    <>
      <SEO
        title="Safety & Quality | MANISH ELECTRICALS Surat"
        description="Workplace safety, PPE awareness, field supervision, quality control and disciplined daily reporting at MANISH ELECTRICALS."
      />
      <PageHero
        eyebrow="Our Standards"
        title={t('safety.heading')}
        desc={t('safety.desc')}
        crumbs={[{ label: t('safety.heading') }]}
      />

      <section className="section" style={{ paddingTop: 80 }}>
        <div className="container">
          <SectionHeading centered eyebrow="Every Day" title={t('safety.heading')} sub={t('safety.desc')} />
          <div className="grid cols-3">
            {items.slice(0, 6).map((s, i) => (
              <Reveal key={s.title} delay={i * 50}>
                <article className="card icon-card">
                  <div className="icon-wrap">
                    <s.icon aria-hidden="true" size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem' }}>{s.title}</h3>
                  <p className="text-muted" style={{ margin: 0 }}>
                    {s.desc}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <FieldSupportBanner />
          </Reveal>
        </div>
      </section>

      <section className="section section-light" style={{ paddingTop: 56 }}>
        <div className="container">
          <Reveal>
            <div className="commitment-banner">
              <ShieldCheck aria-hidden="true" size={36} />
              <div>
                <h3 style={{ marginBottom: 8 }}>{t('safety.commitmentHeading')}</h3>
                <p style={{ margin: 0 }}>{t('safety.commitmentText')}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function FieldSupportBanner() {
  const t = useT();
  return (
    <div className="field-support-banner">
      <div className="icon-wrap sky">
        <ClipboardCheck aria-hidden="true" size={26} />
      </div>
      <div>
        <h3 style={{ marginBottom: 4 }}>{t('safety.compliance')}</h3>
        <p className="text-muted" style={{ margin: 0 }}>
          {t('safety.complianceDesc')}
        </p>
      </div>
    </div>
  );
}