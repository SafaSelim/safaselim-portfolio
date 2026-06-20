'use client';

import { useReveal } from '@/hooks/useReveal';

const groups = [
  {
    title: 'Frontend Technologies',
    items: [
      'Angular (v2–v20)',
      'TypeScript',
      'JavaScript',
      'HTML',
      'CSS',
      'SCSS',
      'Ionic UI',
      'GWT',
      'Material UI',
      'Bootstrap',
      'DevExtreme',
    ],
  },
  {
    title: 'State Management',
    items: ['NGRX', 'Redux'],
  },
  {
    title: 'Architecture',
    items: ['Monorepo', 'Component-Driven Development'],
  },
  {
    title: 'Backend Technologies',
    items: ['ColdFusion', 'MSSQL', 'Java', 'MySQL'],
  },
  {
    title: 'Tools',
    items: ['Storybook', 'Git', 'SVN'],
  },
  {
    title: 'Authentication',
    items: ['Keycloak'],
  },
  {
    title: 'Methodologies',
    items: ['Agile/Scrum', 'Responsive Design', 'User Experience (UX)'],
  },
  {
    title: 'Testing & Optimization',
    items: ['A/B Testing', 'Google Optimize'],
  },
];

const languages = [
  { name: 'English', level: 'Fluent' },
  { name: 'Turkish', level: 'Native' },
  { name: 'Spanish', level: 'Intermediate' },
  { name: 'Japanese', level: 'Basic' },
];

export function Skills() {
  const ref = useReveal<HTMLDivElement>('.will-reveal', { stagger: 0.08 });

  return (
    <section id="skills" className="section-pad">
      <div ref={ref} className="container">
        <span className="eyebrow will-reveal" style={{ display: 'block', marginBottom: '1rem' }}>
          (03) — Capabilities
        </span>
        <h2 className="section-title will-reveal" style={{ marginBottom: 'clamp(2.5rem, 6vw, 4rem)' }}>
          The <span className="italic-accent">toolkit</span>.
        </h2>

        <div className="skills-grid">
          {groups.map((g) => (
            <div key={g.title} className="skill-group will-reveal">
              <div className="skill-group__head">
                <span className="mono-label">{g.title}</span>
                <span className="hairline" style={{ flex: 1 }} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {g.items.map((it) => (
                  <span key={it} className="tag">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="lang-row will-reveal">
          <span className="mono-label" style={{ whiteSpace: 'nowrap' }}>
            Languages
          </span>
          <div className="lang-list">
            {languages.map((l) => (
              <div key={l.name} className="lang-item">
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>{l.name}</span>
                <span style={{ color: 'var(--fg-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                  {l.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(2rem, 5vw, 3.5rem);
        }
        .skill-group__head {
          display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;
        }
        .lang-row {
          display: flex; gap: 2.5rem; align-items: center; flex-wrap: wrap;
          margin-top: clamp(3rem, 7vw, 5rem);
          padding-top: 2rem; border-top: 1px solid var(--line-strong);
        }
        .lang-list { display: flex; flex-wrap: wrap; gap: 2.5rem; }
        .lang-item { display: flex; flex-direction: column; gap: 0.2rem; }
        @media (max-width: 720px) {
          .skills-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
