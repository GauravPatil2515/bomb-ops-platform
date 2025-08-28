import { create } from 'zustand';
import { GameState, GameMode, Difficulty, GameStatus, GameGlobals, ModuleState, ModuleType } from '@/types/game';
import { DeterministicRNG, generateSeed } from '@/lib/rng';
import { WiresModule } from '@/lib/modules/wires';
import { ButtonModule } from '@/lib/modules/button';
import { SymbolsModule } from '@/lib/modules/symbols';
import { MazeModule } from '@/lib/modules/maze';
import { MorseModule } from '@/lib/modules/morse';
import { PasswordModule } from '@/lib/modules/password';
import { SequenceWiresModule } from '@/lib/modules/sequenceWires';
import { CapacitorModule } from '@/lib/modules/capacitor';
import { MemoryModule } from '@/lib/modules/memory';
import { SimonModule } from '@/lib/modules/simon';
import { WordPanelModule } from '@/lib/modules/wordPanel';

interface GameStore extends GameState {
  // Actions
  initializeGame: (mode: GameMode, difficulty: Difficulty, seed?: string) => void;
  startGame: () => void;
  tick: () => void;
  strike: () => void;
  moduleAction: (moduleId: string, action: any) => void;
  reset: (seed?: string) => void;
  setStatus: (status: GameStatus) => void;
  // Timer control
  timerInterval?: NodeJS.Timeout;
  startTimer: () => void;
  stopTimer: () => void;
  // Accessibility & Settings
  colorBlindMode: boolean;
  reducedMotion: boolean;
  audioEnabled: boolean;
  lowGraphics: boolean;
  setColorBlindMode: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setLowGraphics: (enabled: boolean) => void;
}

const TIMER_DURATIONS = {
  quick: 5 * 60, // 5 minutes
  full: 10 * 60  // 10 minutes
};

const MAX_STRIKES = {
  quick: 2,
  full: 3
};

const modules = {
  wires: new WiresModule(),
  button: new ButtonModule(),
  symbols: new SymbolsModule(),
  maze: new MazeModule(),
  morse: new MorseModule(),
  password: new PasswordModule(),
  sequenceWires: new SequenceWiresModule(),
  capacitor: new CapacitorModule(),
  memory: new MemoryModule(),
  simon: new SimonModule(),
  wordPanel: new WordPanelModule()
};

// Module pools and weights by difficulty
const MODULE_POOLS = {
  novice: [
    { type: 'wires' as ModuleType, weight: 2 },
    { type: 'button' as ModuleType, weight: 2 },
    { type: 'symbols' as ModuleType, weight: 2 },
    { type: 'maze' as ModuleType, weight: 1 },
    { type: 'morse' as ModuleType, weight: 1 },
    { type: 'password' as ModuleType, weight: 1 }
  ],
  pro: [
    { type: 'wires' as ModuleType, weight: 2 },
    { type: 'button' as ModuleType, weight: 2 },
    { type: 'symbols' as ModuleType, weight: 2 },
    { type: 'maze' as ModuleType, weight: 1 },
    { type: 'morse' as ModuleType, weight: 1 },
    { type: 'password' as ModuleType, weight: 1 },
    { type: 'sequenceWires' as ModuleType, weight: 1 },
    { type: 'simon' as ModuleType, weight: 1 },
    { type: 'capacitor' as ModuleType, weight: 1 },
    { type: 'memory' as ModuleType, weight: 1 }
  ],
  expert: [
    { type: 'wires' as ModuleType, weight: 1 },
    { type: 'button' as ModuleType, weight: 1 },
    { type: 'symbols' as ModuleType, weight: 2 },
    { type: 'maze' as ModuleType, weight: 1 },
    { type: 'morse' as ModuleType, weight: 1 },
    { type: 'password' as ModuleType, weight: 1 },
    { type: 'sequenceWires' as ModuleType, weight: 1 },
    { type: 'simon' as ModuleType, weight: 1 },
    { type: 'capacitor' as ModuleType, weight: 1 },
    { type: 'memory' as ModuleType, weight: 1 },
    { type: 'wordPanel' as ModuleType, weight: 1 }
  ]
};

function generateGlobals(rng: DeterministicRNG): GameGlobals {
  // Generate serial number
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const serial = Array.from({ length: 6 }, () => rng.choice([...chars])).join('');
  const lastDigit = serial[serial.length - 1];
  const lastDigitOdd = !isNaN(Number(lastDigit)) && Number(lastDigit) % 2 === 1;
  const hasVowel = /[AEIOU]/.test(serial);
  
  // Generate other globals
  const batteries = rng.nextInt(0, 4);
  const indicatorLabels = ['SND', 'CLR', 'CAR', 'FRK', 'IND', 'MSA', 'NSA', 'SIG', 'TRN'];
  const numIndicators = rng.nextInt(0, 3);
  const indicators = rng.shuffle(indicatorLabels)
    .slice(0, numIndicators)
    .map(label => ({ label, lit: rng.next() > 0.5 }));
  
  const allPorts = ['USB', 'HDMI', 'Serial', 'Parallel', 'PS2', 'RCA'];
  const numPorts = rng.nextInt(0, 3);
  const ports = rng.shuffle(allPorts).slice(0, numPorts);
  
  return {
    serial,
    lastDigitOdd,
    hasVowel,
    batteries,
    indicators,
    ports
  };
}

