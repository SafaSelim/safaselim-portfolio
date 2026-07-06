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
  const denom = Math.max(count - 1, 1);
  for (let i = 0; i < count; i++) {
    const y = 1 - (2 * i) / denom;
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
