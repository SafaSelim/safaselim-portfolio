# Landing Page Rework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild safaselim.com's landing page as an awwwards-caliber experience: one persistent WebGL particle system that writes "SAFA SELIM" on load and morphs into a different form per section, under brutalist-editorial typography, in two themes.

**Architecture:** A fixed fullscreen `@react-three/fiber` canvas sits behind all content and renders one `<points>` mesh whose vertex shader lerps between two target-shape attribute sets (`uMix`), plus a write-in frontier (`uWrite`) and cursor repulsion (`uMouse`). Pure-math target generators live in `src/lib/particles/targets.ts` (unit-tested with Vitest). GSAP ScrollTriggers on each section fire discrete morphs. Sections are normal-flow HTML rebuilt in the new type system; existing content data arrays carry over verbatim.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4 (tokens via CSS vars), GSAP 3.15 (ScrollTrigger + SplitText), Lenis, @react-three/fiber 9 + three 0.183, next-themes, Vitest (new, dev-only).

**Spec:** `docs/superpowers/specs/2026-07-06-landing-rework-design.md`

## Global Constraints

- **Local commits only.** Each task ends with a local commit on `feat/landing-page-rework` (user-approved 2026-07-06). NEVER run `git push` or `git merge` — the user reviews the branch before anything leaves the machine. Where a task says "CHECKPOINT — report to user (no commit)", read it as: commit the task's files locally with a conventional message, then report.
- Branch: all work happens on `feat/landing-page-rework` (already checked out).
- Themes: dark = **Dark Cosmos** (`--bg #070709`, `--accent #ff7a34`, particle ramp `#ff7a34 → #ffb26b → #ffd9a8`, additive blending); light = **Paper & Ink** (`--bg #eae6dd`, `--accent #e8480c`, ramp `#e8480c → #b45309 → #78350f`, normal blending). Dark is default (existing `ThemeProvider`, storage key `portfolio-theme`).
- Fonts: display **Archivo Black** (single weight 400, always uppercase), mono **IBM Plex Mono**, body **Inter** — all via `next/font/google`.
- Particle counts: **14000 desktop / 5000** when `window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768`. DPR clamp `[1, 1.75]`.
- Section ids must remain: `top`, `about`, `experience`, `skills`, `work`, `contact` (nav + morph triggers depend on them).
- Morph form order: `0 NAME (hero) → 1 GLOBE (about) → 2 THREAD (experience) → 3 LATTICE (skills) → 4 CONSTELLATION (work) → 5 RING (contact)`.
- Accessibility: canvas is `aria-hidden`; `prefers-reduced-motion` renders final forms statically (no write-in, no morph transit, no repulsion); all reveals fall back to visible text (`.will-reveal` pattern already in `globals.css`).
- Content copy: reuse the existing data arrays (experiences, projects, skills groups, stats, contact details) exactly as found in the current components — do not invent new copy.
- Existing modules to KEEP and reuse untouched: `src/lib/motion.ts`, `src/components/SmoothScrollProvider.tsx`, `src/components/ThemeProvider.tsx`, `src/components/Grain.tsx`, `src/hooks/useMagnetic.ts`, `src/hooks/useReveal.ts`.
- Every task ends with: `npm run lint && npx tsc --noEmit` clean, and `npm run build` clean where stated.

---

### Task 1: Design tokens & fonts

**Files:**
- Modify: `src/app/layout.tsx` (font imports + body class, lines 1–28, 104)
- Modify: `src/app/globals.css` (token blocks lines 7–53; typography utilities lines 110–149; add new utilities)

**Interfaces:**
- Produces CSS vars every later task uses: `--bg`, `--bg-elev`, `--fg`, `--fg-soft`, `--fg-muted`, `--accent`, `--accent-soft`, `--on-accent`, `--line`, `--line-strong`, `--p1 --p2 --p3` (particle ramp), fonts `--font-display/--font-sans/--font-mono`.
- Produces utility classes: `.display-xl`, `.display-lg`, `.mono-label`, `.eyebrow`, `.section-index`, `.hairline`, `.container`, `.section-pad` (existing names kept where possible).

- [ ] **Step 1: Swap fonts in `src/app/layout.tsx`**

Replace the three font constants (lines 2, 8–28) with:

```tsx
import { Archivo_Black, Inter, IBM_Plex_Mono } from 'next/font/google';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});
```

Update the body className (line 104) to `` `${archivoBlack.variable} ${inter.variable} ${ibmPlexMono.variable} antialiased` `` and the `viewport.themeColor` values (lines 69–70) to dark `#070709` / light `#eae6dd`. Everything else in layout.tsx stays.

- [ ] **Step 2: Replace token blocks in `globals.css`**

Replace `:root` (lines 7–33) and `.dark` (lines 35–53) with:

```css
:root {
  /* Paper & Ink (light) */
  --bg: #eae6dd;
  --bg-deep: #e2ddd2;
  --bg-elev: #f2eee6;
  --fg: #16130e;
  --fg-soft: #4a443a;
  --fg-muted: #6f6759;
  --accent: #e8480c;
  --accent-soft: rgba(232, 72, 12, 0.1);
  --on-accent: #f5f5f2;
  --line: rgba(22, 19, 14, 0.12);
  --line-strong: rgba(22, 19, 14, 0.26);
  --p1: #e8480c;
  --p2: #b45309;
  --p3: #78350f;
  --grain-opacity: 0.04;

  --font-display: var(--font-display), 'Arial Black', sans-serif;
  --font-sans: var(--font-sans), system-ui, sans-serif;
  --font-mono: var(--font-mono), ui-monospace, monospace;

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --maxw: 1400px;
}

.dark {
  /* Dark Cosmos */
  --bg: #070709;
  --bg-deep: #040405;
  --bg-elev: #101014;
  --fg: #f5f5f2;
  --fg-soft: #c9c9c2;
  --fg-muted: #8a8a82;
  --accent: #ff7a34;
  --accent-soft: rgba(255, 122, 52, 0.13);
  --on-accent: #070709;
  --line: rgba(245, 245, 242, 0.1);
  --line-strong: rgba(245, 245, 242, 0.22);
  --p1: #ff7a34;
  --p2: #ffb26b;
  --p3: #ffd9a8;
  --grain-opacity: 0.055;
}
```

Note: `--grad`, `--accent-2`, `--accent-3`, `--shadow` are removed — grep for usages (`grep -rn "var(--grad)\|--accent-2\|--accent-3\|var(--shadow)" src/`) and replace stragglers with `var(--accent)` / plain shadows. (`.italic-accent` and `.btn-primary` currently use `--grad`; retarget both to `background: var(--accent)`.)

- [ ] **Step 3: Replace typography utilities**

Replace `.display` and `.section-title` (lines 110–115, 134–140) with the new system (keep `.eyebrow`, `.mono-label`, `.line-mask`, `.will-reveal`, buttons, `.tag`, `.grain`, `.marquee`, `.hairline`, reduced-motion, scrollbar blocks as-is):

```css
.display-xl {
  font-family: var(--font-display);
  font-weight: 400;
  text-transform: uppercase;
  line-height: 0.85;
  letter-spacing: -0.03em;
}

.display-lg {
  font-family: var(--font-display);
  font-weight: 400;
  text-transform: uppercase;
  line-height: 0.92;
  letter-spacing: -0.02em;
}

.section-title {
  font-family: var(--font-display);
  font-weight: 400;
  text-transform: uppercase;
  font-size: clamp(2.2rem, 6.5vw, 5rem);
  line-height: 0.92;
  letter-spacing: -0.02em;
}

.section-index {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent);
}

.italic-accent {
  font-style: normal;
  color: var(--accent);
}

/* static fallback texture when WebGL is unavailable */
body.no-webgl main::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: radial-gradient(var(--line-strong) 1px, transparent 1.4px);
  background-size: 26px 26px;
}
```

Any component still using class `display` will be rebuilt in later tasks; leave the old `.display` rule in place until Task 12 cleanup.

- [ ] **Step 4: Verify**

Run: `npm run lint && npx tsc --noEmit && npm run build`
Expected: all clean. Then `npm run dev`, load http://localhost:3000 — site renders with new fonts/colors (sections will look rough until rebuilt; that's expected).

- [ ] **Step 5: CHECKPOINT — report to user (no commit)**

---

### Task 2: Vitest + particle target generators (pure math, TDD)

**Files:**
- Create: `src/lib/particles/targets.ts`
- Create: `src/lib/particles/targets.test.ts`
- Create: `vitest.config.ts`
- Modify: `package.json` (add `"test": "vitest run"` script, `vitest` devDependency)

**Interfaces:**
- Produces (consumed by Task 3):

```ts
export type Area = { w: number; h: number };            // world units at z=0
export type TargetSet = {
  positions: Float32Array;  // N*3 xyz
  ramp: Float32Array;       // N, 0..1 color-ramp position
  order: Float32Array;      // N, 0..1 write/assembly order
};
export type AlphaGrid = { width: number; height: number; data: Uint8ClampedArray }; // RGBA
export function textToPoints(grid: AlphaGrid, step: number, threshold?: number): Array<[number, number]>; // pixel coords, sorted by x asc
export function nameTarget(pts: Array<[number, number]>, gridW: number, gridH: number, count: number, area: Area): TargetSet;
export function globeTarget(count: number, area: Area): TargetSet;
export function threadTarget(count: number, area: Area): TargetSet;
export function latticeTarget(count: number, area: Area): TargetSet;
export function constellationTarget(count: number, area: Area): TargetSet;
export function ringTarget(count: number, area: Area): TargetSet;
```

