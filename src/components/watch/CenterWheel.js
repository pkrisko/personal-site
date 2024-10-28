import React, { forwardRef } from 'react';
import GearPair from '@/components/watch/GearPair';

const CenterWheel = forwardRef(({
  position = [23.2, 0, 2.0],
  spurTeethCount = 64,
  spurRadius = 20.5,
  pinionTeethCount = 8,
  pinionRadius = 3.0,
}, ref) => {

  return (
    <group rotation={[0, 0, 0.375]}>
      <GearPair
        ref={ref}
        rotation={[0, 0, 0]}
        position={position}
        spurAddendumFactor={1.5}
        module={1}
        spurRadius={spurRadius}
        spurTeethCount={spurTeethCount}
        pinionAddendumFactor={1.0}
        pinionRadius={pinionRadius}
        pinionTeethCount={pinionTeethCount}
      />
    </group>
  );
});

CenterWheel.displayName = 'CenterWheel';

export default CenterWheel;
