'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import Gear from '@/components/Gear';
import { OrbitControls } from '@react-three/drei';

function Movement() {
  // Calculate rotation speeds based on teeth count
  const gear1Teeth = 80;
  const gear2Teeth = 24;
  const baseRotationSpeed = 0.5;
  const gear2RotationSpeed = -(
    (gear1Teeth / gear2Teeth) *
    baseRotationSpeed
  );

  return (
    <div className="w-full h-screen">
      <Canvas shadows camera={{ position: [0, 0, 100], fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1}
          castShadow
        />
        {/* Gears */}
        <Gear
          position={[-2.5, 0, 0]}
          radius={20}
          innerRadius={19}
          teeth={gear1Teeth}
          toothDepth={1}
          thickness={2}
          rotationSpeed={baseRotationSpeed}
          color="orange"
        />
        <Gear
          position={[-29.7, 1, 0]}
          radius={6}
          innerRadius={5}
          teeth={gear2Teeth}
          toothDepth={1}
          thickness={2}
          rotationSpeed={gear2RotationSpeed}
          color="teal"
        />
        {/* Controls */}
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}

export default Movement;
