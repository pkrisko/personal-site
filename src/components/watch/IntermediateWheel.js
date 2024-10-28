import React, { forwardRef } from 'react';
import GearPair from '@/components/watch/GearPair';

const IntermediateWheel = forwardRef(({
  position = [-12.75, 0, 6.0],
  spurTeethCount = 40,
  spurRadius = 10,
  pinionTeethCount = 10,
  pinionRadius = 2.5,
  ringInnerRadius = 1.5,
  ringOuterRadius = 2.5,
}, ref) => {

  return (
    <GearPair
      ref={ref}
      position={position}
      ringInnerRadius={ringInnerRadius}
      ringOuterRadius={ringOuterRadius}
      spurAddendumFactor={1.5}
      spurRadius={spurRadius}
      spurTeethCount={spurTeethCount}
      pinionAddendumFactor={1.3}
      pinionRadius={pinionRadius}
      pinionTeethCount={pinionTeethCount}
    />
  );
});

IntermediateWheel.displayName = 'IntermediateWheel';

export default IntermediateWheel;
