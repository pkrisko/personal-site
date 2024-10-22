'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import GearPair from '@/components/watch/GearPair';
import Pallet from '@/components/watch/Pallet';
import EscapementWheel from '@/components/watch/EscapementWheel';
import ThirdWheel from '@/components/watch/ThirdWheel';

// Constants for gear parameters and rotation behavior
const ESCAPEMENT_TEETH_COUNT = 30;
const PINION_TEETH_COUNT = 8; // Escapement pinion teeth count
const CONNECTED_GEAR_TEETH_COUNT = 64; // Center wheel teeth count
const CENTER_WHEEL_PINION_TEETH_COUNT = 8; // Center wheel pinion teeth count
const THIRD_WHEEL_TEETH_COUNT = 60; // Third wheel teeth count

const TICK_PERIOD = 2; // Time between ticks
const ESCAPEMENT_ROTATION_RATE = TICK_PERIOD / 2;
const TICK_DURATION = 0.4; // Duration of the tick movement
const ESCAPEMENT_ANGLE_PER_TOOTH = -(Math.PI) / ESCAPEMENT_TEETH_COUNT; // Negative to reverse rotation
const PALLET_SWING_ANGLE = 5.9 * (Math.PI / 180); // ~5.9 degrees in radians
const PALLET_PHASE_OFFSET = -Math.PI; // Phase offset to start the pallet at a different point
const PALLET_CLOCKWISE_OFFSET = 5 * Math.PI / 180; // Slight clockwise offset (1 degree)

// Custom hook to handle escapement wheel rotation logic and pallet oscillation
const useEscapementRotation = (
  escapementRef,
  centerWheelRef,
  connectedGearRotation,
  palletRef,
  thirdWheelRef,
  thirdWheelRotation
) => {
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

    // Update connected gear rotation (Center Wheel)
    const gearRatioEscToCenter = PINION_TEETH_COUNT / CONNECTED_GEAR_TEETH_COUNT; // 8 / 64 = 1/8
    const deltaRotationCenter = -deltaEscapementRotation * gearRatioEscToCenter;
    connectedGearRotation.current += deltaRotationCenter;

    if (centerWheelRef.current) {
      centerWheelRef.current.rotation.z = connectedGearRotation.current;
    }

    // Update third wheel rotation
    const gearRatioCenterToThird = CENTER_WHEEL_PINION_TEETH_COUNT / THIRD_WHEEL_TEETH_COUNT; // 8 / 60 = 2/15
    const deltaRotationThird = -deltaRotationCenter * gearRatioCenterToThird;
    thirdWheelRotation.current += deltaRotationThird;

    if (thirdWheelRef.current) {
      thirdWheelRef.current.rotation.z = thirdWheelRotation.current;
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
  const thirdWheelRef = useRef();
  const connectedGearRotation = useRef(0);
  const thirdWheelRotation = useRef(0);

  // Hook to handle escapement and connected gear rotations, including pallet oscillation
  useEscapementRotation(
    escapementWheelRef,
    centerWheelRef,
    connectedGearRotation,
    palletRef,
    thirdWheelRef,
    thirdWheelRotation
  );

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
        ref={centerWheelRef}
        position={[65.2, 8.7, 2.0]}
        spurRadius={57.6}
        spurTeethCount={CONNECTED_GEAR_TEETH_COUNT}
        pinionRadius={7.2}
        pinionTeethCount={PINION_TEETH_COUNT}
      />
      {/* Third Wheel */}
      <ThirdWheel
        ref={thirdWheelRef}
        // Add other necessary props for your ThirdWheel component
      />
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
