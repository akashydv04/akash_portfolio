import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Stars, Preload } from '@react-three/drei';
import * as THREE from 'three';
import ParticleField from './ParticleField';
import GridPlane from './GridPlane';
import NavNode from './NavNode';

const navItems = [
  { label: 'WORK',       color: '#00f5ff', target: 'projects',    pos: [-9, 0, -8] },
  { label: 'EXPERIENCE', color: '#a855f7', target: 'experience',  pos: [-3, 2, -12] },
  { label: 'SKILLS',     color: '#22d3ee', target: 'skills',      pos: [3, -1, -10] },
  { label: 'CONTACT',    color: '#f43f5e', target: 'contact',     pos: [9, 1, -8] },
];

const CameraRig = ({ targetSection }) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 10));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (targetSection) {
      const found = navItems.find(n => n.target === targetSection);
      if (found) {
        targetPos.current.set(found.pos[0] * 0.5, found.pos[1] + 3, found.pos[2] + 8);
        targetLook.current.set(...found.pos);
      }
    } else {
      targetPos.current.set(0, 2, 14);
      targetLook.current.set(0, 0, 0);
    }
  }, [targetSection]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.04);
    const lv = new THREE.Vector3().lerp(targetLook.current, 0.04);
    camera.lookAt(targetLook.current);
  });

  return null;
};

const SpaceScene = ({ onNavClick, targetSection }) => {
  return (
    <>
      <color attach="background" args={['#020b18']} />
      <fog attach="fog" args={['#020b18', 30, 120]} />

      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00f5ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#a855f7" />
      <directionalLight position={[0, 20, 5]} intensity={0.2} color="#ffffff" />

      <Stars
        radius={120}
        depth={60}
        count={4000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <GridPlane />
      <ParticleField count={800} />

      {navItems.map((item, i) => (
        <NavNode
          key={item.label}
          position={item.pos}
          label={item.label}
          color={item.color}
          index={i}
          onClick={() => onNavClick(item.target)}
        />
      ))}

      <CameraRig targetSection={targetSection} />
      <Preload all />
    </>
  );
};

const SpaceCanvas = ({ onNavClick, targetSection }) => {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      camera={{ position: [0, 2, 14], fov: 60, near: 0.1, far: 200 }}
    >
      <SpaceScene onNavClick={onNavClick} targetSection={targetSection} />
    </Canvas>
  );
};

export default SpaceCanvas;
