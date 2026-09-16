import { CalendarDays, FolderOpen, MapPin, User } from 'lucide-react';
import SEO from '../../components/SEO';
import PageHero from '../../components/PageHero';
import Reveal from '../../components/Reveal';
import SectionHeading from '../../components/SectionHeading';
import { useT } from '../../i18n/LanguageContext';

type ProjectStatus = 'Ongoing' | 'Completed' | 'Upcoming';

interface Project {
  id: number;
  name: string;
  client: string;
  location: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
  imageUrl?: string;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Torrent Power Underground Cabling',
    client: 'Torrent Power Ltd',
    location: 'Surat',
    description: 'Extensive underground power distribution cabling and inspection work for Torrent Power.',
    startDate: 'Mar 2025',
    status: 'Ongoing',
    imageUrl: '/assets/images/projects/torrent-power-project.jpg'
  },
  {
    id: 2,
    name: 'Industrial Electrical Panel Setup',
    client: 'Local Manufacturing',
    location: 'Hazira, Surat',
    description: 'Complete setup and wiring of control panels and electrical distributions for an industrial facility.',
    startDate: 'Jan 2026',
    status: 'Completed',
    imageUrl: '/assets/images/services/electrical-work.jpg'
  }
];

export default function ProjectsPage() {
  const t = useT();

  return (
    <>
      <SEO
        title="Projects & Work Experience | MANISH ELECTRICALS Surat"
        description="Work experience and projects delivered by MANISH ELECTRICALS with a disciplined electrical workforce serving Torrent Power Ltd and local customers in Surat."
      />
      <PageHero
        eyebrow="Experience"
        title={t('projects.heading')}
        desc={t('projects.desc')}
        crumbs={[{ label: t('projects.heading') }]}
      />

      <section className="section" style={{ paddingTop: 80 }}>
        <div className="container">
          <SectionHeading centered eyebrow="Work Experience" title={t('projects.heading')} sub={t('projects.desc')} />

          {PROJECTS.length === 0 ? (
            <Reveal>
              <div className="state-panel">
                <div className="state-icon">
                  <FolderOpen aria-hidden="true" size={26} />
                </div>
                <h3>{t('projects.emptyTitle')}</h3>
                <p>{t('projects.emptyDesc')}</p>
              </div>
            </Reveal>
          ) : (
            <div className="grid cols-3">
              {PROJECTS.map((p) => (
                <Reveal key={p.id}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const t = useT();

  const statusLabel = t(`projects.${project.status.toLowerCase()}`);

  return (
    <article className="card project-card">
      <div className="project-card-head">
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : null}
      </div>
      <div className="project-card-body">
        <h3 style={{ fontSize: '1.14rem' }}>{project.name}</h3>
        <span className={`badge status-chip ${project.status.toLowerCase()}`}>{statusLabel}</span>
        <div className="project-meta">
          {project.client && (
            <span>
              <User aria-hidden="true" size={16} /> {project.client}
            </span>
          )}
          {project.location && (
            <span>
              <MapPin aria-hidden="true" size={16} /> {project.location}
            </span>
          )}
          <span>
            <CalendarDays aria-hidden="true" size={16} /> {project.startDate}
            {project.endDate ? ` → ${project.endDate}` : ''}
          </span>
        </div>
        {project.description && <p className="text-muted" style={{ fontSize: '0.92rem', margin: 0 }}>{project.description}</p>}
      </div>
    </article>
  );
}