- [ ] **Step 1: Install vitest and add config**

Run: `npm install -D vitest`

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['src/**/*.test.ts'] },
});
```

Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 2: Write the failing tests**

Create `src/lib/particles/targets.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  textToPoints,
  nameTarget,
  globeTarget,
  threadTarget,
  latticeTarget,
  constellationTarget,
  ringTarget,
  type AlphaGrid,
} from './targets';

const AREA = { w: 12, h: 7 };
const N = 500;

/** 10x10 grid with an opaque 4x4 block at x∈[2,5], y∈[3,6]. */
function blockGrid(): AlphaGrid {
  const width = 10, height = 10;
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 3; y <= 6; y++)
    for (let x = 2; x <= 5; x++) data[(y * width + x) * 4 + 3] = 255;
  return { width, height, data };
}

describe('textToPoints', () => {
  it('finds only opaque pixels, sorted by x ascending', () => {
    const pts = textToPoints(blockGrid(), 1);
    expect(pts.length).toBe(16);
    for (const [x, y] of pts) {
      expect(x).toBeGreaterThanOrEqual(2);
      expect(x).toBeLessThanOrEqual(5);
      expect(y).toBeGreaterThanOrEqual(3);
      expect(y).toBeLessThanOrEqual(6);
    }
    for (let i = 1; i < pts.length; i++) expect(pts[i][0]).toBeGreaterThanOrEqual(pts[i - 1][0]);
  });

  it('respects sampling step', () => {
    expect(textToPoints(blockGrid(), 2).length).toBeLessThan(16);
  });

  it('returns empty for transparent grid', () => {
    const g: AlphaGrid = { width: 4, height: 4, data: new Uint8ClampedArray(64) };
    expect(textToPoints(g, 1)).toEqual([]);
  });
});

function checkShape(t: { positions: Float32Array; ramp: Float32Array; order: Float32Array }) {
  expect(t.positions.length).toBe(N * 3);
  expect(t.ramp.length).toBe(N);
  expect(t.order.length).toBe(N);
  for (let i = 0; i < N; i++) {
    expect(t.ramp[i]).toBeGreaterThanOrEqual(0);
    expect(t.ramp[i]).toBeLessThanOrEqual(1);
    expect(t.order[i]).toBeGreaterThanOrEqual(0);
    expect(t.order[i]).toBeLessThanOrEqual(1);
    expect(Number.isFinite(t.positions[i * 3])).toBe(true);
    expect(Number.isFinite(t.positions[i * 3 + 1])).toBe(true);
    expect(Number.isFinite(t.positions[i * 3 + 2])).toBe(true);
  }
}

describe('geometry targets', () => {
  it.each([
    ['globe', globeTarget],
    ['thread', threadTarget],
    ['lattice', latticeTarget],
    ['constellation', constellationTarget],
    ['ring', ringTarget],
  ])('%s produces well-formed TargetSet', (_, fn) => {
    checkShape(fn(N, AREA));
  });

  it('targets stay inside the area bounds (with 10% margin)', () => {
    for (const fn of [globeTarget, latticeTarget, constellationTarget, ringTarget]) {
      const t = fn(N, AREA);
      for (let i = 0; i < N; i++) {
        expect(Math.abs(t.positions[i * 3])).toBeLessThanOrEqual(AREA.w * 0.55);
        expect(Math.abs(t.positions[i * 3 + 1])).toBeLessThanOrEqual(AREA.h * 0.55);
      }
    }
  });

  it('globe is a sphere: constant radius from center', () => {
    const t = globeTarget(N, AREA);
    const r0 = Math.hypot(t.positions[0], t.positions[1], t.positions[2]);
    for (let i = 1; i < N; i++) {
      const r = Math.hypot(t.positions[i * 3], t.positions[i * 3 + 1], t.positions[i * 3 + 2]);
      expect(r).toBeCloseTo(r0, 5);
    }
  });

  it('ring points lie on an annulus in xy', () => {
    const t = ringTarget(N, AREA);
    const R = Math.min(AREA.w, AREA.h) * 0.32;
    for (let i = 0; i < N; i++) {
      const r = Math.hypot(t.positions[i * 3], t.positions[i * 3 + 1]);
      expect(r).toBeGreaterThan(R * 0.8);
      expect(r).toBeLessThan(R * 1.2);
    }
  });

  it('deterministic: same input, same output', () => {
    const a = constellationTarget(N, AREA).positions;
    const b = constellationTarget(N, AREA).positions;
    expect(Array.from(a)).toEqual(Array.from(b));
  });
});

