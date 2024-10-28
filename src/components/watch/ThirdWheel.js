// ThirdWheel.js
import React, { forwardRef, useMemo } from 'react';
import { Cylinder } from '@react-three/drei';
import { MathUtils } from 'three';
import GearPair from '@/components/watch/GearPair';
import Hand from '@/components/watch/Hand';

const AXLE_HEIGHT = 22;
const AXLE_WIDTH = 1.0; // Slightly wider than second hand, in real world would be a tube.
const MINUTE_HAND_LENGTH = 50;

const ThirdWheel = forwardRef(({
  position = [0, 0, 4],
  spurTeethCount = 60,
  spurRadius = 19.7,
  pinionAddendumFactor = 1.0,
  pinionTeethCount = 10,
  pinionRadius = 2.5,
}, ref) => {
  // Calculate the initial rotation of the seconds hand
  const minuteHandRotation = useMemo(() => {
    const now = new Date();
    const minutes = now.getMinutes() + now.getSeconds() / 60;
    const angle = MathUtils.degToRad(0 - minutes * 6) + 0.095; // 6 = (360º / 60 minutes), with slight offset from Movement.js
    return [0, 0, angle];
  }, []);

  return (
    <group ref={ref} position={position}>
      <GearPair
        spurAddendumFactor={1.5}
        spurRadius={spurRadius}
        spurTeethCount={spurTeethCount}
        pinionAddendumFactor={pinionAddendumFactor}
        pinionRadius={pinionRadius}
        pinionTeethCount={pinionTeethCount}
      />
      {/* Axle with hole in the middle */}
      <Cylinder
        args={[AXLE_WIDTH, AXLE_WIDTH, AXLE_HEIGHT, 32, 1]} // 'true' for open-ended cylinder (hole)
        position={[0, 0, AXLE_HEIGHT / 2]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="silver" side={2} /> {/* side={2} to render both sides */}
      </Cylinder>
      {/* Minute hand */}
      <Hand
        position={[0, 0, AXLE_HEIGHT - 2]}
        rotation={minuteHandRotation}
        length={MINUTE_HAND_LENGTH}
        donutRadius={3.3}
        depth={1.5}
        rearOffset={7.5}
      />
    </group>
  );
});

ThirdWheel.displayName = 'ThirdWheel';

export default ThirdWheel;
