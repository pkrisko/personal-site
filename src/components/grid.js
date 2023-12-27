import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const Grid = () => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ mouse }) => {
    // Update the grid based on mouse position
    const xRotation = mouse.y * Math.PI * 2;
    const yRotation = mouse.x * Math.PI * 2;
    meshRef.current.rotation.set(xRotation, yRotation, 0);

    // Additional effects when hovered
    if (hovered) {
      meshRef.current.scale.set(1.2, 1.2, 1.2);
    } else {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Increase the size of the cube */}
      <boxGeometry args={[3, 3, 3]} /> {/* Adjust these numbers to change the size */}
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
};

const CoolAnimation = () => {
  return (
    <div className="h-10 w-10">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Grid />
      </Canvas>
    </div>
  );
};

export default CoolAnimation;