describe('nameTarget', () => {
  it('maps pixel points into area space with left-to-right order', () => {
    const pts = textToPoints(blockGrid(), 1);
    const t = nameTarget(pts, 10, 10, N, AREA);
    checkShape(t);
    // order must be non-decreasing with x position
    for (let i = 0; i < N; i++) {
      const x = t.positions[i * 3];
      expect(t.order[i]).toBeCloseTo(t.ramp[i], 5); // ramp follows write order
      expect(Math.abs(x)).toBeLessThanOrEqual(AREA.w * 0.55);
    }
  });

  it('falls back to scattered points when glyph is empty', () => {
    const t = nameTarget([], 10, 10, N, AREA);
    checkShape(t);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './targets'`.

- [ ] **Step 4: Implement `src/lib/particles/targets.ts`**

```ts
/**
 * Pure target-shape generators for the particle system.
 * All positions are in world units centered on origin; x∈[-w/2,w/2], y∈[-h/2,h/2].
 * Everything here is deterministic (seeded) so shapes are stable across renders.
 */

export type Area = { w: number; h: number };

export type TargetSet = {
  positions: Float32Array;
  ramp: Float32Array;
  order: Float32Array;
};

export type AlphaGrid = { width: number; height: number; data: Uint8ClampedArray };

/** Deterministic pseudo-random in [0,1) from an integer seed. */
function rand(seed: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function makeSet(count: number): TargetSet {
  return {
    positions: new Float32Array(count * 3),
    ramp: new Float32Array(count),
    order: new Float32Array(count),
  };
}

/** Sample opaque pixels from an RGBA grid, sorted left→right. */
export function textToPoints(grid: AlphaGrid, step: number, threshold = 128): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let y = 0; y < grid.height; y += step)
    for (let x = 0; x < grid.width; x += step)
      if (grid.data[(y * grid.width + x) * 4 + 3] > threshold) pts.push([x, y]);
  pts.sort((a, b) => a[0] - b[0]);
  return pts;
}

/** Map sampled glyph pixels into area space. Order & ramp follow x (write direction). */
export function nameTarget(
  pts: Array<[number, number]>,
  gridW: number,
  gridH: number,
  count: number,
  area: Area
): TargetSet {
  const t = makeSet(count);
  if (pts.length === 0) {
    for (let i = 0; i < count; i++) {
      t.positions[i * 3] = (rand(i) - 0.5) * area.w * 0.8;
      t.positions[i * 3 + 1] = (rand(i + 9e4) - 0.5) * area.h * 0.6;
      t.positions[i * 3 + 2] = 0;
      t.ramp[i] = t.order[i] = i / count;
    }
    return t;
  }
  const scale = Math.min((area.w * 0.9) / gridW, (area.h * 0.55) / gridH);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor((i / count) * pts.length);
    const [px, py] = pts[Math.min(idx, pts.length - 1)];
    const jx = (rand(i) - 0.5) * scale * 1.2;
    const jy = (rand(i + 5e4) - 0.5) * scale * 1.2;
    t.positions[i * 3] = (px - gridW / 2) * scale + jx;
    t.positions[i * 3 + 1] = -(py - gridH / 2) * scale + jy;
    t.positions[i * 3 + 2] = (rand(i + 2e5) - 0.5) * 0.3;
    const o = i / count; // pts are x-sorted, so index order == write order
    t.order[i] = o;
    t.ramp[i] = o;
  }
  return t;
}

/** Fibonacci sphere. Ramp = depth (z), order = index. */
export function globeTarget(count: number, area: Area): TargetSet {
  const t = makeSet(count);
  const R = Math.min(area.w, area.h) * 0.3;
  const GA = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (2 * i) / (count - 1);
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = GA * i;
    const x = Math.cos(th) * r, z = Math.sin(th) * r;
    t.positions[i * 3] = x * R;
    t.positions[i * 3 + 1] = y * R;
    t.positions[i * 3 + 2] = z * R;
    t.ramp[i] = (z + 1) / 2;
    t.order[i] = i / count;
  }
  return t;
}

/** Flowing sine path across the width. Ramp = progress along the path. */
export function threadTarget(count: number, area: Area): TargetSet {
  const t = makeSet(count);
  for (let i = 0; i < count; i++) {
    const u = i / count;
    const x = (u - 0.5) * area.w * 1.05;
    const y =
      Math.sin(u * 6.5) * area.h * 0.18 +
      Math.sin(u * 17 + rand(i) * 6.28) * area.h * 0.03 +
      (rand(i + 3e4) - 0.5) * area.h * 0.05;
    t.positions[i * 3] = x;
    t.positions[i * 3 + 1] = y;
    t.positions[i * 3 + 2] = (rand(i + 7e4) - 0.5) * 0.4;
    t.ramp[i] = u;
    t.order[i] = u;
  }
  return t;
}

/** Ordered grid filling ~84% x 72% of the area. Ramp = column position. */
export function latticeTarget(count: number, area: Area): TargetSet {
  const t = makeSet(count);
  const cols = Math.max(2, Math.ceil(Math.sqrt((count * area.w) / area.h)));
  const rows = Math.max(2, Math.ceil(count / cols));
  for (let i = 0; i < count; i++) {
    const cx = i % cols, cy = Math.floor(i / cols);
    t.positions[i * 3] = (cx / (cols - 1) - 0.5) * area.w * 0.84;
    t.positions[i * 3 + 1] = (Math.min(cy, rows - 1) / (rows - 1) - 0.5) * area.h * 0.72;
    t.positions[i * 3 + 2] = 0;
    t.ramp[i] = cx / (cols - 1);
    t.order[i] = i / count;
  }
  return t;
}

/** 4 gaussian-ish clusters (one per project). Ramp = cluster id. */
export function constellationTarget(count: number, area: Area): TargetSet {
  const t = makeSet(count);
  const centers: Array<[number, number]> = [
    [-0.3 * area.w, 0.22 * area.h],
    [0.28 * area.w, 0.3 * area.h],
    [-0.22 * area.w, -0.26 * area.h],
    [0.32 * area.w, -0.2 * area.h],
  ];
  const spread = Math.min(area.w, area.h) * 0.12;
  for (let i = 0; i < count; i++) {
    const c = i % 4;
    const [cx, cy] = centers[c];
    // sum of two rands ≈ triangular distribution (denser center)
    const ox = (rand(i) + rand(i + 1e4) - 1) * spread * 1.6;
    const oy = (rand(i + 2e4) + rand(i + 3e4) - 1) * spread * 1.6;
    t.positions[i * 3] = cx + ox;
    t.positions[i * 3 + 1] = cy + oy;
    t.positions[i * 3 + 2] = (rand(i + 8e4) - 0.5) * 0.6;
    t.ramp[i] = c / 3;
    t.order[i] = i / count;
  }
  return t;
}

/** Circle band. Ramp = vertical position around the ring. */
export function ringTarget(count: number, area: Area): TargetSet {
  const t = makeSet(count);
  const R = Math.min(area.w, area.h) * 0.32;
  for (let i = 0; i < count; i++) {
    const ang = (i / count) * Math.PI * 2;
    const r = R * (1 + (rand(i) - 0.5) * 0.12);
    t.positions[i * 3] = Math.cos(ang) * r;
    t.positions[i * 3 + 1] = Math.sin(ang) * r * 0.96;
    t.positions[i * 3 + 2] = (rand(i + 6e4) - 0.5) * 0.3;
    t.ramp[i] = (Math.sin(ang) + 1) / 2;
    t.order[i] = i / count;
  }
  return t;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: all PASS. Also run `npm run lint && npx tsc --noEmit` — clean.

- [ ] **Step 6: CHECKPOINT — report to user (no commit)**

---

### Task 3: ParticleCanvas — persistent morphing scene

**Files:**
- Create: `src/components/ParticleCanvas.tsx`
- Modify: `src/app/page.tsx` (mount canvas behind content)

**Interfaces:**
- Consumes: all generators from `src/lib/particles/targets.ts` (Task 2 signatures).
- Produces:
  - `<ParticleCanvas />` — self-contained client component; renders `<div aria-hidden style={{position:'fixed', inset:0, zIndex:0}}>`.
  - Listens for `window` CustomEvent **`'preloader:done'`** → runs the write-in (`uWrite` 0→1). If the event never fires within 2.5s of mount (preloader skipped), it self-starts.
  - Creates its own ScrollTriggers on `#about`, `#experience`, `#skills`, `#work`, `#contact` (start `'top 55%'`) morphing to forms 1–5; leaving a section upward morphs back.
  - Sets `document.body.classList.add('no-webgl')` when WebGL is unavailable.

- [ ] **Step 1: Implement `src/components/ParticleCanvas.tsx`**

```tsx
'use client';

import { useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap, registerGsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion';
import {
  textToPoints, nameTarget, globeTarget, threadTarget,
  latticeTarget, constellationTarget, ringTarget,
  type Area, type TargetSet,
} from '@/lib/particles/targets';

const FORMS = ['name', 'globe', 'thread', 'lattice', 'constellation', 'ring'] as const;
const SECTION_FOR_FORM: Record<number, string> = {
  1: '#about', 2: '#experience', 3: '#skills', 4: '#work', 5: '#contact',
};

const vertexShader = /* glsl */ `
  attribute vec3 aTargetA;
  attribute vec3 aTargetB;
  attribute float aRampA;
  attribute float aRampB;
  attribute float aOrder;
  attribute float aSeed;
  attribute float aScale;
  uniform float uMix;
  uniform float uTime;
  uniform float uWrite;
  uniform float uSize;
  uniform vec2 uMouse;
  uniform float uMouseR;
  uniform vec2 uArea;
  varying float vRamp;
  varying float vAlpha;

  float easeInOut(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  void main() {
    // staggered morph: each particle starts at a slightly different time
    float m = easeInOut(clamp(uMix * 1.35 - aSeed * 0.35, 0.0, 1.0));
    vec3 pos = mix(aTargetA, aTargetB, m);

    // swirl during transit
    float sw = sin(m * 3.14159);
    pos.x += sin(aSeed * 40.0 + uTime * 0.8) * sw * uArea.x * 0.03;
    pos.y += cos(aSeed * 36.0 + uTime * 0.7) * sw * uArea.y * 0.03;

    // ambient dust for not-yet-written particles (hero write-in)
    vec3 dust = vec3(
      sin(uTime * 0.35 + aSeed * 70.0) * uArea.x * 0.42 * (aSeed - 0.5) * 2.0,
      cos(uTime * 0.28 + aSeed * 119.0) * uArea.y * 0.36 * (fract(aSeed * 7.31) - 0.5) * 2.0,
      0.0
    );
    float written = smoothstep(aOrder - 0.02, aOrder + 0.02, uWrite);
    pos = mix(dust, pos, written);

    // idle breathing
    pos.x += sin(uTime * 0.6 + aSeed * 31.0) * 0.03;
    pos.y += cos(uTime * 0.5 + aSeed * 57.0) * 0.03;

    // cursor repulsion (world space, z=0 plane)
    vec2 d = pos.xy - uMouse;
    float dist = length(d);
    float f = smoothstep(uMouseR, 0.0, dist);
    pos.xy += (d / max(dist, 0.0001)) * f * uArea.y * 0.06;

    vRamp = mix(aRampA, aRampB, m);
    vAlpha = 0.35 + fract(aSeed * 13.7) * 0.65;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * (14.0 / -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uC1;
  uniform vec3 uC2;
  uniform vec3 uC3;
  uniform float uOpacity;
  varying float vRamp;
  varying float vAlpha;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.12, d);
    vec3 color = vRamp < 0.5
      ? mix(uC1, uC2, vRamp * 2.0)
      : mix(uC2, uC3, (vRamp - 0.5) * 2.0);
    gl_FragColor = vec4(color, a * vAlpha * uOpacity);
  }
`;

function readRamp(): [THREE.Color, THREE.Color, THREE.Color] {
  const cs = getComputedStyle(document.documentElement);
  return [
    new THREE.Color(cs.getPropertyValue('--p1').trim() || '#ff7a34'),
    new THREE.Color(cs.getPropertyValue('--p2').trim() || '#ffb26b'),
    new THREE.Color(cs.getPropertyValue('--p3').trim() || '#ffd9a8'),
  ];
}

function isDarkTheme(): boolean {
  return document.documentElement.classList.contains('dark');
}

/** Render "SAFA SELIM" to an offscreen canvas and sample it. */
function sampleName(count: number, area: Area): TargetSet {
  const W = 900, H = 300;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  if (!g) return nameTarget([], W, H, count, area);
  let size = 100;
  g.font = `400 ${size}px ${getComputedStyle(document.body).getPropertyValue('--font-display') || 'Arial Black'}`;
  const ratio = g.measureText('SAFA SELIM').width / size;
  size = Math.min((W * 0.94) / ratio, H * 0.7);
  g.font = `400 ${size}px ${getComputedStyle(document.body).getPropertyValue('--font-display') || 'Arial Black'}`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('SAFA SELIM', W / 2, H / 2);
  const grid = { width: W, height: H, data: g.getImageData(0, 0, W, H).data };
  const step = Math.max(2, Math.round(size / 52));
  return nameTarget(textToPoints(grid, step), W, H, count, area);
}

function buildTargets(count: number, area: Area): TargetSet[] {
  return [
    sampleName(count, area),
    globeTarget(count, area),
    threadTarget(count, area),
    latticeTarget(count, area),
    constellationTarget(count, area),
    ringTarget(count, area),
  ];
}

function Particles({ reduced }: { reduced: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useRef<THREE.BufferGeometry>(null);
  const { viewport, size } = useThree();
  const formRef = useRef(0);
  const targetsRef = useRef<TargetSet[]>([]);
  const mouse = useRef(new THREE.Vector2(-999, -999));

  const isMobile = size.width < 768 || window.matchMedia('(pointer: coarse)').matches;
  const count = isMobile ? 5000 : 14000;

  const seeds = useMemo(() => {
    const a = new Float32Array(count);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = Math.sin(i * 127.1 + 311.7) * 43758.5453;
      a[i] = r - Math.floor(r);
      const r2 = Math.sin(i * 269.5 + 183.3) * 43758.5453;
      s[i] = 0.5 + (r2 - Math.floor(r2));
    }
    return { seed: a, scale: s };
  }, [count]);

  const uniforms = useMemo(() => {
    const [c1, c2, c3] = [new THREE.Color('#ff7a34'), new THREE.Color('#ffb26b'), new THREE.Color('#ffd9a8')];
    return {
      uMix: { value: 1 },
      uTime: { value: 0 },
      uWrite: { value: 0 },
      uSize: { value: isMobile ? 30 : 26 },
      uMouse: { value: new THREE.Vector2(-999, -999) },
      uMouseR: { value: 0 },
      uArea: { value: new THREE.Vector2(10, 6) },
      uC1: { value: c1 },
      uC2: { value: c2 },
      uC3: { value: c3 },
      uOpacity: { value: 0.9 },
    };
  }, [isMobile]);

  /** (Re)generate all target sets and (re)fill attributes for the current form. */
  const rebuild = () => {
    const area: Area = { w: viewport.width, h: viewport.height };
    uniforms.uArea.value.set(area.w, area.h);
    targetsRef.current = buildTargets(count, area);
    const g = geo.current;
    if (!g) return;
    const t = targetsRef.current[formRef.current];
    (g.getAttribute('aTargetA') as THREE.BufferAttribute).copyArray(t.positions).needsUpdate = true;
    (g.getAttribute('aTargetB') as THREE.BufferAttribute).copyArray(t.positions).needsUpdate = true;
    (g.getAttribute('aRampA') as THREE.BufferAttribute).copyArray(t.ramp).needsUpdate = true;
    (g.getAttribute('aRampB') as THREE.BufferAttribute).copyArray(t.ramp).needsUpdate = true;
    (g.getAttribute('aOrder') as THREE.BufferAttribute).copyArray(t.order).needsUpdate = true;
  };

  /** Swap targetB → targetA, load form `next` into B, tween uMix. */
  const morphTo = (next: number) => {
    if (next === formRef.current || !targetsRef.current.length) return;
    const g = geo.current;
    if (!g) return;
    const from = targetsRef.current[formRef.current];
    const to = targetsRef.current[next];
    formRef.current = next;
    (g.getAttribute('aTargetA') as THREE.BufferAttribute).copyArray(from.positions).needsUpdate = true;
    (g.getAttribute('aRampA') as THREE.BufferAttribute).copyArray(from.ramp).needsUpdate = true;
    (g.getAttribute('aTargetB') as THREE.BufferAttribute).copyArray(to.positions).needsUpdate = true;
    (g.getAttribute('aRampB') as THREE.BufferAttribute).copyArray(to.ramp).needsUpdate = true;
    (g.getAttribute('aOrder') as THREE.BufferAttribute).copyArray(to.order).needsUpdate = true;
    if (reduced) {
      uniforms.uMix.value = 1;
    } else {
      uniforms.uMix.value = 0;
      gsap.to(uniforms.uMix, { value: 1, duration: 1.5, ease: 'expo.inOut', overwrite: true });
    }
  };

  // boot: build targets, wire write-in + scroll triggers + theme + pointer
  useEffect(() => {
    registerGsap();
    rebuild();

    const applyTheme = () => {
      const [c1, c2, c3] = readRamp();
      uniforms.uC1.value.copy(c1);
      uniforms.uC2.value.copy(c2);
      uniforms.uC3.value.copy(c3);
      if (mat.current) {
        mat.current.blending = isDarkTheme() ? THREE.AdditiveBlending : THREE.NormalBlending;
        mat.current.needsUpdate = true;
      }
      uniforms.uOpacity.value = isDarkTheme() ? 0.9 : 0.8;
    };
    applyTheme();
    const mo = new MutationObserver(applyTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    let started = false;
    const startWrite = () => {
      if (started) return;
      started = true;
      if (reduced) {
        uniforms.uWrite.value = 1;
      } else {
        gsap.to(uniforms.uWrite, { value: 1, duration: 1.9, ease: 'power2.inOut', delay: 0.15 });
      }
    };
    window.addEventListener('preloader:done', startWrite);
    const fallback = window.setTimeout(startWrite, 2500);

    const triggers: ScrollTrigger[] = [];
    Object.entries(SECTION_FOR_FORM).forEach(([formIdx, sel]) => {
      const el = document.querySelector(sel);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          onEnter: () => morphTo(Number(formIdx)),
          onLeaveBack: () => morphTo(Number(formIdx) - 1),
        })
      );
    });

    const onMove = (e: PointerEvent) => {
      mouse.current.set(
        ((e.clientX / window.innerWidth) * 2 - 1) * (uniforms.uArea.value.x / 2),
        (-(e.clientY / window.innerHeight) * 2 + 1) * (uniforms.uArea.value.y / 2)
      );
    };
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (!reduced && !coarse) {
      uniforms.uMouseR.value = 1.1;
      window.addEventListener('pointermove', onMove);
    }

    return () => {
      window.removeEventListener('preloader:done', startWrite);
      window.removeEventListener('pointermove', onMove);
      window.clearTimeout(fallback);
      triggers.forEach((t) => t.kill());
      mo.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, reduced]);

  // regenerate targets when the world viewport resizes (debounced)
  const lastSize = useRef({ w: 0, h: 0 });
  useEffect(() => {
    if (
      Math.abs(viewport.width - lastSize.current.w) > 0.01 ||
      Math.abs(viewport.height - lastSize.current.h) > 0.01
    ) {
      lastSize.current = { w: viewport.width, h: viewport.height };
      rebuild();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewport.width, viewport.height]);

  useFrame((_, delta) => {
    if (!reduced) uniforms.uTime.value += Math.min(delta, 0.05);
    (uniforms.uMouse.value as THREE.Vector2).lerp(mouse.current, 0.08);
  });

  const zeros = useMemo(() => new Float32Array(count * 3), [count]);
  const zeros1 = useMemo(() => new Float32Array(count), [count]);

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[zeros, 3]} />
        <bufferAttribute attach="attributes-aTargetA" args={[zeros.slice(), 3]} />
        <bufferAttribute attach="attributes-aTargetB" args={[zeros.slice(), 3]} />
        <bufferAttribute attach="attributes-aRampA" args={[zeros1.slice(), 1]} />
        <bufferAttribute attach="attributes-aRampB" args={[zeros1.slice(), 1]} />
        <bufferAttribute attach="attributes-aOrder" args={[zeros1.slice(), 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds.seed, 1]} />
        <bufferAttribute attach="attributes-aScale" args={[seeds.scale, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

function ParticleCanvasInner() {
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const test = document.createElement('canvas');
    const gl = test.getContext('webgl2') || test.getContext('webgl');
    if (!gl) document.body.classList.add('no-webgl');
  }, []);

  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <Particles reduced={reduced} />
      </Canvas>
    </div>
  );
}

const ParticleCanvas = dynamic(() => Promise.resolve(ParticleCanvasInner), { ssr: false });
export default ParticleCanvas;
```

Note for the implementer: with fov 50 and camera z=9, `viewport.width/height` from `useThree` are the world-space dimensions at z=0 — the same `Area` units the generators expect. `gl_PointSize`'s `14.0 / -mv.z` ≈ 1.55px per `uSize` unit at that depth before `aScale`.

- [ ] **Step 2: Mount behind content in `src/app/page.tsx`**

```tsx
import ParticleCanvas from '@/components/ParticleCanvas';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Experience } from '@/components/Experience';
import { Skills } from '@/components/Skills';
import { Projects } from '@/components/Projects';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <>
      <ParticleCanvas />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

(`<Marquee />` moves inside Hero in Task 6; until then the import removal is fine because Hero still renders without it.) Old sections keep their ids, so morph triggers work immediately.

- [ ] **Step 3: Verify in browser**

Run `npm run dev`, open http://localhost:3000:
- Particles visible behind the old sections; after ≤2.5s the name writes in (event fallback).
- Scrolling into About/Experience/Skills/Work/Contact morphs forms; scrolling back reverses.
- Toggle theme → ramp + blending change. No console errors.
- IMPORTANT: old sections have opaque `var(--bg-deep)` backgrounds that hide the canvas — that's expected until Tasks 7–11 make sections transparent.

Run: `npm run lint && npx tsc --noEmit && npm run build`
Expected: clean.

- [ ] **Step 4: CHECKPOINT — report to user (no commit)**

---

### Task 4: Preloader

**Files:**
- Create: `src/components/Preloader.tsx`
- Modify: `src/app/layout.tsx` (render `<Preloader />` inside ThemeProvider, before SmoothScrollProvider)

**Interfaces:**
- Produces: fires `window.dispatchEvent(new CustomEvent('preloader:done'))` exactly once when the overlay finishes (or immediately when skipped). Consumed by ParticleCanvas (Task 3) and Hero (Task 6).
- Session flag: `sessionStorage['ss-preloaded'] = '1'` → subsequent loads skip the overlay.

- [ ] **Step 1: Implement `src/components/Preloader.tsx`**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/motion';

export function Preloader() {
  const [show, setShow] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const done = () => {
      sessionStorage.setItem('ss-preloaded', '1');
      window.dispatchEvent(new CustomEvent('preloader:done'));
    };

    if (sessionStorage.getItem('ss-preloaded') || prefersReducedMotion()) {
      done();
      return;
    }

    setShow(true);
    document.documentElement.style.overflow = 'hidden';

    const obj = { n: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = '';
        done();
        setShow(false);
      },
    });
    tl.to(obj, {
      n: 100,
      duration: 1.1,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (numRef.current) numRef.current.textContent = String(Math.round(obj.n)).padStart(3, '0');
      },
    });
    tl.to(rootRef.current, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '+=0.1');

    return () => {
      tl.kill();
      document.documentElement.style.overflow = '';
    };
  }, []);

  if (!show) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'var(--bg)', display: 'flex',
        alignItems: 'flex-end', justifyContent: 'space-between',
        padding: 'clamp(1.5rem, 4vw, 3rem)',
      }}
    >
      <span className="mono-label">SAFA SELIM — PORTFOLIO</span>
      <span
        ref={numRef}
        className="display-xl"
        style={{ fontSize: 'clamp(4rem, 14vw, 11rem)', color: 'var(--fg)' }}
      >
        000
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Mount in `src/app/layout.tsx`**

Inside `<ThemeProvider>` add `<Preloader />` as the first child (before `<Grain />`). Import: `import { Preloader } from '@/components/Preloader';`

- [ ] **Step 3: Verify**

Dev server, fresh tab (or clear sessionStorage): counter 000→100, overlay wipes up, name write-in starts right after (event now drives it instead of the 2.5s fallback). Reload: no preloader, particles boot immediately. `npm run lint && npx tsc --noEmit` clean.

- [ ] **Step 4: CHECKPOINT — report to user (no commit)**

---

### Task 5: Navbar + fullscreen MenuOverlay

**Files:**
- Create: `src/components/MenuOverlay.tsx`
- Rewrite: `src/components/Navbar.tsx`

**Interfaces:**
- Consumes: `useLenis()` from SmoothScrollProvider, `useMagnetic`, next-themes `useTheme`.
- Produces: `<Navbar />` (renders MenuOverlay internally). Menu links: Work `#work`, Experience `#experience`, About `#about`, Contact `#contact`.

- [ ] **Step 1: Implement `src/components/MenuOverlay.tsx`**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/motion';
import { useLenis } from '@/components/SmoothScrollProvider';

const LINKS = [
  { label: 'Work', href: '#work', index: '01' },
  { label: 'Experience', href: '#experience', index: '02' },
  { label: 'About', href: '#about', index: '03' },
  { label: 'Contact', href: '#contact', index: '04' },
];

export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const { scrollTo } = useLenis();

  // enter/exit animation
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.transform = open ? 'translateY(0%)' : 'translateY(-100%)';
      return;
    }
    if (open) {
      gsap.to(el, { yPercent: 100, duration: 0.7, ease: 'power4.inOut' });
      gsap.fromTo(
        el.querySelectorAll('.menu-link'),
        { yPercent: 110 },
        { yPercent: 0, duration: 0.8, stagger: 0.07, delay: 0.25, ease: 'power4.out' }
      );
    } else {
      gsap.to(el, { yPercent: 0, duration: 0.6, ease: 'power4.inOut' });
    }
  }, [open]);

  // esc close + focus trap
  useEffect(() => {
    if (!open) return;
    const el = root.current;
    const focusables = el?.querySelectorAll<HTMLElement>('a, button');
    focusables?.[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && focusables && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      style={{
        position: 'fixed', inset: 0, zIndex: 90,
        transform: 'translateY(-100%)',
        background: 'var(--bg)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <nav className="container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {LINKS.map((l) => (
          <div key={l.href} className="line-mask">
            <a
              className="menu-link display-xl"
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                onClose();
                scrollTo(l.href, { offset: -10 });
              }}
              style={{
                display: 'flex', alignItems: 'baseline', gap: '1.2rem',
                fontSize: 'clamp(2.6rem, 9vw, 7rem)', color: 'var(--fg)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg)'; }}
            >
              <span className="mono-label" style={{ color: 'var(--accent)' }}>{l.index}</span>
              {l.label}
            </a>
          </div>
        ))}
      </nav>
      <div className="container" style={{ marginTop: '3rem', display: 'flex', gap: '2rem' }}>
        <a className="mono-label" href="https://github.com/SafaSelim" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        <a className="mono-label" href="https://linkedin.com/in/safaselim" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
      </div>
      <button
        onClick={onClose}
        aria-label="Close menu"
        className="mono-label"
        style={{
          position: 'absolute', top: '1.4rem', right: 'clamp(1.25rem, 5vw, 4rem)',
          background: 'none', border: '1px solid var(--line-strong)', borderRadius: '100px',
          padding: '0.6rem 1.2rem', cursor: 'pointer', color: 'var(--fg)',
        }}
      >
        Close ×
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `src/components/Navbar.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { MenuOverlay } from '@/components/MenuOverlay';
import { useLenis } from '@/components/SmoothScrollProvider';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { scrollTo } = useLenis();

  useEffect(() => setMounted(true), []);

  return (
    <>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.1rem clamp(1.25rem, 5vw, 4rem)',
          mixBlendMode: open ? 'normal' : undefined,
        }}
      >
        <a
          href="#top"
          className="mono-label"
          style={{ color: 'var(--fg)', fontWeight: 600 }}
          onClick={(e) => { e.preventDefault(); setOpen(false); scrollTo(0 as unknown as string); }}
        >
          SS — 2026
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="nav-pill"
          >
            {mounted && (resolvedTheme === 'dark' ? <Sun size={14} /> : <Moon size={14} />)}
          </button>
          <button
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className="nav-pill mono-label"
            style={{ color: 'var(--fg)' }}
          >
            {open ? 'Close ×' : 'Menu +'}
          </button>
        </div>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
      <style>{`
        .nav-pill {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: color-mix(in srgb, var(--bg) 65%, transparent);
          backdrop-filter: blur(10px);
          border: 1px solid var(--line-strong); border-radius: 100px;
          padding: 0.55rem 1.1rem; cursor: pointer; color: var(--fg);
          transition: border-color .3s var(--ease-out), color .3s var(--ease-out);
        }
        .nav-pill:hover { border-color: var(--accent); color: var(--accent); }
      `}</style>
    </>
  );
}
```

