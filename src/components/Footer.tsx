import { Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--card-border)',
        backgroundColor: 'var(--background)',
        padding: '2rem 0',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div>
          <span
            style={{
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--foreground)',
              letterSpacing: '-0.01em',
            }}
          >
            Safa<span style={{ color: 'var(--accent)' }}>.</span>
          </span>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
            Senior Angular Frontend Engineer
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a
            href="https://github.com/safaselim"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            style={{
              color: 'var(--muted)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
              display: 'flex',
            }}
          >
            <Github size={18} />
          </a>
          <a
            href="https://linkedin.com/in/safaselim"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            style={{
              color: 'var(--muted)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
              display: 'flex',
            }}
          >
            <Linkedin size={18} />
          </a>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
          © {new Date().getFullYear()} Safa Selim. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
