import { IModule, GameGlobals } from '@/types/game';
import { DeterministicRNG } from '@/lib/rng';

export interface MorseModuleData {
  targetWord: string;
  morseSequence: string;
  correctFrequency: string;
  frequencies: string[];
  isPlaying: boolean;
  playbackSpeed: number;
}

const MORSE_WORDS = {
  'SHELL': '3.505',
  'HALLS': '3.515', 
  'SLICK': '3.522',
  'TRICK': '3.532',
  'BOXES': '3.535',
  'LEAKS': '3.542',
  'STROBE': '3.545',
  'BISTRO': '3.552',
  'FLICK': '3.555',
  'BOMBS': '3.565',
  'BREAK': '3.572',
  'BRICK': '3.575',
  'STEAK': '3.582',
  'STING': '3.592',
  'VECTOR': '3.595',
  'BEATS': '3.600'
};

const MORSE_CODE = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..'
};

export class MorseModule implements IModule {
  generate(seed: string, globals: GameGlobals): MorseModuleData {
    const rng = new DeterministicRNG(seed);
    
    const words = Object.keys(MORSE_WORDS);
    const targetWord = rng.choice(words);
    const correctFrequency = MORSE_WORDS[targetWord as keyof typeof MORSE_WORDS];
    
    // Generate morse sequence for the word
    const morseSequence = targetWord
      .split('')
      .map(char => MORSE_CODE[char as keyof typeof MORSE_CODE])
      .join(' ') + ' ';
    
    // Generate frequency options (correct + distractors)
    const allFrequencies = Object.values(MORSE_WORDS);
    const distractors = rng.shuffle(allFrequencies.filter(f => f !== correctFrequency)).slice(0, 5);
    const frequencies = rng.shuffle([correctFrequency, ...distractors]);
    
    // Playback speed based on globals (FRK + batteries rule)
    const hasFRK = globals.indicators.some(ind => ind.label === 'FRK' && ind.lit);
    const playbackSpeed = (hasFRK && globals.batteries > 2) ? 1.5 : 1.0;
    
    return {
      targetWord,
      morseSequence,
      correctFrequency,
      frequencies,
      isPlaying: false,
      playbackSpeed
    };
  }
  
  validate(action: { frequency: string }, state: MorseModuleData, globals: GameGlobals) {
    const { frequency } = action;
    const isCorrect = frequency === state.correctFrequency;
    
    return {
      valid: true,
      strike: !isCorrect,
      solved: isCorrect,
      newState: state
    };
  }
}