Note: `scrollTo(0 as unknown as string)` — Lenis accepts a number; the context type allows `string | number | HTMLElement` already, so just call `scrollTo(0)` if TS allows (it does — check the `LenisContextValue` type; use plain `scrollTo(0)`).

- [ ] **Step 3: Verify**

Dev server: menu opens/closes with animation, Esc closes, focus trapped, links scroll to sections, theme toggle works without hydration warnings. `npm run lint && npx tsc --noEmit` clean.

- [ ] **Step 4: CHECKPOINT — report to user (no commit)**

---

### Task 6: Hero rebuild

**Files:**
- Rewrite: `src/components/Hero.tsx`
- Modify: `src/components/Marquee.tsx` (invert strip styling; content unchanged)

**Interfaces:**
- Consumes: `'preloader:done'` event (reveals copy after the particle name writes), `useLenis`, `useMagnetic`, `gsap/SplitText` via `@/lib/motion`.
- Produces: `<Hero />` — `<section id="top">`, transparent background (canvas shows through), Marquee rendered at its bottom.

The particle canvas draws the name in the **upper ~60%** of the viewport (targets are centered at world origin ≈ viewport center); the HTML copy sits in the lower third so they don't collide.

- [ ] **Step 1: Rewrite `src/components/Hero.tsx`**

