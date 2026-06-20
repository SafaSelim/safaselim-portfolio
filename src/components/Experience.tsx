'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, registerGsap, prefersReducedMotion } from '@/lib/motion';

const experiences = [
  {
    company: 'adesso Turkey',
    project: 'material.one',
    projectUrl: 'https://material.one/',
    role: 'Frontend Developer & Release Manager',
    period: 'Nov 2023 — Present',
    description:
      'Lead frontend development and release management for 10 interconnected enterprise applications in a single monorepo.',
    impact: [
      'Own monthly production releases end-to-end, coordinating cross-team cycles for predictable, low-risk delivery',
      'Ship scalable features in Angular 19 with NGRX for complex state management',
      'Maintain a Storybook component library that standardizes the design system across every app',
      'Design and manage shared Keycloak authentication flows spanning multiple applications',
      'Raised deployment reliability through structured release processes and tighter cross-team coordination',
    ],
    tech: ['Angular 19', 'NGRX', 'Monorepo', 'Storybook', 'Keycloak'],
  },
  {
    company: 'Digacon',
    project: 'Distrelec',
    projectUrl: 'https://www.distrelec.com/',
    role: 'Frontend Developer',
    period: 'May 2022 — Sep 2023',
    description:
      'Helped migrate a legacy JSP e-commerce platform to Angular 12, modernizing the frontend across 25 country-specific domains.',
    impact: [
      'Maintained 20+ localization files powering a multi-market European user base',
      'Built reusable components — idle-timeout, dynamic volume pricing, image magnifier, gallery preview — reused across the catalog',
      'Kept high-traffic commerce operations smooth across multiple European regions',
      'Ran A/B and geo-targeting experiments in Google Optimize to lift engagement and conversion',
    ],
    tech: ['Angular 12', 'i18n', 'Google Optimize', 'A/B Testing', 'SCSS'],
  },
  {
    company: 'Clinerion LTD',
    project: 'ClinicalTrials Parser',
    projectUrl: null,
    role: 'Frontend Developer',
    period: 'Aug 2021 — May 2022',
    description:
      'Improved the ClinicalTrials.com criteria parser and the surrounding frontend for clinical research data.',
    impact: [
      'Lifted parser accuracy and success rate to 95%',
      'Improved processing efficiency and reliability across the data-integration pipeline',
      'Integrated the frontend with backend services for consistent, high-performance delivery',
      'Delivered enterprise-grade medical data features in cross-functional Agile teams',
    ],
    tech: ['Angular', 'TypeScript', 'REST APIs', 'Agile'],
  },
  {
    company: 'BluLogix LLC',
    project: 'Billing Platform',
    projectUrl: 'https://blulogix.com/',
    role: 'Frontend Developer',
    period: 'Jul 2020 — Jun 2021',
    description:
      'Helped migrate a SaaS billing platform from AngularJS to Angular 10 and built its reusable component library.',
    impact: [
      'Moved the codebase from AngularJS to Angular 10 for long-term maintainability and scalability',
      'Built a reusable component library that sped up feature delivery and kept the UI consistent',
      'Engineered complex dynamic forms with Angular Forms and NGRX for robust state management',
      'Designed flexible modal systems for a more usable, consistent interface',
    ],
    tech: ['AngularJS', 'Angular 10', 'Angular Forms', 'NGRX'],
  },
  {
    company: 'Pluscor INC & Ortak',
    project: 'Enterprise Apps',
    projectUrl: null,
    role: 'Software Developer',
    period: 'Apr 2019 — Jun 2020',
    description:
      'Built full-stack apps across web and cross-platform mobile, wiring in third-party APIs end-to-end.',
    impact: [
      'Built frontend apps with Angular 8, DevExpress, and Material UI',
      'Implemented backend logic in ColdFusion (Lucee) and MSSQL',
      'Integrated Google and Microsoft Calendar APIs into scheduling workflows',
      'Shipped DHL shipment tracking and automated PDF export',
      'Built cross-platform mobile apps with Angular (v4–v6) and Ionic (v3–v4)',
    ],
    tech: ['Angular 8', 'DevExpress', 'Material UI', 'ColdFusion', 'MSSQL', 'Ionic'],
  },
];

