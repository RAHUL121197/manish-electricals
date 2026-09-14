import { useEffect, useRef, useState } from 'react';

interface StatCounterProps {
  value: string;
  label?: string;
  duration?: number;
  numericValue?: number;
}

/**
 * Counts up to a number when scrolled into view. Used for "20+", "90+".
 * Pass numericValue to trigger counting; other values render as-is.
 */
export default function StatCounter({ value, label, duration = 1200, numericValue }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (numericValue === undefined) {
      setDisplay(value);
      return;
    }
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setDisplay(value);
      return;
    }

    let raf = 0;
    const suffix = value.replace(/\d+/g, '');
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(numericValue * eased);
          setDisplay(`${current}${suffix}`);
          if (progress < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [numericValue, value, duration]);

  return (
    <div ref={ref}>
      <div className="stat-value">{display}</div>
      {label && (
        <div className="text-muted" style={{ marginTop: 4, fontWeight: 600 }}>
          {label}
        </div>
      )}
    </div>
  );
}