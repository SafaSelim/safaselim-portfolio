'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, registerGsap, prefersReducedMotion } from '@/lib/motion';

const projects = [
  {
    index: '01',
    name: 'material.one',
    tagline: 'Enterprise monorepo · 10 interconnected apps',
    description:
      'Lead frontend development and release management for 10 interconnected enterprise applications in a single monorepo.',
    highlights: [
      'Own monthly production releases end-to-end for predictable, low-risk delivery',
      'Ship scalable features in Angular 19 with NGRX for complex state management',
      'Maintain a Storybook component library that standardizes the design system across apps',
      'Design and manage shared Keycloak authentication flows across applications',
    ],
    impact: ['10 apps', 'Monthly releases', 'Storybook system'],
    tech: ['Angular 19', 'NGRX', 'Monorepo', 'Storybook', 'Keycloak'],
    url: 'https://material.one/',
  },
  {
    index: '02',
    name: 'Distrelec Commerce',
    tagline: 'JSP → Angular 12 · 25 country domains',
    description:
      'Helped migrate a legacy JSP e-commerce platform to Angular 12, modernizing the frontend across 25 country-specific domains for European markets.',
    highlights: [
      'Maintained 20+ localization files powering a multi-market European user base',
      'Built reusable components — idle-timeout, dynamic volume pricing, image magnifier, gallery preview',
      'Kept high-traffic commerce operations smooth across multiple European regions',
      'Ran A/B and geo-targeting experiments in Google Optimize to lift engagement and conversion',
    ],
    impact: ['25 domains', '20+ languages', 'High-traffic commerce'],
    tech: ['Angular 12', 'i18n', 'Google Optimize', 'A/B Testing'],
    url: 'https://www.distrelec.com/',
  },
  {
    index: '03',
    name: 'ClinicalTrials Parser',
    tagline: 'Clinical research data · 95% accuracy',
    description:
      'Improved the ClinicalTrials.com criteria parser and the surrounding frontend for clinical research data.',
    highlights: [
      'Lifted parser accuracy and success rate to 95%',
      'Improved processing efficiency and reliability across the data-integration pipeline',
      'Integrated the frontend with backend services for consistent, high-performance delivery',
      'Delivered enterprise-grade medical data features in cross-functional Agile teams',
    ],
    impact: ['95% parser accuracy', 'Agile delivery'],
    tech: ['Angular', 'TypeScript', 'REST APIs', 'Agile'],
    url: null,
  },
  {
    index: '04',
    name: 'BluLogix Billing',
    tagline: 'AngularJS → Angular 10 · Component library',
    description:
      'Helped migrate a SaaS billing platform from AngularJS to Angular 10 and built its reusable component library.',
    highlights: [
      'Moved the codebase from AngularJS to Angular 10 for long-term maintainability and scalability',
      'Built a reusable component library that sped up feature delivery and kept the UI consistent',
      'Engineered complex dynamic forms with Angular Forms and NGRX for robust state management',
      'Designed flexible modal systems for a more usable, consistent interface',
    ],
    impact: ['Component library', 'NGRX dynamic forms'],
    tech: ['AngularJS', 'Angular 10', 'Angular Forms', 'NGRX'],
    url: 'https://blulogix.com/',
  },
];

