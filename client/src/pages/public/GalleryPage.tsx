import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import SEO from '../../components/SEO';
import PageHero from '../../components/PageHero';
import Reveal from '../../components/Reveal';
import SectionHeading from '../../components/SectionHeading';
import { useT } from '../../i18n/LanguageContext';

const CATEGORIES = ['all', 'fieldWork', 'employees', 'electricalWork', 'torrentPowerWork', 'office', 'safetyTraining', 'teamPhotos', 'other'] as const;
type CategoryKey = (typeof CATEGORIES)[number];

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: Exclude<CategoryKey, 'all'>;
  url: string;
  type?: 'image' | 'video';
  posterUrl?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'safety-training-video', title: 'Electrical Safety Training', description: 'Proper procedures and safety protocols for electrical site work.', category: 'safetyTraining', url: '/assets/images/gallery/safety-training-video.mp4', type: 'video', posterUrl: '/assets/images/gallery/safety-switchgear-team.jpg' },
  { id: 'safety-switchgear-team', title: 'Team safety inspection inside switchgear', description: 'Workers in protective helmets and masks inspect electrical equipment together.', category: 'safetyTraining', url: '/assets/images/gallery/safety-switchgear-team.jpg' },
  { id: 'lineworker-pole-cabling', title: 'Lineworker servicing overhead cabling', description: 'A protected lineworker works on overhead electrical cabling from a pole.', category: 'fieldWork', url: '/assets/images/gallery/lineworker-pole-cabling.jpg' },
  { id: 'lineworker-aerial-maintenance', title: 'Aerial line maintenance', description: 'A lineworker performs elevated maintenance on a utility pole.', category: 'fieldWork', url: '/assets/images/gallery/lineworker-aerial-maintenance.jpg' },
  { id: 'distribution-line-inspection', title: 'Distribution line inspection', description: 'A technician checks a distribution line and pole-mounted equipment.', category: 'fieldWork', url: '/assets/images/gallery/distribution-line-inspection.jpg' },
  { id: 'electrician-meter-testing', title: 'Electrical meter testing', description: 'An electrician tests wiring and connections with a handheld meter.', category: 'electricalWork', url: '/assets/images/gallery/electrician-meter-testing.jpg' },
  { id: 'electrical-hand-tools', title: 'Electrical hand tools', description: 'Insulated pliers, screwdrivers and tools prepared for electrical work.', category: 'electricalWork', url: '/assets/images/gallery/electrical-hand-tools.jpg' },
  { id: 'aerial-lineworker-garden', title: 'Aerial utility work above a garden', description: 'A lineworker accesses overhead utility infrastructure from an elevated platform.', category: 'fieldWork', url: '/assets/images/gallery/aerial-lineworker-garden.jpg' },
  { id: 'control-panel-technician', title: 'Control panel wiring inspection', description: 'A technician inspects a professionally wired electrical control panel.', category: 'electricalWork', url: '/assets/images/gallery/control-panel-technician.jpg' },
  { id: 'utility-pole-lineworker', title: 'Utility pole maintenance', description: 'A helmeted technician works on overhead utility conductors and insulators.', category: 'fieldWork', url: '/assets/images/gallery/utility-pole-lineworker.jpg' },
  { id: 'team-pole-maintenance', title: 'Team pole maintenance', description: 'A field team works together on an elevated utility pole installation.', category: 'teamPhotos', url: '/assets/images/gallery/team-pole-maintenance.jpg' },
];

export default function GalleryPage() {
  const t = useT();
  const [active, setActive] = useState<CategoryKey>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = active === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((item) => item.category === active);
  const selectedIndex = selectedId ? filtered.findIndex((item) => item.id === selectedId) : -1;
  const selected = selectedIndex >= 0 ? filtered[selectedIndex] : null;

  useEffect(() => {
    if (!selected) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedId(null);
      if (event.key === 'ArrowLeft') setSelectedId(filtered[(selectedIndex - 1 + filtered.length) % filtered.length].id);
      if (event.key === 'ArrowRight') setSelectedId(filtered[(selectedIndex + 1) % filtered.length].id);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [filtered, selected, selectedIndex]);

  return (
    <>
      <SEO
        title="Gallery | MANISH ELECTRICALS — Field Work & Team"
        description="Gallery of MANISH ELECTRICALS — field work, employees, electrical work, office and operations in Surat."
      />
      <PageHero
        eyebrow="Photos"
        title={t('gallery.heading')}
        desc={t('gallery.desc')}
        crumbs={[{ label: t('gallery.heading') }]}
      />

      <section className="section" style={{ paddingTop: 80 }}>
        <div className="container">
          <SectionHeading centered eyebrow="Browse" title={t('gallery.heading')} sub={t('gallery.desc')} />

          <div className="gallery-filters" role="tablist" aria-label="Gallery categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active === cat}
                className={`filter-pill${active === cat ? ' active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {t(`gallery.${cat}`)}
              </button>
            ))}
          </div>

          <div className="grid gallery-grid">
            {filtered.map((item) => (
              <Reveal key={item.id}>
                <figure
                  className="gallery-item"
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${item.title}`}
                  onClick={() => setSelectedId(item.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedId(item.id);
                    }
                  }}
                >
                  {item.type === 'video' ? (
                    <>
                      <img src={item.posterUrl || item.url} alt={item.title} loading="lazy" />
                      <div className="video-play-overlay">
                        <Play fill="white" size={36} />
                      </div>
                    </>
                  ) : (
                    <img src={item.url} alt={item.title} loading="lazy" />
                  )}
                  
                  <figcaption>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {selected && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelectedId(null)}>
          <button type="button" className="lightbox-close" aria-label="Close image viewer" onClick={() => setSelectedId(null)}>
            <X aria-hidden="true" size={22} />
          </button>
          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedId(filtered[(selectedIndex - 1 + filtered.length) % filtered.length].id);
            }}
          >
            <ChevronLeft aria-hidden="true" size={30} />
          </button>
          
          <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
            {selected.type === 'video' ? (
              <video 
                src={selected.url} 
                poster={selected.posterUrl} 
                controls 
                autoPlay 
                style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '4px' }}
              />
            ) : (
              <img src={selected.url} alt={selected.title} />
            )}
            
            <div className="lightbox-caption">
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>
            </div>
          </div>

          <button
            type="button"
            className="lightbox-nav lightbox-next"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedId(filtered[(selectedIndex + 1) % filtered.length].id);
            }}
          >
            <ChevronRight aria-hidden="true" size={30} />
          </button>
        </div>
      )}
    </>
  );
}