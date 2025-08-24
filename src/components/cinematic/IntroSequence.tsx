'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SkipForward } from 'lucide-react';

interface IntroSequenceProps {
  onComplete: () => void;
  mode: 'quick' | 'full';
  difficulty: 'novice' | 'pro' | 'expert';
}

export default function IntroSequence({ onComplete, mode, difficulty }: IntroSequenceProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  const stages = [
    { duration: 2000, content: 'SystemBoot' },
    { duration: 2000, content: 'Clearance' },
    { duration: 3000, content: 'MissionBadge' },
    { duration: 3000, content: 'HUD' },
    { duration: 1000, content: 'Transition' }
  ];

  useEffect(() => {
    setShowSkip(true);
    
    const timers: NodeJS.Timeout[] = [];
    let totalTime = 0;

    stages.forEach((stage, index) => {
      const timer = setTimeout(() => {
        setCurrentStage(index);
        if (index === stages.length - 1) {
          setTimeout(onComplete, stage.duration);
        }
      }, totalTime);
      
      timers.push(timer);
      totalTime += stage.duration;
    });

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center scanlines">
      {/* Skip Button */}
      <AnimatePresence>
        {showSkip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-6 right-6 z-60"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleSkip}
              className="border-primary/30 bg-black/50 text-primary hover:bg-primary/10"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              SKIP INTRO
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Content */}
      <div className="text-center max-w-4xl px-4">
        <AnimatePresence mode="wait">
          {currentStage === 0 && (
            <motion.div
              key="boot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="h-px bg-primary mx-auto"
              />
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-mono text-primary animate-fade-in"
              >
                SYSTEM BOOT INITIATED...
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="font-mono text-sm text-muted-foreground"
              >
                LOADING MISSION PARAMETERS...
              </motion.div>
            </motion.div>
          )}

          {currentStage === 1 && (
            <motion.div
              key="clearance"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ rotateX: -90 }}
                animate={{ rotateX: 0 }}
                transition={{ duration: 0.8, ease: 'backOut' }}
                className="border border-primary/50 bg-primary/5 p-8 rounded-lg"
              >
                <div className="text-6xl font-bold text-primary mb-4">CLASSIFIED</div>
                <div className="text-xl font-mono text-secondary">CLEARANCE GRANTED</div>
              </motion.div>
            </motion.div>
          )}

          {currentStage === 2 && (
            <motion.div
              key="badge"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="space-y-6"
            >
              <div className="terminal-card bg-black/70 border-primary/30 max-w-md mx-auto">
                <div className="text-3xl font-bold text-primary mb-4">MISSION BRIEF</div>
                <div className="space-y-2 text-left font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MODE:</span>
                    <span className="text-secondary uppercase">{mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DIFFICULTY:</span>
                    <span className="text-accent uppercase">{difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TIME LIMIT:</span>
                    <span className="text-destructive">{mode === 'quick' ? '05:00' : '10:00'}</span>
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                className="text-destructive text-2xl font-mono animate-countdown-pulse"
              >
                • TICK • TICK • TICK •
              </motion.div>
            </motion.div>
          )}

          {currentStage === 3 && (
            <motion.div
              key="hud"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-primary"
              >
                SYSTEMS ARMED
              </motion.div>
              
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="terminal-card text-center"
                >
                  <div className="text-2xl font-bold text-secondary">3</div>
                  <div className="text-sm text-muted-foreground font-mono">MODULES</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="terminal-card text-center"
                >
                  <div className="text-2xl font-bold text-destructive">
                    {mode === 'quick' ? '2' : '3'}
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">MAX STRIKES</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="terminal-card text-center"
                >
                  <div className="text-2xl font-bold text-accent countdown-display">
                    {mode === 'quick' ? '05:00' : '10:00'}
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">TIMER</div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-destructive text-xl font-mono"
              >
                INITIATING MISSION IN 3... 2... 1...
              </motion.div>
            </motion.div>
          )}

          {currentStage === 4 && (
            <motion.div
              key="transition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full"
            >
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="w-32 h-32 border-4 border-primary border-t-transparent rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sound visualization */}
      <div className="fixed bottom-8 left-8 flex space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: [4, 20, 4],
              backgroundColor: ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--primary))']
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.1
            }}
            className="w-1 bg-primary rounded-full"
          />
        ))}
      </div>
    </div>
  );
}