'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import Pallet from '@/components/watch/Pallet';
import EscapementWheel from '@/components/watch/EscapementWheel';
import ThirdWheel from '@/components/watch/ThirdWheel';
import CenterWheel from '@/components/watch/CenterWheel';
import IntermediateWheel from '@/components/watch/IntermediateWheel';
import HourWheel from '@/components/watch/HourWheel';
import Dial from '@/components/watch/Dial';

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
const TICK_DURATION = 0.3; // Duration of the tick movement
const ESCAPEMENT_ANGLE_PER_TOOTH = -(Math.PI) / ESCAPEMENT_TEETH_COUNT; // Negative to reverse rotation
const PALLET_SWING_ANGLE = -6 * (Math.PI / 180);
const PALLET_PHASE_OFFSET = -Math.PI; // Phase offset to start the pallet at a different point

// Custom hook to handle escapement wheel rotation logic and pallet oscillation
const useEscapementRotation = (
  escapementRef,
  escapementRotation,
  centerWheelRef,
  centerWheelRotation,
  thirdWheelRef,
  thirdWheelRotation,
  intermediateWheelRef,
  intermediateWheelRotation,
  hourWheelRef,
  hourWheelRotation,
  palletRef,
) => {
  const elapsedTime = useRef(0);

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
    centerWheelRotation.current += deltaRotationCenter;

    if (centerWheelRef.current) {
      centerWheelRef.current.rotation.z = centerWheelRotation.current;
    }

    // Update third wheel rotation
    const gearRatioCenterToThird = CENTER_WHEEL_PINION_TEETH_COUNT / THIRD_WHEEL_SPUR_TEETH_COUNT; // 8 / 60 = 2/15
    const deltaRotationThird = -deltaRotationCenter * gearRatioCenterToThird;
    thirdWheelRotation.current += deltaRotationThird;

    if (thirdWheelRef.current) {
      thirdWheelRef.current.rotation.z = thirdWheelRotation.current;
    }

    // Intermediate wheel
    const gearRatioThirdToIntermediate = THIRD_WHEEL_PINION_TEETH_COUNT / INTERMEDIATE_WHEEL_SPUR_TEETH_COUNT; // 10 / 40 = 1/4
    const deltaRotationIntermediate = -deltaRotationThird * gearRatioThirdToIntermediate;
    intermediateWheelRotation.current += deltaRotationIntermediate;

    if (intermediateWheelRef.current) {
      intermediateWheelRef.current.rotation.z = intermediateWheelRotation.current;
    }

    // Hour wheel
    const gearRatioIntermediateToHour = INTERMEDIATE_WHEEL_PINION_TEETH_COUNT / HOUR_WHEEL_SPUR_TEETH_COUNT; // 10 / 30 = 1/3
    const deltaRotationHour = -deltaRotationIntermediate * gearRatioIntermediateToHour;
    hourWheelRotation.current += deltaRotationHour;

    if (hourWheelRef.current) {
      hourWheelRef.current.rotation.z = hourWheelRotation.current;
    }

    // Calculate pallet oscillation with phase and clockwise offset
    const palletProgress = (elapsedTime.current % TICK_PERIOD) / TICK_PERIOD;
    const palletAngle = PALLET_SWING_ANGLE * Math.sin(palletProgress * Math.PI * 2 + PALLET_PHASE_OFFSET);

    if (palletRef.current) {
      palletRef.current.rotation.z = palletAngle - Math.PI / 2;
    }
  });
};

function Movement() {
  // References to the components
  const escapementWheelRef = useRef();
  const centerWheelRef = useRef();
  const thirdWheelRef = useRef();
  const intermediateWheelRef = useRef();
  const hourWheelRef = useRef();
  const palletRef = useRef();

  const escapementRotation = useRef(0);
  const centerWheelRotation = useRef(0);
  const thirdWheelRotation = useRef(-0.095);
  const intermediateWheelRotation = useRef(0.1);
  const hourWheelRotation = useRef(0);

  const [showDial, setShowDial] = useState(true);

  // Hook to handle gear rotations, including pallet oscillation
  useEscapementRotation(
    escapementWheelRef,
    escapementRotation,
    centerWheelRef,
    centerWheelRotation,
    thirdWheelRef,
    thirdWheelRotation,
    intermediateWheelRef,
    intermediateWheelRotation,
    hourWheelRef,
    hourWheelRotation,
    palletRef,
  );

  return (
    <>
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
        ref={intermediateWheelRef}
        spurTeethCount={INTERMEDIATE_WHEEL_SPUR_TEETH_COUNT}
        pinionTeethCount={INTERMEDIATE_WHEEL_PINION_TEETH_COUNT}
      />
      <HourWheel
        ref={hourWheelRef}
        spurTeethCount={HOUR_WHEEL_SPUR_TEETH_COUNT}
      />
      {showDial && <Dial />}
      <Pallet
        ref={palletRef}
        position={[0, 79.6, 0]}
        rotation={[0, 0, 0]} // Rotation adjusted in useEscapementRotation
        thickness={2}
        showDial={showDial}
        setShowDial={setShowDial}
      />
    </>
  );
}

export default Movement;
