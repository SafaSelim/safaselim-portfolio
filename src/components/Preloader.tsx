'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/motion';

export function Preloader() {
  const [show, setShow] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const firedRef = useRef(false);

  function done() {
    if (firedRef.current) return;
    firedRef.current = true;
    try {
      sessionStorage.setItem('ss-preloaded', '1');
    } catch {
      // sessionStorage may throw (e.g. cookies disabled) — safe to ignore
    }
    window.dispatchEvent(new CustomEvent('preloader:done'));
  }

  // Decide, once on mount, whether the intro should run at all.
  useEffect(() => {
    let alreadyPreloaded = false;
    try {
      alreadyPreloaded = !!sessionStorage.getItem('ss-preloaded');
    } catch {
      // sessionStorage may throw (e.g. cookies disabled) — treat as not preloaded
    }

    if (alreadyPreloaded || prefersReducedMotion()) {
      done();
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- must reveal the overlay only when the intro will actually run (post session/reduced-motion check)
    setShow(true);
  }, []);

  // Build the timeline only once the overlay's root div is actually committed.
  useEffect(() => {
    if (!show) return;
    document.documentElement.style.overflow = 'hidden';

    const obj = { n: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = '';
        done();
        setShow(false);
      },
    });
    tl.to(obj, {
      n: 100,
      duration: 1.1,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (numRef.current) numRef.current.textContent = String(Math.round(obj.n)).padStart(3, '0');
      },
    });
    tl.to(rootRef.current, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '+=0.1');

    return () => {
      tl.kill();
      document.documentElement.style.overflow = '';
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'var(--bg)', display: 'flex',
        alignItems: 'flex-end', justifyContent: 'space-between',
        padding: 'clamp(1.5rem, 4vw, 3rem)',
      }}
    >
      <span className="mono-label">SAFA SELIM — PORTFOLIO</span>
      <span
        ref={numRef}
        className="display-xl"
        style={{ fontSize: 'clamp(4rem, 14vw, 11rem)', color: 'var(--fg)' }}
      >
        000
      </span>
    </div>
  );
}
