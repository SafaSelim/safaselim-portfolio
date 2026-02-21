'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Github, Linkedin, ArrowDown } from 'lucide-react';

const HeroScene = dynamic(
  () => import('./HeroScene').then((m) => ({ default: m.HeroScene })),
  { ssr: false }
);

export function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const onScroll = () => {
      if (bgRef.current) {
        const offset = window.scrollY * 0.25;
        bgRef.current.style.transform = `translateY(${offset}px)`;
      }
    };

    if (!mq.matches) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '64px',
      }}
    >
      {/* Ambient radial glow */}
      <div
        ref={bgRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: '-10%',
          background:
            'radial-gradient(ellipse 55% 60% at 70% 50%, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.06) 40%, transparent 70%)',
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />

      {/* Subtle grid */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--card-border) 1px, transparent 1px), linear-gradient(90deg, var(--card-border) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      />

      {/* 3D canvas — right half, full height */}
      {!reducedMotion && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '55%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <HeroScene />
        </div>
      )}

      {/* Content */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '4rem 1.5rem',
          position: 'relative',
          zIndex: 1,
          width: '100%',
        }}
      >
        <div style={{ maxWidth: '560px' }}>
          {/* Name */}
          <h1
            style={{
              fontSize: 'clamp(2.75rem, 8vw, 5.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              color: 'var(--foreground)',
              marginBottom: '1rem',
            }}
          >
            Safa Selim
          </h1>

          {/* Title */}
          <p
            style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
              fontWeight: 600,
              color: 'var(--accent)',
              letterSpacing: '-0.01em',
              marginBottom: '1.25rem',
            }}
          >
            Senior Angular Frontend Engineer
          </p>

          {/* Positioning statement */}
          <p
            style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              color: 'var(--muted)',
              lineHeight: 1.75,
              marginBottom: '2.5rem',
            }}
          >
            6+ years delivering enterprise-scale Angular systems — from monorepo
            architectures to multi-country deployments serving millions of users
            across Europe.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.875rem',
              marginBottom: '3rem',
            }}
          >
            <a href="#projects" className="btn-primary">
              View Projects
              <ArrowDown size={16} />
            </a>
            <a href="#contact" className="btn-outline">
              Contact Me
            </a>
          </div>

          {/* Social links */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a
              href="https://github.com/safaselim"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--muted)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--foreground)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)')
              }
            >
              <Github size={18} />
              GitHub
            </a>
            <span style={{ color: 'var(--card-border)' }}>·</span>
            <a
              href="https://linkedin.com/in/safaselim"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--muted)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--foreground)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)')
              }
            >
              <Linkedin size={18} />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
