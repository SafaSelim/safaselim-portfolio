'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { Mail, Github, Linkedin, MapPin } from 'lucide-react';

export function Contact() {
  const ref = useFadeIn();

  return (
    <section
      id="contact"
      style={{
        backgroundColor: 'var(--section-alt)',
        padding: '6rem 0',
      }}
    >
      <div
        ref={ref}
        className="fade-in"
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 1.5rem',
        }}
      >
        <h2 className="section-heading">Get In Touch</h2>
        <span className="accent-bar" />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Left: copy */}
          <div>
            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--muted)',
                lineHeight: 1.8,
                marginBottom: '1.5rem',
              }}
            >
              I&apos;m open to senior frontend engineering roles, architectural consulting,
              and interesting engineering challenges. If you&apos;re building something that
              demands scale and precision — let&apos;s talk.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <a
                href="mailto:safaselim.ss@gmail.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: 'var(--muted)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
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
                <Mail size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                safaselim.ss@gmail.com
              </a>

              <a
                href="https://github.com/safaselim"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: 'var(--muted)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
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
                <Github size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                github.com/safaselim
              </a>

              <a
                href="https://linkedin.com/in/safaselim"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: 'var(--muted)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
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
                <Linkedin size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                linkedin.com/in/safaselim
              </a>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: 'var(--muted)',
                  fontSize: '0.9rem',
                }}
              >
                <MapPin size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                Istanbul, Turkey · Open to remote
              </div>
            </div>
          </div>

          {/* Right: CTA card */}
          <div
            className="card"
            style={{
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <Mail size={24} style={{ color: 'var(--accent)' }} />
            </div>
            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--foreground)',
                marginBottom: '0.625rem',
              }}
            >
              Send me an email
            </h3>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--muted)',
                lineHeight: 1.65,
                marginBottom: '1.5rem',
              }}
            >
              Prefer email? Send me a message and I&apos;ll get back within 24 hours.
            </p>
            <a href="mailto:safaselim.ss@gmail.com" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Send Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
