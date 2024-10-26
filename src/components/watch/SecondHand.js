import React, { useMemo } from 'react';
import { Box, Cylinder } from '@react-three/drei';
import { MathUtils } from 'three';
import { AXLE_HEIGHT } from '@/components/watch/EscapementWheel';
import CompactDisc from '@/components/watch/CompactDisc';

const SECONDS_HAND_LENGTH = 55;
const OFFSET = 12;
const LOLLIPOP_RADIUS = 1.8;

const SecondHand = ({
  width = 1.25,
  depth = 1.25,
  color = "#0073b9",
}) => {
  const secondsHandRotation = useMemo(() => {
    const now = new Date();
    const seconds = now.getSeconds(); // Only use the seconds
    // Since the hand should point down at 30 seconds, adjust by 90 degrees.
    const angle = MathUtils.degToRad(90 - seconds * 6); // 6 = (360º / 60 seconds)
    return [0, 0, angle];
  }, []);

  return (
    <group
      position={[0, 0, AXLE_HEIGHT - 1]}
      rotation={secondsHandRotation}
    >
      <Box
        args={[SECONDS_HAND_LENGTH, width, depth]}
        position={[SECONDS_HAND_LENGTH / 2 - OFFSET, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={color} />
      </Box>
      <Cylinder
        args={[2.8, 2.8, depth, 32]}
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={color} />  
      </Cylinder>
      <Cylinder
        args={[LOLLIPOP_RADIUS, LOLLIPOP_RADIUS, 1, 32]}
        position={[SECONDS_HAND_LENGTH - OFFSET - 8, 0, 0.5]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="white" />
      </Cylinder>
      <CompactDisc
        position={[SECONDS_HAND_LENGTH - OFFSET - 8,0,-1]}
        innerRadius={LOLLIPOP_RADIUS}
        outerRadius={LOLLIPOP_RADIUS + 0.3}
        depth={2.4}
        color={color}
      />
    </group>
  )
}

SecondHand.displayName = 'SecondHand';

export default SecondHand;