```tsx
'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowDownRight, Github, Linkedin } from 'lucide-react';
import { gsap, registerGsap, SplitText, prefersReducedMotion } from '@/lib/motion';
import { useLenis } from '@/components/SmoothScrollProvider';
import { useMagnetic } from '@/hooks/useMagnetic';
import { Marquee } from '@/components/Marquee';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { scrollTo } = useLenis();
  const ctaPrimary = useMagnetic<HTMLAnchorElement>(0.35);
  const ctaGhost = useMagnetic<HTMLAnchorElement>(0.35);

  useIsoLayoutEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll('.will-reveal'), { opacity: 1, y: 0 });
      return;
    }

    gsap.set(el.querySelectorAll('.will-reveal'), { opacity: 0 });

    let played = false;
    const splits: SplitText[] = [];
    const play = () => {
      if (played) return;
      played = true;
      const tl = gsap.timeline({ delay: 1.2, defaults: { ease: 'power4.out' } }); // after name write-in
      el.querySelectorAll<HTMLElement>('[data-split="lines"]').forEach((node) => {
        gsap.set(node, { opacity: 1 });
        const split = new SplitText(node, { type: 'lines', linesClass: 'split-line', mask: 'lines' });
        splits.push(split);
        gsap.set(split.lines, { yPercent: 115 });
        tl.to(split.lines, { yPercent: 0, duration: 1.1, stagger: 0.08 }, '<0.1');
      });
      tl.to('[data-fade]', { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, '-=0.6');
    };
    gsap.set(el.querySelectorAll('[data-fade]'), { y: 24 });
    window.addEventListener('preloader:done', play);
    const fallback = window.setTimeout(play, 3200);

    // copy drifts up + fades as you scroll away
    const drift = gsap.to('.hero-copy', {
      yPercent: 14,
      opacity: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    });

    return () => {
      window.removeEventListener('preloader:done', play);
      window.clearTimeout(fallback);
      splits.forEach((s) => s.revert());
      drift.scrollTrigger?.kill();
      drift.kill();
    };
  }, []);

  return (
    <section
      id="top"
      ref={root}
      style={{
        position: 'relative', minHeight: '100svh',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}
    >
      <div className="container hero-copy" style={{ paddingBottom: '2.5rem' }}>
        <div
          className="will-reveal"
          data-fade
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}
        >
          <span
            aria-hidden
            style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--accent)', boxShadow: '0 0 0 4px var(--accent-soft)',
            }}
          />
          <span className="eyebrow">Senior Frontend Engineer — Istanbul / Europe</span>
        </div>

        <h1 className="sr-only">Safa Selim — Senior Frontend Engineer</h1>

        <p
          data-split="lines"
          className="display-lg will-reveal"
          style={{ fontSize: 'clamp(1.6rem, 4.2vw, 3.4rem)', maxWidth: '18ch', color: 'var(--fg)' }}
        >
          Building enterprise-scale web &amp; mobile platforms<span style={{ color: 'var(--accent)' }}>.</span>
        </p>

        <div
          className="will-reveal"
          data-fade
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginTop: '2.2rem' }}
        >
          <a
            ref={ctaPrimary}
            href="#work"
            onClick={(e) => { e.preventDefault(); scrollTo('#work', { offset: -10 }); }}
            className="btn btn-primary"
          >
            View selected work <ArrowDownRight size={18} />
          </a>
          <a
            ref={ctaGhost}
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollTo('#contact', { offset: -10 }); }}
            className="btn btn-ghost"
          >
            Get in touch
          </a>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <a href="https://github.com/SafaSelim" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hero-social"><Github size={17} /></a>
            <a href="https://linkedin.com/in/safaselim" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hero-social"><Linkedin size={17} /></a>
          </div>
        </div>

        <div
          className="will-reveal"
          data-fade
          style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: '2.4rem', paddingTop: '1rem', borderTop: '1px solid var(--line)',
          }}
        >
          <span className="mono-label">Scroll ↓</span>
          <span className="mono-label">00 / 05</span>
        </div>
      </div>

      <Marquee />

      <style>{`
        .split-line { display: block; will-change: transform; }
        .hero-social {
          display: inline-flex; align-items: center; justify-content: center;
          width: 2.9rem; height: 2.9rem; border-radius: 50%;
          border: 1px solid var(--line-strong); color: var(--fg);
          transition: color .3s ease, border-color .3s ease;
        }
        .hero-social:hover { color: var(--accent); border-color: var(--accent); }
        .sr-only {
          position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
        }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 2: Invert the Marquee strip**