export function Projects() {
  const root = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<string[] | null>(null);

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.proj-card').forEach((card) => {
        gsap.from(card, {
          y: 70,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%' },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    const card = previewRef.current;
    if (!el || !card) return;
    if (prefersReducedMotion() || window.matchMedia('(hover: none)').matches) return;
    const xTo = gsap.quickTo(card, 'x', { duration: 0.45, ease: 'power3' });
    const yTo = gsap.quickTo(card, 'y', { duration: 0.45, ease: 'power3' });
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo(e.clientX - r.left + 24);
      yTo(e.clientY - r.top - 40);
    };
    el.addEventListener('pointermove', onMove);
    return () => el.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section-pad"
      style={{ position: 'relative', overflow: 'hidden' }}
      onMouseLeave={() => setPreview(null)}
    >
      <div ref={root} className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: 'clamp(2.5rem, 6vw, 4.5rem)',
          }}
        >
          <div>
            <span className="section-index" style={{ display: 'block', marginBottom: '1rem' }}>
              04 — Selected Work
            </span>
            <h2 className="section-title">
              Things I&apos;ve shipped<span style={{ color: 'var(--accent)' }}>.</span>
            </h2>
          </div>
          <p style={{ color: 'var(--fg-muted)', maxWidth: '32ch', fontSize: '0.95rem' }}>
            Enterprise platforms where architecture, scale, and release discipline mattered most.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {projects.map((p) => (
            <article
              key={p.index}
              className="proj-card"
              onMouseEnter={() => setPreview(p.impact)}
              onMouseLeave={() => setPreview(null)}
            >
              <div className="proj-top">
                <span className="proj-index mono-label">{p.index}</span>
                <div className="proj-headline">
                  <h3 className="proj-name display-lg">
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noopener noreferrer">
                        {p.name}
                        <ArrowUpRight className="proj-arrow" size={28} />
                      </a>
                    ) : (
                      <span>{p.name}</span>
                    )}
                  </h3>
                  <p className="proj-tagline">{p.tagline}</p>
                </div>
              </div>

              <div className="proj-detail">
                <div className="proj-detail__inner">
                <p className="proj-desc">{p.description}</p>
                <ul className="proj-highlights">
                  {p.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <div className="proj-impact">
                  {p.impact.map((it) => (
                    <span key={it} className="proj-impact__item">
                      {it}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1.2rem' }}>
                  {p.tech.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div
        ref={previewRef}
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2,
          pointerEvents: 'none',
          opacity: preview ? 1 : 0,
          transition: 'opacity 0.25s var(--ease-out)',
          background: 'var(--bg-elev)',
          border: '1px solid var(--line-strong)',
          borderRadius: '10px',
          padding: '0.9rem 1.1rem',
          maxWidth: '240px',
          boxShadow: '0 24px 60px -24px rgba(0,0,0,0.5)',
        }}
      >
        {preview?.map((it) => (
          <div key={it} className="mono-label" style={{ color: 'var(--accent-text)', marginBottom: '0.3rem' }}>
            {it}
          </div>
        ))}
      </div>

      <style>{`
        .proj-card {
          border-top: 1px solid var(--line-strong);
          padding: clamp(1.8rem, 4vw, 2.8rem) 0;
        }
        .proj-card:last-child { border-bottom: 1px solid var(--line-strong); }
        .proj-top {
          display: grid; grid-template-columns: 60px 1fr; gap: 1.5rem; align-items: baseline;
        }
        .proj-index { padding-top: 0.6rem; }
        .proj-name {
          font-size: clamp(1.9rem, 5.5vw, 4rem);
        }
        .proj-name a { display: inline-flex; align-items: center; gap: 0.4rem; transition: color 0.3s ease; padding: 0.5rem 0; margin: -0.5rem 0; }
        .proj-name a:hover { color: var(--accent); }
        .proj-arrow { opacity: 0; transform: translate(-8px, 8px); transition: all 0.35s var(--ease-out); }
        .proj-name a:hover .proj-arrow { opacity: 1; transform: translate(0, 0); }
        .proj-tagline { color: var(--fg-muted); font-family: var(--font-mono-stack); font-size: 0.8rem; margin-top: 0.7rem; letter-spacing: 0.02em; }
        /* grid-rows collapse animates on the compositor-friendly track size
           instead of max-height/margin (layout thrash) */
        .proj-detail {
          grid-column: 1 / -1;
          display: grid; grid-template-rows: 0fr; opacity: 0;
          transition: grid-template-rows 0.6s var(--ease-out), opacity 0.5s var(--ease-out);
        }
        .proj-detail__inner {
          overflow: hidden; min-height: 0;
          display: grid; grid-template-columns: 60px 1fr; gap: 1.5rem;
        }
        .proj-detail__inner > * { grid-column: 2; }
        .proj-detail__inner > :first-child { margin-top: 1.6rem; }
        .proj-card:hover .proj-detail,
        .proj-card:focus-within .proj-detail {
          grid-template-rows: 1fr; opacity: 1;
        }
        .proj-desc { color: var(--fg-soft); max-width: 70ch; line-height: 1.7; }
        .proj-highlights { list-style: none; margin-top: 1.4rem; display: grid; gap: 0.55rem; max-width: 70ch; }
        .proj-highlights li {
          position: relative; padding-left: 1.4rem; color: var(--fg-muted);
          font-size: 0.92rem; line-height: 1.6;
        }
        .proj-highlights li::before {
          content: '✦'; position: absolute; left: 0; top: 0; color: var(--accent);
          font-size: 0.7rem; line-height: 1.7;
        }
        .proj-impact { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.6rem; }
        .proj-impact__item {
          font-family: var(--font-mono-stack); font-size: 0.74rem; color: var(--accent-text);
          padding: 0.35rem 0.7rem; border-radius: 100px; background: var(--accent-soft);
        }
        @media (hover: none) {
          .proj-detail { grid-template-rows: 1fr; opacity: 1; }
        }
        @media (max-width: 760px) {
          .proj-top, .proj-detail__inner { grid-template-columns: 1fr; gap: 0.6rem; }
          .proj-detail__inner > * { grid-column: 1; }
          .proj-index { padding-top: 0; }
        }
      `}</style>
    </section>
  );
}
