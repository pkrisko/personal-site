import React, { forwardRef } from 'react';
import GearPair from '@/components/watch/GearPair';

const IntermediateWheel = forwardRef(({
  position = [-37.5, 6.8, 6.0],
  spurTeethCount = 40,
  spurRadius = 30,
  pinionTeethCount = 10,
  pinionRadius = 10.2,
  ringInnerRadius = 4,
  ringOuterRadius = 13,
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
      pinionAddendumFactor={1.4}
      pinionRadius={pinionRadius}
      pinionTeethCount={pinionTeethCount}
    />
  );
});

IntermediateWheel.displayName = 'IntermediateWheel';

export default IntermediateWheel;
