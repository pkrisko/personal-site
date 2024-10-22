// ThirdWheel.js
import React, { forwardRef, useMemo } from 'react';
import { Box, Cylinder } from '@react-three/drei';
import { MathUtils } from 'three';
import GearPair from '@/components/watch/GearPair';

const AXLE_HEIGHT = 32;
const AXLE_WIDTH = 2.2; // Slightly wider than second hand, in real world would be a tube.
const MINUTE_HAND_LENGTH = 45;

const ThirdWheel = forwardRef(({
  position = [0, 0, 4],
  spurTeethCount = 60,
  spurRadius = 57.1,
  pinionTeethCount = 8,
  pinionRadius = 7.2,
}, ref) => {
  // Calculate the initial rotation of the seconds hand
  const minuteHandRotation = useMemo(() => {
    const now = new Date();
    const minutes = now.getMinutes() + now.getSeconds() / 60;
    // Since the hand points east (15 minutes) at zero rotation,
    // adjust the angle accordingly.
    const angle = MathUtils.degToRad(90 - minutes * 6);
    return [0, 0, angle];
  }, []);

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
        args={[AXLE_WIDTH, AXLE_WIDTH, AXLE_HEIGHT, 32, 1, true]} // 'true' for open-ended cylinder (hole)
        position={[0, 0, AXLE_HEIGHT / 2]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="silver" side={2} /> {/* side={2} to render both sides */}
      </Cylinder>
      {/* Minute hand */}
      <group position={[0, 0, AXLE_HEIGHT - 2]} rotation={minuteHandRotation}>
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

ThirdWheel.displayName = 'ThirdWheel';

export default ThirdWheel;
