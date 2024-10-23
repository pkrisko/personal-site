'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Pallet from '@/components/watch/Pallet';
import EscapementWheel from '@/components/watch/EscapementWheel';
import ThirdWheel from '@/components/watch/ThirdWheel';
import CenterWheel from '@/components/watch/CenterWheel';
import IntermediateWheel from '@/components/watch/IntermediateWheel';
import HourWheel from '@/components/watch/HourWheel';

// Escapement Wheel
const ESCAPEMENT_TEETH_COUNT = 30;
const ESCAPEMENT_WHEEL_PINION_TEETH_COUNT = 8;
// Center Wheel
const CENTER_WHEEL_SPUR_TEETH_COUNT = 64;
const CENTER_WHEEL_PINION_TEETH_COUNT = 8;
// Third Wheel
const THIRD_WHEEL_SPUR_TEETH_COUNT = 60;
const THIRD_WHEEL_PINION_TEETH_COUNT = 10;
// Intermediate Wheel
const INTERMEDIATE_WHEEL_SPUR_TEETH_COUNT = 40;
const INTERMEDIATE_WHEEL_PINION_TEETH_COUNT = 10;
// Hour Wheel
const HOUR_WHEEL_SPUR_TEETH_COUNT = 30;

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
    const gearRatioEscToCenter = ESCAPEMENT_WHEEL_PINION_TEETH_COUNT / CENTER_WHEEL_SPUR_TEETH_COUNT; // 8 / 64 = 1/8
    const deltaRotationCenter = -deltaEscapementRotation * gearRatioEscToCenter;
    connectedGearRotation.current += deltaRotationCenter;

    if (centerWheelRef.current) {
      centerWheelRef.current.rotation.z = connectedGearRotation.current;
    }

    // Update third wheel rotation
    const gearRatioCenterToThird = CENTER_WHEEL_PINION_TEETH_COUNT / THIRD_WHEEL_SPUR_TEETH_COUNT; // 8 / 60 = 2/15
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
      <CenterWheel
        ref={centerWheelRef}
        spurTeethCount={CENTER_WHEEL_SPUR_TEETH_COUNT}
        pinionTeethCount={CENTER_WHEEL_PINION_TEETH_COUNT}
      />
      <ThirdWheel
        ref={thirdWheelRef}
        spurTeethCount={THIRD_WHEEL_SPUR_TEETH_COUNT}
        pinionTeethCount={THIRD_WHEEL_PINION_TEETH_COUNT}
      />
      <IntermediateWheel
        spurTeethCount={INTERMEDIATE_WHEEL_SPUR_TEETH_COUNT}
        pinionTeethCount={INTERMEDIATE_WHEEL_PINION_TEETH_COUNT}
      />
      <HourWheel
        spurTeethCount={HOUR_WHEEL_SPUR_TEETH_COUNT}
      />
      <Pallet
        ref={palletRef}
        position={[-7.0, 79.6, 0]}
        rotation={[0, 0, 0]} // Rotation adjusted in useEscapementRotation
        thickness={2}
      />
    </>
  );
}

export default Movement;
