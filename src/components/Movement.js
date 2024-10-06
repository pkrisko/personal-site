'use client';

import React, { useRef } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from '@phosphor-icons/react';
import { Canvas } from '@react-three/fiber';
import Gear from '@/components/Gear';
import { OrbitControls } from '@react-three/drei';
import CameraController from '@/components/CameraController';

function Movement() {
  const controlsRef = useRef();

  const moveCamera = (direction) => {
    const moveAmount = 0.89;
    const controls = controlsRef.current;
    if (!controls) return;
    const { object: camera, target } = controls;
      switch (direction) {
        case 'up':
          camera.position.y += moveAmount;
          target.y += moveAmount;
          break;
        case 'down':
          camera.position.y -= moveAmount;
          target.y -= moveAmount;
          break;
        case 'left':
          camera.position.x -= moveAmount;
          target.x -= moveAmount;
          break;
        case 'right':
          camera.position.x += moveAmount;
          target.x += moveAmount;
          break;
        default:
          break;
      }
      controls.update();
  };

  // Calculate rotation speeds based on teeth count
  const gear1Teeth = 80;
  const gear2Teeth = 24;
  const baseRotationSpeed = 0.5;
  const gear2RotationSpeed = -((gear1Teeth / gear2Teeth) * baseRotationSpeed);

  return (
    <div className="w-full h-screen relative">
      {/* Directional Pad */}
      <div className="absolute bottom-5 z-50 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded mb-2"
          onClick={() => moveCamera('up')}
        >
          <ArrowUp size={32} />
        </button>
        <div className="flex space-x-2">
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded"
            onClick={() => moveCamera('left')}
          >
            <ArrowLeft size={32} />
          </button>
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded"
            onClick={() => moveCamera('down')}
          >
            <ArrowDown size={32} />
          </button>
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded"
            onClick={() => moveCamera('right')}
          >
            <ArrowRight size={32} />
          </button>
        </div>
      </div>

      <Canvas shadows camera={{ position: [0, 0, 100], fov: 60 }}>
        <CameraController moveCamera={moveCamera} controlsRef={controlsRef} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />

        {/* Gears */}
        <Gear
          position={[-2.5, 0, 0]}
          radius={20}
          innerRadius={19}
          teeth={gear1Teeth}
          toothDepth={1}
          thickness={2}
          rotationSpeed={baseRotationSpeed}
          color="silver"
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

        {/* Zoom Controls */}
        <OrbitControls ref={controlsRef} enableZoom={true} />
      </Canvas>
    </div>
  );
}

export default Movement;
