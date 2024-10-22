// ThirdWheel.js
import React, { forwardRef } from 'react';
import { Box, Cylinder } from '@react-three/drei';
import GearPair from '@/components/watch/GearPair';

const AXLE_HEIGHT = 32;
const AXLE_WIDTH = 2.2; // Slightly wider than second hand, in real world would be a tube.
const MINUTE_HAND_LENGTH = 45;

const ThirdWheel = forwardRef(({
  position = [0, 0, 0],
  spurTeethCount = 60,
  spurRadius = 57.6,
  pinionTeethCount = 8,
  pinionRadius = 7.2,
}, ref) => {

  return (
    <group ref={ref} position={position}>
      <GearPair
        spurRadius={spurRadius}
        spurTeethCount={spurTeethCount}
        pinionRadius={pinionRadius}
        pinionTeethCount={pinionTeethCount}
      />
      {/* Axle with hole in the middle */}
      <Cylinder
        args={[2.2, 2.2, AXLE_HEIGHT, 32, 1, true]} // 'true' for open-ended cylinder (hole)
        position={[0, 0, AXLE_HEIGHT / 2]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="silver" side={2} /> {/* side={2} to render both sides */}
      </Cylinder>
      {/* Minute hand */}
      <group position={[0, 0, AXLE_HEIGHT - 2]}>
        <Box
          args={[MINUTE_HAND_LENGTH, 3, 3]}
          position={[MINUTE_HAND_LENGTH / 2, 0, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="blue" />
        </Box>
      </group>
    </group>
  );
});

export default ThirdWheel;
