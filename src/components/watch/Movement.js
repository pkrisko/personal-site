'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Gear from '@/components/watch/Gear';
import EscapementWheel from '@/components/watch/EscapementWheel';

function Movement() {
  // References to the gears
  const escapementWheelRef = useRef();
  const connectedGearRef = useRef();

  // Gear parameters
  const escapementTeethCount = 30;
  const pinionTeethCount = 15; // Pinion attached to escapement wheel
  const connectedGearTeethCount = 30; // Gear meshed with the pinion

  // Escapement wheel rotation parameters
  const period = 1; // Time between ticks
  const tickDuration = 0.1; // Duration of the tick movement
  const anglePerTooth = (2 * Math.PI) / escapementTeethCount;

  // State variables for the escapement wheel
  const elapsedTime = useRef(0);
  const escapementRotation = useRef(0);

  // State variables for the connected gear
  const connectedGearRotation = useRef(0);

  // Function to update gear rotation based on driving gear
  const updateGearRotation = (
    drivingGearDeltaRotation,
    drivingGearTeethCount,
    drivenGearRef,
    drivenGearTeethCount,
    drivenGearRotationRef
  ) => {
    const gearRatio = drivingGearTeethCount / drivenGearTeethCount;
    const deltaRotation = -drivingGearDeltaRotation * gearRatio;
    drivenGearRotationRef.current += deltaRotation;
    if (drivenGearRef.current) {
      drivenGearRef.current.rotation.z = drivenGearRotationRef.current;
    }
  };

  useFrame((_, delta) => {
    elapsedTime.current += delta;

    // Check if we're within the tick duration
    const isTicking = elapsedTime.current % period <= tickDuration;

    // Calculate the target rotation based on completed ticks
    const completedTicks = Math.floor(elapsedTime.current / period);
    const baseRotation = completedTicks * anglePerTooth;

    // Calculate rotation during the current tick
    let rotationThisFrame = 0;
    if (isTicking) {
      const tickProgress = (elapsedTime.current % period) / tickDuration;
      rotationThisFrame = anglePerTooth * tickProgress;
    } else {
      rotationThisFrame = anglePerTooth;
    }

    // Total rotation for the escapement wheel
    const newEscapementRotation = baseRotation + rotationThisFrame;

    // Calculate rotation difference
    const deltaEscapementRotation = newEscapementRotation - escapementRotation.current;
    escapementRotation.current = newEscapementRotation;

    // Update escapement wheel rotation
    if (escapementWheelRef.current) {
      escapementWheelRef.current.rotation.z = newEscapementRotation;
    }

    // Update connected gear rotation
    updateGearRotation(
      deltaEscapementRotation,
      pinionTeethCount,
      connectedGearRef,
      connectedGearTeethCount,
      connectedGearRotation
    );
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
      {/* Connected gear meshed with the pinion */}
      <Gear
        ref={connectedGearRef}
        position={[15.7, 3.4, 0]}
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
