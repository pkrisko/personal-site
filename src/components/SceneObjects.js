import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import Globe from '@/components/Globe';
import Gears from '@/components/Gears';

const SceneObjects = () => {
  const objectsData = [
    { type: 'cube', position: [0, -10, 0], color: 'green' },
    { type: 'sphere', position: [0, -15, 0], color: 'blue' },
    { type: 'cube', position: [0, -20, 0], color: 'yellow' },
    { type: 'sphere', position: [0, -25, 0], color: 'purple' },
  ];

  const refs = useRef([]);
  const scroll = useScroll();

  useFrame(() => {
    const scrollOffset = scroll.offset;

    objectsData.forEach((obj, index) => {
      const mesh = refs.current[index];
      if (mesh) {
        const start = index / objectsData.length;
        const end = (index + 1) / objectsData.length;

        const progress = (scrollOffset - start) / (end - start);
        const clampedProgress = Math.max(0, Math.min(progress, 1));

        // Animate scale smoothly
        mesh.scale.set(clampedProgress, clampedProgress, clampedProgress);

        // Make the shapes spin
        mesh.rotation.y += 0.01;
        mesh.rotation.x += 0.005;
      }
    });
  });

  return (
    <>
      <Globe position={[0, 0, 0]} />
      <Gears />
      {objectsData.map(({ type, position, color }, index) => (
        <mesh
          key={index}
          ref={(el) => (refs.current[index] = el)}
          position={position}
        >
          {type === 'sphere' ? (
            <sphereGeometry args={[1, 32, 32]} />
          ) : (
            <boxGeometry args={[2, 2, 2]} />
          )}
          <meshStandardMaterial color={color} />
        </mesh>
      )
      )}
    </>
  )
};

export default SceneObjects;
