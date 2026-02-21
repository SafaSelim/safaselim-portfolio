'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { ExternalLink } from 'lucide-react';

const experiences = [
  {
    company: 'adesso Turkey',
    project: 'material.one',
    projectUrl: 'https://material.one/',
    role: 'Senior Frontend Engineer',
    period: '2022 – Present',
    location: 'Istanbul, Turkey',
    description:
      'Led frontend architecture for a suite of 10 interconnected enterprise web applications within a unified monorepo ecosystem.',
    impact: [
      'Architected and maintained 10 enterprise apps sharing a unified component library',
      'Managed monthly production release cycles with coordinated QA and deployment',
      'Built and maintained a Storybook design system consumed across all products',
      'Integrated Keycloak for enterprise-grade authentication across applications',
    ],
    tech: ['Angular 19', 'NGRX', 'TypeScript', 'Storybook', 'Keycloak', 'Monorepo', 'SCSS'],
  },
  {
    company: 'Digacon',
    project: 'Distrelec',
    projectUrl: 'https://www.distrelec.com/global/',
    role: 'Senior Frontend Engineer',
    period: '2020 – 2022',
    location: 'Remote',
    description:
      'Led the migration of a high-traffic B2B e-commerce platform from JSP to Angular 12, serving 25 country domains across Europe.',
    impact: [
      'Migrated legacy JSP codebase to Angular 12 — zero downtime across 25 country domains',
      'Implemented 20+ language localization with dynamic content switching',
      'Optimized platform for high-traffic European markets',
      'Established reusable component patterns that reduced development time by ~30%',
    ],
    tech: ['Angular 12', 'TypeScript', 'SCSS', 'i18n', 'RxJS', 'REST APIs'],
  },
  {
    company: 'Clinerion',
    project: 'Patient Network Explorer',
    projectUrl: 'https://trinetx.com/press-releases/clinerion/',
    role: 'Frontend Engineer',
    period: '2019 – 2020',
    location: 'Basel, Switzerland (Remote)',
    description:
      'Developed frontend for a medical data platform integrating complex patient records and clinical trial matching.',
    impact: [
      'Achieved 95% parser accuracy for medical data integration pipelines',
      'Built complex data visualization dashboards for clinical trial matching',
      'Collaborated with medical data scientists to translate requirements into UI',
    ],
    tech: ['Angular', 'TypeScript', 'D3.js', 'SCSS', 'RESTful APIs'],
  },
  {
    company: 'BluLogix',
    project: 'Billing Platform',
    projectUrl: 'https://blulogix.com/',
    role: 'Frontend Engineer',
    period: '2018 – 2019',
    location: 'Remote',
    description:
      'Led the migration from AngularJS to Angular and built a reusable component library for a SaaS billing platform.',
    impact: [
      'Completed AngularJS → Angular migration with zero regression in billing workflows',
      'Created a component library that standardized UI across 5 product modules',
      'Reduced codebase size by 40% through refactoring and component consolidation',
    ],
    tech: ['Angular', 'AngularJS', 'TypeScript', 'SCSS', 'Component Library'],
  },
  {
    company: 'Pluscor',
    project: 'Enterprise ERP',
    projectUrl: null,
    role: 'Frontend Developer',
    period: '2017 – 2018',
    location: 'Turkey',
    description:
      'Built frontend modules for an enterprise ERP system with Angular and DevExpress components, integrating with ColdFusion backend APIs.',
    impact: [
      'Delivered 8 enterprise ERP modules on schedule',
      'Integrated DevExpress grid and reporting components for complex data workflows',
      'Collaborated closely with ColdFusion backend team on API design',
    ],
    tech: ['Angular', 'DevExpress', 'TypeScript', 'ColdFusion API', 'MSSQL', 'SCSS'],
  },
];

export function Experience() {
  const ref = useFadeIn();

  return (
    <section
      id="experience"
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
        <h2 className="section-heading">Experience</h2>
        <span className="accent-bar" />

        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: '0',
              top: '12px',
              bottom: '0',
              width: '2px',
              backgroundColor: 'var(--card-border)',
              marginLeft: '7px',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingLeft: '2.5rem' }}>
            {experiences.map((exp, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {/* Timeline dot */}
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: '-2.5rem',
                    top: '14px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: i === 0 ? 'var(--accent)' : 'var(--card-bg)',
                    border: '2px solid var(--accent)',
                    boxShadow: i === 0 ? '0 0 0 4px rgba(59, 130, 246, 0.15)' : 'none',
                  }}
                />

                <div className="card" style={{ padding: '1.75rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      marginBottom: '0.25rem',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: 'var(--foreground)',
                          letterSpacing: '-0.01em',
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.375rem',
                        }}
                      >
                        {exp.company}
                        {exp.project && (
                          <>
                            <span style={{ color: 'var(--card-border)', fontWeight: 400 }}>·</span>
                            {exp.projectUrl ? (
                              <a
                                href={exp.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: 'var(--accent)',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  transition: 'opacity 0.15s ease',
                                }}
                                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.75')}
                                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
                              >
                                {exp.project}
                                <ExternalLink size={13} style={{ opacity: 0.7 }} />
                              </a>
                            ) : (
                              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                                {exp.project}
                              </span>
                            )}
                          </>
                        )}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.9rem',
                          color: 'var(--muted)',
                          fontWeight: 500,
                          marginTop: '0.125rem',
                        }}
                      >
                        {exp.role}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: 'var(--accent)',
                          backgroundColor: 'rgba(59, 130, 246, 0.08)',
                          padding: '0.25rem 0.625rem',
                          borderRadius: '6px',
                          display: 'block',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {exp.period}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--muted)',
                      lineHeight: 1.7,
                      marginTop: '0.75rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {exp.description}
                  </p>

                  <ul style={{ listStyle: 'none', marginBottom: '1.25rem' }}>
                    {exp.impact.map((item, j) => (
                      <li
                        key={j}
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--muted)',
                          lineHeight: 1.6,
                          padding: '0.25rem 0',
                          paddingLeft: '1rem',
                          position: 'relative',
                        }}
                      >
                        <span
                          aria-hidden
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: '0.6rem',
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent)',
                            opacity: 0.7,
                          }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {exp.tech.map((t) => (
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
      </div>
    </section>
  );
}
