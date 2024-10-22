'use client';

import React, { forwardRef, useMemo } from 'react';
import { Shape, ExtrudeGeometry, Vector2, BoxGeometry, CylinderGeometry } from 'three';
import Pendulum from '@/components/watch/Pendulum';

const RUBY_X_OFFSET = 20;
const RUBY_Y_OFFSET = 20;

// Axle dimensions
const AXLE_RADIUS = 1;
const AXLE_HEIGHT = 20;

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
  const startAngle = Math.PI; // Start from the leftmost point
  const endAngle = 2 * Math.PI; // Go to the rightmost point
  const centerX = 0;
  const centerY = curveRadius;

  arcShape.moveTo(centerX - curveRadius, centerY);
  arcShape.absarc(centerX, centerY, curveRadius, startAngle, endAngle, false);

  return new ExtrudeGeometry(arcShape, {
    steps: 1,
    depth,
    bevelEnabled: false,
  });
};

const createRubyGeometry = (rubyWidth, rubyHeight, rubyDepth) => {
  return new BoxGeometry(rubyWidth, rubyHeight, rubyDepth);
};

// Function to create the axle
const createAxleGeometry = (axleRadius, axleHeight) => {
  return new CylinderGeometry(axleRadius, axleRadius, axleHeight, 32);
};

const Pallet = forwardRef(
  (
    {
      position = [0, 0, 0],
      rotation = [0, 0, 0],
      color = '#E1C16E', // Brass
      rubyColor = '#E0115F', // Ruby red
      axleColor = '#808080', // Gray color for the axle
      depth = 1.0, // Depth of the 3D extrusion
      armLength = 60.0, // Length of each arm of the "V"
      armWidth = 3.0,  // Width (thickness) of the "V" arms
      angle = (96 * Math.PI) / 180, // 120-degree angle in radians (for the "V" shape)
      curveRadius = 4.0, // Radius for the arc connecting the arms
      rubyWidth = 1.5, // Width of the ruby
      rubyHeight = 11.0, // Height of the ruby
      rubyDepth = 1, // Depth of the ruby (thin)
    },
    ref
  ) => {
    const [leftArmGeometry, rightArmGeometry, arcGeometry, rubyGeometry, axleGeometry] = useMemo(() => {
      const leftArmGeometry = createArmGeometry(armLength, armWidth, depth, angle / 2);
      const rightArmGeometry = createArmGeometry(armLength, armWidth, depth, -angle / 2);
      const arcGeometry = createArcGeometry(curveRadius, depth);
      const rubyGeometry = createRubyGeometry(rubyWidth, rubyHeight, rubyDepth);
      const axleGeometry = createAxleGeometry(AXLE_RADIUS, AXLE_HEIGHT);

      return [leftArmGeometry, rightArmGeometry, arcGeometry, rubyGeometry, axleGeometry];
    }, [armLength, armWidth, depth, angle, curveRadius, rubyWidth, rubyHeight, rubyDepth]);

    return (
      <group ref={ref} position={position} rotation={rotation}>
        {/* Left arm */}
        <mesh geometry={leftArmGeometry} castShadow receiveShadow>
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Right arm */}
        <mesh geometry={rightArmGeometry} castShadow receiveShadow>
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Arc at top of the pallet tip which holds axle */}
        <mesh
          geometry={arcGeometry}
          position={[-2, 0, -0.5]}
          rotation={[0, 0, Math.PI / -2]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Entry Ruby (left arm) */}
        <mesh
          geometry={rubyGeometry}
          position={[armLength - RUBY_X_OFFSET, -armLength + RUBY_Y_OFFSET, -0.1]} // Adjusted position near the end of the left arm
          rotation={[0, 0, -angle / 2]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={rubyColor} />
        </mesh>

        {/* Exit Ruby (right arm) */}
        <mesh
          geometry={rubyGeometry}
          position={[armLength - RUBY_X_OFFSET, armLength - RUBY_Y_OFFSET, -0.1]} // Adjusted position near the end of the left arm
          rotation={[0, 0, angle / 2]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={rubyColor} />
        </mesh>

        {/* Axle */}
        <mesh
          geometry={axleGeometry}
          position={[0, 0, -AXLE_HEIGHT / 2 + 1.1]} // Positioning the axle so it extends downward
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={axleColor} />
        </mesh>

        {/* Pendulum */}
        <Pendulum position={[0, 0, -AXLE_HEIGHT / 2]} />
      </group>
    );
  }
);

Pallet.displayName = 'Pallet';

export default Pallet;
