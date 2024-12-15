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

  gridData.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === '#') {
        blocks.add([y, x].toString());
      } else if (cell === '^') {
        guard.setSpawn([y, x]);
      }
    });
  });

  return {p1: p1(blocks, guard, grid), p2: p2(blocks, guard, grid)}
}

function p1(blocks: Set<SerializedPoint>, guard: Guard, grid:GridDef): number {
  guard.reset();
  return guard.getLocations(grid, blocks).size;
}

function p2(blocks: Set<SerializedPoint>, guard: Guard, grid:GridDef): number {
  guard.reset();
  const candidates: Set<SerializedPoint> = guard.getLocations(grid, blocks)

  guard.reset();
  candidates.delete(guard.position.point.toString());

  const loops = [...candidates].filter(
    candidate => causesLoop(new Set([...blocks, candidate]), guard, grid)
  );
  return loops.length;
}

function causesLoop(blocks: Set<SerializedPoint>, guard: Guard, grid: GridDef): boolean {
  guard.reset();
  const visited = new Set();
  while (grid.inBounds(guard.position.point)){
    if (visited.has(guard.position.toString())){
      return true;
    }

    visited.add(guard.position.toString());
    let turns = 0;

    while (blocks.has(guard.next().toString())){
      guard.turnRight();
      turns++;
      if (turns === 4){
        return true;
      }
    }

    guard.walk();
  }

  return false;
}

class Guard {
  position!: Position
  _spawn!: Point

  constructor(spawn?: Point) {
    this.position = new Position([0,0], Direction.North);
    this._spawn = spawn ?? [0,0];
  }

  setSpawn(spawn: Point) {  
    this._spawn = spawn;
  }

  reset() {
    this.position.point = this._spawn;
    this.position.orientaion = Direction.North;
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
