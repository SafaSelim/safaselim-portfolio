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
    gl_PointSize = uSize * aScale * (1.0 / -mv.z);
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
  const t = nameTarget(textToPoints(grid, step), W, H, count, area);
  // shift up so the name sits clear of the hero's HTML copy (lower third)
  for (let i = 0; i < count; i++) t.positions[i * 3 + 1] += area.h * 0.16;
  return t;
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

  const fillPending = useRef(true);

  // buffers are recreated when count changes — request a refill
  useEffect(() => {
    fillPending.current = true;
  }, [count]);

  /** Fill attribute buffers for the current form. No-ops (returns false) until geometry exists. */
  const fillCurrent = () => {
    const g = geo.current;
    if (!g || !targetsRef.current.length) return false;
    const t = targetsRef.current[formRef.current];
    (g.getAttribute('aTargetA') as THREE.BufferAttribute).copyArray(t.positions).needsUpdate = true;
    (g.getAttribute('aTargetB') as THREE.BufferAttribute).copyArray(t.positions).needsUpdate = true;
    (g.getAttribute('aRampA') as THREE.BufferAttribute).copyArray(t.ramp).needsUpdate = true;
    (g.getAttribute('aRampB') as THREE.BufferAttribute).copyArray(t.ramp).needsUpdate = true;
    (g.getAttribute('aOrder') as THREE.BufferAttribute).copyArray(t.order).needsUpdate = true;
    fillPending.current = false;
    return true;
  };

  /** (Re)generate all target sets and (re)fill attributes for the current form. */
  const rebuild = (w = viewport.width, h = viewport.height) => {
    const area: Area = { w, h };
    uniforms.uArea.value.set(area.w, area.h);
    targetsRef.current = buildTargets(count, area);
    fillPending.current = true;
    fillCurrent();
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
      gsap.killTweensOf(uniforms.uWrite);
      gsap.killTweensOf(uniforms.uMix);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, reduced]);

  useFrame((state, delta) => {
    // self-heal: if targets were built against a stale viewport, rebuild
    const vp = state.viewport;
    if (
      Math.abs(vp.width - uniforms.uArea.value.x) > 0.01 ||
      Math.abs(vp.height - uniforms.uArea.value.y) > 0.01
    ) {
      rebuild(vp.width, vp.height);
    }
    if (fillPending.current) fillCurrent();
    if (!reduced) uniforms.uTime.value += Math.min(delta, 0.05);
    (uniforms.uMouse.value as THREE.Vector2).lerp(mouse.current, 0.08);
  });

  // Stable array identities: fresh arrays per render (e.g. via .slice()) would
  // make R3F reconstruct the BufferAttributes on every re-render, zeroing out
  // data written by fillCurrent()/morphTo().
  const buffers = useMemo(
    () => ({
      pos: new Float32Array(count * 3),
      tA: new Float32Array(count * 3),
      tB: new Float32Array(count * 3),
      rA: new Float32Array(count),
      rB: new Float32Array(count),
      order: new Float32Array(count),
    }),
    [count]
  );

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[buffers.pos, 3]} />
        <bufferAttribute attach="attributes-aTargetA" args={[buffers.tA, 3]} />
        <bufferAttribute attach="attributes-aTargetB" args={[buffers.tB, 3]} />
        <bufferAttribute attach="attributes-aRampA" args={[buffers.rA, 1]} />
        <bufferAttribute attach="attributes-aRampB" args={[buffers.rB, 1]} />
        <bufferAttribute attach="attributes-aOrder" args={[buffers.order, 1]} />
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
