import React, { useMemo } from 'react';
import { Shape, ExtrudeGeometry } from 'three';
import { Box, Cylinder } from '@react-three/drei';

const Hand= ({
  length = 20,
  longWidth = 3,
  shortWidth = 2,
  depth = 1.5,
  rearOffset = 10,
  donutRadius = 4,
  color = "#9ca1a2",
  rotation = [0, 0, 0],
  position = [0, 0, 0],
}) => {
  const geometry = useMemo(() => {
    const shape = new Shape();

    // Define the trapezoid shape in 2D
    shape.moveTo(-longWidth / 2, 0);
    shape.lineTo(longWidth / 2, 0);
    shape.lineTo(shortWidth / 2, length);
    shape.lineTo(-shortWidth / 2, length);
    shape.lineTo(-longWidth / 2, 0); // Close the shape

    const extrudeSettings = {
      depth: depth,
      bevelEnabled: false,
    };

    // Create the geometry by extruding the 2D shape
    return new ExtrudeGeometry(shape, extrudeSettings);
  }, [length, longWidth, shortWidth, depth]);

  const boxLength = length / 3

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry} position={[0, -(rearOffset), 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} />
      </mesh>
      <Cylinder
        args={[donutRadius, donutRadius, depth + 0.2, 32]}
        position={[0, 0, depth / 2]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={color} />  
      </Cylinder>
      <Box
        args={[boxLength, 1.25, 1.25]}
        position={[0, -(rearOffset) + length - (boxLength / 2) - 3, 1.5]}
        rotation={[0, 0, 3 * Math.PI / 2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="white" />
      </Box>
    </group>
  );
}

Hand.displayName = 'Hand';

export default Hand;
