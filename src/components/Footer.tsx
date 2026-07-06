export function Footer() {
  return (
    <footer
      style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid var(--line)',
        padding: '1.2rem clamp(1.25rem, 5vw, 4rem)',
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem',
      }}
    >
      <span className="mono-label">© {new Date().getFullYear()} Safa Selim</span>
      <span className="mono-label">Istanbul / Europe</span>
      <span className="mono-label">Built with Next.js + R3F</span>
    </footer>
  );
}
