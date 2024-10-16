'use client';

import React, { forwardRef, useMemo } from 'react';
import { Shape, ExtrudeGeometry, Vector2, BoxGeometry } from 'three';

const createArmGeometry = (armLength, armWidth, depth, rotationAngle) => {
  const armShape = new Shape();
  armShape.moveTo(0, 0);
  armShape.lineTo(0, armWidth);
  armShape.lineTo(armLength, armWidth);
  armShape.lineTo(armLength, 0);
  armShape.closePath();

  const armGeometry = new ExtrudeGeometry(armShape, {
    steps: 1,
    depth: depth,
    bevelEnabled: false,
  });

  armGeometry.translate(0, -armWidth / 2, -depth / 2);
  armGeometry.rotateZ(rotationAngle);

  return armGeometry;
};

const createArcGeometry = (curveRadius, depth) => {
  const arcShape = new Shape();
  const arcStart = new Vector2(-curveRadius, 0);
  const arcEnd = new Vector2(curveRadius, 0);
  arcShape.moveTo(arcStart.x, arcStart.y);
  arcShape.quadraticCurveTo(0, curveRadius, arcEnd.x, arcEnd.y);

  return new ExtrudeGeometry(arcShape, {
    steps: 1,
    depth: depth,
    bevelEnabled: false,
  });
};

const createRubyGeometry = (rubyWidth, rubyHeight, rubyDepth) => {
  return new BoxGeometry(rubyWidth, rubyHeight, rubyDepth);
};

const Pallet = forwardRef(
  (
    {
      position = [0, 0, 0],
      color = '#E1C16E', // Brass
      rubyColor = '#E0115F', // Ruby red
      depth = 1.0, // Depth of the 3D extrusion
      armLength = 40, // Length of each arm of the "V"
      armWidth = 3.0,  // Width (thickness) of the "V" arms
      angle = (102 * Math.PI) / 180, // 120-degree angle in radians (for the "V" shape)
      curveRadius = 3.0, // Radius for the arc connecting the arms
      rubyWidth = 1.5, // Width of the ruby
      rubyHeight = 11.0, // Height of the ruby
      rubyDepth = 1 // Depth of the ruby (thin)
    },
    ref
  ) => {
    const [leftArmGeometry, rightArmGeometry, arcGeometry, rubyGeometry] = useMemo(() => {
      const leftArmGeometry = createArmGeometry(armLength, armWidth, depth, angle / 2);
      const rightArmGeometry = createArmGeometry(armLength, armWidth, depth, -angle / 2);
      const arcGeometry = createArcGeometry(curveRadius, depth);
      const rubyGeometry = createRubyGeometry(rubyWidth, rubyHeight, rubyDepth);

      return [leftArmGeometry, rightArmGeometry, arcGeometry, rubyGeometry];
    }, [armLength, armWidth, depth, angle, curveRadius, rubyWidth, rubyHeight, rubyDepth]);

    return (
      <group ref={ref} position={position} rotation={[0, 0, 0]}>
        {/* Left arm */}
        <mesh geometry={leftArmGeometry} castShadow receiveShadow>
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Right arm */}
        <mesh geometry={rightArmGeometry} castShadow receiveShadow>
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Smooth Arc */}
        <mesh
          geometry={arcGeometry}
          position={[0, (armWidth / 2) - (curveRadius / 2), -0.5]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Entry Ruby (left arm) */}
        <mesh
          geometry={rubyGeometry}
          position={[armLength - 12, -armLength + 11, -0.1]} // Adjusted position near the end of the left arm
          rotation={[0, 0, -angle / 2]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={rubyColor} />
        </mesh>

        {/* Exit Ruby (right arm) */}
        <mesh
          geometry={rubyGeometry}
          position={[armLength - 12, armLength - 11, -0.1]} // Adjusted position near the end of the left arm
          rotation={[0, 0, angle / 2]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={rubyColor} />
        </mesh>
      </group>
    );
  }
);

Pallet.displayName = 'Pallet';

export default Pallet;
