'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text, RoundedBox } from '@react-three/drei';
import { Group } from 'three';
import { useGameStore } from '@/store/game';
import ModulePanel from './ModulePanel';

interface Chassis3DProps {
  onModuleHover: (moduleId: string | null) => void;
  hoveredModule: string | null;
}

export default function Chassis3D({ onModuleHover, hoveredModule }: Chassis3DProps) {
  const chassisRef = useRef<Group>(null);
  const { modules, globals, strikes, status } = useGameStore();

  // Subtle rotation animation when idle
  useFrame((state) => {
    if (chassisRef.current && status === 'active') {
      chassisRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <group ref={chassisRef}>
      {/* Main Chassis */}
      <RoundedBox
        args={[4, 2.5, 1]}
        radius={0.05}
        smoothness={8}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.8} 
          roughness={0.2}
        />
      </RoundedBox>

      {/* Module Panels */}
      {modules.map((module, index) => {
        const x = (index - 1) * 1.2; // Spread modules horizontally
        const y = 0.2; // Slightly above chassis surface
        const z = 0.51; // Just in front of chassis
        
        return (
          <ModulePanel
            key={module.id}
            module={module}
            position={[x, y, z]}
            onHover={onModuleHover}
            isHovered={hoveredModule === module.id}
          />
        );
      })}

      {/* Serial Number Panel */}
      <group position={[2.2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <RoundedBox
          args={[0.8, 0.4, 0.05]}
          radius={0.02}
          smoothness={4}
        >
          <meshStandardMaterial color="#2a2a2a" />
        </RoundedBox>
        <Text
          position={[0, 0, 0.03]}
          fontSize={0.08}
          color="#00ff41"
          anchorX="center"
          anchorY="middle"
          font="/fonts/RobotoMono-Regular.ttf"
        >
          {`SERIAL: ${globals.serial}`}
        </Text>
      </group>

      {/* Battery Indicator */}
      <group position={[-2.2, 0.8, 0]}>
        {Array.from({ length: globals.batteries }).map((_, i) => (
          <RoundedBox
            key={i}
            args={[0.15, 0.3, 0.1]}
            radius={0.02}
            position={[i * 0.2, 0, 0]}
          >
            <meshStandardMaterial color="#ffd700" />
          </RoundedBox>
        ))}
        <Text
          position={[0, -0.3, 0]}
          fontSize={0.06}
          color="#888"
          anchorX="left"
          anchorY="middle"
        >
          {`BATTERIES: ${globals.batteries}`}
        </Text>
      </group>

      {/* Indicators Panel */}
      <group position={[2.2, 0.8, 0]}>
        {globals.indicators.map((indicator, i) => (
          <group key={indicator.label} position={[0, -i * 0.15, 0]}>
            <RoundedBox
              args={[0.3, 0.08, 0.02]}
              radius={0.01}
            >
              <meshStandardMaterial 
                color={indicator.lit ? "#ff0000" : "#333"} 
                emissive={indicator.lit ? "#ff0000" : "#000"}
                emissiveIntensity={indicator.lit ? 0.3 : 0}
              />
            </RoundedBox>
            <Text
              position={[0, 0, 0.02]}
              fontSize={0.04}
              color={indicator.lit ? "#fff" : "#666"}
              anchorX="center"
              anchorY="middle"
            >
              {indicator.label}
            </Text>
          </group>
        ))}
      </group>

      {/* Ports Panel */}
      <group position={[-2.2, -0.8, 0]}>
        {globals.ports.map((port, i) => (
          <RoundedBox
            key={port}
            args={[0.2, 0.1, 0.05]}
            radius={0.01}
            position={[i * 0.25, 0, 0]}
          >
            <meshStandardMaterial color="#444" />
          </RoundedBox>
        ))}
        <Text
          position={[0, -0.2, 0]}
          fontSize={0.05}
          color="#888"
          anchorX="left"
          anchorY="middle"
        >
          PORTS
        </Text>
      </group>

      {/* Strike Indicators */}
      <group position={[0, -1.4, 0]}>
        {Array.from({ length: strikes }).map((_, i) => (
          <Text
            key={i}
            position={[i * 0.3 - 0.3, 0, 0]}
            fontSize={0.15}
            color="#ff0000"
            anchorX="center"
            anchorY="middle"
          >
            ✗
          </Text>
        ))}
      </group>

      {/* Ambient Effects */}
      {status === 'active' && (
        <pointLight
          position={[0, 0, 2]}
          intensity={0.2}
          color="#ff0000"
          distance={10}
        />
      )}
    </group>
  );
}