export function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // progress line fill
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top',
          scrollTrigger: { trigger: el, start: 'top 60%', end: 'bottom 80%', scrub: true },
        }
      );

      gsap.utils.toArray<HTMLElement>('.exp-row').forEach((row) => {
        gsap.from(row, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 82%' },
        });
        const dot = row.querySelector('.exp-dot');
        if (dot) {
          gsap.from(dot, {
            scale: 0,
            duration: 0.6,
            ease: 'back.out(2)',
            scrollTrigger: { trigger: row, start: 'top 75%' },
          });
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="section-pad" style={{ background: 'var(--bg-deep)' }}>
      <div ref={root} className="container">
        <div className="exp-head">
          <span className="eyebrow">(02) — Experience</span>
          <h2 className="section-title" style={{ marginTop: '1rem' }}>
            Six years,<br />
            <span className="italic-accent">five</span> teams.
          </h2>
        </div>

        <div className="exp-timeline">
          <div className="exp-line-track" aria-hidden>
            <div ref={lineRef} className="exp-line-fill" />
          </div>

          <div className="exp-list">
            {experiences.map((exp, i) => (
              <article key={i} className="exp-row">
                <span className="exp-dot" aria-hidden />
                <div className="exp-period mono-label">{exp.period}</div>
                <div className="exp-body">
                  <h3 className="exp-title">
                    {exp.company}
                    <span style={{ color: 'var(--line-strong)' }}> / </span>
                    {exp.projectUrl ? (
                      <a
                        href={exp.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--accent)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.15rem',
                        }}
                      >
                        {exp.project}
                        <ArrowUpRight size={18} />
                      </a>
                    ) : (
                      <span style={{ color: 'var(--accent)' }}>{exp.project}</span>
                    )}
                  </h3>
                  <p className="exp-role">{exp.role}</p>
                  <p className="exp-desc">{exp.description}</p>
                  <ul className="exp-impact">
                    {exp.impact.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1.1rem' }}>
                    {exp.tech.map((t) => (
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
      </div>

      <style>{`
        .exp-head { max-width: 60ch; margin-bottom: clamp(3rem, 7vw, 5rem); }
        .exp-timeline { position: relative; padding-left: 2.5rem; }
        .exp-line-track {
          position: absolute; left: 6px; top: 8px; bottom: 8px; width: 2px;
          background: var(--line);
        }
        .exp-line-fill { width: 100%; height: 100%; background: var(--accent); transform: scaleY(0); }
        .exp-list { display: flex; flex-direction: column; gap: clamp(3rem, 7vw, 5.5rem); }
        .exp-row { position: relative; display: grid; grid-template-columns: 200px 1fr; gap: 2.5rem; }
        .exp-dot {
          position: absolute; left: calc(-2.5rem + 1px); top: 6px;
          width: 14px; height: 14px; border-radius: 50%;
          background: var(--bg-deep); border: 2px solid var(--accent);
        }
        .exp-period { padding-top: 4px; }
        .exp-title {
          font-family: var(--font-display); font-weight: 500;
          font-size: clamp(1.5rem, 3vw, 2.3rem); line-height: 1.05; letter-spacing: -0.02em;
        }
        .exp-role { color: var(--fg-soft); font-weight: 500; margin-top: 0.4rem; font-size: 0.95rem; }
        .exp-desc { color: var(--fg-muted); margin-top: 0.9rem; max-width: 60ch; line-height: 1.7; }
        .exp-impact { list-style: none; margin-top: 1.1rem; display: grid; gap: 0.5rem; max-width: 62ch; }
        .exp-impact li {
          position: relative; padding-left: 1.4rem; color: var(--fg-soft);
          font-size: 0.92rem; line-height: 1.55;
        }
        .exp-impact li::before {
          content: '✦'; position: absolute; left: 0; top: 0; color: var(--accent);
          font-size: 0.7rem; line-height: 1.6;
        }
        @media (max-width: 760px) {
          .exp-row { grid-template-columns: 1fr; gap: 0.6rem; }
        }
      `}</style>
    </section>
  );
}
