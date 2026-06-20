# Safa Selim — Portfolio

An awwwards-style single-page portfolio for a Senior Angular Frontend Engineer.
Editorial **Warm Mono** art direction (warm near-black, cream type, burnt-amber accent),
dark + light themes, and an immersive, motion-rich experience.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **GSAP** (ScrollTrigger + SplitText) — kinetic typography, scroll reveals, scrubbed timeline
- **Lenis** — smooth scroll, synced with GSAP's ticker
- **Three.js / @react-three/fiber** — custom-shader particle field in the hero (theme-aware, mouse-reactive)
- **Tailwind CSS v4** + CSS custom properties for the design system
- **next-themes** — dark default with light toggle and system-preference detection

## Highlights

- Custom cursor + magnetic interactive elements
- Per-character / per-line text reveals
- Animated stat counters and a scroll-scrubbed experience timeline
- Film grain overlay, marquee band, hover-expanding project cards
- Fully responsive and `prefers-reduced-motion` aware (all motion degrades gracefully)

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build
```

## Structure

```
src/
  app/            layout, global design system, page composition
  components/     Hero, HeroScene (3D), Navbar, About, Experience,
                  Skills, Projects, Contact, Footer, Marquee, Cursor, Grain
  hooks/          useMagnetic, useReveal
  lib/            motion.ts (GSAP registration + reduced-motion helpers)
```

## Deploy

Deploys cleanly to [Vercel](https://vercel.com/new). Push the branch and connect the repo.
