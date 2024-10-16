'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Gear from '@/components/watch/Gear';
import Pallet from '@/components/watch/Pallet';
import EscapementWheel from '@/components/watch/EscapementWheel';

// Constants for gear parameters and rotation behavior
const ESCAPEMENT_TEETH_COUNT = 30;
const PINION_TEETH_COUNT = 15;
const CONNECTED_GEAR_TEETH_COUNT = 30;
const TICK_PERIOD = 1; // Time between ticks
const TICK_DURATION = 0.4; // Duration of the tick movement
const ESCAPEMENT_ANGLE_PER_TOOTH = (2 * Math.PI) / ESCAPEMENT_TEETH_COUNT;

// Custom hook to manage gear rotation
const useGearRotation = (ref, drivingDeltaRotation, drivingTeeth, drivenTeeth, drivenRotation) => {
  const gearRatio = drivingTeeth / drivenTeeth;
  const deltaRotation = -drivingDeltaRotation * gearRatio;
  drivenRotation.current += deltaRotation;

  if (ref.current) {
    ref.current.rotation.z = drivenRotation.current;
  }
};

// Custom hook to handle escapement wheel rotation logic
const useEscapementRotation = (escapementRef, connectedGearRef, connectedGearRotation) => {
  const elapsedTime = useRef(0);
  const escapementRotation = useRef(0);

  useFrame((_, delta) => {
    elapsedTime.current += delta;

    const isTicking = elapsedTime.current % TICK_PERIOD <= TICK_DURATION;
    const completedTicks = Math.floor(elapsedTime.current / TICK_PERIOD);
    const baseRotation = completedTicks * ESCAPEMENT_ANGLE_PER_TOOTH;

    let rotationThisFrame = isTicking
      ? ESCAPEMENT_ANGLE_PER_TOOTH * ((elapsedTime.current % TICK_PERIOD) / TICK_DURATION)
      : ESCAPEMENT_ANGLE_PER_TOOTH;

    const newEscapementRotation = baseRotation + rotationThisFrame;
    const deltaEscapementRotation = newEscapementRotation - escapementRotation.current;
    escapementRotation.current = newEscapementRotation;

    if (escapementRef.current) {
      escapementRef.current.rotation.z = newEscapementRotation;
    }

    // Update connected gear rotation
    useGearRotation(
      connectedGearRef,
      deltaEscapementRotation,
      PINION_TEETH_COUNT,
      CONNECTED_GEAR_TEETH_COUNT,
      connectedGearRotation
    );
  });
};

function Movement() {
  // References to the components
  const escapementWheelRef = useRef();
  const connectedGearRef = useRef();
  const palletRef = useRef();
  const connectedGearRotation = useRef(0);

  // Hook to handle escapement and connected gear rotations
  useEscapementRotation(escapementWheelRef, connectedGearRef, connectedGearRotation);

  return (
    <>
      <EscapementWheel
        ref={escapementWheelRef}
        position={[0, 0, -2]}
        numTeeth={ESCAPEMENT_TEETH_COUNT}
        radius={27}
        toothHeight={5.5}
        thickness={2}
      />
      <Gear
        ref={connectedGearRef}
        position={[15.7, 3.4, 0]}
        numTeeth={CONNECTED_GEAR_TEETH_COUNT}
        radius={10.5}
        numTeeth1={PINION_TEETH_COUNT}
        numTeeth2={CONNECTED_GEAR_TEETH_COUNT}
        clearance={0.0}
        backlash={0.0}
        thickness={2}
        color="#c0c6c7" // steel gray
        module={3}
        addendumFactor={1.75}
      />
      <Pallet
        ref={palletRef}
        position={[0, 44, -1]}
        rotation={[0, 0, Math.PI / 2]}
        thickness={2}
      />
    </>
  );
}

export default Movement;
