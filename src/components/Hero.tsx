'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowDownRight, Github, Linkedin } from 'lucide-react';
import { gsap, registerGsap, SplitText, prefersReducedMotion } from '@/lib/motion';
import { useLenis } from '@/components/SmoothScrollProvider';
import { useMagnetic } from '@/hooks/useMagnetic';
import { Marquee } from '@/components/Marquee';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { scrollTo } = useLenis();
  const ctaPrimary = useMagnetic<HTMLAnchorElement>(0.35);
  const ctaGhost = useMagnetic<HTMLAnchorElement>(0.35);

  useIsoLayoutEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll('.will-reveal'), { opacity: 1, y: 0 });
      return;
    }

    gsap.set(el.querySelectorAll('.will-reveal'), { opacity: 0 });

    let played = false;
    let tl: gsap.core.Timeline | null = null;
    const splits: SplitText[] = [];
    const play = () => {
      if (played) return;
      played = true;
      const t = gsap.timeline({ delay: 1.2, defaults: { ease: 'power4.out' } }); // after name write-in
      tl = t;
      el.querySelectorAll<HTMLElement>('[data-split="lines"]').forEach((node) => {
        gsap.set(node, { opacity: 1 });
        const split = new SplitText(node, { type: 'lines', linesClass: 'split-line', mask: 'lines' });
        splits.push(split);
        gsap.set(split.lines, { yPercent: 115 });
        t.to(split.lines, { yPercent: 0, duration: 1.1, stagger: 0.08 }, '<0.1');
      });
      t.to('[data-fade]', { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, '-=0.6');
    };
    gsap.set(el.querySelectorAll('[data-fade]'), { y: 24 });
    window.addEventListener('preloader:done', play);
    const fallback = window.setTimeout(play, 3200);

    // copy drifts up + fades as you scroll away
    const drift = gsap.to('.hero-copy', {
      yPercent: 14,
      opacity: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    });

    return () => {
      window.removeEventListener('preloader:done', play);
      window.clearTimeout(fallback);
      tl?.kill();
      splits.forEach((s) => s.revert());
      drift.scrollTrigger?.kill();
      drift.kill();
    };
  }, []);

  return (
    <section
      id="top"
      ref={root}
      style={{
        position: 'relative', minHeight: '100svh',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}
    >
      <div className="container hero-copy" style={{ paddingBottom: '2.5rem' }}>
        <div
          className="will-reveal"
          data-fade
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}
        >
          <span
            aria-hidden
            style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--accent)', boxShadow: '0 0 0 4px var(--accent-soft)',
            }}
          />
          <span className="eyebrow">Senior Frontend Engineer — Istanbul / Europe</span>
        </div>

        <h1 className="sr-only">Safa Selim — Senior Frontend Engineer</h1>

        <p
          data-split="lines"
          className="display-lg will-reveal"
          style={{ fontSize: 'clamp(1.6rem, 4.2vw, 3.4rem)', maxWidth: '18ch', color: 'var(--fg)' }}
        >
          Building enterprise-scale web &amp; mobile platforms<span style={{ color: 'var(--accent)' }}>.</span>
        </p>

        <div
          className="will-reveal"
          data-fade
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginTop: '2.2rem' }}
        >
          <a
            ref={ctaPrimary}
            href="#work"
            onClick={(e) => { e.preventDefault(); scrollTo('#work', { offset: -10 }); }}
            className="btn btn-primary"
          >
            View selected work <ArrowDownRight size={18} />
          </a>
          <a
            ref={ctaGhost}
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollTo('#contact', { offset: -10 }); }}
            className="btn btn-ghost"
          >
            Get in touch
          </a>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <a href="https://github.com/SafaSelim" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hero-social"><Github size={17} /></a>
            <a href="https://linkedin.com/in/safaselim" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hero-social"><Linkedin size={17} /></a>
          </div>
        </div>

        <div
          className="will-reveal"
          data-fade
          style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: '2.4rem', paddingTop: '1rem', borderTop: '1px solid var(--line)',
          }}
        >
          <span className="mono-label">Scroll ↓</span>
          <span className="mono-label">00 / 05</span>
        </div>
      </div>

      <Marquee />

      <style>{`
        .split-line { display: block; will-change: transform; }
        .hero-social {
          display: inline-flex; align-items: center; justify-content: center;
          width: 2.9rem; height: 2.9rem; border-radius: 50%;
          border: 1px solid var(--line-strong); color: var(--fg);
          transition: color .3s ease, border-color .3s ease;
        }
        .hero-social:hover { color: var(--accent); border-color: var(--accent); }
        .sr-only {
          position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
        }
      `}</style>
    </section>
  );
}
