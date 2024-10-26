import React, { useMemo } from 'react';
import { Box } from '@react-three/drei';
import { Shape, ExtrudeGeometry } from 'three';

const Index = ({
  color = "#9ca1a2",
  position = [0, 0, 0],
  rotation = [Math.PI / 2, 0, 0],
}) => {
  // Define index dimensions
  const indexWidth = 3; // Width along X-axis
  const indexLength = 10; // Length along Y-axis
  const indexDepth = 2; // Depth along Z-axis

  // Ridges parameters
  const numRidges = 7; // Number of ridges
  const ridgesLength = (2 * indexLength) / 3; // Total length of ridges along Y-axis
  const flatSpaceLength = (indexLength - ridgesLength) / 2; // Flat space at top and bottom
  const ridgeBase = ridgesLength / numRidges; // Base length of each ridge along Y-axis
  const ridgeHeight = 0.4; // Height of each ridge along Z-axis
  const ridgeLength = indexWidth; // Length along X-axis (same as index width)

  // Use useMemo for performance optimization
  const ridges = useMemo(() => {
    const ridgeMeshes = [];

    for (let i = 0; i < numRidges; i++) {
      // Create the triangle shape in the YZ-plane
      const triangleShape = new Shape();
      triangleShape.moveTo(0, 0); // Start at (0, 0) in YZ-plane
      triangleShape.lineTo(0, ridgeBase); // Up along Y-axis
      triangleShape.lineTo(ridgeHeight, ridgeBase / 2); // Peak at (ridgeHeight, ridgeBase/2)
      triangleShape.lineTo(0, 0); // Close the shape

      // Extrude settings
      const extrudeSettings = {
        depth: ridgeLength, // Extrude along X-axis
        bevelEnabled: false,
      };

      // Create the geometry
      const ridgeGeometry = new ExtrudeGeometry(triangleShape, extrudeSettings);

      // Positioning the ridge
      const x = -ridgeLength / 2; // Centered along X-axis after extrusion
      const y = -(indexLength / 2) + (2.5) + i * ridgeBase; // Position along Y-axis
      const z = indexDepth / 2; // On top of the base box

      // Rotate the ridge so that length is along X-axis
      const ridgeRotation = [Math.PI / 2, Math.PI / 2, Math.PI / 2]; // No rotation needed

      // Create a mesh for the ridge
      ridgeMeshes.push(
        <mesh
          key={i}
          geometry={ridgeGeometry}
          position={[x, y, z]}
          rotation={ridgeRotation}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={color} />
        </mesh>
      );
    }

    return ridgeMeshes;
  }, [
    ridgeBase,
    ridgeHeight,
    ridgeLength,
    numRidges,
    indexLength,
    indexDepth,
    color,
  ]);

  return (
    <group position={position} rotation={rotation}>
      {/* Base Index Box */}
      <Box
        args={[indexWidth, indexLength, indexDepth]}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={color} />
      </Box>
      {ridges}
      {/* Blue detail above index */}
      <Box args={[1, 3, 0.2]}
        position={[0, indexLength - 4, -indexDepth / 2 + 0.2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#0073b9" />
      </Box>
    </group>
  );
};

export default Index;
