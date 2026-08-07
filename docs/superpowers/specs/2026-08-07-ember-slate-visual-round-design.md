# Ember & Slate — Visual Refinement Round

Date: 2026-08-07 · Branch: `chore/impeccable-design-audit` · Status: approved by Safa (palette picks confirmed via artifact review)

Driven by the 2026-08-07 impeccable critique (23/32, snapshot in `.impeccable/critique/`): one-temperature palette, mono carrying 73% of text, no middle type voice, particle name not sharp, plus four small P2s. Visual proposal artifact: claude.ai/code/artifact/3343e02b-83a0-4858-9a9b-10ede6a3c052.

## Goals

1. Cool the all-orange system with a slate-teal secondary used structurally.
2. Give the type system a middle voice; shrink mono back to true labels.
3. Make the particle name sharp at every viewport.
4. Fix the ride-along P2s: ring-over-text at the climax, menu numbering, mailto hijack, project disclosure affordance/keyboard access.

## Non-Goals (parked for later rounds)

- Experience/Work content restructure (critique P1 #1).
- New particle forms for the middle sections (morph plateau).
- Skill wall dedup, em-dash copyedit, dark-vs-light default question.

## 1. Palette — "Ember & Slate"

**Semantic rule: ember = act, slate = annotate.** Orange marks things you click or the one emotional hit per section; teal marks labels and annotations.

New tokens in `globals.css`:

| Token | Light (Paper & Ink) | Dark (Dark Cosmos) | Measured contrast on bg |
|---|---|---|---|
| `--secondary` | `#1f5f56` | `#8fb8ac` | 5.96 / 9.22 |
| `--secondary-soft` | `rgba(31,95,86,0.10)` | `rgba(143,184,172,0.12)` | chip bg |
| `--secondary-inverse` | `#8fb8ac` (for ink strip) | `#1f5f56` (for cream strip) | 8.49 / 6.79 |

Reassignments to `--secondary` (from accent/accent-text):
- `.section-index`, `.eyebrow` (globals.css)
- Experience `✦` bullets (`.xp-impact li::before`), Projects `✦` (`.proj-highlights li::before`)
- About `↳` arrows
- Projects impact chips (`.proj-impact__item`: `--secondary` on `--secondary-soft`) and the hover preview card items
- Contact meta icons (MapPin/Mail/Github/Linkedin `size={14}` icons)
- MenuOverlay index numbers
- Marquee `✦` stars → `--secondary-inverse` (fixes the 2.38:1 finding)

Orange keeps: `.btn-primary`, `.btn-ghost` hover fill, text links (`.xp-proj`, `.proj-name a:hover`, hero-social/nav-pill/tag hovers), `::selection`, focus outline, title punctuation periods, hero eyebrow dot, particle ramp p1/p2, scrollbar hover.

Particle ramps (CSS `--p1/--p2/--p3`):
- Dark: `#ff7a34 → #ffb26b → #cfe0d8` (ember cooling to teal-ash; was `#ffd9a8`)
- Light: `#e8480c → #b45309 → #1f5f56` (restores mid chroma — fixes "SELIM as brown blobs" — and ends in slate; was `#9c4507 → #78350f`)

## 2. Typography — the middle voice

- New `.subhead` utility: Inter (`--font-sans-stack`), `1.3rem`, weight 600, `line-height 1.35`, color `--fg`.
- Experience roles (`{exp.role}`) → `.subhead`.
- Project taglines (`.proj-tagline`) → Inter `1.05rem`, regular, `--fg-soft`, normal tracking (was mono 0.8rem).
- Mono remains only for true labels: eyebrows, section indexes, `.mono-label`, `.tag`, period label, marquee, contact email address.
- Measure caps for the 85–96ch detector hits: `.skill-groups p` and `.lang-row p` get `max-width: 55ch`.
- Impact bullets `0.92rem → 0.95rem` for readability.

## 3. Particle name sharpness

In `ParticleCanvas.tsx` / `targets.ts`:
- Glyph raster 1.5×: line `900×300 → 1350×450`; stack `600×520 → 900×780`. Sampling step divisor `52 → 64` (finer grid).
- Counts: desktop `14000 → 18000`, mobile `5000 → 8000`. Watch fps on mobile emulation; fall back to 7000 if morphs stutter.
- `nameTarget` jitter `1.2×scale → 0.7×scale`; z-spread `0.3 → 0.15` (tighter letterforms). Update the jitter-tolerance test accordingly.

## 4. Ride-along fixes

- **Ring**: landscape radius `min(w,h)×0.32 → ×0.41` so it frames the contact copy as portrait already does; update the annulus test.
- **Menu numbering**: MenuOverlay LINKS reordered to page order — About 01, Experience 02, Skills 03, Work 04, Contact 05.
- **Email link**: remove `preventDefault` — click opens mailto natively; clipboard copy still fires alongside with the "Copied ✓" swap. No dead action when clipboard is denied.
- **Project disclosure**: a visible `+` cue rendered as a real `<button>` beside each project index (rotates 45° when open, `aria-expanded` reflected, `aria-controls` the detail block) — the project-name link stays a separate sibling anchor, never nested inside the button. Keyboard users can now open url-less projects; hover-expand behavior is unchanged for pointer users and the button state syncs with it.

## Execution notes (for a fresh session)

- Work on the existing branch `chore/impeccable-design-audit` (do NOT push to `main` — it auto-deploys to safaselim.com via Vercel).
- Dev server: port 3000 is occupied by another app on this machine — use `npm run dev -- -p 3100`.
- Font stack vars (`--font-display-stack` etc.) are declared on `body`, not `:root` — next/font puts its vars on body. Never move them.
- MenuOverlay's transform is GSAP-owned — never put a `transform` in a React style prop alongside GSAP there.
- Collapse transitions gate on `body.js-anim` (added after a forced reflow in SmoothScrollProvider) — if you add interpolable collapse transitions, follow the same gating or boot-time `ScrollTrigger.refresh()` will measure mid-transition and downstream scroll entrances will stick invisible (this bit us once already).
- Pure particle generators in `src/lib/particles/targets.ts` are vitest-covered (`npm test`) — update the jitter-tolerance and ring-annulus tests when changing those values.
- The particle glyph cache (`glyphCache` in ParticleCanvas.tsx) is layout-keyed (`line`/`stack`) — raster size changes must update both layouts.
- Commit per numbered section of this spec (4 commits), message style `feat:`/`fix:`/`polish:` as in recent history; the user reviews in the browser before any merge.

## Verification

- `npm test` (updated particle tests), `npm run lint`, `npx tsc --noEmit`, `impeccable detect src/` stays clean.
- Contrast script re-run for every new pair (already measured above; re-verify chip-on-soft combinations in situ).
- Browser pass: both themes × 1440×900 / 768×1024 / 390×844 — hero name sharpness, annotation color sweep, marquee stars, ring clearance at 1440, menu numbering, keyboard-open a url-less project, mailto opens with copy feedback.
- Re-run in-page detector: line-length count should drop; overused-font share should improve.
