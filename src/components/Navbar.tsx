'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useLenis } from '@/components/SmoothScrollProvider';
import { PaletteSwitcher } from '@/components/PaletteSwitcher';
import { useMagnetic } from '@/hooks/useMagnetic';

const links = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const { scrollTo } = useLenis();
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const logoRef = useMagnetic<HTMLAnchorElement>(0.5);
  const toggleRef = useMagnetic<HTMLButtonElement>(0.5);

  // Hydration guard: theme icon must only render after mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > lastY.current && y > 300);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    scrollTo(href, { offset: -10 });
  };

  const isDark = resolvedTheme !== 'light';

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transform: hidden ? 'translateY(-130%)' : 'translateY(0)',
        transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <nav
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.75rem',
          marginTop: '0.75rem',
        }}
      >
        <a
          ref={logoRef}
          href="#top"
          onClick={(e) => go(e, '#top')}
          aria-label="Safa Selim — home"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '1.4rem',
            letterSpacing: '-0.02em',
            display: 'inline-flex',
            alignItems: 'baseline',
          }}
        >
          Safa<span style={{ color: 'var(--accent)' }}>.</span>
        </a>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.4rem',
            borderRadius: '100px',
            border: '1px solid var(--line)',
            background: scrolled ? 'var(--bg-elev)' : 'transparent',
            backdropFilter: scrolled ? 'blur(14px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
            transition: 'background 0.4s ease, border-color 0.4s ease',
          }}
        >
          <ul
            className="nav-links"
            style={{ display: 'flex', listStyle: 'none', gap: '0.15rem', alignItems: 'center' }}
          >
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => go(e, l.href)}
                  style={{
                    display: 'inline-block',
                    padding: '0.55rem 1rem',
                    borderRadius: '100px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: 'var(--fg-soft)',
                    transition: 'color 0.25s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-soft)')}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <PaletteSwitcher />

          <button
            ref={toggleRef}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label="Toggle color theme"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              border: '1px solid var(--line)',
              background: 'var(--bg)',
              color: 'var(--fg)',
              cursor: 'pointer',
            }}
          >
            {mounted && (isDark ? <Sun size={16} /> : <Moon size={16} />)}
          </button>
        </div>
      </nav>

      <style>{`
        @media (max-width: 640px) {
          .nav-links { display: none !important; }
        }
      `}</style>
    </header>
  );
}
