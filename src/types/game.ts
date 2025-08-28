export type GameMode = 'quick' | 'full';
export type Difficulty = 'novice' | 'pro' | 'expert';
export type GameStatus = 'intro' | 'active' | 'won' | 'exploded';
export type ModuleType = 'wires' | 'button' | 'symbols' | 'maze' | 'morse' | 'password' | 'sequenceWires' | 'capacitor' | 'memory' | 'simon' | 'wordPanel';

export interface Indicator {
  label: string;
  lit: boolean;
}

export interface GameGlobals {
  serial: string;
  lastDigitOdd: boolean;
  hasVowel: boolean;
  batteries: number;
  indicators: Indicator[];
  ports: string[];
}

export interface ModuleState {
  id: string;
  type: ModuleType;
  solved: boolean;
  data: any; // Module-specific state
}

export interface WireModuleData {
  wires: Array<{
    color: 'red' | 'blue' | 'yellow' | 'white' | 'black' | 'green';
    cut: boolean;
  }>;
  correctWire: number; // Index of correct wire to cut
}

export interface ButtonModuleData {
  color: 'red' | 'blue' | 'yellow' | 'white';
  label: 'PRESS' | 'ABORT' | 'HOLD' | 'DETONATE';
  held: boolean;
  stripColor?: 'red' | 'blue' | 'yellow' | 'white';
  shouldHold: boolean;
  releaseDigit?: number;
}

export interface SymbolModuleData {
  symbols: number[]; // 4 symbol IDs
  order: number[]; // Correct order based on column
  pressed: number[]; // Symbols pressed so far
}

export interface MazeModuleData {
  mazeId: number;
  playerX: number;
  playerY: number;
  targetX: number;
  targetY: number;
  walls: boolean[][];
  circleMarkers: { x: number; y: number }[];
}

export interface MorseModuleData {
  targetWord: string;
  morseSequence: string;
  correctFrequency: string;
  frequencies: string[];
  isPlaying: boolean;
  playbackSpeed: number;
}

export interface PasswordModuleData {
  targetWord: string;
  columns: string[][];
  currentPassword: string[];
}

export interface SequenceWiresModuleData {
  stage: number;
  maxStages: number;
  wireConnections: Array<{ from: string; to: number; cut: boolean }>;
  redWiresCut: number;
  blueWiresCut: number;
  blackWiresCut: number;
}

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

export interface MemoryModuleData {
  stage: number;
  displays: number[];
  buttons: number[][];
  history: Array<{ position: number; label: number }>;
  currentDisplay: number;
  currentButtons: number[];
}

export interface SimonModuleData {
  sequence: number[];
  playerInput: number[];
  stage: number;
  maxStages: number;
  colorMapping: number[];
  hasVowel: boolean;
  strikes: number;
}

export interface WordPanelModuleData {
  displayWord: string;
  buttonWords: string[];
  correctButton: number;
  category: string;
}

export interface GameState {
  seed: string;
  mode: GameMode;
  difficulty: Difficulty;
  timerSeconds: number;
  maxStrikes: number;
  strikes: number;
  globals: GameGlobals;
  modules: ModuleState[];
  status: GameStatus;
  startTime?: number;
  endTime?: number;
}

export interface IModule {
  generate(seed: string, globals: GameGlobals): any;
  validate(action: any, state: any, globals: GameGlobals): { 
    valid: boolean; 
    strike?: boolean; 
    newState: any;
    solved?: boolean;
  };
}