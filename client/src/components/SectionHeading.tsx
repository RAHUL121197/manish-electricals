import Reveal from './Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  sub?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeading({ eyebrow, title, sub, centered = false, light = false }: SectionHeadingProps) {
  return (
    <Reveal className={`section-head${centered ? ' centered' : ''}`}>
      {eyebrow && <span className={`eyebrow${centered ? ' centered' : ''}`}>{eyebrow}</span>}
      <h2>{title}</h2>
      {sub && <p className={`text-muted${light ? '' : ''}`}>{sub}</p>}
    </Reveal>
  );
}