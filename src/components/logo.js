import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll } from '@react-three/drei';

const GlobeScene = () => {
  // Data structure for the objects, arranged vertically
  const objectsData = [
    { type: 'sphere', position: [0, 0, 0], color: 'red' },
    { type: 'cube', position: [0, -5, 0], color: 'green' },
    { type: 'sphere', position: [0, -10, 0], color: 'blue' },
    { type: 'cube', position: [0, -15, 0], color: 'yellow' },
    { type: 'sphere', position: [0, -20, 0], color: 'purple' },
  ];

  // SceneObjects component
  const SceneObjects = () => {
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
          mesh.scale.set(
            clampedProgress,
            clampedProgress,
            clampedProgress
          );

          // Make the shapes spin
          mesh.rotation.y += 0.01; // Adjust rotation speed as needed
          mesh.rotation.x += 0.005; // Optional: rotate on x-axis as well
        }
      });
    });

    return objectsData.map((obj, index) => (
      <mesh
        key={index}
        ref={(el) => (refs.current[index] = el)}
        position={obj.position}
      >
        {obj.type === 'sphere' ? (
          <sphereGeometry args={[1, 32, 32]} />
        ) : (
          <boxGeometry args={[2, 2, 2]} />
        )}
        <meshStandardMaterial color={obj.color} />
      </mesh>
    ));
  };

  // CameraController component
  const CameraController = () => {
    const { camera } = useThree();
    const scroll = useScroll();

    useFrame(() => {
      const scrollOffset = scroll.offset;

      // Map scroll position to camera movement along y-axis (from 0 to -20)
      camera.position.y = -scrollOffset * 20; // Adjust multiplier as needed
      camera.updateProjectionMatrix();
    });

    return null;
  };

  return (
    <div className="globe-container w-screen h-screen">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* ScrollControls */}
        <ScrollControls pages={5} damping={0.1}>
          {/* 3D Objects */}
          <SceneObjects />
          {/* Camera Controller */}
          <CameraController />
        </ScrollControls>
      </Canvas>
    </div>
  );
};

export default GlobeScene;
