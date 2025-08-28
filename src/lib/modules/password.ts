import { IModule, GameGlobals } from '@/types/game';
import { DeterministicRNG } from '@/lib/rng';

export interface PasswordModuleData {
  targetWord: string;
  columns: string[][];
  currentPassword: string[];
}

const PASSWORD_WORDS = [
  'ABOUT', 'AFTER', 'AGAIN', 'BELOW', 'COULD', 'EVERY', 'FIRST', 'FOUND', 
  'GREAT', 'GROUP', 'HAND', 'HELP', 'HOUSE', 'LARGE', 'LAST', 'LEFT',
  'LIFE', 'LIGHT', 'LIVED', 'MADE', 'MIGHT', 'MOVE', 'MUCH', 'MUST',
  'NAME', 'NEVER', 'NEW', 'NEWS', 'NIGHT', 'NUMBER', 'OFTEN', 'ORDER',
  'OTHER', 'OWN', 'PART', 'PLACE', 'POINT', 'RIGHT', 'SAID', 'SAME',
  'SAW', 'SEEMS', 'SHALL', 'SHE', 'SHOULD', 'SHOW', 'SMALL', 'SOUND',
  'STILL', 'SUCH', 'TAKE', 'THAN', 'THEM', 'WELL', 'WERE'
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export class PasswordModule implements IModule {
  generate(seed: string, globals: GameGlobals): PasswordModuleData {
    const rng = new DeterministicRNG(seed);
    const targetWord = rng.choice(PASSWORD_WORDS);
    
    // Generate 5 columns, each containing the target letter + 5 distractors
    const columns: string[][] = [];
    
    for (let i = 0; i < 5; i++) {
      const targetLetter = targetWord[i];
      const distractors: string[] = [];
      
      // Add 5 random letters that don't form other valid words
      while (distractors.length < 5) {
        const letter = rng.choice([...ALPHABET]);
        if (letter !== targetLetter && !distractors.includes(letter)) {
          distractors.push(letter);
        }
      }
      
      const column = rng.shuffle([targetLetter, ...distractors]);
      columns.push(column);
    }
    
    return {
      targetWord,
      columns,
      currentPassword: columns.map(col => col[0]) // Start with first letter of each column
    };
  }
  
  validate(action: { type: 'setLetter'; column: number; letter: string } | { type: 'submit' }, state: PasswordModuleData, globals: GameGlobals) {
    if (action.type === 'setLetter') {
      const { column, letter } = action;
      const newPassword = [...state.currentPassword];
      newPassword[column] = letter;
      
      return {
        valid: true,
        strike: false,
        solved: false,
        newState: { ...state, currentPassword: newPassword }
      };
    }
    
    if (action.type === 'submit') {
      const submittedWord = state.currentPassword.join('');
      const isCorrect = submittedWord === state.targetWord;
      
      return {
        valid: true,
        strike: !isCorrect,
        solved: isCorrect,
        newState: state
      };
    }
    
    return { valid: false, newState: state };
  }
}