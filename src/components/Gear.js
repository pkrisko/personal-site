'use client';

import React, { useRef, useMemo } from 'react';
import { Shape, ExtrudeGeometry, Path } from 'three';
import { useFrame } from '@react-three/fiber';

function Gear({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  radius = 1,
  innerRadius = 0.5,
  teeth = 20,
  toothDepth = 0.2,
  thickness = 0.5,
  rotationSpeed = 0,
  color = 'gray',
}) {
  const mesh = useRef();

  // Gear geometry with a donut hole
  const geometry = useMemo(() => {
    const shape = new Shape();

    const numTeeth = teeth;
    const outerRadius = radius + toothDepth;
    const anglePerTooth = (Math.PI * 2) / numTeeth;

    // Outer gear shape teeth
    for (let i = 0; i < numTeeth; i++) {
      const angle = i * anglePerTooth;
      const nextAngle = (i + 1) * anglePerTooth;
      const midAngle = angle + anglePerTooth / 2;

      const x1 = radius * Math.cos(angle);
      const y1 = radius * Math.sin(angle);

      const x2 = outerRadius * Math.cos(midAngle);
      const y2 = outerRadius * Math.sin(midAngle);

      const x3 = radius * Math.cos(nextAngle);
      const y3 = radius * Math.sin(nextAngle);

      if (i === 0) {
        shape.moveTo(x1, y1);
      } else {
        shape.lineTo(x1, y1);
      }

      shape.lineTo(x2, y2);
      shape.lineTo(x3, y3);
    }

    shape.closePath();

    // Hole in the center
    const hole = new Path();
    const numSegments = 32;
    const anglePerSegment = (Math.PI * 2) / numSegments;

    for (let i = 0; i <= numSegments; i++) {
      const angle = i * anglePerSegment;
      const x = innerRadius * Math.cos(angle);
      const y = innerRadius * Math.sin(angle);

      if (i === 0) {
        hole.moveTo(x, y);
      } else {
        hole.lineTo(x, y);
      }
    }

    shape.holes.push(hole);

    const extrudeSettings = {
      steps: 1,
      depth: thickness,
      bevelEnabled: false,
    };

    return new ExtrudeGeometry(shape, extrudeSettings);
  }, [radius, innerRadius, teeth, toothDepth, thickness]);

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
