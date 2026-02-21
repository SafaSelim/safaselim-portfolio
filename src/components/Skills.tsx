'use client';

import { useFadeIn } from '@/hooks/useFadeIn';

const skillGroups = [
  {
    category: 'Frontend Core',
    icon: '⬡',
    skills: [
      { name: 'Angular', level: 'Expert' },
      { name: 'TypeScript', level: 'Expert' },
      { name: 'SCSS / CSS', level: 'Expert' },
      { name: 'RxJS', level: 'Expert' },
      { name: 'HTML5', level: 'Expert' },
    ],
  },
  {
    category: 'State Management',
    icon: '◈',
    skills: [
      { name: 'NGRX', level: 'Expert' },
      { name: 'Redux', level: 'Advanced' },
      { name: 'Signals', level: 'Advanced' },
      { name: 'Services / BehaviorSubject', level: 'Expert' },
    ],
  },
  {
    category: 'Architecture',
    icon: '◻',
    skills: [
      { name: 'Monorepo (Nx)', level: 'Expert' },
      { name: 'Component-driven design', level: 'Expert' },
      { name: 'Storybook', level: 'Advanced' },
      { name: 'Micro-frontends', level: 'Advanced' },
      { name: 'Design Systems', level: 'Expert' },
    ],
  },
  {
    category: 'Backend Knowledge',
    icon: '◯',
    skills: [
      { name: 'ColdFusion', level: 'Intermediate' },
      { name: 'MSSQL', level: 'Intermediate' },
      { name: 'Java', level: 'Intermediate' },
      { name: 'REST APIs', level: 'Advanced' },
    ],
  },
  {
    category: 'Authentication',
    icon: '◆',
    skills: [
      { name: 'Keycloak', level: 'Advanced' },
      { name: 'OAuth 2.0', level: 'Advanced' },
      { name: 'JWT', level: 'Advanced' },
    ],
  },
  {
    category: 'Optimization & Testing',
    icon: '◉',
    skills: [
      { name: 'A/B Testing', level: 'Advanced' },
      { name: 'Performance tuning', level: 'Expert' },
      { name: 'Jasmine / Karma', level: 'Advanced' },
      { name: 'Lighthouse', level: 'Advanced' },
    ],
  },
];

const levelColor: Record<string, string> = {
  Expert: 'var(--accent)',
  Advanced: '#10b981',
  Intermediate: '#f59e0b',
};

export function Skills() {
  const ref = useFadeIn();

  return (
    <section
      id="skills"
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
        <h2 className="section-heading">Skills</h2>
        <span className="accent-bar" />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {skillGroups.map((group) => (
            <div key={group.category} className="card" style={{ padding: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  marginBottom: '1.25rem',
                }}
              >
                <span
                  style={{
                    fontSize: '1rem',
                    color: 'var(--accent)',
                    fontFamily: 'monospace',
                  }}
                >
                  {group.icon}
                </span>
                <h3
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: 'var(--foreground)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {group.category}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {group.skills.map((skill) => (
                  <div
                    key={skill.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--foreground)',
                        fontWeight: 500,
                      }}
                    >
                      {skill.name}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: levelColor[skill.level] || 'var(--muted)',
                        backgroundColor: `${levelColor[skill.level]}15`,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
