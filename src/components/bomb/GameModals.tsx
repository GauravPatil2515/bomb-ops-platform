'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/game';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';

export default function GameModals() {
  const { 
    status, 
    timerSeconds, 
    strikes, 
    maxStrikes, 
    seed, 
    modules, 
    startTime, 
    endTime,
    reset 
  } = useGameStore();

  // Calculate game stats
  const solvedCount = modules.filter(m => m.solved).length;
  const totalModules = modules.length;
  const gameTime = startTime && endTime ? Math.round((endTime - startTime) / 1000) : 0;
  const formatGameTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Play sound effects based on status changes
  useEffect(() => {
    // In a real implementation, you'd play actual sound files here
    if (status === 'won') {
      console.log('🎉 Success sound');
    } else if (status === 'exploded') {
      console.log('💥 Explosion sound');
    }
  }, [status]);

  const handlePlayAgain = () => {
    reset();
  };

  const handleNewGame = () => {
    reset(); // This will generate a new seed
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <AnimatePresence>
      {(status === 'won' || status === 'exploded') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="max-w-md w-full mx-4"
          >
            {status === 'won' ? (
              // Success Modal
              <div className="terminal-card bg-black/90 border-secondary/50 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mb-6"
                >
                  <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-secondary mb-2">
                    MISSION SUCCESS
                  </h2>
                  <p className="text-muted-foreground font-mono">
                    Explosive device successfully defused
                  </p>
                </motion.div>

                <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                    <div className="terminal-card bg-secondary/10 border-secondary/30">
                      <div className="text-secondary text-lg font-bold">
                        {formatGameTime(gameTime)}
                      </div>
                      <div className="text-muted-foreground">Time Taken</div>
                    </div>
                    <div className="terminal-card bg-primary/10 border-primary/30">
                      <div className="text-primary text-lg font-bold">
                        {strikes} / {maxStrikes}
                      </div>
                      <div className="text-muted-foreground">Strikes</div>
                    </div>
                  </div>

                  <div className="terminal-card bg-accent/10 border-accent/30">
                    <div className="text-accent text-sm font-mono">
                      SEED: {seed}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Share this code to replay the same mission
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground font-mono">
                    All {totalModules} modules successfully defused
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handlePlayAgain}
                    className="flex-1"
                    size="lg"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                  <Button 
                    onClick={handleNewGame}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    New Mission
                  </Button>
                </div>

                <Button
                  onClick={handleGoHome}
                  variant="ghost"
                  size="sm"
                  className="mt-4"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Return to Base
                </Button>
              </div>
            ) : (
              // Explosion Modal
              <div className="terminal-card bg-black/90 border-destructive/50 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mb-6"
                >
                  <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-destructive mb-2">
                    MISSION FAILED
                  </h2>
                  <p className="text-muted-foreground font-mono">
                    Explosive device detonated
                  </p>
                </motion.div>

                <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                    <div className="terminal-card bg-destructive/10 border-destructive/30">
                      <div className="text-destructive text-lg font-bold">
                        {strikes} / {maxStrikes}
                      </div>
                      <div className="text-muted-foreground">Max Strikes</div>
                    </div>
                    <div className="terminal-card bg-muted/10 border-muted/30">
                      <div className="text-muted-foreground text-lg font-bold">
                        {solvedCount} / {totalModules}
                      </div>
                      <div className="text-muted-foreground">Solved</div>
                    </div>
                  </div>

                  <div className="terminal-card bg-accent/10 border-accent/30">
                    <div className="text-accent text-sm font-mono">
                      SEED: {seed}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Try this mission again with the same configuration
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handlePlayAgain}
                    className="flex-1"
                    size="lg"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button 
                    onClick={handleNewGame}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    New Mission
                  </Button>
                </div>

                <Button
                  onClick={handleGoHome}
                  variant="ghost"
                  size="sm"
                  className="mt-4"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Return to Base
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}