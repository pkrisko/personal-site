import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const Globe = () => {
  const globeRef = useRef(null);

  useFrame(() => {
    globeRef.current.rotation.y += 0.0025; 
  });

  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[3, 13, 13]} />
      <meshStandardMaterial color="white" wireframe />
    </mesh>
  );
};

export default Globe;
