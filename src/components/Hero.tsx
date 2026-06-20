'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ArrowDownRight, Github, Linkedin } from 'lucide-react';
import { gsap, registerGsap, SplitText, prefersReducedMotion } from '@/lib/motion';
import { useLenis } from '@/components/SmoothScrollProvider';
import { useMagnetic } from '@/hooks/useMagnetic';

const HeroScene = dynamic(() => import('@/components/HeroScene'), { ssr: false });

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useLenis();
  const ctaPrimary = useMagnetic<HTMLAnchorElement>(0.35);
  const ctaGhost = useMagnetic<HTMLAnchorElement>(0.35);

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll('.will-reveal'), { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const splits: SplitText[] = [];
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.25 });

      el.querySelectorAll<HTMLElement>('[data-split="lines"]').forEach((node) => {
        const split = new SplitText(node, { type: 'lines', linesClass: 'split-line' });
        splits.push(split);
        gsap.set(split.lines, { yPercent: 115 });
        tl.to(split.lines, { yPercent: 0, duration: 1.15, stagger: 0.09 }, node.dataset.at ?? '<0.12');
      });

      tl.from(
        '[data-fade]',
        { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' },
        '-=0.7'
      );

      // parallax drift of the hero copy on scroll
      gsap.to('.hero-copy', {
        yPercent: 18,
        opacity: 0.18,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });

      return () => splits.forEach((s) => s.revert());
    }, el);

    return () => ctx.revert();
  }, []);

  // Cursor-driven 3D tilt on the name + spotlight glow that follows the pointer.
  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;
    const el = root.current;
    const name = nameRef.current;
    const glow = glowRef.current;
    if (!el || !name || !glow) return;

    gsap.set(name, { transformPerspective: 900, transformOrigin: 'center center' });
    const rotY = gsap.quickTo(name, 'rotationY', { duration: 0.7, ease: 'power3' });
    const rotX = gsap.quickTo(name, 'rotationX', { duration: 0.7, ease: 'power3' });
    const gx = gsap.quickTo(glow, 'x', { duration: 0.5, ease: 'power3' });
    const gy = gsap.quickTo(glow, 'y', { duration: 0.5, ease: 'power3' });
    const clamp = gsap.utils.clamp(-1, 1);

    let shown = false;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (!shown) {
        shown = true;
        gsap.to(glow, { opacity: 0.3, duration: 0.6 });
      }
      const relX = clamp((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
      const relY = clamp((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
      rotY(relX * 6);
      rotX(relY * -6);
      gx(e.clientX - rect.left - 120);
      gy(e.clientY - rect.top - 120);
    };
    const onLeave = () => {
      rotY(0);
      rotX(0);
      gsap.to(glow, { opacity: 0, duration: 0.5 });
      shown = false;
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section
      id="top"
      ref={root}
      style={{ position: 'relative', minHeight: '100svh', overflow: 'hidden' }}
    >
      {/* 3D field */}
      <div
        aria-hidden
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      >
        <HeroScene />
      </div>

      {/* soft vignette so type stays legible over the field */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 90% at 50% 8%, transparent 40%, var(--bg) 100%)',
        }}
      />

      {/* cursor spotlight glow */}
      <div
        ref={glowRef}
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '240px',
          height: '240px',
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0,
          background: 'radial-gradient(circle at center, var(--accent) 0%, transparent 65%)',
          mixBlendMode: 'screen',
          willChange: 'transform, opacity',
        }}
      />

      <div
        className="container hero-copy"
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '6rem',
          paddingBottom: '3rem',
        }}
      >
        <div
          data-fade
          className="eyebrow"
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent)',
              boxShadow: '0 0 0 4px var(--accent-soft)',
            }}
          />
          Senior Software Engineer
        </div>

        <h1
          ref={nameRef}
          className="display"
          style={{ fontSize: 'clamp(3.4rem, 13vw, 12rem)', marginBottom: '0' }}
        >
          <span className="line-mask">
            <span data-split="lines" style={{ display: 'block' }}>
              Safa Selim
            </span>
          </span>
        </h1>

        <p
          data-split="lines"
          data-at="-=0.9"
          className="display"
          style={{
            fontSize: 'clamp(1.3rem, 3.4vw, 2.6rem)',
            fontWeight: 400,
            lineHeight: 1.12,
            maxWidth: '20ch',
            marginTop: '1.5rem',
            color: 'var(--fg-soft)',
          }}
        >
          Architecting <span className="italic-accent">enterprise-scale</span> web &amp;
          mobile platforms for European markets.
        </p>

        <div
          data-fade
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '2.75rem',
          }}
        >
          <a
            ref={ctaPrimary}
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#work', { offset: -10 });
            }}
            className="btn btn-primary"
          >
            View selected work <ArrowDownRight size={18} />
          </a>
          <a
            ref={ctaGhost}
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#contact', { offset: -10 });
            }}
            className="btn btn-ghost"
          >
            Get in touch
          </a>

          <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.25rem' }}>
            <SocialIcon href="https://github.com/SafaSelim" label="GitHub">
              <Github size={18} />
            </SocialIcon>
            <SocialIcon href="https://linkedin.com/in/safaselim" label="LinkedIn">
              <Linkedin size={18} />
            </SocialIcon>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div
        data-fade
        className="scroll-cue"
        style={{
          position: 'absolute',
          bottom: '1.75rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span className="mono-label" style={{ fontSize: '0.62rem' }}>
          Scroll
        </span>
        <span
          aria-hidden
          style={{
            display: 'block',
            width: '1px',
            height: '42px',
            background: 'linear-gradient(var(--accent), transparent)',
          }}
        />
      </div>

      <style>{`
        .split-line { display: block; will-change: transform; }
        .scroll-cue span:last-child { animation: cue 2.2s var(--ease-in-out) infinite; transform-origin: top; }
        @keyframes cue { 0%,100% { transform: scaleY(0.4); opacity: .4 } 50% { transform: scaleY(1); opacity: 1 } }
        @media (prefers-reduced-motion: reduce) { .scroll-cue span:last-child { animation: none } }
      `}</style>
    </section>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const ref = useMagnetic<HTMLAnchorElement>(0.5);
  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '3rem',
        height: '3rem',
        borderRadius: '50%',
        border: '1px solid var(--line-strong)',
        color: 'var(--fg)',
        transition: 'color 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--accent)';
        e.currentTarget.style.borderColor = 'var(--accent)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--fg)';
        e.currentTarget.style.borderColor = 'var(--line-strong)';
      }}
    >
      {children}
    </a>
  );
}
