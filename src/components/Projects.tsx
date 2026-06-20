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
      'Lead frontend development and release management across 10 interconnected enterprise applications within a monorepo architecture.',
    highlights: [
      'Manage monthly production deployments with coordinated release cycles for stable, predictable delivery',
      'Develop scalable features using Angular 19 and NGRX for complex state management',
      'Build and maintain reusable UI components in Storybook to standardize design systems',
      'Customize and manage Keycloak-based authentication flows across multiple applications',
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
      'Contributed to migrating a legacy JSP-based e-commerce platform to Angular 12, modernizing the frontend across 25 country-specific domains for European markets.',
    highlights: [
      'Managed and maintained 20+ language translation files for a multi-market European user base',
      'Built reusable Angular components: idle-timeout, dynamic volume pricing formatter, image magnifier, product gallery preview',
      'Supported high-traffic e-commerce operations across multiple European regions',
      'Ran A/B testing and geo-targeting experiments with Google Optimize to improve engagement and conversion',
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
      'Enhanced the ClinicalTrials.com criteria parser and integrated frontend systems for clinical research data integration.',
    highlights: [
      'Increased parsing accuracy and success rate to 95%',
      'Improved data processing efficiency and reliability for clinical research data integration',
      'Integrated frontend systems with backend services for consistent, high-performance applications',
      'Collaborated in Agile teams to deliver enterprise-grade medical data solutions',
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
      'Contributed to the AngularJS → Angular 10 migration and built a reusable component library for a SaaS billing platform.',
    highlights: [
      'Migrated from AngularJS to Angular 10, improving long-term maintainability and scalability',
      'Developed a reusable component library to accelerate feature delivery and ensure UI consistency',
      'Engineered complex dynamic forms using Angular Forms and NGRX for robust state management',
      'Designed flexible modal systems to enhance usability and interface consistency',
    ],
    impact: ['Component library', 'NGRX dynamic forms'],
    tech: ['AngularJS', 'Angular 10', 'Angular Forms', 'NGRX'],
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
          max-height: 900px; opacity: 1; margin-top: 1.6rem;
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
        }
      `}</style>
    </section>
  );
}
