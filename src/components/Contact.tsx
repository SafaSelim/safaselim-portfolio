'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const headline = el.querySelector<HTMLElement>('[data-contact-headline]');
      if (headline) {
        const split = new SplitText(headline, { type: 'chars', aria: 'none' });
        gsap.from(split.chars, {
          yPercent: 120, opacity: 0, stagger: 0.03, duration: 0.9, ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 65%' },
        });
      }
      gsap.from('.contact-fade', {
        y: 26, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 55%' },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const copyEmail = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navigator.clipboard) return; // fall through to mailto
    e.preventDefault();
    navigator.clipboard.writeText('safaselim.ss@gmail.com').then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  };

  return (
    <section
      id="contact"
      ref={root}
      className="section-pad"
      style={{
        minHeight: '100svh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', textAlign: 'center', overflow: 'hidden',
      }}
    >
      <div className="container">
        <span className="section-index" style={{ display: 'block', marginBottom: '1.2rem' }}>05 — Contact</span>
        <p className="contact-fade" style={{ color: 'var(--fg-muted)', marginBottom: '1.4rem' }}>
          Available for senior engineering &amp; release-management roles.
        </p>
        <h2 aria-label="Let's talk." className="display-xl" style={{ fontSize: 'clamp(3rem, 12vw, 10rem)', color: 'var(--fg)' }}>
          <span className="line-mask" aria-hidden><span data-contact-headline>Let&apos;s talk<span style={{ color: 'var(--accent)' }}>.</span></span></span>
        </h2>
        <a
          ref={mailRef}
          href="mailto:safaselim.ss@gmail.com"
          onClick={copyEmail}
          className="contact-fade mono-label"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem',
            fontSize: '0.95rem', color: 'var(--fg)', borderBottom: '1px solid var(--accent)',
            paddingBottom: '0.3rem', letterSpacing: '0.08em',
          }}
        >
          {copied ? 'Copied ✓' : 'safaselim.ss@gmail.com'} <ArrowUpRight size={15} />
        </a>

        <div
          className="contact-fade contact-meta"
          style={{
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
            gap: '2.2rem', marginTop: 'clamp(3rem, 8vw, 5.5rem)',
          }}
        >
          {details.map((d) => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <d.icon size={14} style={{ color: 'var(--accent)' }} />
              {d.href ? (
                <a href={d.href} className="mono-label" style={{ color: 'var(--fg-soft)' }}>{d.value}</a>
              ) : (
                <span className="mono-label" style={{ color: 'var(--fg-soft)' }}>{d.value}</span>
              )}
            </div>
          ))}
          <a href="https://github.com/SafaSelim" target="_blank" rel="noopener noreferrer" className="mono-label" style={{ color: 'var(--fg-soft)' }}><Github size={14} style={{ verticalAlign: '-2px', marginRight: '0.4rem', color: 'var(--accent)' }} />GitHub</a>
          <a href="https://linkedin.com/in/safaselim" target="_blank" rel="noopener noreferrer" className="mono-label" style={{ color: 'var(--fg-soft)' }}><Linkedin size={14} style={{ verticalAlign: '-2px', marginRight: '0.4rem', color: 'var(--accent)' }} />LinkedIn</a>
        </div>
      </div>
    </section>
  );
}
