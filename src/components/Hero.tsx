'use client';

import { useEffect, useRef } from 'react';
import { Github, Linkedin, ArrowDown } from 'lucide-react';

export function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) {
        const offset = window.scrollY * 0.3;
        bgRef.current.style.transform = `translateY(${offset}px)`;
      }
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches) {
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
      {/* Subtle background depth */}
      <div
        ref={bgRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: '-10%',
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(59, 130, 246, 0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />

      {/* Grid overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--card-border) 1px, transparent 1px), linear-gradient(90deg, var(--card-border) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />

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
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.875rem',
            borderRadius: '100px',
            border: '1px solid var(--accent)',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            color: 'var(--accent)',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent)',
              display: 'inline-block',
            }}
          />
          Available for opportunities
        </div>

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
            maxWidth: '560px',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}
        >
          6+ years delivering enterprise-scale Angular systems — from monorepo architectures
          to multi-country deployments serving millions of users across Europe.
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
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--foreground)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)')}
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
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--foreground)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)')}
          >
            <Linkedin size={18} />
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
