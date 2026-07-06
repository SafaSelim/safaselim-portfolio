'use client';

import { useEffect, useRef } from 'react';
import { gsap, registerGsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion';
import { useReveal } from '@/hooks/useReveal';

const stats = [
  { value: 6, suffix: '+', label: 'Years of experience' },
  { value: 10, suffix: '', label: 'Enterprise apps in one monorepo' },
  { value: 25, suffix: '', label: 'Country domains shipped' },
  { value: 20, suffix: '+', label: 'Languages localized' },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = `${value}${suffix}`;
      return;
    }
    const obj = { n: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          n: value,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${Math.round(obj.n)}${suffix}`;
          },
        });
      },
    });
    return () => st.kill();
  }, [value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export function About() {
  const ref = useReveal<HTMLDivElement>('.will-reveal', { stagger: 0.1 });

  return (
    <section id="about" className="section-pad">
      <div ref={ref} className="container">
        <span className="section-index will-reveal" style={{ display: 'block', marginBottom: '2rem' }}>
          01 — About
        </span>

        <div className="about-copy will-reveal">
          <p
            className="display-lg"
            style={{ fontSize: 'clamp(1.5rem, 3.4vw, 2.9rem)', color: 'var(--fg)' }}
          >
            I turn sprawling enterprise codebases into{' '}
            <span className="italic-accent">structured, scalable</span> systems.
          </p>
          <p style={{ color: 'var(--fg-soft)', lineHeight: 1.75, marginTop: '1.5rem', maxWidth: '52ch' }}>
            For 6+ years I&apos;ve shipped performance-critical platforms across European markets —
            from lifting a 25-domain e-commerce site off legacy JSP to standardizing design systems
            in Storybook and securing apps with Keycloak. I specialize in Angular, NGRX, and monorepo
            architecture, and own release management across multi-application environments.
          </p>
          <ul style={{ listStyle: 'none', display: 'grid', gap: '0.6rem', marginTop: '1.5rem' }}>
            {[
              'Angular v4 → v19 across the full release timeline',
              'Monorepo architecture & shared component libraries',
              'NGRX state management at enterprise scale',
              'Release management for multi-app environments',
            ].map((t) => (
              <li key={t} style={{ display: 'flex', gap: '0.7rem', fontSize: '0.92rem', color: 'var(--fg-soft)' }}>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono-stack)' }}>↳</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="stats-grid will-reveal">
          {stats.map((s) => (
            <div key={s.label} style={{ borderTop: '1px solid var(--line-strong)', paddingTop: '1.1rem' }}>
              <div className="display-xl" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', color: 'var(--fg)' }}>
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mono-label" style={{ marginTop: '0.5rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .about-copy { max-width: 56%; margin-left: auto; }
        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem; margin-top: clamp(4rem, 9vw, 7rem);
        }
        @media (max-width: 900px) {
          .about-copy { max-width: 100%; margin-left: 0; padding-top: 42vh; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}
