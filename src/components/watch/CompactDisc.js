import React, { useMemo } from 'react';
import { Shape, ExtrudeGeometry } from 'three';

const CompactDisc = ({
  innerRadius = 1,
  outerRadius = 2,
  depth = 1,
  color = '#767A7A',
  children,
  ...props
}) => {
  const geometry = useMemo(() => {
    // Create the outer circle
    const shape = new Shape();
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

    // Create the hole (inner circle)
    const holePath = new Shape();
    holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    // Extrude settings
    const extrudeSettings = {
      depth: depth,
      bevelEnabled: false,
    };

    // Create the geometry by extruding the shape
    return new ExtrudeGeometry(shape, extrudeSettings);
  }, [innerRadius, outerRadius, depth]);

  return (
    <mesh geometry={geometry} {...props}>
      <meshStandardMaterial color={color} />
      {children}
    </mesh>
  );
}

CompactDisc.displayName = 'CompactDisc';

export default CompactDisc;
