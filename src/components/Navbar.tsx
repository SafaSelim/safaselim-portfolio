'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { MenuOverlay } from '@/components/MenuOverlay';
import { useLenis } from '@/components/SmoothScrollProvider';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { scrollTo } = useLenis();

  // Hydration guard: theme icon must only render after mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const closeMenu = useCallback(() => setOpen(false), []);

  return (
    <>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.1rem clamp(1.25rem, 5vw, 4rem)',
        }}
      >
        <a
          href="#top"
          className="mono-label"
          style={{ color: 'var(--fg)', fontWeight: 600, padding: '0.85rem 0.6rem', margin: '-0.85rem -0.6rem' }}
          onClick={(e) => { e.preventDefault(); setOpen(false); scrollTo(0); }}
        >
          SS — 2026
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', visibility: open ? 'hidden' : 'visible' }}>
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="nav-pill"
          >
            {mounted && (resolvedTheme === 'dark' ? <Sun size={14} /> : <Moon size={14} />)}
          </button>
          <button
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className="nav-pill mono-label"
            style={{ color: 'var(--fg)' }}
          >
            {open ? 'Close ×' : 'Menu +'}
          </button>
        </div>
      </header>
      <MenuOverlay open={open} onClose={closeMenu} />
      <style>{`
        .nav-pill {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: color-mix(in srgb, var(--bg) 65%, transparent);
          backdrop-filter: blur(10px);
          border: 1px solid var(--line-strong); border-radius: 100px;
          min-height: 44px; padding: 0.55rem 1.2rem; cursor: pointer; color: var(--fg);
          transition: border-color .3s var(--ease-out), color .3s var(--ease-out);
        }
        .nav-pill:hover { border-color: var(--accent); color: var(--accent); }
      `}</style>
    </>
  );
}
