'use client';

import { useEffect } from 'react';

const CameraController = ({ moveCamera }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          moveCamera('up');
          break;
        case 'ArrowDown':
          moveCamera('down');
          break;
        case 'ArrowLeft':
          moveCamera('left');
          break;
        case 'ArrowRight':
          moveCamera('right');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [moveCamera]);

  return null; // Nothing to render.
}

export default CameraController;
