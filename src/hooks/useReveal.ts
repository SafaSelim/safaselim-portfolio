'use client';

import { useEffect, useRef } from 'react';
import { gsap, registerGsap, prefersReducedMotion } from '@/lib/motion';

/**
 * Reveals direct children marked with `.will-reveal` (or a custom selector)
 * with a staggered rise as the container scrolls into view.
 */
export function useReveal<T extends HTMLElement>(
  selector = '.will-reveal',
  opts: { y?: number; stagger?: number; start?: string } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    registerGsap();

    const targets = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(selector));
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y: opts.y ?? 38, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: opts.stagger ?? 0.08,
          scrollTrigger: {
            trigger: el,
            start: opts.start ?? 'top 80%',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [selector, opts.y, opts.stagger, opts.start]);

  return ref;
}
