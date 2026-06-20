'use client';

import { useEffect, useRef } from 'react';
import { gsap, registerGsap, prefersReducedMotion } from '@/lib/motion';

const items = [
  'Angular v2–v20',
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
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 3.5vw, 2.6rem)',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            color: 'var(--fg-soft)',
          }}
        >
          {it}
          <span style={{ color: 'var(--accent)', fontSize: '0.7em' }}>✦</span>
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
      // speed up / nudge direction with scroll velocity
      let dir = 1;
      const onScroll = () => {
        const v = (window.scrollY % 1000) - dir;
        dir = window.scrollY;
        tween.timeScale(v < 0 ? -1 : 1);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      style={{
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        padding: '1.6rem 0',
        background: 'var(--bg-deep)',
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
