'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, registerGsap, prefersReducedMotion } from '@/lib/motion';

const projects = [
  {
    index: '01',
    name: 'material.one',
    tagline: 'Enterprise monorepo · 10 interconnected apps',
    description:
      'A unified monorepo hosting 10 enterprise Angular applications with a shared design system, centralized state, and an automated monthly release pipeline.',
    problem:
      'Isolated enterprise apps with duplicated code, inconsistent UX, and fragile, unpredictable releases.',
    solution:
      'Shared component libraries in Storybook, centralized NGRX patterns, Keycloak SSO, and a structured release process across every app.',
    impact: ['10 apps unified', 'Monthly release cadence', 'Storybook design system'],
    tech: ['Angular 19', 'NGRX', 'Monorepo', 'Storybook', 'Keycloak'],
    url: 'https://material.one/',
  },
  {
    index: '02',
    name: 'Distrelec Commerce',
    tagline: 'JSP → Angular 12 · 25 country domains',
    description:
      'Full migration of a high-traffic B2B electronics platform from legacy JSP to Angular 12, serving 25 European country domains with 20+ languages.',
    problem:
      'A legacy JSP frontend that couldn’t scale to modern UX, localization, and traffic demands across 25 markets.',
    solution:
      'Phased migration to Angular 12 with an i18n-first architecture, lazy-loaded country modules, and reusable commerce components.',
    impact: ['25 domains migrated', '20+ languages', 'A/B-tested conversions'],
    tech: ['Angular 12', 'i18n', 'RxJS', 'Google Optimize'],
    url: 'https://www.distrelec.com/',
  },
  {
    index: '03',
    name: 'ClinicalTrials Parser',
    tagline: 'Medical data integration · 95% accuracy',
    description:
      'Enhanced a clinical-trials criteria parser and the surrounding frontend to integrate complex medical research data with high reliability.',
    problem:
      'Inconsistent parsing of clinical eligibility criteria limited the reliability of research data integration.',
    solution:
      'Refined parsing logic and frontend–backend integration to push accuracy and processing efficiency to production-grade levels.',
    impact: ['95% parser accuracy', 'Agile delivery', 'Reliable data pipelines'],
    tech: ['Angular', 'TypeScript', 'REST APIs', 'Agile'],
    url: null,
  },
  {
    index: '04',
    name: 'BluLogix Billing',
    tagline: 'AngularJS → Angular 10 · Component library',
    description:
      'Migration of a multi-tenant SaaS billing platform from AngularJS to Angular 10, paired with a reusable component library and complex dynamic forms.',
    problem:
      'A legacy AngularJS codebase with technical debt and inconsistent UI slowing feature delivery.',
    solution:
      'Complete framework migration plus a shared component library and NGRX-driven dynamic forms and modal systems.',
    impact: ['Zero billing regressions', 'Reusable library', 'NGRX dynamic forms'],
    tech: ['Angular 10', 'AngularJS', 'NGRX', 'Component Library'],
    url: 'https://blulogix.com/',
  },
];

export function Projects() {
  const root = useRef<HTMLDivElement>(null);

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

  return (
    <section id="work" className="section-pad" style={{ background: 'var(--bg-deep)' }}>
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
            <span className="eyebrow" style={{ display: 'block', marginBottom: '1rem' }}>
              (04) — Selected Work
            </span>
            <h2 className="section-title">
              Things I&apos;ve<br />
              <span className="italic-accent">shipped</span>.
            </h2>
          </div>
          <p style={{ color: 'var(--fg-muted)', maxWidth: '32ch', fontSize: '0.95rem' }}>
            Enterprise platforms where architecture, scale, and release discipline mattered most.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {projects.map((p) => (
            <article key={p.index} className="proj-card" data-cursor="hover">
              <div className="proj-top">
                <span className="proj-index mono-label">{p.index}</span>
                <div className="proj-headline">
                  <h3 className="proj-name">
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
                <p className="proj-desc">{p.description}</p>
                <div className="proj-cols">
                  <div>
                    <span className="mono-label">Problem</span>
                    <p>{p.problem}</p>
                  </div>
                  <div>
                    <span className="mono-label">Solution</span>
                    <p>{p.solution}</p>
                  </div>
                </div>
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
            </article>
          ))}
        </div>
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
          font-family: var(--font-display); font-weight: 500;
          font-size: clamp(2rem, 6vw, 4.5rem); line-height: 1; letter-spacing: -0.03em;
        }
        .proj-name a { display: inline-flex; align-items: center; gap: 0.4rem; transition: color 0.3s ease; }
        .proj-name a:hover { color: var(--accent); }
        .proj-arrow { opacity: 0; transform: translate(-8px, 8px); transition: all 0.35s var(--ease-out); }
        .proj-name a:hover .proj-arrow { opacity: 1; transform: translate(0, 0); }
        .proj-tagline { color: var(--fg-muted); font-family: var(--font-mono); font-size: 0.8rem; margin-top: 0.7rem; letter-spacing: 0.02em; }
        .proj-detail {
          display: grid; grid-template-columns: 60px 1fr; gap: 1.5rem;
          max-height: 0; opacity: 0; overflow: hidden;
          transition: max-height 0.6s var(--ease-out), opacity 0.5s var(--ease-out), margin-top 0.5s var(--ease-out);
          grid-column: 1 / -1;
        }
        .proj-detail > * { grid-column: 2; }
        .proj-card:hover .proj-detail,
        .proj-card:focus-within .proj-detail {
          max-height: 600px; opacity: 1; margin-top: 1.6rem;
        }
        .proj-desc { color: var(--fg-soft); max-width: 65ch; line-height: 1.7; }
        .proj-cols {
          display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1.6rem;
        }
        .proj-cols p { color: var(--fg-muted); font-size: 0.9rem; line-height: 1.65; margin-top: 0.5rem; max-width: 42ch; }
        .proj-impact { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.6rem; }
        .proj-impact__item {
          font-family: var(--font-mono); font-size: 0.74rem; color: var(--accent);
          padding: 0.35rem 0.7rem; border-radius: 100px; background: var(--accent-soft);
        }
        @media (hover: none) {
          .proj-detail { max-height: 800px; opacity: 1; margin-top: 1.6rem; }
        }
        @media (max-width: 760px) {
          .proj-top, .proj-detail { grid-template-columns: 1fr; gap: 0.6rem; }
          .proj-detail > * { grid-column: 1; }
          .proj-index { padding-top: 0; }
          .proj-cols { grid-template-columns: 1fr; gap: 1.25rem; }
        }
      `}</style>
    </section>
  );
}
