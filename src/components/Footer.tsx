'use client';

import { useLenis } from '@/components/SmoothScrollProvider';

export function Footer() {
  const { scrollTo } = useLenis();
  const year = 2026;

  return (
    <footer style={{ background: 'var(--bg-deep)', borderTop: '1px solid var(--line)' }}>
      <div
        className="container"
        style={{ paddingBlock: '2.5rem' }}
      >
        <div className="footer-edu">
          <span className="mono-label">Education</span>
          <p style={{ color: 'var(--fg-soft)', maxWidth: '60ch', lineHeight: 1.6 }}>
            B.Sc. Computer Engineering — Çanakkale Onsekiz Mart University (2014–2018).
            Senior project: Quantum Key Distribution (campus-level implementation study).
          </p>
        </div>

        <div className="footer-bar">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
            Safa Selim<span style={{ color: 'var(--accent)' }}>.</span>
          </span>
          <span className="mono-label" style={{ fontSize: '0.7rem' }}>
            © {year} — Designed & built with Next.js, GSAP & Three.js
          </span>
          <button
            onClick={() => scrollTo(0)}
            className="footer-top"
            aria-label="Back to top"
          >
            Back to top ↑
          </button>
        </div>
      </div>

      <style>{`
        .footer-edu {
          display: grid; grid-template-columns: 160px 1fr; gap: 1.5rem;
          padding-bottom: 2.5rem; margin-bottom: 2rem; border-bottom: 1px solid var(--line);
        }
        .footer-bar {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
        }
        .footer-top {
          background: none; border: none; cursor: pointer; color: var(--fg-soft);
          font-family: var(--font-mono); font-size: 0.78rem; letter-spacing: 0.05em;
          transition: color 0.25s ease;
        }
        .footer-top:hover { color: var(--accent); }
        @media (max-width: 640px) {
          .footer-edu { grid-template-columns: 1fr; gap: 0.5rem; }
        }
      `}</style>
    </footer>
  );
}
