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
      'Lead frontend development and release management across 10 interconnected enterprise applications within a monorepo architecture.',
    impact: [
      'Manage monthly production deployments, coordinating release cycles for stable, predictable delivery',
      'Develop scalable features using Angular 19 and NGRX for complex state management',
      'Build and maintain reusable UI components in Storybook to standardize design systems across applications',
      'Customize and manage Keycloak-based authentication flows across multiple applications',
      'Improve deployment reliability through structured release processes and cross-team coordination',
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
      'Contributed to migrating a legacy JSP-based e-commerce platform to Angular 12, modernizing frontend architecture across 25 country-specific domains.',
    impact: [
      'Managed and maintained 20+ language translation files for a multi-market European user base',
      'Built reusable Angular components: idle-timeout, dynamic volume pricing formatter, image magnifier, product gallery preview',
      'Supported high-traffic e-commerce operations serving users across multiple European regions',
      'Conducted A/B testing and geo-targeting experiments with Google Optimize to improve engagement and conversion',
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
      'Enhanced the ClinicalTrials.com criteria parser and integrated frontend systems for clinical research data integration.',
    impact: [
      'Increased parsing accuracy and success rate to 95%',
      'Improved data processing efficiency and reliability for clinical research data integration',
      'Integrated frontend systems with backend services for consistent, high-performance applications',
      'Collaborated in Agile teams to deliver enterprise-grade medical data solutions',
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
      'Contributed to the AngularJS → Angular 10 migration and built a reusable component library for a SaaS billing platform.',
    impact: [
      'Migrated from AngularJS to Angular 10, improving long-term maintainability and scalability',
      'Developed a reusable component library to accelerate feature delivery and ensure UI consistency',
      'Engineered complex dynamic forms using Angular Forms and NGRX for robust state management',
      'Designed flexible modal systems to enhance usability and interface consistency',
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
      'Built scalable frontend applications and backend logic, integrating third-party APIs across cross-platform products.',
    impact: [
      'Built scalable frontend applications using Angular 8, DevExpress, and Material UI',
      'Implemented backend logic using ColdFusion (Lucee) and MSSQL',
      'Integrated Google and Microsoft Calendar APIs into scheduling workflows',
      'Implemented DHL shipment tracking and automated PDF export functionality',
      'Developed cross-platform applications using Angular (v4–v6) and Ionic (v3–v4)',
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
