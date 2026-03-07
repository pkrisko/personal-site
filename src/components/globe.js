'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const RADIUS = 2;
const LAT_RINGS = 6;    // horizontal parallels
const LON_ARCS = 9;     // vertical meridians
const SEGMENTS = 80;    // smoothness per line
const PULSE_MERIDIANS = 3; // how many meridians light up per tap
// Tilt the globe so it reads as a 3D sphere, not a flat circle
const TILT_X = -0.32;   // ~18° forward, like a desk globe

function buildSeparatedLines() {
  const white = new THREE.Color('white');

  // Latitude rings — static, never animated
  const latLines = [];
  for (let i = 1; i <= LAT_RINGS; i++) {
    const phi = (i / (LAT_RINGS + 1)) * Math.PI;
    const y = RADIUS * Math.cos(phi);
    const r = RADIUS * Math.sin(phi);
    const pts = [];
    for (let j = 0; j <= SEGMENTS; j++) {
      const theta = (j / SEGMENTS) * Math.PI * 2;
      pts.push(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    latLines.push(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: white })));
  }

  // Longitude meridians — stored separately so we can mutate their vertices
  const lonData = [];
  for (let i = 0; i < LON_ARCS; i++) {
    const theta = (i / LON_ARCS) * Math.PI * 2;
    const pts = [];
    for (let j = 0; j <= SEGMENTS; j++) {
      const phi = (j / SEGMENTS) * Math.PI;
      pts.push(new THREE.Vector3(
        RADIUS * Math.sin(phi) * Math.cos(theta),
        RADIUS * Math.cos(phi),
        RADIUS * Math.sin(phi) * Math.sin(theta),
      ));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    // Take a snapshot of resting positions so we can restore after pulse
    const basePositions = geo.attributes.position.array.slice();
    const mat = new THREE.LineBasicMaterial({ color: white.clone() });
    lonData.push({ line: new THREE.Line(geo, mat), geo, mat, theta, basePositions });
  }

  return { latLines, lonData };
}

const SpinningGlobe = () => {
  const groupRef = useRef();
  const hoveredRef = useRef(false);
  const { latLines, lonData } = useMemo(buildSeparatedLines, []);
  // { active, t, indices }
  const pulseRef = useRef({ active: false, t: 0, indices: [] });
  const autoTimerRef = useRef(0);

  const handleClick = () => {
    // Don't restart if already pulsing
    if (pulseRef.current.active) return;
    // Pick PULSE_MERIDIANS random unique meridian indices
    const shuffled = Array.from({ length: LON_ARCS }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    pulseRef.current = { active: true, t: 0, indices: shuffled.slice(0, PULSE_MERIDIANS) };
  };

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // groupRef.current.rotation.y += hoveredRef.current ? 0.008 : 0.002;
    groupRef.current.rotation.y += 0.002;

    autoTimerRef.current += delta;
    if (autoTimerRef.current >= 10) {
      autoTimerRef.current = 0;
      handleClick();
    }

    if (!pulseRef.current.active) return;

    pulseRef.current.t += delta * 1.4; // pulse duration ~0.7s to travel pole-to-pole
    const t = pulseRef.current.t;

    for (const idx of pulseRef.current.indices) {
      const { geo, mat, theta, basePositions } = lonData[idx];
      const pos = geo.attributes.position;

      if (t > 1.3) {
        // Animation done — restore resting geometry and color
        pos.array.set(basePositions);
        pos.needsUpdate = true;
        mat.color.setRGB(1, 1, 1);
        continue;
      }

      // Wave front travels from south pole (j=SEGMENTS) → north pole (j=0)
      const waveFront = 1 - Math.min(t, 1); // normalized 0=north, 1=south; front goes 1→0

      for (let j = 0; j <= SEGMENTS; j++) {
        const phi = (j / SEGMENTS) * Math.PI;
        const progress = j / SEGMENTS; // 0=north, 1=south

        // Tight gaussian envelope around the wave front
        const dist = progress - waveFront;
        const envelope = Math.exp(-(dist * dist) * 35);

        // Zig-zag radial displacement — jagged sine along the arc
        const zigzag = Math.sin(j * 1.1) * 0.75 * envelope;
        const r = (RADIUS + zigzag) * Math.sin(phi);

        pos.setXYZ(j, r * Math.cos(theta), RADIUS * Math.cos(phi), r * Math.sin(theta));
      }
      pos.needsUpdate = true;

      // Cyan flash that fades back to white as the wave passes
      const glow = Math.max(0, 1 - t * 0.9);
      mat.color.setRGB(0.4 + 0.6 * (1 - glow), 0.7 + 0.3 * (1 - glow), 1.0);
    }

    if (t > 1.3) {
      pulseRef.current.active = false;
    }
  });

  return (
    <group
      ref={groupRef}
      rotation={[TILT_X, 0, 0]}
      onPointerOver={() => { hoveredRef.current = true; }}
      onPointerOut={() => { hoveredRef.current = false; }}
      onPointerEnter={handleClick}
      onClick={handleClick}
    >
      {latLines.map((line, i) => (
        <primitive key={`lat-${i}`} object={line} />
      ))}
      {lonData.map((d, i) => (
        <primitive key={`lon-${i}`} object={d.line} />
      ))}
    </group>
  );
};

const GlobeScene = () => (
  <div className="w-12 h-12 lg:w-16 lg:h-16">
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
      <SpinningGlobe />
    </Canvas>
  </div>
);

export default GlobeScene;
