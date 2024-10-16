'use client';

import React, { forwardRef, useMemo } from 'react';
import { Shape, ExtrudeGeometry, Mesh, MeshStandardMaterial, Vector2 } from 'three';

const Pallet = forwardRef(
  (
    {
      position = [0, 0, 0],
      color = 'silver',
      depth = 1.0, // Depth of the 3D extrusion
      armLength = 20.0, // Length of each arm of the "V"
      armWidth = 3.0,  // Width (thickness) of the "V" arms
      angle = (2 * Math.PI) / 3, // 120-degree angle in radians (for the "V" shape)
      curveRadius = 3.0 // Radius for the arc connecting the arms
    },
    ref
  ) => {
    const [leftArmGeometry, rightArmGeometry, arcGeometry] = useMemo(() => {
      // Create left arm shape
      const leftArmShape = new Shape();
      leftArmShape.moveTo(0, 0);
      leftArmShape.lineTo(0, armWidth);
      leftArmShape.lineTo(armLength, armWidth);
      leftArmShape.lineTo(armLength, 0);
      leftArmShape.closePath();

      // Extrude to make it 3D
      const leftArmGeometry = new ExtrudeGeometry(leftArmShape, {
        steps: 1,
        depth: depth,
        bevelEnabled: false,
      });

      // Position and rotate the left arm
      leftArmGeometry.translate(0, -armWidth / 2, -depth / 2);
      leftArmGeometry.rotateZ(angle / 2);

      // Create right arm shape
      const rightArmShape = new Shape();
      rightArmShape.moveTo(0, 0);
      rightArmShape.lineTo(0, armWidth);
      rightArmShape.lineTo(armLength, armWidth);
      rightArmShape.lineTo(armLength, 0);
      rightArmShape.closePath();

      // Extrude to make it 3D
      const rightArmGeometry = new ExtrudeGeometry(rightArmShape, {
        steps: 1,
        depth: depth,
        bevelEnabled: false,
      });

      // Position and rotate the right arm
      rightArmGeometry.translate(0, -armWidth / 2, -depth / 2);
      rightArmGeometry.rotateZ(-angle / 2);

      // Create an arc to smooth the connection between the two arms
      const arcShape = new Shape();
      const arcStart = new Vector2(-curveRadius, 0);
      const arcEnd = new Vector2(curveRadius, 0);
      arcShape.moveTo(arcStart.x, arcStart.y);
      arcShape.quadraticCurveTo(0, curveRadius, arcEnd.x, arcEnd.y); // Smooth arc

      // Extrude the arc
      const arcGeometry = new ExtrudeGeometry(arcShape, {
        steps: 1,
        depth: depth,
        bevelEnabled: false,
      });

      return [leftArmGeometry, rightArmGeometry, arcGeometry];
    }, [armLength, armWidth, depth, angle, curveRadius]);

    return (
      <group ref={ref} position={position} rotation={[0, 0, Math.PI / -2]}>
        {/* Left arm */}
        <mesh geometry={leftArmGeometry} castShadow receiveShadow>
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Right arm */}
        <mesh geometry={rightArmGeometry} castShadow receiveShadow>
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Smooth Arc */}
        <mesh geometry={arcGeometry} position={[0, (armWidth / 2) - (curveRadius / 2), -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    );
  }
);

Pallet.displayName = 'Pallet';

export default Pallet;
