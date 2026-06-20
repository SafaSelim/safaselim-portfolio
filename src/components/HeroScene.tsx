'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTheme } from 'next-themes';
import { usePalette } from '@/components/PaletteProvider';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uSize;
  uniform float uAmp;
  varying float vElevation;
  varying float vDist;

  void main() {
    vec3 pos = position;

    // layered travelling waves
    float e =
        sin(pos.x * 0.55 + uTime * 0.8) * 0.6
      + cos(pos.y * 0.4 - uTime * 0.6) * 0.5
      + sin((pos.x + pos.y) * 0.3 + uTime * 0.4) * 0.4;

    // mouse ripple
    float md = distance(pos.xy, uMouse * 7.0);
    e += smoothstep(4.5, 0.0, md) * 1.4 * sin(md - uTime * 2.2);

    pos.z += e * uAmp;
    vElevation = e;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDist = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * (1.0 / vDist) * (1.0 + e * 0.25);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vElevation;
  varying float vDist;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, d);
    vec3 color = mix(uColorA, uColorB, smoothstep(-1.2, 1.6, vElevation));
    float fog = smoothstep(26.0, 6.0, vDist);
    gl_FragColor = vec4(color, alpha * uOpacity * fog);
  }
`;

function ParticleField({
  isDark,
  reduced,
  palette,
}: {
  isDark: boolean;
  reduced: boolean;
  palette: string;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const { viewport, size } = useThree();

  const isMobile = size.width < 768;
  const sep = isMobile ? 0.85 : 0.58;
  const count = isMobile ? 46 : 88;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * count * 3);
    let i = 0;
    const half = (count * sep) / 2;
    for (let xi = 0; xi < count; xi++) {
      for (let yi = 0; yi < count; yi++) {
        arr[i++] = xi * sep - half;
        arr[i++] = yi * sep - half;
        arr[i++] = 0;
      }
    }
    return arr;
  }, [count, sep]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uSize: { value: isMobile ? 26 : 34 },
      uAmp: { value: 1.0 },
      uColorA: { value: new THREE.Color() },
      uColorB: { value: new THREE.Color() },
      uOpacity: { value: 0 },
    }),
    [isMobile]
  );

  useEffect(() => {
    const accent =
      getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff7a34';
    const a = uniforms.uColorA.value as THREE.Color;
    const b = uniforms.uColorB.value as THREE.Color;
    a.set(accent);
    b.set(isDark ? '#f5efe6' : '#2a2018');
  }, [isDark, palette, uniforms]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((_, delta) => {
    const m = matRef.current;
    if (!m) return;
    const u = m.uniforms;
    if (!reduced) u.uTime.value += Math.min(delta, 0.05);
    (u.uMouse.value as THREE.Vector2).lerp(mouse.current, 0.05);
    u.uOpacity.value = THREE.MathUtils.lerp(u.uOpacity.value, isDark ? 0.95 : 0.85, 0.03);
  });

  return (
    <points
      rotation={[-Math.PI / 2.7, 0, Math.PI / 14]}
      position={[0, -2.2, 0]}
      scale={viewport.width > 8 ? 1 : 0.85}
    >
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

export default function HeroScene() {
  const { resolvedTheme } = useTheme();
  const { palette } = usePalette();
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Hydration guard: WebGL canvas must only mount client-side.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Pause rendering whenever the hero is scrolled out of view.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  if (!mounted) return null;
  const isDark = resolvedTheme !== 'light';

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%' }}>
      <Canvas
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [0, 4.5, 11], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <ParticleField isDark={isDark} reduced={reduced} palette={palette} />
      </Canvas>
    </div>
  );
}
