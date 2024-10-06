// GlobeScene.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import SceneObjects from './SceneObjects';
import CameraController from './CameraController';

const GlobeScene = () => {
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
