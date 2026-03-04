'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
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

    // --- Normal-based depth shading ---
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float ndotv = clamp(dot(vWorldNormal, viewDir), 0.0, 1.0);
    // Fresnel: edges of the face glow brighter (like a lit globe rim)
    float fresnel = pow(1.0 - ndotv, 2.5);

    // Dark base with subtle depth cueing
    vec3 baseColor = vec3(0.03 + 0.05 * ndotv);

    // Lines brighter toward silhouette edges
    float lineBrightness = 0.72 + 0.28 * fresnel;
    vec3 lineColor = vec3(lineBrightness);

    vec3 color = mix(baseColor, lineColor, line);
    // Intersection nodes pop to full white
    color = mix(color, vec3(1.0), node * 0.55);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function GlobeFace() {
  const groupRef = useRef();
  const { scene } = useGLTF('/3d/krisko-face.glb');
  const { camera } = useThree();

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

    // Derive spacing from model height so lines scale with any GLB
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
      if (child.isMesh) {
        child.material = material;
      }
    });
  }, [scene, camera]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

export default function FaceModel() {
  return (
    <div className="w-full" style={{ height: '90vh' }}>
      <Canvas
        gl={{ antialias: true }}
        camera={{ fov: 30 }}
      >
        <Suspense fallback={null}>
          <GlobeFace />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(3 * Math.PI) / 4}
        />
      </Canvas>
    </div>
  );
}
