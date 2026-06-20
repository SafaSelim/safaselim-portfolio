'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { gsap, registerGsap, SplitText, prefersReducedMotion } from '@/lib/motion';
import { useMagnetic } from '@/hooks/useMagnetic';

const details = [
  { icon: MapPin, label: 'Based in', value: 'Istanbul, Turkey' },
  { icon: Phone, label: 'Phone', value: '+90 546 195 1456', href: 'tel:+905461951456' },
  { icon: Mail, label: 'Email', value: 'safaselim.ss@gmail.com', href: 'mailto:safaselim.ss@gmail.com' },
];

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const mailRef = useMagnetic<HTMLAnchorElement>(0.25);

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const headline = el.querySelector<HTMLElement>('[data-contact-headline]');
      if (headline) {
        const split = new SplitText(headline, { type: 'chars,words' });
        gsap.from(split.chars, {
          yPercent: 120,
          opacity: 0,
          stagger: 0.025,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 70%' },
        });
      }
      gsap.from('.contact-fade', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-meta', start: 'top 85%' },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={root} className="section-pad" style={{ overflow: 'hidden' }}>
      <div className="container">
        <span className="eyebrow" style={{ display: 'block', marginBottom: '1.5rem' }}>
          (05) — Contact
        </span>

        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
            color: 'var(--fg-muted)',
            marginBottom: '1.5rem',
          }}
        >
          Available for senior engineering & release-management roles.
        </p>

        <a
          ref={mailRef}
          href="mailto:safaselim.ss@gmail.com"
          className="display contact-mail"
          style={{
            display: 'inline-block',
            position: 'relative',
            fontSize: 'clamp(2.6rem, 11vw, 9rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
          }}
        >
          <span data-contact-headline>Let&apos;s&nbsp;talk</span>
          <ArrowUpRight
            className="contact-arrow"
            size={48}
            strokeWidth={1.5}
            style={{ display: 'inline-block', verticalAlign: 'top', marginLeft: '0.15em' }}
          />
        </a>

        <div className="contact-meta">
          <div className="contact-details">
            {details.map((d) => (
              <div key={d.label} className="contact-fade contact-item">
                <span className="mono-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <d.icon size={14} style={{ color: 'var(--accent)' }} />
                  {d.label}
                </span>
                {d.href ? (
                  <a href={d.href} className="contact-value">
                    {d.value}
                  </a>
                ) : (
                  <span className="contact-value">{d.value}</span>
                )}
              </div>
            ))}
          </div>

          <div className="contact-fade contact-socials">
            <a href="https://github.com/SafaSelim" target="_blank" rel="noopener noreferrer" className="contact-social">
              <Github size={18} /> GitHub
            </a>
            <a href="https://linkedin.com/in/safaselim" target="_blank" rel="noopener noreferrer" className="contact-social">
              <Linkedin size={18} /> LinkedIn
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .contact-mail { color: var(--fg); transition: color 0.3s ease; }
        .contact-mail:hover { color: var(--accent); }
        .contact-arrow { color: var(--accent); margin-top: 0.4em; transition: transform 0.4s var(--ease-out); }
        .contact-mail:hover .contact-arrow { transform: translate(8px, -8px); }
        .contact-meta {
          display: flex; justify-content: space-between; flex-wrap: wrap; gap: 2.5rem;
          margin-top: clamp(3rem, 8vw, 6rem);
          padding-top: 2.5rem; border-top: 1px solid var(--line-strong);
        }
        .contact-details { display: flex; flex-wrap: wrap; gap: clamp(2rem, 5vw, 4rem); }
        .contact-item { display: flex; flex-direction: column; gap: 0.5rem; }
        .contact-value { font-size: 1.05rem; color: var(--fg); transition: color 0.25s ease; }
        a.contact-value:hover { color: var(--accent); }
        .contact-socials { display: flex; gap: 1.5rem; align-items: flex-start; }
        .contact-social { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; color: var(--fg-soft); transition: color 0.25s ease; }
        .contact-social:hover { color: var(--accent); }
      `}</style>
    </section>
  );
}
