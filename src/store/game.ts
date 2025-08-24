import { create } from 'zustand';
import { GameState, GameMode, Difficulty, GameStatus, GameGlobals, ModuleState } from '@/types/game';
import { DeterministicRNG, generateSeed } from '@/lib/rng';
import { WiresModule } from '@/lib/modules/wires';
import { ButtonModule } from '@/lib/modules/button';
import { SymbolsModule } from '@/lib/modules/symbols';

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
  symbols: new SymbolsModule()
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

function generateModules(seed: string, globals: GameGlobals): ModuleState[] {
  const rng = new DeterministicRNG(seed + '_modules');
  const moduleTypes = ['wires', 'button', 'symbols'] as const;
  
  return moduleTypes.map((type, index) => ({
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
  
  initializeGame: (mode, difficulty, seed) => {
    const gameSeed = seed || generateSeed();
    const rng = new DeterministicRNG(gameSeed);
    const globals = generateGlobals(rng);
    const gameModules = generateModules(gameSeed, globals);
    
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
  }
}));