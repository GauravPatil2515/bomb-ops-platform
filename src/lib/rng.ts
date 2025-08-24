import seedrandom from 'seedrandom';

export class DeterministicRNG {
  private rng: () => number;
  
  constructor(seed: string) {
    this.rng = seedrandom(seed);
  }
  
  // Generate random integer between min and max (inclusive)
  nextInt(min: number, max: number): number {
    return Math.floor(this.rng() * (max - min + 1)) + min;
  }
  
  // Generate random float between 0 and 1
  next(): number {
    return this.rng();
  }
  
  // Pick random element from array
  choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
  
  // Shuffle array using Fisher-Yates
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

// Generate random seed if none provided
export function generateSeed(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}