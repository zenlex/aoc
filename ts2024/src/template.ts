import fs from 'fs';

export function main(file: string): {p1: number, p2: number} {
  const path = `./inputs/${file}`;
  const input = fs.readFileSync(path, 'utf-8');
  return {p1: p1(), p2: p2()}
}

function p1(): number {
  return 0;
}

function p2(): number {
  return 0;
}
