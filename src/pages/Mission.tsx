'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGameStore } from '@/store/game';
import IntroSequence from '@/components/cinematic/IntroSequence';
import BombScene from '@/components/bomb/BombScene';
import { GameMode, Difficulty } from '@/types/game';

export default function Mission() {
  const [searchParams] = useSearchParams();
  const { initializeGame, startGame, status } = useGameStore();
  const [showIntro, setShowIntro] = useState(true);
  const [lowGraphics, setLowGraphics] = useState(false);

  // Parse URL parameters
  const mode = (searchParams.get('mode') as GameMode) || 'quick';
  const difficulty = (searchParams.get('difficulty') as Difficulty) || 'novice';
  const seed = searchParams.get('seed') || undefined;
  const skipIntro = searchParams.get('skipIntro') === 'true';
  const lowGfx = searchParams.get('lowGfx') === '1';

  useEffect(() => {
    // Initialize game with parameters
    initializeGame(mode, difficulty, seed);
    
    // Check for low graphics mode
    setLowGraphics(lowGfx || !window.WebGLRenderingContext);
    
    // Skip intro if requested
    if (skipIntro) {
      setShowIntro(false);
      startGame();
    }
  }, [mode, difficulty, seed, skipIntro, lowGfx, initializeGame, startGame]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    startGame();
  };

  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any running timers
      useGameStore.getState().stopTimer();
    };
  }, []);

  if (showIntro) {
    return (
      <IntroSequence 
        onComplete={handleIntroComplete}
        mode={mode}
        difficulty={difficulty}
      />
    );
  }

  return <BombScene lowGraphics={lowGraphics} />;
}