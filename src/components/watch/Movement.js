'use client';

import React from 'react';
import Gear from '@/components/watch/Gear';
import EscapementWheel from '@/components/watch/EscapementWheel';

function Movement() {
  // Calculate rotation speeds based on teeth count
  const gearOneTeethCount = 15;
  const gearTwoTeethCount = 30;
  const baseRotationSpeed = 0.15;
  const gearTwoRotationalVelocity =
    -((gearOneTeethCount / gearTwoTeethCount) * baseRotationSpeed);

  return (
    <>
      <EscapementWheel
        position={[0, 0, -2]}
        numTeeth={30}
        radius={27}
        toothHeight={7.5}
        thickness={2}
        rotationSpeed={0.5}
        color="gray"
      />
      {/* Gear connected to escapement pinion */}
      <Gear
        position={[15.7, 3.3, 0]}
        numTeeth={gearTwoTeethCount}
        radius={10.5}
        numTeeth1={gearOneTeethCount}
        numTeeth2={gearTwoTeethCount}
        clearance={0.0}
        backlash={0.0}
        thickness={2}
        rotationSpeed={gearTwoRotationalVelocity}
        color="teal"
        module={3}
        addendumFactor={1.75}
      />
    </>
  )
}

export default Movement;
