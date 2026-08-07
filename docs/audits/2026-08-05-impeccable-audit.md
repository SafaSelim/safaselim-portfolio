# Impeccable Design Audit — safaselim.com

Date: 2026-08-05 · Branch: `chore/impeccable-design-audit` · Tool: impeccable 3.5.0 (skill 4.0.4)
Method: bundled detector over `src/`, full code review (all 24 source files), live browser pass at 1440×900 / 768×1024 / 390×844 in both themes.

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 2/4 | Light-theme accent text 3.14:1 — fails WCAG AA on all eyebrows/labels |
| 2 | Performance | 3/4 | `max-height` transitions in Experience + Projects (layout thrash) |
| 3 | Responsive Design | 2/4 | Particle ribbon/ring collides with text on mobile; touch targets < 44px |
| 4 | Theming | 3/4 | Excellent token system; light-theme particle name washes out |
| 5 | Implementation Integrity | 4/4 | Coherent, product-specific system; detector found only 2 issues |
| **Total** | | **14/20** | **Good — address weak dimensions** |

## Implementation Integrity Verdict

**Pass.** The implementation expresses a coherent, product-specific system: a real token vocabulary (`--bg/--fg/--accent/--line` + particle ramp), one display/mono/sans type hierarchy used consistently, and the particle concept carried through every section. The detector found only 2 deterministic issues across the whole codebase (both `max-height` transitions). Nothing reads as template filler.

## Detailed Findings

### P1 — Major (fix before next release)

**[P1] Light-theme accent text fails WCAG AA contrast**
- Location: `src/app/globals.css:15` (`--accent: #e8480c` on `--bg: #eae6dd`)
- Category: Accessibility
- Impact: Measured **3.14:1** (AA requires 4.5:1). This color is used for *small* text everywhere: `.eyebrow`, `.section-index`, `.xp-proj` links, `.proj-impact__item` chips, menu index numbers. Low-vision users in light mode can't read any of the orange micro-labels.
- WCAG: 1.4.3 Contrast (Minimum)
- Recommendation: darken the light-theme accent for **text** use (e.g. `#c93a06` ≈ 4.1:1, `#b83505` ≈ 4.8:1) — keep the brighter `#e8480c` for large display glyphs and particle ramp via a separate `--accent-text` token.

**[P1] Light-theme primary button text fails AA**
- Location: `globals.css` `.btn-primary` (`#f5f5f2` on `#e8480c` = **3.58:1**, 0.92rem text)
- Category: Accessibility
- Impact: The main CTA ("View selected work") is the least readable element on the light page.
- WCAG: 1.4.3
- Recommendation: darker accent surface for light mode, or near-black text on the orange (`--on-accent: #16130e` gives ~4.2:1 → pair with a slightly darker accent).

**[P1] Particle ribbon collides with text on mobile (About, Experience, Work)**
- Location: `src/lib/particles/targets.ts` (`sideThreadTarget`) + `src/components/ParticleCanvas.tsx` forms 1–4
- Category: Responsive
- Impact: At 390px the ribbon occupies the right ~15% of the viewport, and body copy runs underneath it — verified overlapping words in About ("markets", "systems"), Experience bullets, and Work taglines ("…interconnected apps", "…Component library" are partially buried). Desktop is affected too: Experience's "NOV 2023 — PRESENT" period label sits directly under the ribbon.
- Recommendation: on narrow viewports either push the ribbon further off-canvas (x offset beyond `area.w/2`), reduce its opacity behind the content column, or add extra right padding/`max-width` to text blocks in ribbon sections. For the desktop period label, move `.xp-period` inset from the right edge.

**[P1] Contact section is a text/particle collision field on mobile & tablet**
- Location: `src/components/Contact.tsx` + `ringTarget`
- Category: Responsive
- Impact: At 390px and 768px the ring passes *through* "Available for…", the email link, and the meta row (the location/email strings are struck through by dense particles). Worst screen of the audit.
- Recommendation: scale the ring radius with viewport so it frames rather than crosses the content (larger radius + lower density on small screens), or fade ring opacity in the central band.

**[P1] Light-theme particle name is washed out**
- Location: `ParticleCanvas.tsx` fragment shader / ramp + `uOpacity` 0.8, normal blending
- Category: Theming
- Impact: In light mode "SELIM" (upper ramp colors) renders pale peach on cream — the signature moment of the site nearly disappears. Verified at 390px and 768px.
- Recommendation: darken the light ramp's upper stops (`--p2`/`--p3` currently render diluted through alpha), raise `uOpacity` in light mode, or increase point size/density in light theme.

### P2 — Minor (next pass)

**[P2] `max-height`/`margin-top` transitions animate layout**
- Location: `src/components/Experience.tsx:187`, `src/components/Projects.tsx:246`
- Category: Performance (detector: `layout-transition`)
- Impact: Layout thrash on every accordion open/close; janky on low-end mobiles.
- Recommendation: `grid-template-rows: 0fr → 1fr` on a wrapper (keeps the CSS-only no-JS behavior) or GSAP height auto-tweens.

