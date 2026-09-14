import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';

interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  variant?: 'dark' | 'light';
  size?: number;
}

/**
 * Company logo. Tries the actual logo at /logo/logo.png and falls back to a
 * styled monogram placeholder so the site works even before the real logo is
 * provided. Replace the file at /public/logo/logo.png with the real logo.
 */
export default function Logo({ variant = 'dark', size = 40, style, ...rest }: LogoProps) {
  const [failed, setFailed] = useState(false);
  const isDark = variant === 'dark';

  if (failed) {
    return (
      <span
        aria-label="MANISH ELECTRICALS"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          borderRadius: 12,
          background: isDark ? '#0b1120' : '#0b1120',
          border: '2px solid #f59e0b',
          color: '#fbbf24',
          fontFamily: 'Sora, Inter, sans-serif',
          fontWeight: 800,
          fontSize: size * 0.4,
          letterSpacing: '-0.04em',
          ...style,
        }}
      >
        ME
      </span>
    );
  }

  return (
    <img
      src="/logo/logo.png"
      alt="MANISH ELECTRICALS logo"
      width={size}
      height={size}
      onError={() => setFailed(true)}
      style={{
        borderRadius: 10,
        objectFit: 'contain',
        background: '#0b1120',
        ...style,
      }}
      {...rest}
    />
  );
}