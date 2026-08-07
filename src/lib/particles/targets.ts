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
    // tight jitter + shallow z keep the letterforms crisp; wider spreads
    // blur the counters of S/A/E at small glyph sizes
    const jx = (rand(i) - 0.5) * scale * 0.7;
    const jy = (rand(i + 5e4) - 0.5) * scale * 0.7;
    t.positions[i * 3] = (px - gridW / 2) * scale + jx;
    t.positions[i * 3 + 1] = -(py - gridH / 2) * scale + jy;
    t.positions[i * 3 + 2] = (rand(i + 2e5) - 0.5) * 0.15;
    const o = i / count; // pts are x-sorted, so index order == write order
    t.order[i] = o;
    t.ramp[i] = o;
  }
  return t;
}

/**
 * Sinuous vertical ribbon along the right edge. Ramp/order = top→bottom progress.
 * Portrait viewports straddle the screen edge (half the band off-canvas) so the
 * full-width text column stays legible; landscape floats just inside it.
 */
export function sideThreadTarget(count: number, area: Area): TargetSet {
  const t = makeSet(count);
  const portrait = area.h > area.w;
  const x0 = area.w * (portrait ? 0.505 : 0.42);
  const amp = area.w * (portrait ? 0.016 : 0.025);
  const jit = area.w * (portrait ? 0.008 : 0.014);
  for (let i = 0; i < count; i++) {
    const u = i / count;
    t.positions[i * 3] = x0 + Math.sin(u * 9 + rand(i) * 0.9) * amp + (rand(i + 4e4) - 0.5) * jit;
    t.positions[i * 3 + 1] = (0.5 - u) * area.h * 1.04;
    t.positions[i * 3 + 2] = (rand(i + 7e4) - 0.5) * 0.4;
    t.ramp[i] = u;
    t.order[i] = u;
  }
  return t;
}

/**
 * Circle band. Ramp = vertical position around the ring.
 * Portrait viewports scale the ring past the screen sides so its arcs frame the
 * centered contact copy from above and below instead of crossing through it.
 * Landscape uses 0.41 of the short axis for the same reason — at 0.32 the ring
 * ran straight through "Let's talk".
 */
export function ringTarget(count: number, area: Area): TargetSet {
  const t = makeSet(count);
  const portrait = area.h > area.w;
  const R = portrait ? Math.max(area.w, area.h) * 0.4 : Math.min(area.w, area.h) * 0.41;
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
