# Safa Selim — Portfolio

**[safaselim.com](https://safaselim.com)** — an awwwards-style single-page portfolio for a Senior Frontend Engineer, built around one idea: **scattered dust becomes structure**.

A persistent WebGL particle system is the site's protagonist. On load, drifting dust assembles into **"SAFA SELIM"** written in ~14,000 particles; as you scroll, the name pours into a sinuous vertical ribbon that accompanies every section, then closes as a glowing ring around the contact call-to-action.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Three.js / @react-three/fiber** — one fullscreen particle scene; all morph math runs in a custom vertex shader (two target attribute sets lerped with per-particle stagger and swirl)
- **GSAP** (ScrollTrigger + SplitText) — scroll-driven morphs, line-mask text reveals, the preloader counter
- **Lenis** — smooth scroll, synced with GSAP's ticker
- **Tailwind CSS v4** + CSS custom properties for the design system
- **next-themes** — dual themes: **Dark Cosmos** (near-black, additive ember glow) and **Paper & Ink** (warm paper, ink-stipple particles)
- **Vitest** — unit tests for the pure particle-shape generators

## How the particle system works

- `src/lib/particles/targets.ts` — pure, deterministic generators produce each shape (name glyph sampled from an offscreen canvas raster, side ribbon, ring) as typed arrays: positions, color-ramp value, and write-in order per particle
- `src/components/ParticleCanvas.tsx` — a fixed fullscreen canvas behind the page; ScrollTrigger fires a morph at each section boundary by swapping target attribute buffers and tweening a single `uMix` uniform, so the GPU does the heavy lifting
- Typography is brutalist-editorial: **Archivo Black** display, **IBM Plex Mono** labels, **Inter** body

## Highlights

- Percentage preloader → particle name write-in choreography
- Magnetic CTAs, fullscreen menu overlay with focus trap, copy-to-clipboard email
- Film grain, inverted marquee band, hover-expanding rows with a cursor-following preview card
- Fully responsive (reduced particle count on mobile), `prefers-reduced-motion` aware (static forms, instant reveals), CSS-only fallback when WebGL is unavailable
- Lighthouse 100 Performance / 100 Accessibility on the production build

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build
npm test         # vitest — particle generator unit tests
npm run lint     # eslint
```

## Structure

```
src/
  app/            layout (fonts, themes, metadata), global design system, page composition
  components/     ParticleCanvas, Preloader, Navbar + MenuOverlay, Hero, About,
                  Experience, Skills, Projects, Contact, Footer, Marquee, Grain
  lib/            motion.ts (GSAP setup), particles/ (target generators + tests)
  hooks/          useReveal, useMagnetic
docs/superpowers/ design spec & implementation plan for the 2026 rework
```

## Deploy

Deploys cleanly to [Vercel](https://vercel.com/new) — `main` is auto-deployed.
