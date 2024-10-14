'use client';

import React, { useRef, useMemo } from 'react';
import { Shape, ExtrudeGeometry, Vector2 } from 'three';
import { useFrame } from '@react-three/fiber';

function Gear({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  numTeeth = 14,
  module = 1,
  numTeeth1 = 5,      // For hypocycloid (pinion)
  numTeeth2 = 5,      // For epicycloid (wheel)
  clearance = 0.25,
  backlash = 0.0,
  head = 0.0,
  thickness = 0.5,
  rotationSpeed = 0,
  color = 'gray',
}) {
  const mesh = useRef();

  const geometry = useMemo(() => {
    const shape = new Shape();

    // Gear calculations based on cycloidal gear design
    const m = module;
    const z = numTeeth;
    const z1 = numTeeth1;
    const z2 = numTeeth2;
    const c = clearance;
    const b = backlash;
    const h = head;

    const d = z * m;                 // Pitch diameter
    const d1 = z1 * m;               // Generating circle diameter for hypocycloid
    const d2 = z2 * m;               // Generating circle diameter for epicycloid
    const da = d + 2 * (1 + h) * m;  // Addendum diameter
    const di = d - 2 * (1 + c) * m;  // Dedendum diameter
    const phi = m * Math.PI;         // Circular pitch
    const phipart = (2 * Math.PI) / z; // Angle per tooth
    const angularBacklash = b / (d / 2);

    // Functions for epicycloid and hypocycloid curves
    const epicycloid = (t) => {
      const x = ((d2 + d) * Math.cos(t)) / 2 - (d2 * Math.cos(((1 + d / d2) * t))) / 2;
      const y = ((d2 + d) * Math.sin(t)) / 2 - (d2 * Math.sin(((1 + d / d2) * t))) / 2;
      return new Vector2(x, y);
    };

    const hypocycloid = (t) => {
      const x = ((d - d1) * Math.cos(t)) / 2 + (d1 * Math.cos(((d / d1 - 1) * t))) / 2;
      const y = ((d - d1) * Math.sin(t)) / 2 - (d1 * Math.sin(((d / d1 - 1) * t))) / 2;
      return new Vector2(x, y);
    };

    // Calculate start and end parameters for the tooth profile
    const innerEnd = () => {
      return -(
        (d1 *
          Math.acos(
            (2 * d1 ** 2 - di ** 2 - 2 * d1 * d + d ** 2) /
              (2 * d1 * (d1 - d))
          )) /
        d
      );
    };

    const outerEnd = () => {
      return (
        (d2 *
          Math.acos(
            (2 * d2 ** 2 - da ** 2 + 2 * d2 * d + d ** 2) /
              (2 * d2 * (d2 + d))
          )) /
        d
      );
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
    for (let i = 0; i <= numSegments; i++) {
      const angle = (i * 2 * Math.PI) / numSegments;
      const x = (d / 2 - 2 * m) * Math.cos(angle);
      const y = (d / 2 - 2 * m) * Math.sin(angle);

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
    module,
    numTeeth1,
    numTeeth2,
    clearance,
    backlash,
    head,
    thickness,
  ]);

  // Rotate the gear
  useFrame((_, delta) => {
    if (rotationSpeed && mesh.current) {
      mesh.current.rotation.z += rotationSpeed * delta;
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

export default Gear;
