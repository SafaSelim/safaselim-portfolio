'use client';

import { useFadeIn } from '@/hooks/useFadeIn';

const stats = [
  { value: '6+', label: 'Years Experience' },
  { value: '10+', label: 'Enterprise Apps' },
  { value: '25', label: 'Country Deployments' },
  { value: 'v2–v20', label: 'Angular Versions' },
];

const highlights = [
  {
    title: 'Enterprise Angular Expertise',
    description:
      'Delivered production systems across Angular v2 through v20, covering major breaking changes and architectural shifts over a decade of the framework.',
  },
  {
    title: 'Monorepo Architecture',
    description:
      'Led the design and development of monorepo systems with 10+ interconnected enterprise applications, shared component libraries, and unified CI/CD pipelines.',
  },
  {
    title: 'State Management at Scale',
    description:
      'Implemented NGRX and Redux across complex multi-domain applications — designing scalable store architecture, effects, selectors, and entity adapters.',
  },
  {
    title: 'Release Cycle Leadership',
    description:
      'Managed monthly production releases across high-traffic platforms, coordinating cross-functional teams, QA cycles, and deployment strategies.',
  },
];

export function About() {
  const ref = useFadeIn();

  return (
    <section
      id="about"
      style={{
        backgroundColor: 'var(--section-alt)',
        padding: '6rem 0',
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
        <h2 className="section-heading">About</h2>
        <span className="accent-bar" />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '3.5rem',
          }}
        >
          <div style={{ gridColumn: 'span 2' }}>
            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--muted)',
                lineHeight: 1.8,
                marginBottom: '1rem',
              }}
            >
              I&apos;m a Senior Angular Frontend Engineer with over 6 years of hands-on experience
              building complex, enterprise-grade web applications. My work spans from JSP-to-Angular
              migrations serving 25 country domains, to designing monorepo architectures that power
              10 interconnected enterprise products.
            </p>
            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--muted)',
                lineHeight: 1.8,
              }}
            >
              I specialize in scalable system design, state management architecture, and
              release engineering — translating complex business requirements into clean,
              maintainable frontend systems that teams can build on for years.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            marginBottom: '3.5rem',
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="card"
              style={{
                padding: '1.25rem 1.5rem',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: 'var(--accent)',
                  letterSpacing: '-0.03em',
                  marginBottom: '0.25rem',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Highlight grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {highlights.map((item) => (
            <div key={item.title} className="card" style={{ padding: '1.5rem' }}>
              <h3
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--foreground)',
                  marginBottom: '0.625rem',
                  letterSpacing: '-0.01em',
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
