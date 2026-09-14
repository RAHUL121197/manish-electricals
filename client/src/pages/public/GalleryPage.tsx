import { useState } from 'react';
import { Images } from 'lucide-react';
import SEO from '../../components/SEO';
import PageHero from '../../components/PageHero';
import Reveal from '../../components/Reveal';
import SectionHeading from '../../components/SectionHeading';
import { useT } from '../../i18n/LanguageContext';

const CATEGORIES = ['all', 'fieldWork', 'employees', 'electricalWork', 'office', 'other'] as const;
type CategoryKey = (typeof CATEGORIES)[number];

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
}

const EMPTY_IMAGES: GalleryImage[] = [];

export default function GalleryPage() {
  const t = useT();
  const [active, setActive] = useState<CategoryKey>('all');

  const filtered = active === 'all' ? EMPTY_IMAGES : EMPTY_IMAGES.filter((img) => img.category === active);

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

          {filtered.length === 0 ? (
            <Reveal>
              <div className="state-panel">
                <div className="state-icon">
                  <Images aria-hidden="true" size={26} />
                </div>
                <h3>{t('gallery.emptyTitle')}</h3>
                <p>{t('gallery.emptyDesc')}</p>
              </div>
            </Reveal>
          ) : (
            <div className="grid gallery-grid">
              {filtered.map((img) => (
                <Reveal key={img.id}>
                  <figure className="gallery-item">
                    <img src={img.imageUrl} alt={img.title || img.category} loading="lazy" />
                    {img.title && <figcaption>{img.title}</figcaption>}
                  </figure>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}