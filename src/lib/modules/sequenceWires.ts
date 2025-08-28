import { IModule, GameGlobals } from '@/types/game';
import { DeterministicRNG } from '@/lib/rng';

export interface SequenceWiresModuleData {
  stage: number;
  maxStages: number;
  wireConnections: Array<{ from: string; to: number; cut: boolean }>;
  redWiresCut: number;
  blueWiresCut: number;
  blackWiresCut: number;
}

// Cutting rules based on occurrence number and conditions
const CUT_RULES = {
  red: {
    1: 'C', 2: 'B', 3: 'A', 4: 'A_OR_C', 5: 'B', 6: 'A_OR_C', 7: 'NEVER', 8: 'B', 9: 'C'
  },
  blue: {
    1: 'B', 2: 'A_OR_C', 3: 'B', 4: 'A', 5: 'B', 6: 'B_OR_C', 7: 'C', 8: 'A_OR_C', 9: 'A'
  },
  black: {
    1: 'NEVER', 2: 'A_OR_C', 3: 'B', 4: 'A_OR_C', 5: 'B', 6: 'B_OR_C', 7: 'A_OR_B', 8: 'C', 9: 'C'
  }
};

export class SequenceWiresModule implements IModule {
  generate(seed: string, globals: GameGlobals): SequenceWiresModuleData {
    const rng = new DeterministicRNG(seed);
    
    // Generate 4 stages with random wire configurations
    const wireConnections = [];
    for (let stage = 0; stage < 4; stage++) {
      for (let panel = 0; panel < 3; panel++) {
        const colors = ['red', 'blue', 'black'];
        const color = rng.choice(colors);
        const destination = rng.nextInt(1, 3); // A=1, B=2, C=3
        
        wireConnections.push({
          from: color,
          to: destination,
          cut: false
        });
      }
    }
    
    return {
      stage: 0,
      maxStages: 4,
      wireConnections,
      redWiresCut: 0,
      blueWiresCut: 0,
      blackWiresCut: 0
    };
  }
  
  validate(action: { wireIndex: number; cut: boolean }, state: SequenceWiresModuleData, globals: GameGlobals) {
    const { wireIndex, cut } = action;
    const wire = state.wireConnections[wireIndex];
    
    if (!wire || wire.cut) {
      return { valid: false, newState: state };
    }
    
    // Determine occurrence number for this color
    const colorCount = state.wireConnections
      .slice(0, wireIndex + 1)
      .filter(w => w.from === wire.from).length;
    
    const rule = CUT_RULES[wire.from as keyof typeof CUT_RULES][colorCount as keyof typeof CUT_RULES['red']];
    
    let shouldCut = false;
    const destLetter = ['', 'A', 'B', 'C'][wire.to];
    
    switch (rule) {
      case 'A': shouldCut = wire.to === 1; break;
      case 'B': shouldCut = wire.to === 2; break;
      case 'C': shouldCut = wire.to === 3; break;
      case 'A_OR_C': shouldCut = wire.to === 1 || wire.to === 3; break;
      case 'B_OR_C': shouldCut = wire.to === 2 || wire.to === 3; break;
      case 'A_OR_B': shouldCut = wire.to === 1 || wire.to === 2; break;
      case 'NEVER': shouldCut = false; break;
    }
    
    const isCorrect = cut === shouldCut;
    
    // Update state
    const newConnections = [...state.wireConnections];
    newConnections[wireIndex] = { ...wire, cut: true };
    
    let newRedCut = state.redWiresCut;
    let newBlueCut = state.blueWiresCut;
    let newBlackCut = state.blackWiresCut;
    
    if (cut) {
      if (wire.from === 'red') newRedCut++;
      if (wire.from === 'blue') newBlueCut++;
      if (wire.from === 'black') newBlackCut++;
    }
    
    const newStage = Math.floor((wireIndex + 1) / 3);
    const solved = newStage >= 4;
    
    return {
      valid: true,
      strike: !isCorrect,
      solved,
      newState: {
        ...state,
        stage: newStage,
        wireConnections: newConnections,
        redWiresCut: newRedCut,
        blueWiresCut: newBlueCut,
        blackWiresCut: newBlackCut
      }
    };
  }
}