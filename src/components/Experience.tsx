'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, registerGsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion';

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

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.querySelectorAll('.xp-row').forEach((r) => r.classList.add('is-active'));
      return;
    }
    const triggers: ScrollTrigger[] = [];
    el.querySelectorAll<HTMLElement>('.xp-row').forEach((row) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: row,
          start: 'top 62%',
          end: 'bottom 38%',
          onToggle: (self) => row.classList.toggle('is-active', self.isActive),
        })
      );
      const entrance = gsap.from(row, {
        y: 50, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: row, start: 'top 85%' },
      });
      if (entrance.scrollTrigger) triggers.push(entrance.scrollTrigger);
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section id="experience" className="section-pad">
      <div ref={root} className="container">
        <span className="section-index" style={{ display: 'block', marginBottom: '1rem' }}>02 — Experience</span>
        <h2 className="section-title" style={{ marginBottom: 'clamp(3rem, 7vw, 5rem)' }}>
          Seven years, five teams<span style={{ color: 'var(--accent)' }}>.</span>
        </h2>

        <div>
          {experiences.map((exp) => (
            <article key={exp.company} className="xp-row">
              <div className="xp-head">
                <h3 className="display-lg xp-company">
                  {exp.company}
                  {exp.projectUrl ? (
                    <a href={exp.projectUrl} target="_blank" rel="noopener noreferrer" className="xp-proj">
                      {exp.project} <ArrowUpRight size={16} />
                    </a>
                  ) : (
                    <span className="xp-proj">{exp.project}</span>
                  )}
                </h3>
                <span className="mono-label xp-period">{exp.period}</span>
              </div>
              <div className="xp-detail">
                <p style={{ color: 'var(--fg-soft)', fontWeight: 500 }}>{exp.role}</p>
                <p style={{ color: 'var(--fg-muted)', marginTop: '0.7rem', maxWidth: '60ch', lineHeight: 1.7 }}>
                  {exp.description}
                </p>
                <ul className="xp-impact">
                  {exp.impact.map((it) => <li key={it}>{it}</li>)}
                </ul>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1.1rem' }}>
                  {exp.tech.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .xp-row {
          border-top: 1px solid var(--line);
          padding: clamp(1.4rem, 3vw, 2.2rem) 0;
          opacity: 0.35;
          transition: opacity 0.5s var(--ease-out);
        }
        .xp-row:last-child { border-bottom: 1px solid var(--line); }
        .xp-row.is-active { opacity: 1; }
        .xp-head {
          display: flex; justify-content: space-between; align-items: baseline;
          flex-wrap: wrap; gap: 0.5rem;
        }
        .xp-company {
          font-size: clamp(1.7rem, 5vw, 3.6rem); color: var(--fg);
          display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap;
        }
        .xp-proj {
          font-family: var(--font-mono-stack); font-size: clamp(0.75rem, 1.4vw, 0.95rem);
          letter-spacing: 0.06em; text-transform: none; color: var(--accent);
          display: inline-flex; align-items: center; gap: 0.2rem;
        }
        .xp-detail {
          max-height: 0; opacity: 0; overflow: hidden;
          transition: max-height 0.7s var(--ease-out), opacity 0.6s var(--ease-out), margin-top 0.5s var(--ease-out);
        }
        .xp-row.is-active .xp-detail { max-height: 800px; opacity: 1; margin-top: 1.4rem; }
        .xp-impact { list-style: none; margin-top: 1rem; display: grid; gap: 0.5rem; max-width: 62ch; }
        .xp-impact li {
          position: relative; padding-left: 1.3rem; color: var(--fg-soft);
          font-size: 0.92rem; line-height: 1.55;
        }
        .xp-impact li::before {
          content: '✦'; position: absolute; left: 0; top: 0;
          color: var(--accent); font-size: 0.65rem; line-height: 1.7;
        }
      `}</style>
    </section>
  );
}
