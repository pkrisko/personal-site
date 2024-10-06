import React from 'react';
import { Text } from '@react-three/drei';

const monoFontPath = "/fonts/FantasqueSansMono-Regular.ttf";

const Text = () => {
  return (
    <group position={[0, 0.75, 0]}>
      <Text anchorX="center" anchorY="top" fontSize={1.0} font={monoFontPath}>
        Patrick Krisko
      </Text>
      <Text
        position={[0, -1.2, 0]}
        anchorX="center"
        anchorY="top"
        fontSize={0.6}
        font={monoFontPath}
      >
        Software Engineer
      </Text>
    </group>
  )
}
