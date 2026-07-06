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

const tiers = [
  { className: 'tier-1', items: ['Angular v2–v20', 'TypeScript', 'NGRX', 'Monorepo'] },
  { className: 'tier-2', items: ['Storybook', 'Keycloak', 'Ionic', 'SCSS', 'Component-Driven Design'] },
  { className: 'tier-3', items: ['Redux', 'Java', 'MSSQL', 'A/B Testing', 'Agile/Scrum', 'Material UI'] },
];

export function Skills() {
  const ref = useReveal<HTMLDivElement>('.will-reveal', { stagger: 0.08 });

  return (
    <section id="skills" className="section-pad">
      <div ref={ref} className="container">
        <span className="section-index will-reveal" style={{ display: 'block', marginBottom: '1rem' }}>
          03 — Stack
        </span>
        <h2 className="section-title will-reveal" style={{ marginBottom: 'clamp(2.5rem, 6vw, 4rem)' }}>
          The toolkit<span style={{ color: 'var(--accent)' }}>.</span>
        </h2>

        <div className="skill-wall will-reveal" role="group" aria-label="Core skills">
          {tiers.map((tier) => (
            <p key={tier.className} className={`display-lg ${tier.className}`}>
              {tier.items.map((it, i) => (
                <span key={it} className="skill-item">
                  {it}
                  {i < tier.items.length - 1 && <span className="skill-sep" aria-hidden> / </span>}
                </span>
              ))}
            </p>
          ))}
        </div>

        <div className="skill-groups will-reveal">
          {groups.map((g) => (
            <div key={g.title}>
              <span className="mono-label" style={{ display: 'block', marginBottom: '0.6rem' }}>{g.title}</span>
              <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{g.items.join(' · ')}</p>
            </div>
          ))}
        </div>

        <div className="lang-row will-reveal">
          <span className="mono-label">Languages</span>
          <p style={{ color: 'var(--fg-soft)', fontSize: '0.95rem' }}>
            {languages.map((l) => `${l.name} (${l.level})`).join(' · ')}
          </p>
        </div>
      </div>

      <style>{`
        .skill-wall p { font-size: clamp(1.5rem, 4.6vw, 3.8rem); color: var(--fg); }
        .skill-wall .tier-2 { opacity: 0.65; }
        .skill-wall .tier-3 { opacity: 0.35; }
        .skill-item { transition: color 0.3s var(--ease-out); }
        .skill-item:hover { color: var(--accent); }
        .skill-sep { color: var(--line-strong); }
        .skill-groups {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 1.6rem 3rem; margin-top: clamp(3rem, 7vw, 5rem);
          border-top: 1px solid var(--line); padding-top: 2rem;
        }
        .lang-row {
          display: flex; gap: 2rem; align-items: baseline;
          border-top: 1px solid var(--line); margin-top: 2rem; padding-top: 1.4rem;
        }
        @media (max-width: 700px) { .skill-groups { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
