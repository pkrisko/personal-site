import React, { forwardRef } from 'react';
import GearPair from '@/components/watch/GearPair';

const CenterWheel = forwardRef(({
  position = [65.2, 8.7, 2.0],
  spurTeethCount = 64,
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
    </group>
  );
});

CenterWheel.displayName = 'CenterWheel';

export default CenterWheel;
