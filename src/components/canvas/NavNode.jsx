import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const NavNode = ({ position, label, color, onClick, index }) => {
  const mesh = useRef();
  const ring = useRef();
  const [hovered, setHovered] = useState(false);
  const baseY = position[1];

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.position.y = baseY + Math.sin(clock.elapsedTime * 0.8 + index * 1.2) * 0.3;
      mesh.current.rotation.y += 0.005;
    }
    if (ring.current) {
      ring.current.rotation.z += 0.01;
      ring.current.rotation.x = Math.sin(clock.elapsedTime * 0.5 + index) * 0.2;
    }
  });

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh ref={mesh}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color={hovered ? '#ffffff' : color}
          emissive={color}
          emissiveIntensity={hovered ? 2 : 0.8}
          transparent
          opacity={0.9}
          wireframe={false}
        />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[1.2, 0.04, 8, 40]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 3 : 1}
          transparent
          opacity={0.6}
        />
      </mesh>
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.4}
        color={hovered ? '#ffffff' : color}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
      >
        {`[ ${label} ]`}
      </Text>
      {/* Glow pulse */}
      <pointLight
        color={color}
        intensity={hovered ? 3 : 0.8}
        distance={5}
        decay={2}
      />
    </group>
  );
};

export default NavNode;
