'use client';

import React, { useRef, useMemo } from 'react';
import { Shape, ExtrudeGeometry, Vector2 } from 'three';
import { useFrame } from '@react-three/fiber';

function EscapementWheel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  numTeeth = 30,
  radius = 10,
  toothHeight = 2,
  toothWidth = 1,
  thickness = 0.5,
  rotationSpeed = 0,
  color = 'gray',
}) {
  const mesh = useRef();

  const geometry = useMemo(() => {
    const shape = new Shape();

    const anglePerTooth = (2 * Math.PI) / numTeeth;

    // Starting point at base of the first tooth
    let theta = 0;
    let x0 = radius * Math.cos(theta);
    let y0 = radius * Math.sin(theta);
    shape.moveTo(x0, y0);

    for (let i = 0; i < numTeeth; i++) {
      theta = i * anglePerTooth;
      const nextTheta = (i + 1) * anglePerTooth;

      // Points of the tooth
      const baseX = radius * Math.cos(theta);
      const baseY = radius * Math.sin(theta);

      const tipX = (radius + toothHeight) * Math.cos(theta);
      const tipY = (radius + toothHeight) * Math.sin(theta);

      const nextBaseX = radius * Math.cos(nextTheta);
      const nextBaseY = radius * Math.sin(nextTheta);

      // Draw the tooth
      shape.lineTo(tipX, tipY); // Rise up vertically
      shape.lineTo(nextBaseX, nextBaseY); // Back down at a diagonal
    }

    shape.closePath();

    // Create the hole in the center
    const hole = new Shape();
    const numSegments = 64;
    const holeRadius = radius / 5; // Adjust as needed

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
  }, [numTeeth, radius, toothHeight, thickness]);

  // Rotate the escapement wheel
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

export default EscapementWheel;
