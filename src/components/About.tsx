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
        <span className="eyebrow will-reveal" style={{ display: 'block', marginBottom: '2.5rem' }}>
          (01) — About
        </span>

        <div className="about-grid">
          <p
            className="display will-reveal"
            style={{
              fontSize: 'clamp(1.6rem, 3.6vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.18,
              letterSpacing: '-0.02em',
            }}
          >
            I turn sprawling enterprise codebases into{' '}
            <span className="italic-accent">structured, scalable</span> systems —
            specializing in Angular, NGRX, and monorepo architecture, and owning{' '}
            <span className="italic-accent">release management</span> across
            multi-application environments.
          </p>

          <div className="about-side will-reveal">
            <p
              style={{
                color: 'var(--fg-muted)',
                fontSize: '1rem',
                lineHeight: 1.75,
                marginBottom: '1.5rem',
              }}
            >
              For 6+ years I&apos;ve shipped performance-critical platforms across European
              markets — from lifting a 25-domain e-commerce site off legacy JSP to
              standardizing design systems in Storybook and securing apps with Keycloak.
            </p>
            <ul style={{ listStyle: 'none', display: 'grid', gap: '0.6rem' }}>
              {[
                'Angular v4 → v19 across the full release timeline',
                'Monorepo architecture & shared component libraries',
                'NGRX state management at enterprise scale',
                'Release management for multi-app environments',
              ].map((t) => (
                <li
                  key={t}
                  style={{
                    display: 'flex',
                    gap: '0.7rem',
                    alignItems: 'flex-start',
                    fontSize: '0.92rem',
                    color: 'var(--fg-soft)',
                  }}
                >
                  <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>↳</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="stats-grid will-reveal">
          {stats.map((s) => (
            <div key={s.label} style={{ borderTop: '1px solid var(--line-strong)', paddingTop: '1.2rem' }}>
              <div
                className="display"
                style={{
                  fontSize: 'clamp(2.6rem, 6vw, 4.5rem)',
                  fontWeight: 500,
                  lineHeight: 1,
                  color: 'var(--accent)',
                }}
              >
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <p
                style={{
                  marginTop: '0.6rem',
                  fontSize: '0.85rem',
                  color: 'var(--fg-muted)',
                  maxWidth: '18ch',
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: clamp(2rem, 6vw, 5rem);
          align-items: start;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(1.5rem, 4vw, 3rem);
          margin-top: clamp(3.5rem, 8vw, 6rem);
        }
        @media (max-width: 880px) {
          .about-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
        }
      `}</style>
    </section>
  );
}
