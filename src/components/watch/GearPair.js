'use client';

import React, { forwardRef, useMemo } from 'react';
import Gear from '@/components/watch/Gear';
import Spokes from '@/components/watch/Spokes';
import { Shape, ExtrudeGeometry } from 'three';

const GearPair = forwardRef(
  (
    {
      position = [0, 0, 0],
      rotation = [0, 0, 0],
      spurAddendumFactor = 1.75,
      spurModule = 3.0,
      spurRadius = 57.6,
      spurTeethCount = 60,
      pinionAddendumFactor = 1,
      pinionRadius = 3.0,
      ringInnerRadius = pinionRadius - 0.75,
      ringOuterRadius = pinionRadius + 0.75,
      pinionTeethCount = 8,
      numSpokes = 5,
    },
    ref
  ) => {
    // Create the ring shape (CD-like disc)
    const ringShape = useMemo(() => {
      const shape = new Shape();

      // Outer circle
      shape.absarc(0, 0, ringOuterRadius, 0, Math.PI * 2, false);

      // Inner hole
      const hole = new Shape();
      hole.absarc(0, 0, ringInnerRadius, 0, Math.PI * 2, true);
      shape.holes.push(hole);

      return shape;
    }, [ringInnerRadius, ringOuterRadius]);

    // Extrude the shape to create 3D geometry
    const ringGeometry = useMemo(() => {
      return new ExtrudeGeometry(ringShape, {
        depth: 2,
        bevelEnabled: false,
      });
    }, [ringShape]);

    return (
      <group position={position} rotation={rotation} ref={ref}>
        {/* Spur Gear */}
        <Gear
          addendumFactor={spurAddendumFactor}
          module={spurModule}
          numTeeth={spurTeethCount}
          radius={spurRadius}
        />

        {/* Central Ring (CD-shaped disc) */}
        <mesh geometry={ringGeometry} position={[0, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#D8DADA" />
        </mesh>

        {/* Spokes */}
        <Spokes
          thickness={2.5}
          numSpokes={numSpokes}
          innerRadius={ringOuterRadius - 1}
          outerRadius={spurRadius - 1}
        />

        {/* Pinion Gear */}
        <Gear
          position={[0, 0, 2]}
          numTeeth={pinionTeethCount}
          radius={pinionRadius}
          addendumFactor={pinionAddendumFactor}
        />
      </group>
    );
  }
);

GearPair.displayName = 'GearPair';

export default GearPair;
