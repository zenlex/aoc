import { pbkdf2 } from 'crypto';
import fs from 'fs';

export function main(file: string): {p1: number, p2: number} {
  const path = `./inputs/${file}`;
  const input = fs.readFileSync(path, 'utf-8');
  return {p1: p1(input), p2: p2(input)}
}

function p1(input: string): number {
  return 0;
}

function p2(input: string): number {
  return 0;
}
