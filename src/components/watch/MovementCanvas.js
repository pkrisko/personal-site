'use client';

import React, { useRef } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
} from '@phosphor-icons/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import CameraController from '@/components/watch/CameraController';
import DirectionalButton from '@/components/watch/DirectionalButton';
import Movement from '@/components/watch/Movement';

const MovementCanvas = () => {
  const controlsRef = useRef();

  const moveCamera = (direction) => {
    const moveAmount = 1.5;
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

  return (
    <div className="w-full h-screen relative">
      {/* Directional Pad */}
      <div className="absolute bottom-24 lg:bottom-10 z-10 left-1/2 transform -translate-x-1/2 grid grid-cols-3 gap-4">
        <DirectionalButton
          onClick={() => moveCamera('up')}
          className="col-start-2 row-start-1"
        >
          <ArrowUp size={32} />
        </DirectionalButton>
        <DirectionalButton
          onClick={() => moveCamera('left')}
          className="col-start-1 row-start-2"
        >
          <ArrowLeft size={32} />
        </DirectionalButton>
        <DirectionalButton
          onClick={() => moveCamera('down')}
          className="col-start-2 row-start-2"
        >
          <ArrowDown size={32} />
        </DirectionalButton>
        <DirectionalButton
          onClick={() => moveCamera('right')}
          className="col-start-3 row-start-2"
        >
          <ArrowRight size={32} />
        </DirectionalButton>
      </div>

      <Canvas shadows camera={{ position: [0, -25, 350], fov: 60 }}>
        <CameraController moveCamera={moveCamera} controlsRef={controlsRef} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[200, 200, 200]} intensity={1} castShadow />

        {/* Watch Movement Meshes  */}
        <Movement />

        {/* Orbit Controls */}
        <OrbitControls ref={controlsRef} enableZoom={true} target={[0, -25, 0]} />
      </Canvas>
    </div>
  );
};

export default MovementCanvas;
