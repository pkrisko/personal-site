'use client';

import { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BG = '#ECEBE9';

const POS = {
  p0: [-3.5,  1.5, 0],
  p1: [-3.5,  0.0, 0],
  p2: [-3.5, -1.5, 0],
  b0: [-0.5,  1.8, 0],
  b1: [ 0.5,  0.6, 0],
  b2: [-0.5, -0.6, 0],
  b3: [ 0.5, -1.8, 0],
  c0: [ 3.5,  0.75, 0],
  c1: [ 3.5, -0.75, 0],
};

const EDGES = [
  ['p0', 'b0'], ['p0', 'b1'],
  ['p1', 'b1'], ['p1', 'b2'],
  ['p2', 'b2'], ['p2', 'b3'],
  ['b0', 'c0'],
  ['b1', 'c0'], ['b1', 'c1'],
  ['b2', 'c0'], ['b2', 'c1'],
  ['b3', 'c1'],
];

const NODE_ROLES = {
  p0: 'producer', p1: 'producer', p2: 'producer',
  b0: 'broker',   b1: 'broker',   b2: 'broker',   b3: 'broker',
  c0: 'consumer', c1: 'consumer',
};

const NODE_RADIUS = { producer: 0.13, broker: 0.20, consumer: 0.13 };
const PPE = 5;

// Particle color palette: ~25% yellow, ~35% black, ~30% dark gray, ~10% light gray
function pickParticleColor() {
  const r = Math.random();
  if (r < 0.25)  return new THREE.Color('#FFCA00'); // yellow
  if (r < 0.60)  return new THREE.Color(0.05, 0.05, 0.05); // near black
  if (r < 0.90)  return new THREE.Color(0.38, 0.38, 0.38); // dark/medium gray
  return           new THREE.Color(0.92, 0.92, 0.92);        // near white
}

function buildScene() {
  const curves = EDGES.map(([a, b]) => {
    const pa = new THREE.Vector3(...POS[a]);
    const pb = new THREE.Vector3(...POS[b]);
    const ctrl = pa.clone().lerp(pb, 0.5);
    ctrl.y += (pa.y - pb.y) * 0.12;
    return new THREE.QuadraticBezierCurve3(pa, ctrl, pb);
  });

  // Edge lines — dark gray
  const edgeLines = curves.map(curve => {
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64));
    return new THREE.Line(geo, new THREE.LineBasicMaterial({
      color: 0x555555, transparent: true, opacity: 0.35,
    }));
  });

  // Node rings — dark gray
  const nodeLines = Object.entries(POS).map(([key, [x, y, z]]) => {
    const r = NODE_RADIUS[NODE_ROLES[key]];
    const pts = Array.from({ length: 65 }, (_, i) => {
      const a = (i / 64) * Math.PI * 2;
      return new THREE.Vector3(x + Math.cos(a) * r, y + Math.sin(a) * r, z);
    });
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return new THREE.Line(geo, new THREE.LineBasicMaterial({
      color: 0x222222, transparent: true, opacity: 0.70,
    }));
  });

  // Particle buffer with per-vertex colors
  const count = EDGES.length * PPE;
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);

  const tVals = EDGES.flatMap((_, ei) =>
    Array.from({ length: PPE }, (_, pi) => ({
      edgeIdx: ei,
      t: pi / PPE,
      speed: 0.0028 + Math.random() * 0.0022,
    }))
  );

  tVals.forEach(({ edgeIdx, t }, i) => {
    const p = curves[edgeIdx].getPoint(t);
    positions[i * 3]     = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;

    const c = pickParticleColor();
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  });

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

  return { curves, edgeLines, nodeLines, particleGeo, tVals };
}

function Pipeline() {
  const scene = useMemo(buildScene, []);

  useFrame(() => {
    const pos = scene.particleGeo.attributes.position.array;
    scene.tVals.forEach((p, i) => {
      p.t = (p.t + p.speed) % 1;
      const pt = scene.curves[p.edgeIdx].getPoint(p.t);
      pos[i * 3]     = pt.x;
      pos[i * 3 + 1] = pt.y;
      pos[i * 3 + 2] = pt.z;
    });
    scene.particleGeo.attributes.position.needsUpdate = true;
  });

  return (
    <>
      {scene.edgeLines.map((line, i) => <primitive key={`e${i}`} object={line} />)}
      {scene.nodeLines.map((line, i) => <primitive key={`n${i}`} object={line} />)}
      <points geometry={scene.particleGeo}>
        <pointsMaterial vertexColors size={0.09} sizeAttenuation transparent opacity={0.95} />
      </points>
    </>
  );
}

export default function PipelineSketch() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={[BG]} />
        <Pipeline />
      </Canvas>
    </div>
  );
}
