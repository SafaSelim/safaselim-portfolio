'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/motion';
import { useLenis } from '@/components/SmoothScrollProvider';

const LINKS = [
  { label: 'Work', href: '#work', index: '01' },
  { label: 'Experience', href: '#experience', index: '02' },
  { label: 'About', href: '#about', index: '03' },
  { label: 'Contact', href: '#contact', index: '04' },
];

export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const firstRun = useRef(true);

  const { scrollTo } = useLenis();

  // Set initial GSAP-owned transform once on mount.
  // y: 0 is essential — GSAP parses the pre-existing CSS transform
  // (translateY(-100%), computed as pixels) into its pixel-y cache; without
  // clearing it, yPercent composes on top of that cached offset and the
  // overlay can never reach the viewport.
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    gsap.set(el, { y: 0, yPercent: -100 });
  }, []);

  // enter/exit animation
  useEffect(() => {
    // Skip the pointless close tween on first mount (overlay starts closed).
    if (firstRun.current) {
      firstRun.current = false;
      if (!open) return;
    }
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { y: 0, yPercent: open ? 0 : -100 });
      return;
    }
    if (open) {
      gsap.to(el, { yPercent: 0, duration: 0.7, ease: 'power4.inOut' });
      gsap.fromTo(
        el.querySelectorAll('.menu-link'),
        { yPercent: 110 },
        { yPercent: 0, duration: 0.8, stagger: 0.07, delay: 0.25, ease: 'power4.out' }
      );
    } else {
      gsap.to(el, { yPercent: -100, duration: 0.6, ease: 'power4.inOut' });
    }
  }, [open]);

  // esc close + focus trap + focus restore on close
  useEffect(() => {
    if (!open) return;
    prevFocusRef.current = document.activeElement as HTMLElement | null;
    const el = root.current;
    const focusables = el?.querySelectorAll<HTMLElement>('a, button');
    focusables?.[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && focusables && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prevFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      className="menu-overlay"
      style={{
        position: 'fixed', inset: 0, zIndex: 90,
        background: 'var(--bg)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <nav className="container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {LINKS.map((l) => (
          <div key={l.href} className="line-mask">
            <a
              className="menu-link display-xl"
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                onClose();
                scrollTo(l.href, { offset: -10 });
              }}
              style={{
                display: 'flex', alignItems: 'baseline', gap: '1.2rem',
                fontSize: 'clamp(2.6rem, 9vw, 7rem)', color: 'var(--fg)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg)'; }}
            >
              <span className="mono-label" style={{ color: 'var(--accent)' }}>{l.index}</span>
              {l.label}
            </a>
          </div>
        ))}
      </nav>
      <div className="container" style={{ marginTop: '3rem', display: 'flex', gap: '2rem' }}>
        <a className="mono-label" href="https://github.com/SafaSelim" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        <a className="mono-label" href="https://linkedin.com/in/safaselim" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
      </div>
      <button
        onClick={onClose}
        aria-label="Close menu"
        className="mono-label"
        style={{
          position: 'absolute', top: '1.4rem', right: 'clamp(1.25rem, 5vw, 4rem)',
          background: 'none', border: '1px solid var(--line-strong)', borderRadius: '100px',
          padding: '0.6rem 1.2rem', cursor: 'pointer', color: 'var(--fg)',
        }}
      >
        Close ×
      </button>
      <style>{`
        /* Hidden pre-hydration / without JS; GSAP's inline transform
           overrides this once mounted. */
        .menu-overlay { transform: translateY(-100%); }
      `}</style>
    </div>
  );
}
