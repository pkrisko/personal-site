import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

const Globe = () => {
  const globeRef = useRef();

  useFrame(() => {
    globeRef.current.rotation.y += .01;
  });

  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[2, 15, 10]} />
      <meshStandardMaterial color="lightblue" wireframe />
    </mesh>
  );
};

const CameraController = () => {
  const { camera } = useThree();
  const targetZ = useRef(camera.position.z);

  // Handler for wheel events
  const handleWheel = (event) => {
    event.preventDefault();
    const delta = event.deltaY * 0.005; // Adjust scroll sensitivity here
    targetZ.current += delta;

    // Clamp the zoom levels
    targetZ.current = Math.min(Math.max(targetZ.current, 5), 100);
  };

  useEffect(() => {
    // Attach the wheel event listener
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Cleanup on unmount
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useFrame(() => {
    // Smoothly interpolate the camera's z position towards the target z
    camera.position.z += (targetZ.current - camera.position.z) * 0.1;
    camera.updateProjectionMatrix();
  });

  return null;
};

const GlobeScene = () => {
  return (
    <div className="globe-container w-screen h-screen">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {/* 3D Objects */}
        <Globe />
        {/* Camera Controller */}
        <CameraController />
      </Canvas>
    </div>
  );
};

export default GlobeScene;
