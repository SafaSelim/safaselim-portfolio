# Landing Page Rework — Design Spec

**Date:** 2026-07-06
**Branch:** `feat/landing-page-rework`
**Goal:** Full reimagining of safaselim.com as a modern, awwwards-caliber landing page for a Senior Frontend Engineer portfolio. Content (bio, experience, skills, projects, contact) carries over; every visual and motion decision is new.

## Concept

**"Scattered dust becomes structure."** One persistent WebGL particle system is the site's protagonist. It lives on a fullscreen fixed canvas behind the entire page and morphs into a different form per section as the visitor scrolls. The narrative mirrors what an engineer does: chaos organized into meaning.

Layered on top: brutalist-editorial typography — monumental uppercase display type, monospace micro-labels, exposed structure.

## Locked decisions (validated with live prototype)

| Decision | Choice |
|---|---|
| Direction | Brutalist editorial type × immersive WebGL centerpiece |
| Centerpiece | Morphing GPU particle constellation |
| Canvas scope | Persistent fullscreen scene, morphs per section |
| Hero moment | Particles **write "SAFA SELIM"** — dust assembles left-to-right on load |
| Palette | **Ember** (single warm family, per-particle gradient ramp) |
| Themes | Both: **Dark Cosmos** (dark) + **Paper & Ink** (light), same layout |
| Sections | Keep lineup: Hero → About → Experience → Skills → Projects → Contact |

## Visual system

### Typography
- **Display:** Archivo Black (via `next/font/google`) — uppercase, tight tracking (−0.04em), line-height ~0.85, sizes up to `clamp(3rem, 12vw, 11rem)`.
- **Mono labels:** IBM Plex Mono — section indexes (`01 — ABOUT`), coordinates, statuses; uppercase, letter-spaced.
- **Body:** Inter (kept) for paragraphs and descriptions.

### Color
CSS custom properties, switched by `next-themes` (existing setup, storage key `portfolio-theme`, dark default).

| Token | Dark Cosmos | Paper & Ink |
|---|---|---|
| `--bg` | `#070709` | `#eae6dd` |
| `--fg` | `#f5f5f2` | `#16130e` |
| `--accent` | `#ff7a34` | `#e8480c` |
| Particle ramp | `#ff7a34 → #ffb26b → #ffd9a8` | `#e8480c → #b45309 → #78350f` |
| Particle blending | Additive (glow) | Normal alpha (ink stippling) |

Color **follows form**: ramp position is derived from each particle's place in the current shape (depth on the globe, x-progress along the name, cluster id in work), never random.

### Texture
- Existing film grain overlay (`Grain.tsx`) retained, subtle.
- Hairline rules (`--fg` at ~12% alpha) to expose the grid; ruler-tick details in section headers.

## The particle engine

### Architecture
- `src/components/ParticleCanvas.tsx` — one `@react-three/fiber` `<Canvas>` in a `position: fixed; inset: 0` wrapper behind all content (`z-index: 0`, content wrapper `z-index: 1`). Mounted client-only (`dynamic`, `ssr: false`).
- `src/lib/particles/targets.ts` — pure target-generation functions, each returning a `Float32Array` of xyz positions (+ per-particle color-ramp value):
  - `name()` — samples "SAFA SELIM" pixels from an offscreen 2D canvas (Archivo Black), sorted left→right with a per-particle write-order attribute
  - `globe()` — Fibonacci sphere
  - `thread()` — flowing parametric curve down the page
  - `lattice()` — ordered grid
  - `constellation()` — 4 clusters (one per project)
  - `ring()` — circle band
- One `<points>` mesh with a custom `ShaderMaterial`. Two position attributes (`targetA`, `targetB`) + `uMix` uniform; the vertex shader lerps A→B with per-particle stagger and curl-noise detour during transit, so morphs feel organic, not linear.
- **Scroll driving:** GSAP ScrollTrigger — each section boundary maps to a morph (`uMix` 0→1, then attributes swap). Scroll velocity adds a subtle turbulence uniform.
- **Cursor:** `uMouse` uniform → repulsion field in the vertex shader (desktop pointer only).
- **Theme:** ramp colors + blending mode swap on theme change (uniforms, no remount).

### Hero write-in (load choreography)
1. Preloader (percentage counter, ~0.8–1.2s max, covers font + target generation).
2. Particles start as drifting ambient dust.
3. GSAP timeline sweeps `uWrite` 0→1: particles whose write-order < frontier fly to their letter position — the name writes itself left-to-right (~1.6s, `power4.out`).
4. Role/tagline HTML type and nav reveal after (SplitText line masks).

The giant HTML type in the hero is the **role statement** ("Senior Frontend Engineer — building enterprise-scale web & mobile platforms"), not the name; the particles own the name.

### Performance budget
- Particle count: ~14,000 desktop / ~5,000 mobile (`pointer: coarse` or width < 768).
- DPR clamped to `[1, 1.75]`.
- Target: 60fps desktop, ≥40fps mid-tier mobile; zero layout shift from canvas (fixed, pre-sized).
- `frameloop` paused when tab hidden (default R3F behavior) — canvas is always in-viewport by design, so no IO gating.
- All morph math in the vertex shader; JS per-frame work limited to uniform updates.
- No postprocessing passes (bloom faked via additive blending + soft point sprites).

