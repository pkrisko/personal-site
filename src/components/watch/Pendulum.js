'use client';

import React, { forwardRef, useMemo } from 'react';
import { Cylinder } from '@react-three/drei';

const Pendulum = forwardRef(
  (
    {
      position = [0, 0, 0],
      rotation = [0, 0, 95 * Math.PI / 180],
      armLength = 170,
      armRadius = 1,
      bobRadius = 10, // Round bottom part of the pendulum is called a "Bob".
      bobDepth = 2, // Thickness of the bob
      color = '#EAECEC', // Default pendulum color
    },
    ref
  ) => {
    return (
      <group ref={ref} position={position} rotation={rotation}>
        {/* Pendulum Arm */}
        <Cylinder args={[armRadius, armRadius, armLength, 32]} position={[0, -armLength / 2, 0]}>
          <meshStandardMaterial color={color} />
        </Cylinder>
        {/* Pendulum Bob */}
        <Cylinder
          args={[bobRadius, bobRadius, bobDepth, 32]}
          rotation={[0, Math.PI / 2, Math.PI / 2]}
          position={[0, -armLength, 0]}
        >
          <meshStandardMaterial color={color} />
        </Cylinder>
      </group>
    );
  }
);

Pendulum.displayName = 'Pendulum';

export default Pendulum;
