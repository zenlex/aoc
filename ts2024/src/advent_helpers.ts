import fs from 'fs';
export function readPuzzleInput(file: string): string {
  const path = `./inputs/${file}`;
  return fs.readFileSync(path, 'utf-8');
}

export function unionSets<T>(sets: Set<T>[]): Set<T> {
  return sets.reduce((acc, set) => new Set([...acc, ...set]), new Set<T>());
}
