'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Gear from '@/components/watch/Gear';
import EscapementWheel from '@/components/watch/EscapementWheel';

function Movement() {
  const connectedGearRef = useRef();
  const escapementWheelRef = useRef();

  const period = 1;
  const tickDuration = 0.1; // Not "Tick" in game clock sense, but the duration of the escapement wheel rotation

  // Define teeth counts
  const escapementTeethCount = 30;
  const pinionTeethCount = 15; // The pinion gear attached to escapement wheel
  const connectedGearTeethCount = 30; // The gear connected to the pinion

  // New code for ticking rotation
  const elapsedTime = useRef(0);
  const currentRotation = useRef(0);
  const targetRotation = useRef(0);
  const anglePerTooth = (2 * Math.PI) / escapementTeethCount;

  useFrame(function rotateEscapementWheel(_, delta) {
    if (escapementWheelRef.current) {
      elapsedTime.current += delta;

      if (elapsedTime.current >= period) {
        // Start a new tick
        elapsedTime.current = 0;
        // Update the current rotation to target rotation
        currentRotation.current = targetRotation.current;
        // Set new target rotation
        targetRotation.current += anglePerTooth;
      }

      if (elapsedTime.current <= tickDuration) {
        // Interpolate rotation from currentRotation to targetRotation over tickDuration
        const t = elapsedTime.current / tickDuration;
        const newRotation = currentRotation.current + t * anglePerTooth;
        escapementWheelRef.current.rotation.z = newRotation;
      } else {
        // Hold at target rotation
        escapementWheelRef.current.rotation.z = targetRotation.current;
      }
    }
  });

  return (
    <>
      <EscapementWheel
        ref={escapementWheelRef}
        position={[0, 0, -2]}
        numTeeth={escapementTeethCount}
        radius={27}
        toothHeight={7.5}
        thickness={2}
        color="gray"
      />
      {/* Gear connected to escapement pinion */}
      <Gear
        ref={connectedGearRef}
        position={[15.7, 3.3, 0]}
        numTeeth={connectedGearTeethCount}
        radius={10.5}
        numTeeth1={pinionTeethCount}
        numTeeth2={connectedGearTeethCount}
        clearance={0.0}
        backlash={0.0}
        thickness={2}
        color="teal"
        module={3}
        addendumFactor={1.75}
      />
    </>
  );
}

export default Movement;
