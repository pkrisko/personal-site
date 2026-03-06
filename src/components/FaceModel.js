'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    // World-space normal (assumes uniform scaling, true for most GLBs)
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = `
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  uniform float uHSpacing;
  uniform float uNumV;
  uniform float uLineWidth;

  const float TWO_PI = 6.28318530718;

  void main() {
    // --- Latitude lines (horizontal, evenly spaced in Y) ---
    float hf = vWorldPos.y / uHSpacing;
    float hDist = min(fract(hf), 1.0 - fract(hf));
    // fwidth gives screen-space derivative → consistent pixel-width lines
    float hLine = 1.0 - smoothstep(0.0, fwidth(hf) * uLineWidth, hDist);

    // --- Longitude lines (vertical, evenly spaced by angle around Y) ---
    float angle = atan(vWorldPos.x, vWorldPos.z);
    float vf = (angle / TWO_PI + 0.5) * uNumV;
    float vDist = min(fract(vf), 1.0 - fract(vf));
    float vLine = 1.0 - smoothstep(0.0, fwidth(vf) * uLineWidth, vDist);

    float line = max(hLine, vLine);

    // --- Intersection nodes: bright dot where both lines cross ---
    float node = hLine * vLine;

    // --- View-based shading ---
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float ndotv = clamp(dot(vWorldNormal, viewDir), 0.0, 1.0);
    // Fresnel: edges of the face glow brighter (like a lit globe rim)
    float fresnel = pow(1.0 - ndotv, 2.5);

    // --- Directional key light from above-front-right ---
    // Illuminates forehead/cheeks; shadows under nose, mustache, eye sockets
    vec3 lightDir = normalize(vec3(0.3, 0.9, 1.2));
    float ndotl = clamp(dot(vWorldNormal, lightDir), 0.0, 1.0);

    // Fill between lines: faint gray lit by directional light
    // Recessed/downward-facing areas (mustache, nostrils, eye sockets) stay dark
    vec3 baseColor = vec3(0.02 + 0.18 * ndotl + 0.03 * ndotv);

    // Lines brighter toward silhouette edges, slightly warmed by light
    float lineBrightness = 0.65 + 0.20 * fresnel + 0.15 * ndotl;
    vec3 lineColor = vec3(lineBrightness);

    vec3 color = mix(baseColor, lineColor, line);
    // Intersection nodes pop to full white
    color = mix(color, vec3(1.0), node * 0.55);

    gl_FragColor = vec4(color, 1.0);
  }
`;

// GlobeFace only handles rendering + camera setup.
// Input (mouse / device orientation) is managed by FaceModel so that
// regular DOM event listeners work reliably on mobile.
function GlobeFace({ target }) {
  const groupRef = useRef();
  const { scene } = useGLTF('/3d/krisko-face-decimate-blender.glb');
  const { camera } = useThree();
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Center and auto-fit camera to the model's bounding box
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    scene.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    camera.position.set(0, 0, maxDim * 1.55);
    camera.near = maxDim * 0.01;
    camera.far = maxDim * 100;
    camera.updateProjectionMatrix();

    const numHLines = 64;
    const numVLines = 64;
    const hSpacing = size.y / numHLines;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uHSpacing: { value: hSpacing },
        uNumV: { value: numVLines },
        uLineWidth: { value: 1.5 },
      },
      side: THREE.FrontSide,
    });

    scene.traverse((child) => {
      if (child.isMesh) child.material = material;
    });
  }, [scene, camera]);

  useFrame(() => {
    if (!groupRef.current) return;
    const ease = 0.06;
    current.current.x += (target.current.x - current.current.x) * ease;
    current.current.y += (target.current.y - current.current.y) * ease;
    groupRef.current.rotation.x = current.current.x;
    groupRef.current.rotation.y = current.current.y;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

export default function FaceModel() {
  const target = useRef({ x: 0, y: 0 });
  const [showTiltButton, setShowTiltButton] = useState(false);

  useEffect(() => {
    const isTouchDevice = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;

    if (!isTouchDevice) {
      const onMouseMove = (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        target.current.y = nx * 0.45;
        target.current.x = ny * 0.2;
      };
      window.addEventListener('mousemove', onMouseMove);
      return () => window.removeEventListener('mousemove', onMouseMove);
    } else {
      setShowTiltButton(true);
    }
  }, []);

  const enableTilt = async () => {
    const baseline = { beta: null, gamma: null };

    const onDeviceOrientation = (e) => {
      const beta  = e.beta  ?? 0;
      const gamma = e.gamma ?? 0;

      if (baseline.beta === null) {
        baseline.beta  = beta;
        baseline.gamma = gamma;
      }

      const db = beta  - baseline.beta;
      const dg = gamma - baseline.gamma;

      target.current.x = (Math.max(-30, Math.min(30, db)) / 30) * 0.25;
      target.current.y = (Math.max(-30, Math.min(30, dg)) / 30) * 0.45;
    };

    const start = () => {
      window.addEventListener('deviceorientation', onDeviceOrientation);
      setShowTiltButton(false);
    };

    // iOS 13+ requires requestPermission() called from a real DOM user gesture.
    // On iOS Chrome (WKWebView) and Android this function won't exist — just start.
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const result = await DeviceOrientationEvent.requestPermission();
        if (result === 'granted') start();
      } catch (_) {}
    } else {
      start();
    }
  };

  return (
    <div className="w-full h-full relative">
      <Canvas gl={{ antialias: true }} camera={{ fov: 60 }}>
        <Suspense fallback={null}>
          <GlobeFace target={target} />
        </Suspense>
      </Canvas>
      {showTiltButton && (
        <button
          onClick={enableTilt}
          className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 font-fantastique text-xs tracking-widest text-white/40 hover:text-white/70 transition-colors duration-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
          tap to tilt
        </button>
      )}
    </div>
  );
}

useGLTF.preload('/3d/krisko-face-decimate-blender.glb');
