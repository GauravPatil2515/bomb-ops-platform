import { IModule, GameGlobals } from '@/types/game';
import { DeterministicRNG } from '@/lib/rng';

export interface MemoryModuleData {
  stage: number;
  displays: number[];
  buttons: number[][];
  history: Array<{ position: number; label: number }>;
  currentDisplay: number;
  currentButtons: number[];
}

export class MemoryModule implements IModule {
  generate(seed: string, globals: GameGlobals): MemoryModuleData {
    const rng = new DeterministicRNG(seed);
    
    // Generate 5 stages of displays and button configurations
    const displays: number[] = [];
    const buttons: number[][] = [];
    
    for (let stage = 0; stage < 5; stage++) {
      displays.push(rng.nextInt(1, 4));
      
      // Generate 4 buttons with numbers 1-4, shuffled
      const stageButtons = rng.shuffle([1, 2, 3, 4]);
      buttons.push(stageButtons);
    }
    
    return {
      stage: 0,
      displays,
      buttons,
      history: [],
      currentDisplay: displays[0],
      currentButtons: buttons[0]
    };
  }
  
  validate(action: { position: number }, state: MemoryModuleData, globals: GameGlobals) {
    const { position } = action;
    const { stage, displays, buttons, history } = state;
    
    if (position < 0 || position >= 4) {
      return { valid: false, newState: state };
    }
    
    const display = displays[stage];
    const stageButtons = buttons[stage];
    const pressedLabel = stageButtons[position];
    
    let correctPosition = -1;
    
    // Memory rules based on stage and display value
    switch (stage) {
      case 0: // Stage 1
        switch (display) {
          case 1: correctPosition = 1; break; // Press button in position 2
          case 2: correctPosition = 1; break; // Press button in position 2  
          case 3: correctPosition = 2; break; // Press button in position 3
          case 4: correctPosition = 3; break; // Press button in position 4
        }
        break;
        
      case 1: // Stage 2
        switch (display) {
          case 1: correctPosition = stageButtons.indexOf(4); break; // Press button labeled "4"
          case 2: correctPosition = history[0].position; break; // Press same position as stage 1
          case 3: correctPosition = 0; break; // Press button in position 1
          case 4: correctPosition = history[0].position; break; // Press same position as stage 1
        }
        break;
        
      case 2: // Stage 3
        switch (display) {
          case 1: correctPosition = stageButtons.indexOf(history[1].label); break; // Press button with same label as stage 2
          case 2: correctPosition = stageButtons.indexOf(history[0].label); break; // Press button with same label as stage 1
          case 3: correctPosition = 2; break; // Press button in position 3
          case 4: correctPosition = stageButtons.indexOf(4); break; // Press button labeled "4"
        }
        break;
        
      case 3: // Stage 4
        switch (display) {
          case 1: correctPosition = history[0].position; break; // Press same position as stage 1
          case 2: correctPosition = 0; break; // Press button in position 1
          case 3: correctPosition = history[1].position; break; // Press same position as stage 2
          case 4: correctPosition = history[1].position; break; // Press same position as stage 2
        }
        break;
        
      case 4: // Stage 5
        switch (display) {
          case 1: correctPosition = stageButtons.indexOf(history[0].label); break; // Press button with same label as stage 1
          case 2: correctPosition = stageButtons.indexOf(history[1].label); break; // Press button with same label as stage 2
          case 3: correctPosition = stageButtons.indexOf(history[3].label); break; // Press button with same label as stage 4
          case 4: correctPosition = stageButtons.indexOf(history[2].label); break; // Press button with same label as stage 3
        }
        break;
    }
    
    const isCorrect = position === correctPosition;
    
    if (!isCorrect) {
      // Reset on incorrect answer
      return {
        valid: true,
        strike: true,
        solved: false,
        newState: {
          ...state,
          stage: 0,
          history: [],
          currentDisplay: state.displays[0],
          currentButtons: state.buttons[0]
        }
      };
    }
    
    // Correct answer - advance to next stage
    const newHistory = [...history, { position, label: pressedLabel }];
    const newStage = stage + 1;
    const solved = newStage >= 5;
    
    return {
      valid: true,
      strike: false,
      solved,
      newState: {
        ...state,
        stage: newStage,
        history: newHistory,
        currentDisplay: solved ? 0 : state.displays[newStage],
        currentButtons: solved ? [] : state.buttons[newStage]
      }
    };
  }
}