### Fallbacks & accessibility
- `prefers-reduced-motion`: no write-in animation or morph transits — particles render statically in each section's final form; cursor repulsion off; SplitText reveals become simple fades.
- No WebGL: canvas renders nothing; a static radial-dot CSS background keeps the texture.
- All content is real HTML — the canvas is `aria-hidden`, purely decorative. Keyboard nav, focus states, semantic headings preserved.

## Page structure & choreography

Persistent canvas behind; sections are normal-flow HTML. Morphs trigger at section boundaries.

| # | Section | Particle form | Layout & motion |
|---|---|---|---|
| 00 | **Hero** | Dust → **"SAFA SELIM"** | Particle name center-stage; eyebrow (`● SENIOR FRONTEND ENGINEER — MUNICH/ISTANBUL`), role statement in display type lower-left; marquee strip (stack keywords) pinned at hero bottom; scroll cue + `00/05` index. |
| 01 | **About** | Name → **Globe** | Editorial paragraph (line-mask reveals), stat counters (9+ years, countries, 10M+ users) count up on enter. Globe sits opposite the copy. |
| 02 | **Experience** | Globe → **Side Ribbon** | Roles as giant type rows (company + years); active row full opacity, others dimmed; hover/scroll expands details + external link. |
| 03 | **Skills** | Side Ribbon (persists) | One big typographic wall: skills weighted by seniority tier (full / 65% / 35% opacity), CSS accent hover. |
| 04 | **Projects** | Side Ribbon (persists) | Editorial index rows (name, mono meta, `001–004`); hover: floating preview card follows cursor (desktop), inline detail (mobile). |

> **Rev 2026-07-07 (user feedback):** the mid-page Thread/Lattice/Constellation forms were replaced by one sinuous **vertical ribbon along the right edge** that persists across Experience → Skills → Projects (readability: particles no longer sit behind body text) and pours into the Contact ring. Morph tweens slowed (2.8s, wider stagger, stronger swirl) so particle travel is visible instead of reading as teleporting.
| 05 | **Contact** | Constellation → **Ring** | Story closes: ring orbits "LET'S TALK." + magnetic email CTA (copy-to-clipboard + mailto). Compact footer: mono micro-labels, socials, cat-model credit removed with old hero, CC credit dropped along with the GLB asset. |

### Chrome (persistent UI)
- **Nav:** minimal fixed bar — mono wordmark `SS — 2026`, theme toggle, `MENU +`.
- **Menu:** fullscreen overlay, giant links (Archivo Black) with staggered mask reveal, mono index numbers, close on `Esc`/link click. Focus-trapped.
- **Preloader:** counter 0→100 with name flicker; shown once per session (skipped on `prefers-reduced-motion`).

## Motion system

- **Lenis** (existing `SmoothScrollProvider`) — smooth scroll, synced to GSAP ScrollTrigger.
- **GSAP + SplitText** (already licensed via `gsap` package) — line-mask reveals for all display copy; scroll-scrubbed section transitions; counters.
- **Magnetic hover** (existing `useMagnetic` hook) — CTAs and social icons.
- Easing language: `power4.out` for entrances, `expo.inOut` for morphs; durations 0.9–1.6s; no bounce.

## Code architecture

```
src/
  app/
    layout.tsx        — fonts (Archivo Black, IBM Plex Mono, Inter), ThemeProvider, Grain
    page.tsx          — ParticleCanvas + section assembly
    globals.css       — new token set, utilities (display type, mono-label, rules)
  components/
    ParticleCanvas.tsx    — persistent R3F scene + morph engine (client-only)
    Preloader.tsx         — counter overlay
    Navbar.tsx            — rebuilt minimal bar
    MenuOverlay.tsx       — fullscreen menu
    Hero.tsx, About.tsx, Experience.tsx, Skills.tsx, Projects.tsx, Contact.tsx, Footer.tsx — rebuilt
    Marquee.tsx           — restyled (kept)
    SmoothScrollProvider.tsx, ThemeProvider.tsx, Grain.tsx — kept
  lib/
    motion.ts             — existing GSAP setup (kept)
    particles/targets.ts  — target generators
  hooks/
    useMagnetic.ts        — kept
```

Removed: `HeroScene.tsx` (old particle wave), `public/models/an_animated_cat.glb` + its footer credit, unused old utilities after audit.

## Verification plan

Run via `npm run dev` + Chrome DevTools before handoff:
1. **Performance:** DevTools trace of full scroll — no long tasks > 50ms during steady scroll; FPS meter ≥ 55 desktop; 4× CPU throttle stays fluid.
2. **Mobile:** device emulation (iPhone SE, Pixel 7) — layout, reduced particle count, inline project previews, no horizontal overflow.
3. **Flicker:** verify no FOUC on load (preloader covers boot), no hydration flash on theme, `next build && next start` smoke test.
4. **Both themes** across all sections; **reduced motion** pass; **keyboard-only** pass; Lighthouse (perf ≥ 90 desktop, a11y ≥ 95).

## Out of scope

- Content rewrites (copy carries over, light editorial tightening only)
- New sections, blog, CMS
- The old 3D cat model (permanently retired)
- SEO/metadata changes (recently done on `main`)
