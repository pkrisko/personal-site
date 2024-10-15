'use client';

import React, { forwardRef, useMemo } from 'react';
import { Shape, ExtrudeGeometry, Vector2 } from 'three';

const Gear = forwardRef(
  (
    {
      position = [0, 0, 0],
      rotation = [0, 0, 0],
      numTeeth = 14,
      radius = null, // Pitch radius
      module = 1, // Module (recalculated if radius is provided)
      numTeeth1 = null, // Hypocycloid generating circle teeth (pinion)
      numTeeth2 = null, // Epicycloid generating circle teeth (wheel)
      clearance = 0.25,
      backlash = 0.0,
      thickness = 0.5,
      color = 'gray',
      addendumFactor = 1.0, // New parameter for addendum factor
    },
    ref
  ) => {
  const geometry = useMemo(() => {
    const shape = new Shape();

    // Gear calculations based on cycloidal gear design according to B.S. 978

    let m = module;
    const z = numTeeth;

    // If radius is provided, calculate module
    if (radius !== null) {
      const D = radius * 2; // Pitch diameter
      m = D / z;
    }

    const f_a = addendumFactor;     // Addendum factor (user-defined)
    const f_r = 1.4 * f_a;          // Equation (18)
    const f_prac = 0.95 * f_a;      // Equation (21)
    const a_h = m * f_prac;         // Equation (22), practical addendum height
    const f_d = 1.25;               // Standard dedendum factor
    const d_h = m * f_d;            // Dedendum height

    const d = z * m;                // Pitch diameter

    const da = d + 2 * a_h;         // Addendum diameter
    const di = d - 2 * d_h;         // Dedendum diameter

    const phipart = (2 * Math.PI) / z; // Angle per tooth
    const angularBacklash = backlash / (d / 2);

    // Generating circle diameters
    const z1 = numTeeth1 !== null ? numTeeth1 : z / 2; // Hypocycloid
    const z2 = numTeeth2 !== null ? numTeeth2 : z / 2; // Epicycloid
    const d1 = z1 * m;               // Hypocycloid generating circle diameter
    const d2 = z2 * m;               // Epicycloid generating circle diameter

    // Functions for epicycloid and hypocycloid curves
    const epicycloid = (t) => {
      const x =
        ((d2 + d) * Math.cos(t)) / 2 -
        (d2 * Math.cos(((d2 + d) * t) / d2)) / 2;
      const y =
        ((d2 + d) * Math.sin(t)) / 2 -
        (d2 * Math.sin(((d2 + d) * t) / d2)) / 2;
      return new Vector2(x, y);
    };

    const hypocycloid = (t) => {
      const x =
        ((d - d1) * Math.cos(t)) / 2 +
        (d1 * Math.cos(((d - d1) * t) / d1)) / 2;
      const y =
        ((d - d1) * Math.sin(t)) / 2 -
        (d1 * Math.sin(((d - d1) * t) / d1)) / 2;
      return new Vector2(x, y);
    };

    // Calculate start and end parameters for the tooth profile
    const innerEnd = () => {
      const numerator = 2 * d1 ** 2 - di ** 2 - 2 * d1 * d + d ** 2;
      const denominator = 2 * d1 * (d1 - d);
      const ratio = numerator / denominator;
      if (ratio < -1 || ratio > 1) {
        console.warn('Invalid value for innerEnd acos argument:', ratio);
      }
      return -((d1 * Math.acos(Math.max(-1, Math.min(1, ratio)))) / d);
    };

    const outerEnd = () => {
      const numerator = 2 * d2 ** 2 - da ** 2 + 2 * d2 * d + d ** 2;
      const denominator = 2 * d2 * (d2 + d);
      const ratio = numerator / denominator;
      if (ratio < -1 || ratio > 1) {
        console.warn('Invalid value for outerEnd acos argument:', ratio);
      }
      return ((d2 * Math.acos(Math.max(-1, Math.min(1, ratio)))) / d);
    };

    // Generate the tooth profile points
    const generateToothProfile = () => {
      const tInnerEnd = innerEnd();
      const tOuterEnd = outerEnd();
      const numPoints = 20; // Increase for smoother curves

      const tValsOuter = [];
      const tValsInner = [];

      for (let i = 0; i <= numPoints; i++) {
        tValsOuter.push((tOuterEnd * i) / numPoints);
        tValsInner.push(tInnerEnd + ((0 - tInnerEnd) * i) / numPoints);
      }

      const ptsOuter = tValsOuter.map((t) => epicycloid(t));
      const ptsInner = tValsInner.map((t) => hypocycloid(t));

      // Combine inner and outer points
      let toothProfile = [...ptsInner.slice(0, -1), ...ptsOuter];

      // Rotate and apply backlash
      const rotationAngle = -phipart / 4 + angularBacklash / 2;
      const cosTheta = Math.cos(rotationAngle);
      const sinTheta = Math.sin(rotationAngle);

      toothProfile = toothProfile.map((pt) => {
        return new Vector2(
          pt.x * cosTheta - pt.y * sinTheta,
          pt.x * sinTheta + pt.y * cosTheta
        );
      });

      // Reflect to get the other side of the tooth
      const reflectedProfile = toothProfile
        .map((pt) => new Vector2(pt.x, -pt.y))
        .reverse();

      // Combine profiles
      const fullTooth = [...toothProfile, ...reflectedProfile];

      return fullTooth;
    };

    // Generate the full gear by rotating the tooth profile
    const toothProfile = generateToothProfile();

    for (let i = 0; i < z; i++) {
      const angle = (i * 2 * Math.PI) / z;
      const cosAngle = Math.cos(angle);
      const sinAngle = Math.sin(angle);

      const rotatedTooth = toothProfile.map((pt) => {
        return new Vector2(
          pt.x * cosAngle - pt.y * sinAngle,
          pt.x * sinAngle + pt.y * cosAngle
        );
      });

      if (i === 0) {
        shape.moveTo(rotatedTooth[0].x, rotatedTooth[0].y);
      } else {
        shape.lineTo(rotatedTooth[0].x, rotatedTooth[0].y);
      }

      rotatedTooth.forEach((pt) => {
        shape.lineTo(pt.x, pt.y);
      });
    }

    shape.closePath();

    // Create the hole in the center
    const hole = new Shape();

    const numSegments = 64;
    const holeRadius = d / 2 - 2 * m; // Adjust as needed
    for (let i = 0; i <= numSegments; i++) {
      const angle = (i * 2 * Math.PI) / numSegments;
      const x = holeRadius * Math.cos(angle);
      const y = holeRadius * Math.sin(angle);

      if (i === 0) {
        hole.moveTo(x, y);
      } else {
        hole.lineTo(x, y);
      }
    }

    shape.holes.push(hole);

    // Extrude settings
    const extrudeSettings = {
      steps: 1,
      depth: thickness,
      bevelEnabled: false,
    };

    return new ExtrudeGeometry(shape, extrudeSettings);
  }, [
    numTeeth,
    radius,
    module,
    numTeeth1,
    numTeeth2,
    clearance,
    backlash,
    thickness,
    addendumFactor, // Added to dependencies
  ]);

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} />
    </mesh>
  );
});

Gear.displayName = 'Gear';

export default Gear;
