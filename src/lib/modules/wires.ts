import { IModule, GameGlobals, WireModuleData } from '@/types/game';
import { DeterministicRNG } from '@/lib/rng';

export class WiresModule implements IModule {
  generate(seed: string, globals: GameGlobals): WireModuleData {
    const rng = new DeterministicRNG(seed);
    const colors = ['red', 'blue', 'yellow', 'white', 'black', 'green'];
    const numWires = rng.nextInt(3, 6);
    
    // Generate wires
    const wires = Array.from({ length: numWires }, () => ({
      color: rng.choice(colors) as 'red' | 'blue' | 'yellow' | 'white' | 'black' | 'green',
      cut: false
    }));
    
    // Determine correct wire based on rules
    const correctWire = this.determineCorrectWire(wires, globals);
    
    return {
      wires,
      correctWire
    };
  }
  
  private determineCorrectWire(
    wires: Array<{ color: string; cut: boolean }>, 
    globals: GameGlobals
  ): number {
    const wireColors = wires.map(w => w.color);
    const wireCount = wires.length;
    
    // Rule logic (simplified from KTANE)
    if (wireCount === 3) {
      if (!wireColors.includes('red')) {
        return 1; // Second wire (0-indexed)
      }
      if (wireColors[wireColors.length - 1] === 'white') {
        return wireColors.length - 1; // Last wire
      }
      if (wireColors.filter(c => c === 'blue').length > 1) {
        return wireColors.lastIndexOf('blue'); // Last blue wire
      }
      return wireColors.length - 1; // Last wire
    }
    
    if (wireCount === 4) {
      if (wireColors.filter(c => c === 'red').length > 1 && globals.lastDigitOdd) {
        return wireColors.lastIndexOf('red'); // Last red wire
      }
      if (wireColors[wireColors.length - 1] === 'yellow' && !wireColors.includes('red')) {
        return 0; // First wire
      }
      if (wireColors.filter(c => c === 'blue').length === 1) {
        return 0; // First wire
      }
      if (wireColors.filter(c => c === 'yellow').length > 1) {
        return wireColors.length - 1; // Last wire
      }
      return 1; // Second wire
    }
    
    if (wireCount === 5) {
      if (wireColors[wireColors.length - 1] === 'black' && globals.lastDigitOdd) {
        return 3; // Fourth wire
      }
      if (wireColors.filter(c => c === 'red').length === 1 && wireColors.filter(c => c === 'yellow').length > 1) {
        return 0; // First wire
      }
      if (!wireColors.includes('black')) {
        return 1; // Second wire
      }
      return 0; // First wire
    }
    
    if (wireCount === 6) {
      if (!wireColors.includes('yellow') && globals.lastDigitOdd) {
        return 2; // Third wire
      }
      if (wireColors.filter(c => c === 'yellow').length === 1 && wireColors.filter(c => c === 'white').length > 1) {
        return 3; // Fourth wire
      }
      if (!wireColors.includes('red')) {
        return wireColors.length - 1; // Last wire
      }
      return 3; // Fourth wire
    }
    
    return 0; // Fallback
  }
  
  validate(action: { wireIndex: number }, state: WireModuleData, globals: GameGlobals) {
    const { wireIndex } = action;
    const newWires = [...state.wires];
    
    if (wireIndex < 0 || wireIndex >= newWires.length || newWires[wireIndex].cut) {
      return { valid: false, newState: state };
    }
    
    newWires[wireIndex].cut = true;
    const newState = { ...state, wires: newWires };
    
    const isCorrect = wireIndex === state.correctWire;
    
    return {
      valid: true,
      strike: !isCorrect,
      solved: isCorrect,
      newState
    };
  }
}