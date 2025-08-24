import { IModule, GameGlobals, SymbolModuleData } from '@/types/game';
import { DeterministicRNG } from '@/lib/rng';

// Symbol definitions (using numbers as IDs for simplicity)
const SYMBOL_COLUMNS = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 1, 7, 9, 10, 6, 11],
  [12, 13, 10, 2, 14, 3, 15],
  [16, 17, 12, 18, 8, 19, 15],
  [20, 16, 21, 14, 18, 11, 9],
  [6, 21, 17, 5, 20, 19, 13]
];

export class SymbolsModule implements IModule {
  generate(seed: string, globals: GameGlobals): SymbolModuleData {
    const rng = new DeterministicRNG(seed);
    
    // Pick 4 random symbols that appear in the same column
    const columnIndex = rng.nextInt(0, SYMBOL_COLUMNS.length - 1);
    const column = SYMBOL_COLUMNS[columnIndex];
    
    // Pick 4 symbols from this column
    const selectedIndices = rng.shuffle([...Array(column.length).keys()]).slice(0, 4);
    const symbols = selectedIndices.map(i => column[i]);
    
    // Determine correct order (top to bottom in the column)
    const order = selectedIndices
      .sort((a, b) => a - b) // Sort by position in column
      .map(i => column[i]); // Map back to symbol IDs
    
    return {
      symbols: rng.shuffle(symbols), // Randomize display order
      order,
      pressed: []
    };
  }
  
  validate(action: { symbolId: number }, state: SymbolModuleData, globals: GameGlobals) {
    const { symbolId } = action;
    const { order, pressed } = state;
    
    if (!state.symbols.includes(symbolId) || pressed.includes(symbolId)) {
      return { valid: false, newState: state };
    }
    
    const expectedNext = order[pressed.length];
    const isCorrect = symbolId === expectedNext;
    
    if (!isCorrect) {
      // Wrong symbol - strike and reset
      return {
        valid: true,
        strike: true,
        newState: { ...state, pressed: [] }
      };
    }
    
    const newPressed = [...pressed, symbolId];
    const solved = newPressed.length === order.length;
    
    return {
      valid: true,
      solved,
      newState: { ...state, pressed: newPressed }
    };
  }
  
  // Helper to get symbol display character
  static getSymbolChar(id: number): string {
    const symbols = ['Ω', 'Ѭ', '☆', 'ټ', 'ϕ', '∇', '※', 'Ѯ', 'Ϭ', 'φ', 'ʘ', 'Җ', 'ξ', '♦', 'Ψ', 'Ϩ', 'Ѧ', 'Ϭ', 'ϑ', 'Ѣ', '₪'];
    return symbols[id - 1] || '?';
  }
}