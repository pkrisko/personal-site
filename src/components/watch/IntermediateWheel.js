import React, { forwardRef } from 'react';
import GearPair from '@/components/watch/GearPair';

const IntermediateWheel = forwardRef(({
  position = [-37.4, 7.1, 6.0],
  spurTeethCount = 40,
  spurRadius = 30,
  pinionTeethCount = 10,
  pinionRadius = 9.2,
  ringInnerRadius = 4,
  ringOuterRadius = 11.0,
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
      pinionAddendumFactor={1.0}
      pinionRadius={pinionRadius}
      pinionTeethCount={pinionTeethCount}
    />
  );
});

IntermediateWheel.displayName = 'IntermediateWheel';

export default IntermediateWheel;
