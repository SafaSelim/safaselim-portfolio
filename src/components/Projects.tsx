'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    name: 'material.one Monorepo Platform',
    description:
      'Enterprise monorepo hosting 10 interconnected Angular applications with a unified design system, shared state management, and automated monthly release pipeline.',
    problem:
      'Multiple isolated enterprise apps with duplicated code, inconsistent UX, and no shared infrastructure — leading to slow development and fragile releases.',
    solution:
      'Designed a Nx monorepo architecture with shared libraries, a Storybook component system, centralized NGRX store patterns, and Keycloak SSO integration across all apps.',
    tech: ['Angular 19', 'NGRX', 'Nx Monorepo', 'Storybook', 'Keycloak', 'TypeScript'],
    role: 'Lead Frontend Engineer',
    impact: '10 apps unified · Monthly release cadence · Zero cross-app regressions',
    color: '#3b82f6',
  },
  {
    name: 'Distrelec E-Commerce Migration',
    description:
      'Full platform migration from legacy JSP to Angular 12 for a B2B electronics distributor operating across 25 European country domains with 20+ language support.',
    problem:
      'A legacy JSP frontend that could not scale to meet growing traffic, localization requirements, and modern UX expectations across 25 markets.',
    solution:
      'Executed a phased migration to Angular 12 with an i18n-first architecture, lazy-loaded country-specific modules, and shared component patterns that reduced per-locale work.',
    tech: ['Angular 12', 'TypeScript', 'i18n', 'RxJS', 'SCSS', 'REST APIs'],
    role: 'Senior Frontend Engineer',
    impact: '25 country domains · 20+ languages · Zero downtime migration',
    color: '#10b981',
    github: null,
  },
  {
    name: 'Patient Network Explorer',
    description:
      'Medical data platform for clinical trial matching, integrating complex patient records from hospital systems with 95% parser accuracy.',
    problem:
      'Healthcare providers needed a compliant, intuitive interface to query complex patient datasets for clinical trial eligibility across multiple medical data sources.',
    solution:
      'Built a data-dense Angular dashboard with D3.js visualizations, custom filter logic for medical record querying, and strict GDPR-compliant data handling.',
    tech: ['Angular', 'TypeScript', 'D3.js', 'SCSS', 'REST APIs'],
    role: 'Frontend Engineer',
    impact: '95% parser accuracy · Multi-hospital data integration · GDPR compliant',
    color: '#8b5cf6',
  },
  {
    name: 'BluLogix SaaS Billing Platform',
    description:
      'AngularJS-to-Angular migration of a multi-tenant SaaS billing platform, combined with a new component library standardizing UI across 5 product modules.',
    problem:
      'Legacy AngularJS codebase with technical debt, inconsistent UI patterns, and inability to adopt modern tooling — slowing down feature delivery.',
    solution:
      'Completed a full framework migration while building a shared component library, reducing codebase size by 40% and accelerating feature development across teams.',
    tech: ['Angular', 'AngularJS', 'TypeScript', 'SCSS', 'Component Library'],
    role: 'Frontend Engineer',
    impact: '40% code reduction · Component library adopted across 5 modules · Zero billing regressions',
    color: '#f59e0b',
  },
];

export function Projects() {
  const ref = useFadeIn();

  return (
    <section
      id="projects"
      style={{
        padding: '6rem 0',
        backgroundColor: 'var(--background)',
      }}
    >
      <div
        ref={ref}
        className="fade-in"
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 1.5rem',
        }}
      >
        <h2 className="section-heading">Featured Projects</h2>
        <span className="accent-bar" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {projects.map((project, i) => (
            <div key={i} className="card" style={{ padding: '0', overflow: 'hidden' }}>
              {/* Accent bar top */}
              <div
                style={{
                  height: '3px',
                  backgroundColor: project.color,
                  width: '100%',
                }}
              />

              <div style={{ padding: '1.75rem' }}>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: 'var(--foreground)',
                        letterSpacing: '-0.01em',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {project.name}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: project.color,
                        backgroundColor: `${project.color}15`,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                      }}
                    >
                      {project.role}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {project.github !== undefined && (
                      <a
                        href="#"
                        aria-label="GitHub"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.4rem',
                          borderRadius: '6px',
                          border: '1px solid var(--card-border)',
                          color: 'var(--muted)',
                          textDecoration: 'none',
                          transition: 'color 0.15s, border-color 0.15s',
                        }}
                      >
                        <Github size={15} />
                      </a>
                    )}
                  </div>
                </div>

                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--muted)',
                    lineHeight: 1.7,
                    marginBottom: '1.25rem',
                  }}
                >
                  {project.description}
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: 'var(--muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: '0.375rem',
                      }}
                    >
                      Problem
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.65 }}>
                      {project.problem}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: 'var(--muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: '0.375rem',
                      }}
                    >
                      Solution
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.65 }}>
                      {project.solution}
                    </p>
                  </div>
                </div>

                {/* Impact */}
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: `${project.color}08`,
                    borderLeft: `3px solid ${project.color}`,
                    borderRadius: '4px',
                    marginBottom: '1.25rem',
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: project.color,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {project.impact}
                  </p>
                </div>

                {/* Tech stack */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {project.tech.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
