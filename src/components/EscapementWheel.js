'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Shape, ExtrudeGeometry, Vector2, MathUtils } from 'three';
import { useFrame } from '@react-three/fiber';

function EscapementWheel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  numTeeth = 30,
  radius = 10,
  toothHeight = 3,
  toothWidth = 2,
  thickness = 0.5,
  period = 1, // Period in seconds
  tickDuration = 0.1, // Duration of rotation in seconds
  color = 'gray',
}) {
  const mesh = useRef();

  const geometry = useMemo(() => {
    const shape = new Shape();

    const anglePerTooth = (2 * Math.PI) / numTeeth;

    const liftAngleDegrees = 7.5; // Adjust this to change the angle of the tooth rise
    const gapAngleDegrees = 6; // Adjust this to change the gap between teeth

    const liftAngleOffset = MathUtils.degToRad(liftAngleDegrees);
    const gapAngleOffset = MathUtils.degToRad(gapAngleDegrees);

    // Starting point at base of the first tooth
    let baseTheta = 0;
    let baseX = radius * Math.cos(baseTheta);
    let baseY = radius * Math.sin(baseTheta);
    shape.moveTo(baseX, baseY);

    for (let i = 0; i < numTeeth; i++) {
      baseTheta = i * anglePerTooth;
      const nextBaseTheta = (i + 1) * anglePerTooth;

      const baseX = radius * Math.cos(baseTheta);
      const baseY = radius * Math.sin(baseTheta);

      const tipTheta = baseTheta + liftAngleOffset;
      const tipX = (radius + toothHeight) * Math.cos(tipTheta);
      const tipY = (radius + toothHeight) * Math.sin(tipTheta);

      const gapTheta = nextBaseTheta - gapAngleOffset;
      const gapX = radius * Math.cos(gapTheta);
      const gapY = radius * Math.sin(gapTheta);

      // Draw the tooth
      if (i > 0) {
        shape.lineTo(baseX, baseY);
      }

      shape.lineTo(tipX, tipY);
      shape.lineTo(gapX, gapY);

      // Move to the next base point to create a gap
      shape.lineTo(
        radius * Math.cos(nextBaseTheta),
        radius * Math.sin(nextBaseTheta)
      );
    }

    shape.closePath();

    // Define the central solid circle radius
    const centralCircleRadius = radius / 3; // Adjust as needed for central solid circle

    // Create the axle hole in the center
    const axleHoleRadius = 2; // Adjust as needed for small hole in center (axle)
    const axleHole = new Shape();
    const numSegments = 32;

    for (let i = 0; i <= numSegments; i++) {
      const angle = (i * 2 * Math.PI) / numSegments;
      const x = axleHoleRadius * Math.cos(angle);
      const y = axleHoleRadius * Math.sin(angle);

      if (i === 0) {
        axleHole.moveTo(x, y);
      } else {
        axleHole.lineTo(x, y);
      }
    }

    shape.holes.push(axleHole);

    // Create the holes between spokes
    const numSpokes = 8;
    const spokeAngleDegrees = 10; // Width of the spokes in degrees
    const spokeAngleRadians = MathUtils.degToRad(spokeAngleDegrees);
    const anglePerSpoke = (2 * Math.PI) / numSpokes;
    const halfSpokeAngle = spokeAngleRadians / 4.5;
    const rimThickness = 1.5; // Thickness of the outer rim

    const innerRadius = centralCircleRadius; // Radius of the central solid circle
    const outerRadius = radius - rimThickness; // Up to the base of the teeth minus rim thickness

    for (let i = 0; i < numSpokes; i++) {
      const hole = new Shape();

      // Angles for the gaps between spokes
      const thetaStart = i * anglePerSpoke + halfSpokeAngle;
      const thetaEnd = (i + 1) * anglePerSpoke - halfSpokeAngle;

      const holeSegments = 16; // Number of segments to approximate the hole shape

      // Move to the starting point on the inner radius
      hole.moveTo(
        innerRadius * Math.cos(thetaStart),
        innerRadius * Math.sin(thetaStart)
      );

      // Draw points along the outer radius from thetaStart to thetaEnd
      for (let j = 0; j <= holeSegments; j++) {
        const t = thetaStart + (j / holeSegments) * (thetaEnd - thetaStart);
        const x = outerRadius * Math.cos(t);
        const y = outerRadius * Math.sin(t);
        hole.lineTo(x, y);
      }

      // Draw points along the inner radius from thetaEnd back to thetaStart
      for (let j = holeSegments; j >= 0; j--) {
        const t = thetaStart + (j / holeSegments) * (thetaEnd - thetaStart);
        const x = innerRadius * Math.cos(t);
        const y = innerRadius * Math.sin(t);
        hole.lineTo(x, y);
      }

      shape.holes.push(hole);
    }

    // Extrude settings
    const extrudeSettings = {
      steps: 1,
      depth: thickness,
      bevelEnabled: false,
    };

    return new ExtrudeGeometry(shape, extrudeSettings);
  }, [numTeeth, radius, toothHeight, thickness]);

  // New code for ticking rotation
  const elapsedTime = useRef(0);
  const currentRotation = useRef(0);
  const targetRotation = useRef(0);
  const anglePerTooth = (2 * Math.PI) / numTeeth;

  useEffect(() => {
    if (mesh.current) {
      currentRotation.current = mesh.current.rotation.z;
      targetRotation.current = mesh.current.rotation.z;
    }
  }, []);

  useFrame((_, delta) => {
    if (mesh.current) {
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
        mesh.current.rotation.z = newRotation;
      } else {
        // Hold at target rotation
        mesh.current.rotation.z = targetRotation.current;
      }
    }
  });

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default EscapementWheel;
