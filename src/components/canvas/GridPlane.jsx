import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GridPlane = () => {
  const gridRef = useRef();

  useFrame(({ clock }) => {
    if (gridRef.current) {
      gridRef.current.material.opacity = 0.08 + Math.sin(clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group>
      <gridHelper
        ref={gridRef}
        args={[200, 80, '#00f5ff', '#0a2040']}
        position={[0, -20, 0]}
        rotation={[0, 0, 0]}
      >
        <meshBasicMaterial transparent opacity={0.1} />
      </gridHelper>
      {/* Vertical side grid */}
      <gridHelper
        args={[200, 80, '#00f5ff', '#0a2040']}
        position={[0, 0, -60]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial transparent opacity={0.03} />
      </gridHelper>
    </group>
  );
};

export default GridPlane;
