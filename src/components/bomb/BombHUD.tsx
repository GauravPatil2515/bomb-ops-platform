'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/game';
import { Button } from '@/components/ui/button';
import { Pause, Play, RotateCcw, Settings } from 'lucide-react';

interface BombHUDProps {
  hoveredModule: string | null;
}

export default function BombHUD({ hoveredModule }: BombHUDProps) {
  const { 
    timerSeconds, 
    strikes, 
    maxStrikes, 
    seed, 
    status, 
    modules,
    startTimer,
    stopTimer,
    reset
  } = useGameStore();
  
  const [isPaused, setIsPaused] = useState(false);
  const [showDevTools, setShowDevTools] = useState(false);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timer color based on remaining time
  const getTimerColor = () => {
    if (timerSeconds <= 30) return 'text-destructive animate-countdown-pulse';
    if (timerSeconds <= 60) return 'text-amber-400';
    return 'text-primary';
  };

  // Handle pause/resume (dev mode only)
  const handlePauseToggle = () => {
    if (status !== 'active') return;
    
    if (isPaused) {
      startTimer();
      setIsPaused(false);
    } else {
      stopTimer();
      setIsPaused(true);
    }
  };

  // Show dev tools on Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setShowDevTools(!showDevTools);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDevTools]);

  const solvedCount = modules.filter(m => m.solved).length;
  const totalModules = modules.length;

  return (
    <>
      {/* Main HUD */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-b border-primary/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Timer and Status */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className={`text-4xl font-mono font-bold ${getTimerColor()}`}>
                  {formatTime(timerSeconds)}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {status.toUpperCase()}
                </div>
              </div>
              
              {isPaused && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded text-amber-400 text-sm font-mono"
                >
                  PAUSED
                </motion.div>
              )}
            </div>

            {/* Center: Module Progress */}
            <div className="text-center">
              <div className="text-xl font-mono text-secondary">
                {solvedCount} / {totalModules}
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                MODULES SOLVED
              </div>
              <div className="flex mt-2 space-x-1">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className={`
                      w-3 h-3 rounded-full border transition-all duration-200
                      ${module.solved 
                        ? 'bg-secondary border-secondary' 
                        : hoveredModule === module.id
                          ? 'bg-primary/50 border-primary'
                          : 'bg-transparent border-muted-foreground'
                      }
                    `}
                  />
                ))}
              </div>
            </div>

            {/* Right: Strikes and Info */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex space-x-1 mb-1">
                  {Array.from({ length: maxStrikes }).map((_, i) => (
                    <div
                      key={i}
                      className={`
                        w-4 h-4 rounded-full border-2
                        ${i < strikes 
                          ? 'bg-destructive border-destructive animate-countdown-pulse' 
                          : 'border-muted-foreground'
                        }
                      `}
                    />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  STRIKES
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-mono text-muted-foreground">
                  SEED: {seed}
                </div>
                <div className="text-xs text-muted-foreground">
                  {hoveredModule ? `MODULE: ${hoveredModule.toUpperCase()}` : 'HOVER MODULES'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dev Tools (hidden by default) */}
      {showDevTools && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-4 z-50 bg-black/90 border border-primary/30 rounded-lg p-4 space-y-2"
        >
          <div className="text-sm font-mono text-primary mb-2">DEV TOOLS</div>
          
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePauseToggle}
              disabled={status !== 'active'}
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => reset()}
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDevTools(false)}
            >
              <Settings className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground font-mono">
            Ctrl+Shift+D to toggle
          </div>
        </motion.div>
      )}

      {/* Status Indicators */}
      {status === 'active' && timerSeconds <= 10 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="fixed inset-0 pointer-events-none border-4 border-destructive z-30"
        />
      )}
    </>
  );
}