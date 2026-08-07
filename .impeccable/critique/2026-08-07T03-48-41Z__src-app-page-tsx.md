---
target: the landing page (src/app/page.tsx)
total_score: 23
max_score: 32
na_heuristics: 9,10
p0_count: 0
p1_count: 3
timestamp: 2026-08-07T03-48-41Z
slug: src-app-page-tsx
---
Method: dual-agent (A: design review · B: detector/browser evidence)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | "00 / 05" position indicator never recurs after the hero |
| 2 | Match System / Real World | 3 | Big email link labeled mailto silently copies to clipboard instead |
| 3 | User Control and Freedom | 3 | Clipboard hijack removes mail-client choice; Experience rows auto-collapse — can't compare two jobs |
| 4 | Consistency and Standards | 2 | Menu renumbers sections (Work=01) against the page's own scheme (About=01); "v2–v20" vs "v4 → v19" |
| 5 | Error Prevention | 4 | No-WebGL/no-JS/reduced-motion/sessionStorage fallbacks all genuinely handled |
| 6 | Recognition Rather Than Recall | 2 | Desktop project rows expand on hover with zero affordance; 0.35-opacity collapsed rows give no cue |
| 7 | Flexibility and Efficiency | 3 | Menu jumps, theme toggle, magnetic CTAs; no deep links but acceptable |
| 8 | Aesthetic and Minimalist Design | 3 | Visually disciplined; editorially not — same 4 employers appear twice, stack listed 4 times |
| 9 | Error Recovery | n/a | No user-generated error states on this surface |
| 10 | Help and Documentation | n/a | Experience surface; self-evident interaction is the goal |
| **Total** | | **23/32** | **Good (72%)** |

## Design Specificity Verdict

**LLM assessment:** Authored centerpiece on a genre chassis. The particle arc (name written in dust → ember thread → ring around "LET'S TALK.") is genuinely authored for this person and could not be lifted onto another portfolio. The light "thrown rust pigment on cream" look is the rarer, more personal theme. But the HTML layer around the canvas is category grammar — oversized uppercase display + tracked mono eyebrows + hairline rows + hover-expand list + preloader percentage — swap the name and it serves any senior frontend engineer. Telling detail: `.italic-accent` renders `font-style: normal` — the system wanted an italic voice, Archivo Black has none, and the idea was dropped rather than solved.

