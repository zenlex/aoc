import './string.extensions.js';
import {GridDef, Point, SerializedPoint, Direction, Position} from './advent_grid_utils.js';
import fs from 'fs';

export function main(file: string): {p1: number, p2: number} {
  const path = `./inputs/${file}`;
  const input = fs.readFileSync(path, 'utf-8');
  const gridData = input.alphaGrid();
  let blocks: Set<SerializedPoint> = new Set();
  let guard = new Guard();
  let grid = new GridDef(gridData);
  let foundGuard = false;
  gridData.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === '#') {
        blocks.add([y, x].toString());
      } else if (cell === '^') {
        guard.position.point = [y, x];
        guard.position.orientaion = Direction.North;
        foundGuard = true;
      }
    });
  });
  if (!foundGuard){
    throw new Error("Guard not found");
  }
  return {p1: p1(blocks, guard, grid), p2: p2(blocks, guard, grid)}
}

function p1(blocks: Set<SerializedPoint>, guard: Guard, grid:GridDef): number {
  return guard.getLocations(grid, blocks).size;
}

function p2(blocks: Set<SerializedPoint>, guard: Guard, grid:GridDef): number {
/* Algorithm
  - p2 obstacle candidates are the locationsCovered except start position
  - write a cycle detector - pass in the modified blocks and have it return true if cycle, false if guard makes it out
  - filter candidates to those that create loops and return the length of the set (in JS to filter set, splat to array)
    */
  return 0;
}


class Guard {
  position!: Position

  constructor() {
    this.position = new Position([0,0], Direction.North);
  }

  walk() {
    this.position.point = this.next();
  }

  next(): Point {
    return this.position.point.map(
      (val, idx) => val + this.position.orientaion.toVector()[idx]
    ) as Point;
  }

  turnRight() {
    const directions = Object.values(Direction);
    const idx = directions.indexOf(this.position.orientaion);
    this.position.orientaion = directions[(idx + 1) % directions.length];
  }

  getLocations(grid:GridDef, blocks:Set<SerializedPoint>): Set<SerializedPoint> {
    const positions = new Set([this.position.point.toString()]);

    while (grid.inBounds(this.position.point)){
      positions.add(this.position.point.toString());
      let turns = 0;
      while (blocks.has(this.next().toString())){
          this.turnRight();
          turns++;
        if (turns === 4) {
          return positions;
        }
      }
      this.walk();
    }

    return positions;
  }
};
