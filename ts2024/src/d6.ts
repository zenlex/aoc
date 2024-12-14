import './string.extensions.js';
import fs from 'fs';

export function main(file: string): {p1: number, p2: number} {
  const path = `./inputs/${file}`;
  const input = fs.readFileSync(path, 'utf-8');
  const grid = input.alphaGrid();
  return {p1: p1(grid), p2: p2(grid)}
}

type Point = [number, number]
type Grid = string[][]

const Direction = {
  North: {value: 'N', toVector: () => [-1,0]},
  East: {value: 'E', toVector: () => [1,0]},
  South: {value: 'S', toVector: () => [0,1]},
  West: {value: 'W', toVector: () => [0,-1]}
} as const;

type Direction = typeof Direction[keyof typeof Direction]

type Position = {
  point: Point
  orientaion: Direction
}

function p1(grid:Grid): number {
  const positions: Set<Position> = new Set()
  console.log(grid);
  return 0;
}

function p2(grid:Grid): number {
  return 0;
}

class Guard {
  position!: Position

  construct() {
    this.position = {point:[0,0], orientaion: Direction.North};
  }

  walk() {
    this.position.point = this.position.point.map(
      (val, idx) => val + this.position.orientaion.toVector()[idx]
    ) as Point;
  }

  turnRight() {
    const directions = Object.values(Direction);
    const idx = directions.indexOf(this.position.orientaion);
    this.position.orientaion = directions[(idx + 1) % directions.length];
  }
};
