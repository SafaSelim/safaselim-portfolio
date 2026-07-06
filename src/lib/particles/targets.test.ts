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
