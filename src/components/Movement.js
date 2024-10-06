'use client';

import React, { useRef } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
} from '@phosphor-icons/react';
import { Canvas } from '@react-three/fiber';
import Gear from '@/components/Gear';
import { OrbitControls } from '@react-three/drei';
import CameraController from '@/components/CameraController';
import DirectionalButton from '@/components/DirectionalButton';

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
  const gearOneTeethCount = 80;
  const gearTwoTeethCount = 24;
  const baseRotationSpeed = 0.5;
  const gearTwoRotationalVelocity = -((gearOneTeethCount / gearTwoTeethCount) * baseRotationSpeed);

  return (
    <div className="w-full h-screen relative">
      {/* Directional Pad. Positioned on HTML body, z-index above the canvas. */}
      <div className="absolute bottom-5 z-10 left-1/2 transform -translate-x-1/2 grid grid-cols-3 gap-4">
        <DirectionalButton onClick={() => moveCamera('up')} className="col-start-2 row-start-1">
          <ArrowUp size={32} />
        </DirectionalButton>
        <DirectionalButton onClick={() => moveCamera('left')} className="col-start-1 row-start-2">
          <ArrowLeft size={32} />
        </DirectionalButton>
        <DirectionalButton onClick={() => moveCamera('down')} className="col-start-2 row-start-2">
          <ArrowDown size={32} />
        </DirectionalButton>
        <DirectionalButton onClick={() => moveCamera('right')} className="col-start-3 row-start-2">
          <ArrowRight size={32} />
        </DirectionalButton>
      </div>

      <Canvas shadows camera={{ position: [0, 0, 100], fov: 60 }}>
        <CameraController
          moveCamera={moveCamera}
          controlsRef={controlsRef}
        />

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
          teeth={gearOneTeethCount}
          toothDepth={1}
          thickness={2}
          rotationSpeed={baseRotationSpeed}
          color="silver"
        />
        <Gear
          position={[-29.7, 1, 0]}
          radius={6}
          innerRadius={5}
          teeth={gearTwoTeethCount}
          toothDepth={1}
          thickness={2}
          rotationSpeed={gearTwoRotationalVelocity}
          color="teal"
        />

        {/* Zoom Controls */}
        <OrbitControls ref={controlsRef} enableZoom={true} />
      </Canvas>
    </div>
  );
}

export default Movement;