**[P2] Touch targets below 44×44**
- Location: Navbar theme toggle (51×34) and menu button (90×38); menu overlay GitHub/LinkedIn (70×18); `.xp-proj` project links (~16px tall); Contact meta links (~18–32px tall); footer wordmark link (79×18)
- Category: Accessibility / Responsive
- Impact: Hard to hit on touch; the theme toggle and project links are the ones users actually reach for.
- WCAG: 2.5.8 Target Size (Minimum)
- Recommendation: min-height 44px via padding on pills; expand link hit areas with padding + negative margin.

**[P2] Contact meta icons wrap onto their own line**
- Location: `src/components/Contact.tsx:103-104` (GitHub/LinkedIn anchors)
- Category: Implementation Integrity (visual bug)
- Impact: Verified at all three widths: the icon renders above/offset from its label ("GITHUB" under a floating icon) because the anchor is inline and allows an internal line break.
- Recommendation: `display: inline-flex; align-items: center; white-space: nowrap` on those anchors (drop the `verticalAlign` hack).

**[P2] Fixed header has no backdrop — wordmark collides with content**
- Location: `src/components/Navbar.tsx` header (transparent, no blend)
- Impact: Verified: "SS — 2026" overlaps the Skills wall display type and section labels while scrolling, in both themes. The nav pills have `backdrop-filter` but the wordmark doesn't.
- Recommendation: give the wordmark the same pill/backdrop treatment, or `mix-blend-mode: difference` for the wordmark.

**[P2] Blanket reduced-motion kill**
- Location: `globals.css:373-379` (`* { animation-duration: 0.001ms !important; … }`)
- Category: Accessibility
- Impact: Impeccable flags the global 0.01ms kill pattern: it also nukes *useful* feedback (button hover fills, theme cross-fade, `Copied ✓` state changes are instant/jarring). The site already has intentional reduced-motion paths (`html.reduced`, `prefersReducedMotion()` guards) — the blanket rule is redundant with them and coarser.
- Recommendation: scope the kill to the decorative animations (grain, marquee, reveals) and let 150–200ms opacity/color transitions live.

**[P2] Mobile particle name legibility**
- Location: `sampleName` — glyph raster 900×300 sampled for a ~350px-wide viewport
- Impact: At 390px the name is mushy — letters blob together (verified both themes).
- Recommendation: fewer, larger points on mobile for the name form, or stack "SAFA" / "SELIM" on two lines on narrow viewports.

### P3 — Polish

- **Skill wall tier-3 at 0.35 opacity** (`Skills.tsx`) — ~2:1 contrast; intentional hierarchy, but consider 0.45–0.5 or a hover/in-view brighten so the content is at least discoverable.
- **No custom `:focus-visible` style** — UA default ring clashes with the aesthetic; a 2px accent outline w/ offset would match the system.
- **Permanent `will-change`** on `.split-line` and `.marquee__track` — remove after intro completes.
- **Hard-coded shadow** `rgba(0,0,0,0.5)` in Projects preview card — token candidate.
- **Metadata title says "Senior Software Engineer", hero says "Senior Frontend Engineer"** — known deferred wording decision; audit re-flags for a deliberate choice.

## Patterns & Systemic Issues

1. **The particle layer never negotiates with the HTML layer.** Every P1 responsive finding is one root cause: particle target shapes are computed from viewport area with no awareness of where the DOM content sits. A per-form "content exclusion zone" (or viewport-scaled offsets) fixes About/Experience/Work/Contact in one concept.
2. **The light theme was tuned by inversion, not measurement.** Dark theme passes every contrast check (accent 7.75:1); light fails three (accent text 3.14, button 3.58, muted 4.48 borderline). Light needs its own pass with measured values, not mirrored ones.
3. **Small-type accent monoculture**: eyebrows, indexes, chips, links all use the same accent-on-bg micro-mono treatment, so one failing color fails a dozen surfaces — but it also means one token fix (`--accent-text`) repairs all of them.

## Positive Findings

- Token discipline is genuinely good: every color in components resolves to a CSS var; theme switching is instant and complete (MutationObserver even re-reads the particle ramp).
- Accessibility intent is real: sr-only h1/copy behind the aria-hidden animated headline, focus trap + focus restore + `inert` in the menu, `aria` attrs on toggles, SplitText `aria: 'none'` used correctly, no-WebGL and no-JS fallbacks.
- Zero horizontal overflow at 390px — rare for a site this animated.
- Detector: 2 findings in ~2,900 lines. Implementation integrity is the strongest dimension.
- Clean console (only a Three.js deprecation warning from the library itself).

## Recommended Actions (priority order)

1. **[P1] `/impeccable adapt`** — particle/content collisions on small screens (ribbon overlap in About/Experience/Work, Contact ring, mobile name legibility, touch targets).
2. **[P1] `/impeccable colorize`** — light-theme color pass: `--accent-text` token at ≥4.5:1, button pair fix, `--fg-muted` nudge, light particle ramp densify/darken.
3. **[P2] `/impeccable optimize`** — replace the two `max-height` transitions with `grid-template-rows`; drop stale `will-change`.
4. **[P2] `/impeccable typeset`** — the font/hierarchy improvements you wanted: header wordmark treatment, tier-3 wall opacity, focus-visible style, icon/label alignment in Contact.
5. **[Final] `/impeccable polish`** — verification pass over everything above.
