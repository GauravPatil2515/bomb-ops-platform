'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { useGameStore } from '@/store/game';
import Chassis3D from './Chassis3D';
import BombHUD from './BombHUD';
import GameModals from './GameModals';

interface BombSceneProps {
  lowGraphics?: boolean;
}

export default function BombScene({ lowGraphics = false }: BombSceneProps) {
  const { status } = useGameStore();
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  if (lowGraphics) {
    return <BombScene2D />;
  }

  return (
    <div className="h-screen bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 2, 5]} />
          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={8}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            enableDamping
            dampingFactor={0.05}
          />
          
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[0, 2, 0]} intensity={0.5} color="#00ff41" />
          
          <Suspense fallback={null}>
            <Chassis3D 
              onModuleHover={setHoveredModule}
              hoveredModule={hoveredModule}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* HUD Overlay */}
      <BombHUD hoveredModule={hoveredModule} />
      
      {/* Game Modals */}
      <GameModals />
    </div>
  );
}

// 2D Fallback Implementation
function BombScene2D() {
  const { modules } = useGameStore();

  return (
    <div className="h-screen bg-gradient-to-b from-background to-muted/20 relative flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-8">
        {/* 2D Bomb Representation */}
        <div className="terminal-card bg-black/50 border-primary/30 p-8 relative">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary mb-2">EXPLOSIVE DEVICE</h2>
            <div className="text-sm text-muted-foreground font-mono">2D MODE ACTIVE</div>
          </div>
          
          {/* Module Grid */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {modules.map((module) => (
              <div
                key={module.id}
                className={`
                  aspect-square border-2 rounded-lg p-4 flex flex-col items-center justify-center
                  transition-all duration-200 cursor-pointer hover:scale-105
                  ${module.solved 
                    ? 'border-secondary bg-secondary/10 text-secondary' 
                    : 'border-primary/50 bg-primary/5 text-primary hover:border-primary'
                  }
                `}
              >
                <div className="text-2xl mb-2">
                  {module.type === 'wires' && '🔌'}
                  {module.type === 'button' && '⏺️'}
                  {module.type === 'symbols' && '🔣'}
                </div>
                <div className="text-sm font-mono uppercase">{module.type}</div>
                {module.solved && (
                  <div className="text-xs text-secondary mt-1">SOLVED</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HUD Overlay */}
      <BombHUD hoveredModule={null} />
      
      {/* Game Modals */}
      <GameModals />
    </div>
  );
}