'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import GearPair from '@/components/watch/GearPair';
import Pallet from '@/components/watch/Pallet';
import EscapementWheel from '@/components/watch/EscapementWheel';
import ThirdWheel from '@/components/watch/ThirdWheel';

// Constants for gear parameters and rotation behavior
const ESCAPEMENT_TEETH_COUNT = 30;
const PINION_TEETH_COUNT = 8;
const CONNECTED_GEAR_TEETH_COUNT = 64;
const TICK_PERIOD = 2; // Time between ticks
const ESCAPEMENT_ROTATION_RATE = TICK_PERIOD / 2;
const TICK_DURATION = 0.4; // Duration of the tick movement
const ESCAPEMENT_ANGLE_PER_TOOTH = -(Math.PI) / ESCAPEMENT_TEETH_COUNT; // Negative to reverse rotation
const PALLET_SWING_ANGLE = 5.9 * (Math.PI / 180); // ~5.9 degrees in radians
const PALLET_PHASE_OFFSET = -Math.PI; // Phase offset to start the pallet at a different point
const PALLET_CLOCKWISE_OFFSET = 5 * Math.PI / 180; // Slight clockwise offset (1 degree)

// Custom hook to handle escapement wheel rotation logic and pallet oscillation
const useEscapementRotation = (escapementRef, centerWheelRef, connectedGearRotation, palletRef) => {
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

    if (centerWheelRef.current) {
      centerWheelRef.current.rotation.z = connectedGearRotation.current;
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
  const centerWheelRef = useRef();
  const palletRef = useRef();
  const connectedGearRotation = useRef(0);

  // Hook to handle escapement and connected gear rotations, including pallet oscillation
  useEscapementRotation(escapementWheelRef, centerWheelRef, connectedGearRotation, palletRef);

  return (
    <>
      {/* Escapement Wheel */}
      <EscapementWheel
        ref={escapementWheelRef}
        position={[0, 0, 0]}
        numTeeth={ESCAPEMENT_TEETH_COUNT}
        radius={45}
        toothHeight={5.5}
        thickness={2}
      />
      {/* Center Wheel and Pinion */}
      <GearPair
        position={[65.2, 8.7, 2.0]}
        ref={centerWheelRef}
        spurRadius={57.6}
        spurTeethCount={CONNECTED_GEAR_TEETH_COUNT}
        pinionRadius={7.2}
        pinionTeethCount={PINION_TEETH_COUNT}
      />
      <ThirdWheel position={[0, 0, 4]} />
      {/* Pallet Fork */}
      <Pallet
        ref={palletRef}
        position={[-7.0, 79.6, 0]}
        rotation={[0, 0, 0]} // Base rotation, with further adjustment in the hook
        thickness={2}
      />
    </>
  );
}

export default Movement;
