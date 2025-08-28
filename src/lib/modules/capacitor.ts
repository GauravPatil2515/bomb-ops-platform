import { IModule, GameGlobals } from '@/types/game';
import { DeterministicRNG } from '@/lib/rng';

export interface CapacitorModuleData {
  chargeLevel: number;
  maxCharge: number;
  ventWindows: Array<{ start: number; end: number }>;
  currentWindow: number;
  isCharging: boolean;
  chargeRate: number;
  ventCount: number;
  maxVents: number;
}

export class CapacitorModule implements IModule {
  generate(seed: string, globals: GameGlobals): CapacitorModuleData {
    const rng = new DeterministicRNG(seed);
    
    // Charge rate affected by batteries
    const baseRate = 2;
    const chargeRate = baseRate + (globals.batteries * 0.5);
    
    // Window timing affected by indicators
    const hasCAR = globals.indicators.some(ind => ind.label === 'CAR' && ind.lit);
    const hasSND = globals.indicators.some(ind => ind.label === 'SND' && ind.lit);
    
    const windowDuration = (hasCAR || hasSND) ? 15 : 20; // Shorter windows with indicators
    
    // Generate 5 vent windows
    const ventWindows = [];
    for (let i = 0; i < 5; i++) {
      const start = 20 + (i * 25) + rng.nextInt(-5, 5);
      ventWindows.push({
        start,
        end: start + windowDuration
      });
    }
    
    return {
      chargeLevel: 0,
      maxCharge: 100,
      ventWindows,
      currentWindow: 0,
      isCharging: true,
      chargeRate,
      ventCount: 0,
      maxVents: 5
    };
  }
  
  validate(action: { type: 'vent' | 'tick'; charge?: number }, state: CapacitorModuleData, globals: GameGlobals) {
    if (action.type === 'tick') {
      // Update charge level
      const newCharge = Math.min(state.maxCharge, state.chargeLevel + state.chargeRate);
      
      // Check for overcharge
      if (newCharge >= state.maxCharge) {
        return {
          valid: true,
          strike: true,
          solved: false,
          newState: { ...state, chargeLevel: 0, isCharging: false }
        };
      }
      
      return {
        valid: true,
        strike: false,
        solved: false,
        newState: { ...state, chargeLevel: newCharge }
      };
    }
    
    if (action.type === 'vent') {
      const currentWindow = state.ventWindows[state.currentWindow];
      if (!currentWindow) {
        return { valid: false, newState: state };
      }
      
      const currentCharge = action.charge || state.chargeLevel;
      const inWindow = currentCharge >= currentWindow.start && currentCharge <= currentWindow.end;
      
      if (!inWindow) {
        // Vented outside window - strike
        return {
          valid: true,
          strike: true,
          solved: false,
          newState: { ...state, chargeLevel: 0 }
        };
      }
      
      // Successful vent
      const newVentCount = state.ventCount + 1;
      const solved = newVentCount >= state.maxVents;
      
      return {
        valid: true,
        strike: false,
        solved,
        newState: {
          ...state,
          chargeLevel: 0,
          ventCount: newVentCount,
          currentWindow: state.currentWindow + 1
        }
      };
    }
    
    return { valid: false, newState: state };
  }
}