'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { registerGsap, gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion';

type LenisContextValue = {
  scrollTo: (target: string | number | HTMLElement, opts?: { offset?: number }) => void;
};

const LenisContext = createContext<LenisContextValue>({ scrollTo: () => {} });

export const useLenis = () => useContext(LenisContext);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    registerGsap();

    const reduced = prefersReducedMotion();
    document.documentElement.classList.toggle('reduced', reduced);
    document.body.classList.add('js-ready');

    if (reduced) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo: LenisContextValue['scrollTo'] = (target, opts) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { offset: opts?.offset ?? 0, duration: 1.3 });
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return <LenisContext.Provider value={{ scrollTo }}>{children}</LenisContext.Provider>;
}