In `src/components/Marquee.tsx`, change the outer wrapper (lines 81–88) to the inverted band and the item styling (lines 24–33) to mono uppercase:

Outer div style becomes: `{ background: 'var(--fg)', color: 'var(--bg)', padding: '0.9rem 0' }` (drop the borders).
Item `<span>` style becomes: `fontFamily: 'var(--font-mono)'`, `fontSize: 'clamp(0.8rem, 1.6vw, 1rem)'`, `fontWeight: 500`, `letterSpacing: '0.14em'`, `textTransform: 'uppercase' as const`, `color: 'inherit'`, keep the gap/inline-flex. Separator `✦` color stays `var(--accent)`. Items array and animation logic unchanged.

- [ ] **Step 3: Verify**

Dev server: hero shows particle name mid-screen with copy pinned to lower third; copy reveals ~1.2s after preloader finishes; marquee is an inverted strip at hero bottom; mobile (375px) — no overlap between particle name and copy (name sits above the copy block), no horizontal scroll. `npm run lint && npx tsc --noEmit` clean.

- [ ] **Step 4: CHECKPOINT — report to user (no commit)**

---

### Task 7: About rebuild

**Files:**
- Rewrite: `src/components/About.tsx` (keep `stats` array and `Counter` component verbatim, lines 7–45)

**Interfaces:**
- Consumes: `useReveal` hook, existing `Counter` pattern.
- Produces: `<section id="about">`, transparent background.

- [ ] **Step 1: Rewrite the render (keep Counter + stats as-is)**

Layout: right-aligned copy block (~55% width, `marginLeft: auto`) so the particle globe (canvas center) reads on the left; stats become a 4-up hairline row full-width below.

```tsx
export function About() {
  const ref = useReveal<HTMLDivElement>('.will-reveal', { stagger: 0.1 });

  return (
    <section id="about" className="section-pad">
      <div ref={ref} className="container">
        <span className="section-index will-reveal" style={{ display: 'block', marginBottom: '2rem' }}>
          01 — About
        </span>

        <div className="about-copy will-reveal">
          <p
            className="display-lg"
            style={{ fontSize: 'clamp(1.5rem, 3.4vw, 2.9rem)', color: 'var(--fg)' }}
          >
            I turn sprawling enterprise codebases into{' '}
            <span className="italic-accent">structured, scalable</span> systems.
          </p>
          <p style={{ color: 'var(--fg-soft)', lineHeight: 1.75, marginTop: '1.5rem', maxWidth: '52ch' }}>
            For 6+ years I&apos;ve shipped performance-critical platforms across European markets —
            from lifting a 25-domain e-commerce site off legacy JSP to standardizing design systems
            in Storybook and securing apps with Keycloak. I specialize in Angular, NGRX, and monorepo
            architecture, and own release management across multi-application environments.
          </p>
          <ul style={{ listStyle: 'none', display: 'grid', gap: '0.6rem', marginTop: '1.5rem' }}>
            {[
              'Angular v4 → v19 across the full release timeline',
              'Monorepo architecture & shared component libraries',
              'NGRX state management at enterprise scale',
              'Release management for multi-app environments',
            ].map((t) => (
              <li key={t} style={{ display: 'flex', gap: '0.7rem', fontSize: '0.92rem', color: 'var(--fg-soft)' }}>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>↳</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="stats-grid will-reveal">
          {stats.map((s) => (
            <div key={s.label} style={{ borderTop: '1px solid var(--line-strong)', paddingTop: '1.1rem' }}>
              <div className="display-xl" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', color: 'var(--fg)' }}>
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mono-label" style={{ marginTop: '0.5rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .about-copy { max-width: 56%; margin-left: auto; }
        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem; margin-top: clamp(4rem, 9vw, 7rem);
        }
        @media (max-width: 900px) {
          .about-copy { max-width: 100%; margin-left: 0; padding-top: 42vh; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}
```

(Mobile: `padding-top: 42vh` gives the globe clear space above the copy.)

- [ ] **Step 2: Verify**

Dev server: globe morphs in as About enters; copy on the right (desktop) / below the globe (mobile); counters animate once. `npm run lint && npx tsc --noEmit` clean.

- [ ] **Step 3: CHECKPOINT — report to user (no commit)**

---

### Task 8: Experience rebuild

**Files:**
- Rewrite: `src/components/Experience.tsx` (keep `experiences` array verbatim, lines 7–90)

**Interfaces:**
- Produces: `<section id="experience">`, transparent background, giant type rows with focus dimming + expandable detail.

- [ ] **Step 1: Rewrite render**

Giant rows (company + period), dimmed by default; the row nearest viewport center gets `.is-active` (full opacity + expanded detail) driven by a ScrollTrigger per row. Details show role, description, impact list, tags — same data.

