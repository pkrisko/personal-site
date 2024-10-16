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
const TICK_PERIOD = 2; // Time between ticks
const ESCAPEMENT_ROTATION_RATE = TICK_PERIOD / 2;
const TICK_DURATION = 0.5; // Duration of the tick movement
const ESCAPEMENT_ANGLE_PER_TOOTH = (Math.PI) / ESCAPEMENT_TEETH_COUNT;
const PALLET_SWING_ANGLE = 5.9 * (Math.PI / 180); // ~10 degrees in radians
const PALLET_PHASE_OFFSET = -Math.PI; // Phase offset to start the pallet at a different point
const PALLET_CLOCKWISE_OFFSET = -5 * Math.PI / 180; // Slight clockwise offset (1 degree)

// Custom hook to handle escapement wheel rotation logic and pallet oscillation
const useEscapementRotation = (escapementRef, connectedGearRef, connectedGearRotation, palletRef) => {
  const elapsedTime = useRef(0);
  const escapementRotation = useRef(0);

  useFrame((_, delta) => {
    elapsedTime.current += delta;

    const isTicking = elapsedTime.current % ESCAPEMENT_ROTATION_RATE <= TICK_DURATION;
    const completedTicks = Math.floor(elapsedTime.current / ESCAPEMENT_ROTATION_RATE);
    const baseRotation = completedTicks * ESCAPEMENT_ANGLE_PER_TOOTH;

    let rotationThisFrame = isTicking
      ? ESCAPEMENT_ANGLE_PER_TOOTH * ((elapsedTime.current % ESCAPEMENT_ROTATION_RATE) / TICK_DURATION)
      : ESCAPEMENT_ANGLE_PER_TOOTH;

    const newEscapementRotation = baseRotation + rotationThisFrame;
    const deltaEscapementRotation = newEscapementRotation - escapementRotation.current;
    escapementRotation.current = newEscapementRotation;

    if (escapementRef.current) {
      escapementRef.current.rotation.z = newEscapementRotation;
    }

    // Update connected gear rotation
    const gearRatio = PINION_TEETH_COUNT / CONNECTED_GEAR_TEETH_COUNT;
    const deltaRotation = -deltaEscapementRotation * gearRatio;
    connectedGearRotation.current += deltaRotation;

    if (connectedGearRef.current) {
      connectedGearRef.current.rotation.z = connectedGearRotation.current;
    }

    // Calculate pallet oscillation with phase and clockwise offset
    const palletProgress = (elapsedTime.current % TICK_PERIOD) / TICK_PERIOD;
    const palletAngle = PALLET_SWING_ANGLE * Math.sin(palletProgress * Math.PI * 2 + PALLET_PHASE_OFFSET);

    if (palletRef.current) {
      palletRef.current.rotation.z = palletAngle - Math.PI / 2 + PALLET_CLOCKWISE_OFFSET;
    }
  });
};

function Movement() {
  // References to the components
  const escapementWheelRef = useRef();
  const connectedGearRef = useRef();
  const palletRef = useRef();
  const connectedGearRotation = useRef(0);

  // Hook to handle escapement and connected gear rotations, including pallet oscillation
  useEscapementRotation(escapementWheelRef, connectedGearRef, connectedGearRotation, palletRef);

  return (
    <>
      <EscapementWheel
        ref={escapementWheelRef}
        position={[0, 0, -2]}
        numTeeth={ESCAPEMENT_TEETH_COUNT}
        radius={27}
        toothHeight={3.5}
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
        color="#EAECEC"
        module={3}
        addendumFactor={1.75}
      />
      <Pallet
        ref={palletRef}
        position={[4.5, 51.5, -1]}
        rotation={[0, 0, 0]} // Base rotation, with further adjustment in the hook
        thickness={2}
      />
    </>
  );
}

export default Movement;
