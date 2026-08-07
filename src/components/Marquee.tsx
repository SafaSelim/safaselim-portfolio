'use client';

import { useEffect, useRef } from 'react';
import { gsap, registerGsap, prefersReducedMotion } from '@/lib/motion';

const items = [
  'Angular',
  'NGRX',
  'Monorepo Architecture',
  'TypeScript',
  'Storybook',
  'Release Management',
  'Keycloak',
  'Component-Driven Design',
  'Enterprise Scale',
];

function MarqueeGroup() {
  return (
    <div className="marquee__track" aria-hidden>
      {items.map((it, i) => (
        <span
          key={i}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2.5rem',
            fontFamily: 'var(--font-mono-stack)',
            fontSize: 'clamp(0.8rem, 1.6vw, 1rem)',
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase' as const,
            color: 'inherit',
          }}
        >
          {it}
          {/* strip is inverted (fg bg), so the star needs the inverse slate */}
          <span style={{ color: 'var(--secondary-inverse)', fontSize: '0.7em' }}>✦</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: -50,
        ease: 'none',
        duration: 28,
        repeat: -1,
      });
      // flip direction based on scroll direction, then settle back to forward
      let lastY = window.scrollY;
      let settle: ReturnType<typeof setTimeout>;
      const onScroll = () => {
        const y = window.scrollY;
        if (y !== lastY) {
          tween.timeScale(y < lastY ? -1 : 1);
          lastY = y;
          clearTimeout(settle);
          settle = setTimeout(() => tween.timeScale(1), 150);
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        clearTimeout(settle);
        window.removeEventListener('scroll', onScroll);
      };
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      style={{
        background: 'var(--fg)',
        color: 'var(--bg)',
        padding: '0.9rem 0',
      }}
    >
      <div className="marquee">
        <div ref={trackRef} style={{ display: 'flex' }}>
          <MarqueeGroup />
          <MarqueeGroup />
        </div>
      </div>
    </div>
  );
}
