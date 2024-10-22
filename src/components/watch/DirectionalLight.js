
import React, { useRef } from 'react';

const DirectionalLight = () => {
  const lightRef = useRef();
  return (
    <directionalLight
      ref={lightRef}
      position={[50, 50, 200]}
      intensity={1}
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-left={-200}
      shadow-camera-right={200}
      shadow-camera-top={200}
      shadow-camera-bottom={-200}
      shadow-camera-near={0.5}
      shadow-camera-far={500}
      shadow-bias={-0.0001}
      castShadow
    />
  );
};

export default DirectionalLight;
