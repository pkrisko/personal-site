// CameraController.jsx
import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';

const CameraController = () => {
  const { camera } = useThree();
  const scroll = useScroll();

  useFrame(() => {
    const scrollOffset = scroll.offset;

    // Map scroll position to camera movement along y-axis
    camera.position.y = -scrollOffset * 20;
    camera.updateProjectionMatrix();
  });

  return null;
};

export default CameraController;
