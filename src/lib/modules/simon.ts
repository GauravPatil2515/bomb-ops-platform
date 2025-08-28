import { IModule, GameGlobals } from '@/types/game';
import { DeterministicRNG } from '@/lib/rng';

export interface SimonModuleData {
  sequence: number[];
  playerInput: number[];
  stage: number;
  maxStages: number;
  colorMapping: number[];
  hasVowel: boolean;
  strikes: number;
}

// Color mappings based on serial vowel and strikes
const COLOR_MAPPINGS = {
  vowel_no_strikes: [0, 1, 3, 2], // Red->Red, Yellow->Blue, Green->Yellow, Blue->Green
  vowel_strikes: [1, 3, 2, 0],    // Red->Blue, Yellow->Yellow, Green->Green, Blue->Red
  no_vowel_no_strikes: [1, 0, 2, 3], // Red->Blue, Yellow->Red, Green->Green, Blue->Yellow
  no_vowel_strikes: [3, 2, 0, 1]     // Red->Yellow, Yellow->Green, Green->Red, Blue->Blue
};

export class SimonModule implements IModule {
  generate(seed: string, globals: GameGlobals): SimonModuleData {
    const rng = new DeterministicRNG(seed);
    
    // Generate sequence of 5 colors (0=Red, 1=Yellow, 2=Green, 3=Blue)
    const sequence = [];
    for (let i = 0; i < 5; i++) {
      sequence.push(rng.nextInt(0, 3));
    }
    
    // Determine initial mapping based on serial vowel
    const hasVowel = globals.hasVowel;
    const mappingKey = hasVowel ? 'vowel_no_strikes' : 'no_vowel_no_strikes';
    const colorMapping = COLOR_MAPPINGS[mappingKey as keyof typeof COLOR_MAPPINGS];
    
    return {
      sequence,
      playerInput: [],
      stage: 0,
      maxStages: 5,
      colorMapping: [...colorMapping],
      hasVowel,
      strikes: 0
    };
  }
  
  validate(action: { color: number } | { type: 'strike' }, state: SimonModuleData, globals: GameGlobals) {
    if ('type' in action && action.type === 'strike') {
      // Update strikes and potentially change mapping
      const newStrikes = state.strikes + 1;
      let newMapping = [...state.colorMapping];
      
      // Change mapping if strikes occurred
      if (newStrikes > 0) {
        const mappingKey = state.hasVowel ? 'vowel_strikes' : 'no_vowel_strikes';
        newMapping = COLOR_MAPPINGS[mappingKey as keyof typeof COLOR_MAPPINGS];
      }
      
      return {
        valid: true,
        strike: false,
        solved: false,
        newState: {
          ...state,
          strikes: newStrikes,
          colorMapping: newMapping,
          playerInput: [] // Reset input on strike
        }
      };
    }
    
    const { color } = action as { color: number };
    
    // Apply color mapping
    const mappedColor = state.colorMapping[color];
    const expectedColor = state.sequence[state.playerInput.length];
    
    if (mappedColor !== expectedColor) {
      // Wrong color - strike and reset
      return {
        valid: true,
        strike: true,
        solved: false,
        newState: {
          ...state,
          playerInput: []
        }
      };
    }
    
    // Correct color
    const newPlayerInput = [...state.playerInput, mappedColor];
    
    // Check if stage is complete
    if (newPlayerInput.length === state.stage + 1) {
      const newStage = state.stage + 1;
      const solved = newStage >= state.maxStages;
      
      return {
        valid: true,
        strike: false,
        solved,
        newState: {
          ...state,
          stage: newStage,
          playerInput: solved ? newPlayerInput : []
        }
      };
    }
    
    // Continue with current stage
    return {
      valid: true,
      strike: false,
      solved: false,
      newState: {
        ...state,
        playerInput: newPlayerInput
      }
    };
  }
}