**Deterministic scan:** CLI detector: clean (0 findings). In-page detector: 41 findings across 9 rules — line-length ×23 (85–96ch vs ≤80 target), kicker-above-heading ×3 + numbered-section-labels ×3 (the "02 — Experience" pattern), all-caps-body ×3, low-contrast ×1 (2.4:1, #f5f5f2/#ff7a34 pair — matches the marquee's accent ✦ stars on the inverted cream strip), tiny-text ×1 (11.84px), overused-font ×1 (**Inter carries only 27% of rendered text — mono dominates**), wide-tracking, tight-leading (0.92 display headings — intentional, false positive), em-dash ×17.

**Convergence:** the detector's overused-font and kicker findings independently confirm Assessment A's two central typography critiques (mono everywhere; labels doing work headings should do). The tight-leading and all-caps-body hits on display/label type are genre-intentional false positives.

**Visual overlays:** ran in an automation browser, not a user-visible tab — no overlay is available to view; console findings reported above instead.

## Overall Impression

The site's two best frames — first and last — are carried by the canvas; the middle 60% is a plateau. The emotional shape is peak–flatline–peak: the promised per-section morphs are aliased to one static ribbon (forms 1–4 share `sideThreadTarget`, a visual no-op by design), and the Experience/Work sections repeat the same four employers nearly verbatim. Typographically everything either shouts (display) or whispers (0.7–0.95rem mono/grey); there is no mid voice. Chromatically the dark theme's ramp does real work, but the single warm accent + warm ramp + warm greys make the whole system read one-temperature — the "so orange" feeling is structural, not just a hue choice.

## What's Working

1. **The contact screen** — ring + "LET'S TALK." + mono email is the best composition on the site in both themes; peak-end rule satisfied.
2. **Token-level craft** — the --accent/--accent-text split, scoped reduced-motion, no-WebGL fallback, sr-only real headings: unusually mature system thinking for a personal site.
3. **The inverting marquee** — `bg: var(--fg)` flips ink/paper across themes; one system, not a filter.

## Priority Issues

1. **[P1] Experience and Selected Work are the same content twice.** Same four employers, near-verbatim bullets. Doubles page length, deflates the ending, reads as padding. Fix: Experience = compressed timeline (role, dates, 2 bullets); Work = case-study layer (outcomes, artifacts, links) — or merge and cut ~1.5 viewports.
2. **[P1] The name — the identity-bearing element — is least sharp where most people see it.** At 390px counters fill with dust ("SAFA" borders on "BAFA"); light mobile worst — the ramp's #78350f end renders "SELIM" as brown blobs. Detector corroborates the general glyph-fidelity gap. Fix: raise glyph raster resolution / reduce sampling step for the stacked layout, more points at smaller size, clamp the light ramp's dark end nearer #b45309.
3. **[P1] One-temperature palette.** Warm accent + warm ramp + warm greys; Inter only 27% of text with warm-toned mono carrying the rest. In light mode the ramp descends into mud unless #e8480c is on screen; marquee accent stars sit at 2.4:1. Fix: introduce one cool counterweight color (structural, not decorative) + demote several accent uses to neutrals.
4. **[P2] Particles cross text at the emotional climax.** "Available for…" and the ISTANBUL/LINKEDIN row are struck by the ring's densest band at 1440 in both themes. Fix: shrink ring ~8% or bias distribution away from a measured exclusion band.
5. **[P2] Project details invisible on desktop, keyboard-inaccessible when url is null.** No affordance; "ClinicalTrials Parser" has no focusable element so :focus-within can never fire. Fix: visible expand cue + real button disclosure per card.
6. **[P2] Menu contradicts the page's numbering.** Page teaches About=01…Contact=05; overlay says Work=01…About=04. Fix: align order and indices.

## Persona Red Flags

**Jordan (first-timer, desktop):** déjà vu at "THINGS I'VE SHIPPED." (same content as Experience); never hovers a project row so leaves thinking Work is four bare titles; menu renumbering breaks the 01–05 scheme he just learned.

**Casey (mobile, one-handed):** the name reads as decorative texture — she may never register whose portfolio this is beyond "SS — 2026"; all four project cards force-open on touch into a wall of already-read bullets; hero eyebrow wraps with a dangling "—"; touch targets themselves are good.

**Riley (stress tester):** clipboard permission denied → email click does nothing (preventDefault fired, rejection swallowed) — dead primary action, no mailto fallback; cannot keyboard-expand ClinicalTrials Parser; tag chips hover-styled but unfocusable; morph thrash and mid-page reload recover cleanly — self-heal works.

## Minor Observations

- Missing type mid-scale: nothing between 0.95rem whisper and 1.9rem+ shout; a 1.25–1.4rem subhead register would give skimmers a resting voice.
- Projects hover tooltip duplicates the impact chips already in the expanded card.
- Skill wall and skill groups render the same list twice within one section.
- 17 em-dashes in body copy (detector) — a tic worth thinning.
- The orange square period on "LET'S TALK." reads as a glitch block at 10rem — arguably a feature.
- Selection, scrollbar hover, and focus states all use accent — good edge completeness.

## Questions to Consider

1. The concept is "dust becomes structure" — why does the structure stop evolving for four consecutive sections, and would three honest states (arrival, journey, invitation) be stronger with copy rebuilt around them?
2. If you deleted the duplicated Projects section and the skill wall tomorrow, would anything of value be lost?
3. Dark is the default, but light is the theme no one else has. Which one should a hiring manager's first screenshot be?
