'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

let registered = false;

/** Register GSAP plugins exactly once (client only). */
export function registerGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  registered = true;
}

/** True when the user prefers reduced motion. */
export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export { gsap, ScrollTrigger, SplitText };