function generateModules(seed: string, globals: GameGlobals, mode: GameMode, difficulty: Difficulty): ModuleState[] {
  const rng = new DeterministicRNG(seed + '_modules');
  
  // Get module count based on mode
  const moduleCount = mode === 'quick' ? 3 : 5;
  
  // Get available modules for difficulty
  const availableModules = MODULE_POOLS[difficulty];
  
  // Create weighted selection
  const weightedModules: ModuleType[] = [];
  availableModules.forEach(({ type, weight }) => {
    for (let i = 0; i < weight; i++) {
      weightedModules.push(type);
    }
  });
  
  // Select unique modules
  const selectedTypes: ModuleType[] = [];
  const uniqueTypes = [...new Set(availableModules.map(m => m.type))];
  
  // Ensure at least one "confidence" module (wires/button/symbols)
  const confidenceModules = ['wires', 'button', 'symbols'].filter(type => 
    uniqueTypes.includes(type as ModuleType)
  );
  if (confidenceModules.length > 0) {
    selectedTypes.push(rng.choice(confidenceModules) as ModuleType);
  }
  
  // Fill remaining slots
  while (selectedTypes.length < moduleCount) {
    const candidate = rng.choice(weightedModules);
    if (!selectedTypes.includes(candidate)) {
      selectedTypes.push(candidate);
    }
  }
  
  // Generate modules
  return selectedTypes.map((type, index) => ({
    id: `${type}_${index}`,
    type,
    solved: false,
    data: modules[type].generate(seed + `_${type}`, globals)
  }));
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  seed: '',
  mode: 'quick',
  difficulty: 'novice',
  timerSeconds: 300,
  maxStrikes: 2,
  strikes: 0,
  globals: {
    serial: '',
    lastDigitOdd: false,
    hasVowel: false,
    batteries: 0,
    indicators: [],
    ports: []
  },
  modules: [],
  status: 'intro',
  
  // Settings
  colorBlindMode: false,
  reducedMotion: false,
  audioEnabled: true,
  lowGraphics: false,
  
  initializeGame: (mode, difficulty, seed) => {
    const gameSeed = seed || generateSeed();
    const rng = new DeterministicRNG(gameSeed);
    const globals = generateGlobals(rng);
    const gameModules = generateModules(gameSeed, globals, mode, difficulty);
    
    set({
      seed: gameSeed,
      mode,
      difficulty,
      timerSeconds: TIMER_DURATIONS[mode],
      maxStrikes: MAX_STRIKES[mode],
      strikes: 0,
      globals,
      modules: gameModules,
      status: 'intro',
      startTime: undefined,
      endTime: undefined
    });
    
    // Update URL with seed
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('seed', gameSeed);
      url.searchParams.set('mode', mode);
      url.searchParams.set('difficulty', difficulty);
      window.history.replaceState({}, '', url.toString());
    }
  },
  
  startGame: () => {
    const { startTimer } = get();
    set({
      status: 'active',
      startTime: Date.now()
    });
    startTimer();
  },
  
  tick: () => {
    const { timerSeconds, status, difficulty } = get();
    if (status !== 'active') return;
    
    const newTime = timerSeconds - 1;
    if (newTime <= 0) {
      get().stopTimer();
      set({
        timerSeconds: 0,
        status: 'exploded',
        endTime: Date.now()
      });
    } else {
      set({ timerSeconds: newTime });
    }
  },
  
  strike: () => {
    const { strikes, maxStrikes, difficulty, timerSeconds } = get();
    const newStrikes = strikes + 1;
    let newTimer = timerSeconds;
    
    // Time penalty for Pro/Expert difficulty
    if (difficulty !== 'novice') {
      newTimer = Math.max(0, timerSeconds - 10);
    }
    
    if (newStrikes >= maxStrikes) {
      get().stopTimer();
      set({
        strikes: newStrikes,
        timerSeconds: newTimer,
        status: 'exploded',
        endTime: Date.now()
      });
    } else {
      set({
        strikes: newStrikes,
        timerSeconds: newTimer
      });
    }
  },
  
  moduleAction: (moduleId, action) => {
    const { modules: currentModules, globals } = get();
    const moduleIndex = currentModules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;
    
    const module = currentModules[moduleIndex];
    const moduleLogic = modules[module.type as keyof typeof modules];
    
    const result = moduleLogic.validate(action, module.data, globals);
    
    if (result.strike) {
      get().strike();
    }
    
    const newModules = [...currentModules];
    newModules[moduleIndex] = {
      ...module,
      data: result.newState,
      solved: result.solved || false
    };
    
    set({ modules: newModules });
    
    // Check if all modules are solved
    if (newModules.every(m => m.solved)) {
      get().stopTimer();
      set({
        status: 'won',
        endTime: Date.now()
      });
    }
  },
  
  reset: (seed) => {
    const { mode, difficulty, stopTimer } = get();
    stopTimer();
    get().initializeGame(mode, difficulty, seed);
  },
  
  setStatus: (status) => {
    set({ status });
  },
  
  startTimer: () => {
    const { stopTimer } = get();
    stopTimer(); // Clear any existing timer
    const interval = setInterval(() => {
      get().tick();
    }, 1000);
    set({ timerInterval: interval });
  },
  
  stopTimer: () => {
    const { timerInterval } = get();
    if (timerInterval) {
      clearInterval(timerInterval);
      set({ timerInterval: undefined });
    }
  },
  
  // Accessibility & Settings
  setColorBlindMode: (enabled) => set({ colorBlindMode: enabled }),
  setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
  setLowGraphics: (enabled) => set({ lowGraphics: enabled })
}));