```tsx
export function Experience() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.querySelectorAll('.xp-row').forEach((r) => r.classList.add('is-active'));
      return;
    }
    const triggers: ScrollTrigger[] = [];
    el.querySelectorAll<HTMLElement>('.xp-row').forEach((row) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: row,
          start: 'top 62%',
          end: 'bottom 38%',
          onToggle: (self) => row.classList.toggle('is-active', self.isActive),
        })
      );
      gsap.from(row, {
        y: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: row, start: 'top 85%' },
      });
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section id="experience" className="section-pad">
      <div ref={root} className="container">
        <span className="section-index" style={{ display: 'block', marginBottom: '1rem' }}>02 — Experience</span>
        <h2 className="section-title" style={{ marginBottom: 'clamp(3rem, 7vw, 5rem)' }}>
          Six years, five teams<span style={{ color: 'var(--accent)' }}>.</span>
        </h2>

        <div>
          {experiences.map((exp) => (
            <article key={exp.company} className="xp-row">
              <div className="xp-head">
                <h3 className="display-lg xp-company">
                  {exp.company}
                  {exp.projectUrl ? (
                    <a href={exp.projectUrl} target="_blank" rel="noopener noreferrer" className="xp-proj">
                      {exp.project} <ArrowUpRight size={16} />
                    </a>
                  ) : (
                    <span className="xp-proj">{exp.project}</span>
                  )}
                </h3>
                <span className="mono-label xp-period">{exp.period}</span>
              </div>
              <div className="xp-detail">
                <p style={{ color: 'var(--fg-soft)', fontWeight: 500 }}>{exp.role}</p>
                <p style={{ color: 'var(--fg-muted)', marginTop: '0.7rem', maxWidth: '60ch', lineHeight: 1.7 }}>
                  {exp.description}
                </p>
                <ul className="xp-impact">
                  {exp.impact.map((it) => <li key={it}>{it}</li>)}
                </ul>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1.1rem' }}>
                  {exp.tech.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .xp-row {
          border-top: 1px solid var(--line);
          padding: clamp(1.4rem, 3vw, 2.2rem) 0;
          opacity: 0.35;
          transition: opacity 0.5s var(--ease-out);
        }
        .xp-row:last-child { border-bottom: 1px solid var(--line); }
        .xp-row.is-active { opacity: 1; }
        .xp-head {
          display: flex; justify-content: space-between; align-items: baseline;
          flex-wrap: wrap; gap: 0.5rem;
        }
        .xp-company {
          font-size: clamp(1.7rem, 5vw, 3.6rem); color: var(--fg);
          display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap;
        }
        .xp-proj {
          font-family: var(--font-mono); font-size: clamp(0.75rem, 1.4vw, 0.95rem);
          letter-spacing: 0.06em; text-transform: none; color: var(--accent);
          display: inline-flex; align-items: center; gap: 0.2rem;
        }
        .xp-detail {
          max-height: 0; opacity: 0; overflow: hidden;
          transition: max-height 0.7s var(--ease-out), opacity 0.6s var(--ease-out), margin-top 0.5s var(--ease-out);
        }
        .xp-row.is-active .xp-detail { max-height: 800px; opacity: 1; margin-top: 1.4rem; }
        .xp-impact { list-style: none; margin-top: 1rem; display: grid; gap: 0.5rem; max-width: 62ch; }
        .xp-impact li {
          position: relative; padding-left: 1.3rem; color: var(--fg-soft);
          font-size: 0.92rem; line-height: 1.55;
        }
        .xp-impact li::before {
          content: '✦'; position: absolute; left: 0; top: 0;
          color: var(--accent); font-size: 0.65rem; line-height: 1.7;
        }
      `}</style>
    </section>
  );
}
```

Imports needed: `useEffect, useRef` from react; `ArrowUpRight` from lucide-react; `gsap, registerGsap, ScrollTrigger, prefersReducedMotion` from `@/lib/motion`. Keep the `experiences` array above the component unchanged.

- [ ] **Step 2: Verify**

Dev server: thread morph plays entering the section; rows dim/undim as they cross viewport center, active row expands; reduced-motion shows all rows expanded. `npm run lint && npx tsc --noEmit` clean.

- [ ] **Step 3: CHECKPOINT — report to user (no commit)**

---

### Task 9: Skills rebuild

**Files:**
- Rewrite: `src/components/Skills.tsx` (keep `groups` and `languages` arrays verbatim, lines 5–57)

**Interfaces:**
- Produces: `<section id="skills">`, typographic wall in three seniority tiers.

- [ ] **Step 1: Rewrite render**

Flatten the groups into three tiers (core / strong / familiar) rendered as one big type wall; keep the full grouped detail below in a compact two-column list; languages row at the end.

```tsx
const tiers = [
  { className: 'tier-1', items: ['Angular v2–v20', 'TypeScript', 'NGRX', 'Monorepo'] },
  { className: 'tier-2', items: ['Storybook', 'Keycloak', 'Ionic', 'SCSS', 'Component-Driven Design'] },
  { className: 'tier-3', items: ['Redux', 'Java', 'MSSQL', 'A/B Testing', 'Agile/Scrum', 'Material UI'] },
];

