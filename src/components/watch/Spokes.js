import React, { useMemo } from 'react';
import { Box } from '@react-three/drei';

const Spokes = ({
  numSpokes,
  innerRadius,
  outerRadius,
  thickness = 4,
  depth = 1.75,
  zPosition = 1,
}) => {
  // Memoize the spokes to prevent unnecessary recalculations
  const spokes = useMemo(() => {
    return Array.from({ length: numSpokes }).map((_, i) => {
      const angle = (i / numSpokes) * Math.PI * 2;

      // Start position at the inner radius
      const startX = innerRadius * Math.cos(angle);
      const startY = innerRadius * Math.sin(angle);

      // End position at the outer radius
      const endX = outerRadius * Math.cos(angle);
      const endY = outerRadius * Math.sin(angle);

      // Calculate length and position
      const dx = endX - startX;
      const dy = endY - startY;
      const length = Math.sqrt(dx ** 2 + dy ** 2);
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const spokeAngle = Math.atan2(dy, dx);

      return {
        key: i,
        length,
        position: [midX, midY, zPosition],
        rotation: [0, 0, spokeAngle],
      };
    });
  }, [numSpokes, innerRadius, outerRadius, zPosition]);

  return spokes.map(({ key, length, position, rotation }) => (
    <Box
      key={key}
      args={[length, thickness, depth]}
      position={position}
      rotation={rotation}
    >
      <meshStandardMaterial color="#D8DADA" />
    </Box>
  ));
};

export default Spokes;
