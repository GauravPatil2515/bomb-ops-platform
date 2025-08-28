import { IModule, GameGlobals } from '@/types/game';
import { DeterministicRNG } from '@/lib/rng';

export interface WordPanelModuleData {
  displayWord: string;
  buttonWords: string[];
  correctButton: number;
  category: string;
}

const WORD_CATEGORIES = {
  'COLORS': {
    display: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'PURPLE'],
    options: ['CRIMSON', 'AZURE', 'EMERALD', 'GOLDEN', 'AMBER', 'VIOLET', 'SCARLET', 'NAVY']
  },
  'ANIMALS': {
    display: ['CAT', 'DOG', 'BIRD', 'FISH', 'HORSE', 'BEAR'],
    options: ['FELINE', 'CANINE', 'AVIAN', 'AQUATIC', 'EQUINE', 'URSINE', 'LUPINE', 'BOVINE']
  },
  'ACTIONS': {
    display: ['RUN', 'JUMP', 'WALK', 'SWIM', 'FLY', 'CLIMB'],
    options: ['SPRINT', 'LEAP', 'STRIDE', 'DIVE', 'SOAR', 'ASCEND', 'DASH', 'GLIDE']
  },
  'OBJECTS': {
    display: ['BOOK', 'CHAIR', 'TABLE', 'LAMP', 'DOOR', 'WINDOW'],
    options: ['TOME', 'SEAT', 'DESK', 'LIGHT', 'PORTAL', 'PANE', 'VOLUME', 'BENCH']
  }
};

// Mapping rules based on display word position and conditions
const POSITION_RULES = {
  1: (globals: GameGlobals) => globals.batteries > 2 ? 2 : 1,
  2: (globals: GameGlobals) => globals.indicators.some(ind => ind.lit) ? 4 : 2,
  3: (globals: GameGlobals) => globals.ports.length > 1 ? 3 : 5,
  4: (globals: GameGlobals) => globals.lastDigitOdd ? 1 : 4,
  5: (globals: GameGlobals) => globals.hasVowel ? 2 : 6,
  6: (globals: GameGlobals) => globals.batteries === 0 ? 3 : 6
};

export class WordPanelModule implements IModule {
  generate(seed: string, globals: GameGlobals): WordPanelModuleData {
    const rng = new DeterministicRNG(seed);
    
    // Choose category
    const categories = Object.keys(WORD_CATEGORIES);
    const category = rng.choice(categories);
    const categoryData = WORD_CATEGORIES[category as keyof typeof WORD_CATEGORIES];
    
    // Choose display word
    const displayWord = rng.choice(categoryData.display);
    const displayIndex = categoryData.display.indexOf(displayWord) + 1;
    
    // Generate 6 button words (including correct answer)
    const correctAnswer = categoryData.options[categoryData.display.indexOf(displayWord)];
    const distractors = categoryData.options.filter(word => word !== correctAnswer);
    const selectedDistractors = rng.shuffle(distractors).slice(0, 5);
    
    const buttonWords = rng.shuffle([correctAnswer, ...selectedDistractors]);
    
    // Determine correct button position based on display word position and rules
    const rulePosition = POSITION_RULES[displayIndex as keyof typeof POSITION_RULES](globals);
    const correctButton = (rulePosition - 1) % buttonWords.length;
    
    return {
      displayWord,
      buttonWords,
      correctButton,
      category
    };
  }
  
  validate(action: { buttonIndex: number }, state: WordPanelModuleData, globals: GameGlobals) {
    const { buttonIndex } = action;
    
    if (buttonIndex < 0 || buttonIndex >= state.buttonWords.length) {
      return { valid: false, newState: state };
    }
    
    const isCorrect = buttonIndex === state.correctButton;
    
    return {
      valid: true,
      strike: !isCorrect,
      solved: isCorrect,
      newState: state
    };
  }
}