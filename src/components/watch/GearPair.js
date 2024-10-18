'use client';

import React, { forwardRef } from 'react';
import Gear from '@/components/watch/Gear';


const GearPair = forwardRef(
  (
    {
      position = [0, 0, 0],
      spurAddendumFactor = 1.75,
      spurRadius = 57.6,
      spurTeethCount = 60,
      pinionAddendumFactor = 1,
      pinionRadius = 7.2,
      pinionTeethCount = 8,
    },
    ref
  ) => {
    return (
      <group position={position} ref={ref}>
        {/* Spur Gear */}
        <Gear
          numTeeth={spurTeethCount}
          radius={spurRadius}
          addendumFactor={spurAddendumFactor}
        />
        {/* Pinion Gear */}
        <Gear
          position={[0, 0, 2]}
          numTeeth={pinionTeethCount}
          radius={pinionRadius}
          addendumFactor={pinionAddendumFactor}
        />
      </group>
    );
  }
);

GearPair.displayName = 'GearPair';

export default GearPair;
