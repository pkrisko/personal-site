'use client';

import React, { useRef, useMemo } from 'react';
import { Shape, ExtrudeGeometry, Path } from 'three';
import { useFrame } from '@react-three/fiber';

function Gear({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  module = 1,
  teeth = 20,
  thickness = 0.5,
  boreRadius = 0.5,
  rotationSpeed = 0,
  color = 'gray',
}) {
  const mesh = useRef();

  // Gear geometry
  const geometry = useMemo(() => {
    const shape = new Shape();

    const n = teeth; // Number of teeth
    const m = module; // Module
    const pitchRadius = (n * m) / 2; // Pitch circle radius
    const addendumRadius = pitchRadius + m; // Addendum circle radius
    const dedendumRadius = pitchRadius - 1.25 * m; // Dedendum circle radius

    const angularPitch = (2 * Math.PI) / n;
    const halfToothAngle = angularPitch / 2;

    for (let i = 0; i < n; i++) {
      const angle = i * angularPitch;

      // Calculate points for the tooth
      const theta1 = angle - halfToothAngle; // Start of tooth
      const theta2 = angle + halfToothAngle; // End of tooth

      // Move to dedendum circle at theta1
      const x1 = dedendumRadius * Math.cos(theta1);
      const y1 = dedendumRadius * Math.sin(theta1);

      if (i === 0) {
        shape.moveTo(x1, y1);
      } else {
        shape.lineTo(x1, y1);
      }

      // Left flank from dedendum to addendum
      shape.quadraticCurveTo(
        pitchRadius * Math.cos(theta1),
        pitchRadius * Math.sin(theta1),
        addendumRadius * Math.cos(angle),
        addendumRadius * Math.sin(angle)
      );

      // Right flank from addendum to dedendum
      shape.quadraticCurveTo(
        pitchRadius * Math.cos(theta2),
        pitchRadius * Math.sin(theta2),
        dedendumRadius * Math.cos(theta2),
        dedendumRadius * Math.sin(theta2)
      );
    }

    shape.closePath();

    // Hole in the center (bore)
    if (boreRadius > 0) {
      const hole = new Path();
      const numSegments = 32;
      const anglePerSegment = (Math.PI * 2) / numSegments;

      for (let i = 0; i <= numSegments; i++) {
        const angle = i * anglePerSegment;
        const x = boreRadius * Math.cos(angle);
        const y = boreRadius * Math.sin(angle);

        if (i === 0) {
          hole.moveTo(x, y);
        } else {
          hole.lineTo(x, y);
        }
      }

      shape.holes.push(hole);
    }

    const extrudeSettings = {
      steps: 1,
      depth: thickness,
      bevelEnabled: false,
    };

    return new ExtrudeGeometry(shape, extrudeSettings);
  }, [module, teeth, thickness, boreRadius]);

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
