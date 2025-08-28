import { IModule, GameGlobals } from '@/types/game';
import { DeterministicRNG } from '@/lib/rng';

export interface MazeModuleData {
  mazeId: number;
  playerX: number;
  playerY: number;
  targetX: number;
  targetY: number;
  walls: boolean[][];
  circleMarkers: { x: number; y: number }[];
}

// Predefined 6x6 maze layouts (0 = path, 1 = wall)
const MAZE_LAYOUTS = {
  A: [
    [
      [1,1,1,1,1,1],
      [1,0,0,1,0,1],
      [1,0,1,0,0,1],
      [1,0,1,1,0,1],
      [1,0,0,0,0,1],
      [1,1,1,1,1,1]
    ],
    [
      [1,1,1,1,1,1],
      [1,0,1,0,0,1],
      [1,0,0,0,1,1],
      [1,1,0,1,0,1],
      [1,0,0,0,0,1],
      [1,1,1,1,1,1]
    ]
  ],
  B: [
    [
      [1,1,1,1,1,1],
      [1,0,0,0,1,1],
      [1,1,0,1,0,1],
      [1,0,0,1,0,1],
      [1,0,1,0,0,1],
      [1,1,1,1,1,1]
    ],
    [
      [1,1,1,1,1,1],
      [1,0,1,0,0,1],
      [1,0,0,1,0,1],
      [1,1,0,0,0,1],
      [1,0,0,1,0,1],
      [1,1,1,1,1,1]
    ]
  ]
};

export class MazeModule implements IModule {
  generate(seed: string, globals: GameGlobals): MazeModuleData {
    const rng = new DeterministicRNG(seed);
    
    // Choose maze set based on vowel in serial
    const mazeSet = globals.hasVowel ? 'A' : 'B';
    const mazeVariant = rng.nextInt(0, 1);
    const wallsRaw = MAZE_LAYOUTS[mazeSet][mazeVariant];
    const walls = wallsRaw.map(row => row.map(cell => cell === 1));
    
    // Find valid start and target positions
    const pathCells = [];
    for (let y = 1; y < 5; y++) {
      for (let x = 1; x < 5; x++) {
        if (wallsRaw[y][x] === 0) {
          pathCells.push({ x, y });
        }
      }
    }
    
    const startCell = rng.choice(pathCells);
    let targetCell;
    do {
      targetCell = rng.choice(pathCells);
    } while (Math.abs(startCell.x - targetCell.x) + Math.abs(startCell.y - targetCell.y) < 3);
    
    // Place circle markers (cosmetic indicators for maze variant)
    const circleMarkers = [
      { x: rng.nextInt(1, 4), y: rng.nextInt(1, 4) },
      { x: rng.nextInt(1, 4), y: rng.nextInt(1, 4) }
    ];
    
    return {
      mazeId: mazeVariant,
      playerX: startCell.x,
      playerY: startCell.y,
      targetX: targetCell.x,
      targetY: targetCell.y,
      walls,
      circleMarkers
    };
  }
  
  validate(action: { direction: 'up' | 'down' | 'left' | 'right' }, state: MazeModuleData, globals: GameGlobals) {
    const { direction } = action;
    const { playerX, playerY, targetX, targetY, walls } = state;
    
    let newX = playerX;
    let newY = playerY;
    
    switch (direction) {
      case 'up': newY = playerY - 1; break;
      case 'down': newY = playerY + 1; break;
      case 'left': newX = playerX - 1; break;
      case 'right': newX = playerX + 1; break;
    }
    
    // Check bounds
    if (newX < 0 || newX >= 6 || newY < 0 || newY >= 6) {
      return { valid: false, strike: true, newState: state };
    }
    
    // Check wall collision
    if (walls[newY][newX]) {
      return { valid: false, strike: true, newState: state };
    }
    
    // Valid move
    const newState = { ...state, playerX: newX, playerY: newY };
    const solved = newX === targetX && newY === targetY;
    
    return {
      valid: true,
      strike: false,
      solved,
      newState
    };
  }
}