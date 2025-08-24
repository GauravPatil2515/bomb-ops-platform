import { IModule, GameGlobals, ButtonModuleData } from '@/types/game';
import { DeterministicRNG } from '@/lib/rng';

export class ButtonModule implements IModule {
  generate(seed: string, globals: GameGlobals): ButtonModuleData {
    const rng = new DeterministicRNG(seed);
    const colors = ['red', 'blue', 'yellow', 'white'];
    const labels = ['PRESS', 'ABORT', 'HOLD', 'DETONATE'];
    
    const color = rng.choice(colors) as 'red' | 'blue' | 'yellow' | 'white';
    const label = rng.choice(labels) as 'PRESS' | 'ABORT' | 'HOLD' | 'DETONATE';
    
    const shouldHold = this.determineShouldHold(color, label, globals);
    const stripColor = shouldHold ? rng.choice(colors) as 'red' | 'blue' | 'yellow' | 'white' : undefined;
    const releaseDigit = stripColor ? this.getReleaseDigit(stripColor) : undefined;
    
    return {
      color,
      label,
      held: false,
      shouldHold,
      stripColor,
      releaseDigit
    };
  }
  
  private determineShouldHold(color: string, label: string, globals: GameGlobals): boolean {
    // Rule logic for when to hold vs tap
    if (color === 'blue' && label === 'ABORT') return true;
    if (globals.batteries > 1 && label === 'DETONATE') return false;
    if (color === 'white' && globals.indicators.some(i => i.label === 'CAR' && i.lit)) return true;
    if (globals.batteries > 2 && globals.indicators.some(i => i.label === 'FRK' && i.lit)) return false;
    if (color === 'yellow') return true;
    if (color === 'red' && label === 'HOLD') return false;
    return true; // Default to hold
  }
  
  private getReleaseDigit(stripColor: string): number {
    // Strip color determines when to release during countdown
    switch (stripColor) {
      case 'blue': return 4;
      case 'yellow': return 5;
      case 'red': return 1;
      case 'white': return 0;
      default: return 0;
    }
  }
  
  validate(action: { type: 'press' | 'hold' | 'release'; timerSeconds?: number }, state: ButtonModuleData, globals: GameGlobals) {
    const { type, timerSeconds } = action;
    
    if (type === 'press' && !state.shouldHold) {
      // Correct tap
      return {
        valid: true,
        solved: true,
        newState: state
      };
    }
    
    if (type === 'hold' && state.shouldHold) {
      // Start holding
      return {
        valid: true,
        newState: { ...state, held: true }
      };
    }
    
    if (type === 'release' && state.held && state.releaseDigit !== undefined && timerSeconds !== undefined) {
      // Check if released at correct time
      const currentDigit = timerSeconds % 10;
      const correct = currentDigit === state.releaseDigit;
      
      return {
        valid: true,
        strike: !correct,
        solved: correct,
        newState: { ...state, held: false }
      };
    }
    
    // Wrong action
    return {
      valid: true,
      strike: true,
      newState: state
    };
  }
}