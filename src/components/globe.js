import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const SpinningGlobe = () => {
  const globeRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useFrame(() => {
    const speed = isHovered ? .01 : .005;
    globeRef.current.rotation.y += speed;

    const scale = isHovered ? 1.05 : 1;
    globeRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh
      ref={globeRef}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <sphereGeometry args={[2, 6, 6]} />
      <meshBasicMaterial color="lightblue" wireframe />
    </mesh>
  );
};

const GlobeScene = () => {
  return (
    <div className="globe-container w-16 h-16">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <SpinningGlobe />
      </Canvas>
    </div>
  );
};

export default GlobeScene;