export function Skills() {
  const ref = useReveal<HTMLDivElement>('.will-reveal', { stagger: 0.08 });

  return (
    <section id="skills" className="section-pad">
      <div ref={ref} className="container">
        <span className="section-index will-reveal" style={{ display: 'block', marginBottom: '1rem' }}>
          03 — Stack
        </span>
        <h2 className="section-title will-reveal" style={{ marginBottom: 'clamp(2.5rem, 6vw, 4rem)' }}>
          The toolkit<span style={{ color: 'var(--accent)' }}>.</span>
        </h2>

        <div className="skill-wall will-reveal" aria-label="Core skills">
          {tiers.map((tier) => (
            <p key={tier.className} className={`display-lg ${tier.className}`}>
              {tier.items.map((it, i) => (
                <span key={it} className="skill-item">
                  {it}
                  {i < tier.items.length - 1 && <span className="skill-sep" aria-hidden> / </span>}
                </span>
              ))}
            </p>
          ))}
        </div>

        <div className="skill-groups will-reveal">
          {groups.map((g) => (
            <div key={g.title}>
              <span className="mono-label" style={{ display: 'block', marginBottom: '0.6rem' }}>{g.title}</span>
              <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{g.items.join(' · ')}</p>
            </div>
          ))}
        </div>

        <div className="lang-row will-reveal">
          <span className="mono-label">Languages</span>
          <p style={{ color: 'var(--fg-soft)', fontSize: '0.95rem' }}>
            {languages.map((l) => `${l.name} (${l.level})`).join(' · ')}
          </p>
        </div>
      </div>

      <style>{`
        .skill-wall p { font-size: clamp(1.5rem, 4.6vw, 3.8rem); color: var(--fg); }
        .skill-wall .tier-2 { opacity: 0.65; }
        .skill-wall .tier-3 { opacity: 0.35; }
        .skill-item { transition: color 0.3s var(--ease-out); }
        .skill-item:hover { color: var(--accent); }
        .skill-sep { color: var(--line-strong); }
        .skill-groups {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 1.6rem 3rem; margin-top: clamp(3rem, 7vw, 5rem);
          border-top: 1px solid var(--line); padding-top: 2rem;
        }
        .lang-row {
          display: flex; gap: 2rem; align-items: baseline;
          border-top: 1px solid var(--line); margin-top: 2rem; padding-top: 1.4rem;
        }
        @media (max-width: 700px) { .skill-groups { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
```

Import `useReveal`; keep `groups`/`languages` arrays.

- [ ] **Step 2: Verify**

Dev server: lattice morph entering; type wall tiers read clearly in both themes; hover turns items accent. `npm run lint && npx tsc --noEmit` clean.

- [ ] **Step 3: CHECKPOINT — report to user (no commit)**

---

### Task 10: Projects rebuild

**Files:**
- Rewrite: `src/components/Projects.tsx` (keep `projects` array verbatim, lines 7–72)

**Interfaces:**
- Produces: `<section id="work">`, editorial index rows; desktop hover shows a floating meta card that follows the cursor; touch/mobile shows the detail inline (existing `@media (hover: none)` pattern).

- [ ] **Step 1: Rewrite render**

Keep the current row structure (`.proj-card` grid, hover-expanded `.proj-detail`, `@media (hover:none)` fallback — it's already the right pattern) but restyle to the new system and add the floating preview:

- `.proj-name` becomes `className="display-lg"` with `font-size: clamp(1.9rem, 5.5vw, 4rem)`, uppercase.
- Section header: `section-index` label `04 — Selected Work`, `section-title` `Things I've shipped.` with accent period (replace `italic-accent` spans).
- Remove `background: var(--bg-deep)` from the section (transparent for canvas).
- Add floating preview: one absolutely-positioned card inside the section root that follows the cursor over rows (GSAP quickTo), showing the hovered project's `impact` chips; hidden on `(hover: none)` and reduced-motion.

```tsx
// inside the component, after the existing reveal useEffect:
const previewRef = useRef<HTMLDivElement>(null);
const [preview, setPreview] = useState<string[] | null>(null);

useEffect(() => {
  const el = root.current;
  const card = previewRef.current;
  if (!el || !card) return;
  if (prefersReducedMotion() || window.matchMedia('(hover: none)').matches) return;
  const xTo = gsap.quickTo(card, 'x', { duration: 0.45, ease: 'power3' });
  const yTo = gsap.quickTo(card, 'y', { duration: 0.45, ease: 'power3' });
  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    xTo(e.clientX - r.left + 24);
    yTo(e.clientY - r.top - 40);
  };
  el.addEventListener('pointermove', onMove);
  return () => el.removeEventListener('pointermove', onMove);
}, []);
```

Row JSX gains `onMouseEnter={() => setPreview(p.impact)}` / `onMouseLeave={() => setPreview(null)}`. The floating card:

```tsx
<div
  ref={previewRef}
  aria-hidden
  style={{
    position: 'absolute', top: 0, left: 0, zIndex: 2, pointerEvents: 'none',
    opacity: preview ? 1 : 0, transition: 'opacity 0.25s var(--ease-out)',
    background: 'var(--bg-elev)', border: '1px solid var(--line-strong)',
    borderRadius: '10px', padding: '0.9rem 1.1rem', maxWidth: '240px',
    boxShadow: '0 24px 60px -24px rgba(0,0,0,0.5)',
  }}
>
  {preview?.map((it) => (
    <div key={it} className="mono-label" style={{ color: 'var(--accent)', marginBottom: '0.3rem' }}>{it}</div>
  ))}
</div>
```

Section root needs `position: relative; overflow: hidden`. Keep detail expansion CSS from the old component (`.proj-detail`, hover/focus-within, `@media (hover:none)`) with colors already token-driven.

- [ ] **Step 2: Verify**

Dev server: constellation morph entering; hovering rows floats the meta card by the cursor and expands details; on mobile emulation details are inline, no floating card. External links open. `npm run lint && npx tsc --noEmit` clean.

- [ ] **Step 3: CHECKPOINT — report to user (no commit)**

---

### Task 11: Contact + Footer rebuild

**Files:**
- Rewrite: `src/components/Contact.tsx` (keep `details` array, drop the phone from display if desired — KEEP it, it's current content)
- Rewrite: `src/components/Footer.tsx`

**Interfaces:**
- Produces: `<section id="contact">` with centered "LET'S TALK." headline inside the particle ring; footer with mono micro-labels. No cat-model credit anywhere.

- [ ] **Step 1: Rewrite `Contact.tsx`**

Centered composition (the ring forms around the viewport center): availability line, giant `LET'S TALK.` (SplitText chars reveal — keep existing pattern), magnetic email link that copies to clipboard with a "Copied ✓" flash, then details row (location/phone/email) and socials.

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { gsap, registerGsap, SplitText, prefersReducedMotion } from '@/lib/motion';
import { useMagnetic } from '@/hooks/useMagnetic';

const details = [
  { icon: MapPin, label: 'Based in', value: 'Istanbul, Turkey' },
  { icon: Phone, label: 'Phone', value: '+90 546 195 1456', href: 'tel:+905461951456' },
  { icon: Mail, label: 'Email', value: 'safaselim.ss@gmail.com', href: 'mailto:safaselim.ss@gmail.com' },
];

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const mailRef = useMagnetic<HTMLAnchorElement>(0.25);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const headline = el.querySelector<HTMLElement>('[data-contact-headline]');
      if (headline) {
        const split = new SplitText(headline, { type: 'chars' });
        gsap.from(split.chars, {
          yPercent: 120, opacity: 0, stagger: 0.03, duration: 0.9, ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 65%' },
        });
      }
      gsap.from('.contact-fade', {
        y: 26, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 55%' },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const copyEmail = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navigator.clipboard) return; // fall through to mailto
    e.preventDefault();
    navigator.clipboard.writeText('safaselim.ss@gmail.com').then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <section
      id="contact"
      ref={root}
      className="section-pad"
      style={{
        minHeight: '100svh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', textAlign: 'center', overflow: 'hidden',
      }}
    >
      <div className="container">
        <span className="section-index" style={{ display: 'block', marginBottom: '1.2rem' }}>05 — Contact</span>
        <p className="contact-fade" style={{ color: 'var(--fg-muted)', marginBottom: '1.4rem' }}>
          Available for senior engineering &amp; release-management roles.
        </p>
        <h2 className="display-xl" style={{ fontSize: 'clamp(3rem, 12vw, 10rem)', color: 'var(--fg)' }}>
          <span className="line-mask"><span data-contact-headline>Let&apos;s talk<span style={{ color: 'var(--accent)' }}>.</span></span></span>
        </h2>
        <a
          ref={mailRef}
          href="mailto:safaselim.ss@gmail.com"
          onClick={copyEmail}
          className="contact-fade mono-label"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem',
            fontSize: '0.95rem', color: 'var(--fg)', borderBottom: '1px solid var(--accent)',
            paddingBottom: '0.3rem', letterSpacing: '0.08em',
          }}
        >
          {copied ? 'Copied ✓' : 'safaselim.ss@gmail.com'} <ArrowUpRight size={15} />
        </a>

        <div
          className="contact-fade contact-meta"
          style={{
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
            gap: '2.2rem', marginTop: 'clamp(3rem, 8vw, 5.5rem)',
          }}
        >
          {details.map((d) => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <d.icon size={14} style={{ color: 'var(--accent)' }} />
              {d.href ? (
                <a href={d.href} className="mono-label" style={{ color: 'var(--fg-soft)' }}>{d.value}</a>
              ) : (
                <span className="mono-label" style={{ color: 'var(--fg-soft)' }}>{d.value}</span>
              )}
            </div>
          ))}
          <a href="https://github.com/SafaSelim" target="_blank" rel="noopener noreferrer" className="mono-label" style={{ color: 'var(--fg-soft)' }}><Github size={14} style={{ verticalAlign: '-2px', marginRight: '0.4rem', color: 'var(--accent)' }} />GitHub</a>
          <a href="https://linkedin.com/in/safaselim" target="_blank" rel="noopener noreferrer" className="mono-label" style={{ color: 'var(--fg-soft)' }}><Linkedin size={14} style={{ verticalAlign: '-2px', marginRight: '0.4rem', color: 'var(--accent)' }} />LinkedIn</a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Rewrite `Footer.tsx`**

```tsx
export function Footer() {
  return (
    <footer
      style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid var(--line)',
        padding: '1.2rem clamp(1.25rem, 5vw, 4rem)',
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem',
      }}
    >
      <span className="mono-label">© {new Date().getFullYear()} Safa Selim</span>
      <span className="mono-label">Istanbul / Europe</span>
      <span className="mono-label">Built with Next.js + R3F</span>
    </footer>
  );
}
```

(Plain server component — no `'use client'`. The cat-model CC credit is gone with the model.)

- [ ] **Step 3: Verify**

Dev server: ring forms around the headline; email click copies + flashes "Copied ✓" (and still mailto-fallbacks when clipboard unavailable); details row readable both themes. `npm run lint && npx tsc --noEmit` clean.

- [ ] **Step 4: CHECKPOINT — report to user (no commit)**

---

### Task 12: Cleanup — retire old hero scene & dead code

**Files:**
- Delete: `src/components/HeroScene.tsx`
- Delete: `public/models/an_animated_cat.glb` (and `public/models/` if empty)
- Modify: `package.json` (remove `@react-three/drei` if nothing imports it)
- Modify: `src/app/globals.css` (remove old `.display` rule and any now-unused rules)

- [ ] **Step 1: Verify nothing references the deleted modules**

Run: `grep -rn "HeroScene\|an_animated_cat\|@react-three/drei" src/ package.json`
Expected: only `package.json`'s drei entry and no `src/` hits. If drei is unreferenced: `npm uninstall @react-three/drei`.

- [ ] **Step 2: Delete files, prune CSS**

`rm src/components/HeroScene.tsx public/models/an_animated_cat.glb`. In `globals.css` remove the legacy `.display` block and grep for orphaned classes: `grep -rn "className=\"display\b\|'display'" src/` → should be empty.

- [ ] **Step 3: Full verification**

Run: `npm run lint && npx tsc --noEmit && npm test && npm run build`
Expected: all clean/pass.

- [ ] **Step 4: CHECKPOINT — report to user (no commit)**

---

### Task 13: End-to-end verification (Chrome DevTools protocol)

**Files:** none (verification only; fix regressions found, in place)

- [ ] **Step 1: Production-mode smoke**

Run: `npm run build && npm run start` → http://localhost:3000. Confirm: preloader → name write-in → all 5 morphs → no console errors/warnings, no hydration mismatch, no FOUC.

- [ ] **Step 2: Automated browser checks**

If a Chrome DevTools MCP tool is available in-session, use it. Otherwise run Playwright ad hoc (`npm i -D playwright && npx playwright install chromium`, remove afterwards if user prefers) with a script that:
- loads the page at 1440×900 and 390×844,
- scrolls end-to-end, capturing `console` errors (must be 0),
- asserts `document.documentElement.scrollWidth <= window.innerWidth` (no horizontal overflow) at both sizes,
- measures FPS during a scripted 6s scroll via `requestAnimationFrame` deltas (expect avg ≥ 50 desktop profile),
- screenshots each section in both themes to `\.superpowers/brainstorm/` for the user to review.

- [ ] **Step 3: Manual DevTools checklist (report results to user)**

- Performance trace during full scroll: no long tasks > 50ms sustained; no layout thrash.
- 4× CPU throttle: morphs remain fluid (they're GPU-side).
- Rendering → paint flashing: canvas doesn't force full-page repaints.
- Emulate `prefers-reduced-motion`: static forms, no write-in, everything readable.
- Both themes × light/dark OS setting; theme toggle causes no flash.
- Lighthouse: Performance ≥ 90 (desktop), Accessibility ≥ 95.

- [ ] **Step 4: FINAL CHECKPOINT — present the finished page to the user for review (no commit, no merge)**

---

## Self-review notes

- Spec coverage: tokens/fonts (T1), generators (T2), canvas+morphs+write-in+fallbacks (T3), preloader (T4), nav/menu (T5), hero+marquee (T6), about (T7), experience (T8), skills (T9), projects (T10), contact+footer (T11), cleanup (T12), verification (T13). Spec's "hover pulses lattice particles" (Skills) intentionally simplified to CSS hover accent — the shader has no per-skill spatial mapping; noted as a possible polish item, not in scope.
- All later-task class/util names (`display-xl`, `display-lg`, `section-index`, `mono-label`, `eyebrow`, `tag`, `btn*`, `line-mask`, `will-reveal`) are defined in Task 1 or already exist in `globals.css`.
- Event name `'preloader:done'` consistent across Tasks 3, 4, 6.
- Generator signatures consistent between Tasks 2 and 3.
