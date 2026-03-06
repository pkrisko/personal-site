'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const RADIUS = 2;
const LAT_RINGS = 6;    // horizontal parallels
const LON_ARCS = 9;     // vertical meridians
const SEGMENTS = 80;    // smoothness per line
// Tilt the globe so it reads as a 3D sphere, not a flat circle
const TILT_X = -0.32;   // ~18° forward, like a desk globe

function buildLines() {
  const color = new THREE.Color('white');
  const lines = [];

  // Latitude rings — evenly spaced, skip poles
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
    lines.push(new THREE.Line(geo, new THREE.LineBasicMaterial({ color })));
  }

  // Longitude arcs — full great-circle arcs
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
    lines.push(new THREE.Line(geo, new THREE.LineBasicMaterial({ color })));
  }

  return lines;
}

const SpinningGlobe = () => {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const lines = useMemo(buildLines, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += hovered ? 0.008 : 0.002;
  });

  return (
    <group
      ref={groupRef}
      rotation={[TILT_X, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
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
