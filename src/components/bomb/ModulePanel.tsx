'use client';

import { useState } from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import { useGameStore } from '@/store/game';
import { ModuleState } from '@/types/game';

interface ModulePanelProps {
  module: ModuleState;
  position: [number, number, number];
  onHover: (moduleId: string | null) => void;
  isHovered: boolean;
}

export default function ModulePanel({ module, position, onHover, isHovered }: ModulePanelProps) {
  const { moduleAction, timerSeconds } = useGameStore();
  const [isInteracting, setIsInteracting] = useState(false);

  const handleClick = (event: any) => {
    event.stopPropagation();
    setIsInteracting(true);
    
    // Handle different module interactions
    if (module.type === 'wires' && !module.solved) {
      // For demo, we'll simulate cutting the correct wire
      const correctWire = module.data.correctWire;
      moduleAction(module.id, { wireIndex: correctWire });
    } else if (module.type === 'button' && !module.solved) {
      if (module.data.shouldHold) {
        moduleAction(module.id, { type: 'hold' });
        // Simulate release after 1 second
        setTimeout(() => {
          moduleAction(module.id, { type: 'release', timerSeconds });
        }, 1000);
      } else {
        moduleAction(module.id, { type: 'press' });
      }
    } else if (module.type === 'symbols' && !module.solved) {
      // For demo, press the first correct symbol
      const nextCorrect = module.data.order[module.data.pressed.length];
      if (nextCorrect) {
        moduleAction(module.id, { symbolId: nextCorrect });
      }
    }
    
    setTimeout(() => setIsInteracting(false), 200);
  };

  const getModuleColor = () => {
    if (module.solved) return "#00ff41";
    if (isHovered) return "#ffff00";
    if (isInteracting) return "#ff6600";
    return "#666";
  };

  const getEmissiveIntensity = () => {
    if (module.solved) return 0.3;
    if (isHovered || isInteracting) return 0.1;
    return 0;
  };

  return (
    <group position={position}>
      {/* Module Base */}
      <RoundedBox
        args={[0.8, 0.8, 0.1]}
        radius={0.02}
        smoothness={4}
        onClick={handleClick}
        onPointerEnter={() => onHover(module.id)}
        onPointerLeave={() => onHover(null)}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color={getModuleColor()}
          emissive={getModuleColor()}
          emissiveIntensity={getEmissiveIntensity()}
          metalness={0.5}
          roughness={0.3}
        />
      </RoundedBox>

      {/* Module Type Label */}
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.06}
        color="#000"
        anchorX="center"
        anchorY="middle"
        font="/fonts/RobotoMono-Bold.ttf"
      >
        {module.type.toUpperCase()}
      </Text>

      {/* Module Specific Visual Elements */}
      {module.type === 'wires' && (
        <group position={[0, 0, 0.06]}>
          {module.data.wires.map((wire, i) => (
            <RoundedBox
              key={i}
              args={[0.02, 0.3, 0.01]}
              position={[(i - 2.5) * 0.1, 0, 0.01]}
              radius={0.005}
            >
              <meshStandardMaterial 
                color={wire.color}
                transparent
                opacity={wire.cut ? 0.3 : 1}
              />
            </RoundedBox>
          ))}
        </group>
      )}

      {module.type === 'button' && (
        <RoundedBox
          args={[0.3, 0.3, 0.1]}
          position={[0, 0, 0.1]}
          radius={0.05}
        >
          <meshStandardMaterial 
            color={module.data.color}
            emissive={module.data.held ? module.data.color : "#000"}
            emissiveIntensity={module.data.held ? 0.2 : 0}
          />
        </RoundedBox>
      )}

      {module.type === 'symbols' && (
        <group position={[0, 0, 0.06]}>
          {module.data.symbols.slice(0, 4).map((symbolId, i) => (
            <Text
              key={i}
              position={[(i % 2 - 0.5) * 0.2, Math.floor(i / 2) * 0.2 - 0.1, 0.01]}
              fontSize={0.08}
              color={module.data.pressed.includes(symbolId) ? "#00ff41" : "#fff"}
              anchorX="center"
              anchorY="middle"
            >
              {String.fromCharCode(65 + symbolId % 26)} {/* Simple symbol representation */}
            </Text>
          ))}
        </group>
      )}

      {/* Solved Indicator */}
      {module.solved && (
        <Text
          position={[0, -0.3, 0.06]}
          fontSize={0.04}
          color="#00ff41"
          anchorX="center"
          anchorY="middle"
        >
          SOLVED
        </Text>
      )}
    </group>
  );
}