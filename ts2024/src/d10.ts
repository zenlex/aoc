import fs, { read } from 'fs';
import './string.extensions.js';
import {readPuzzleInput} from './advent_helpers.js';
import { deserializePoint, Direction, Grid, GridDef, Point, SerializedPoint, serializePoint } from './advent_grid_utils.js';

export function main(file: string, raw = false): {p1: number, p2: number} {
  // const input = readPuzzleInput(file);
  let trailMap;
  if (raw) {
   trailMap = new TrailMap(file.alphaGrid());
  }else{
    trailMap = new TrailMap(readPuzzleInput(file).alphaGrid());
  }
  return {p1: trailMap.totalScore(), p2: trailMap.totalScore()};
}

class TrailMap {
  heights!: Grid;
  def!: GridDef;
  trails: Set<SerializedPoint> = new Set();
  peaks: Set<SerializedPoint> = new Set();

  constructor(rawMap: Grid) {
    this.heights = rawMap;
    this.def = new GridDef(rawMap);

    for (let y = 0; y < this.def.height; y++) {
      for (let x = 0; x < this.def.width; x++) {
        const char = rawMap[x][y];
        if (char === '0') {
          const trailHead: SerializedPoint = serializePoint([x, y]);
          this.trails.add(trailHead);
        }
        if (char === '9') {
          const peak: SerializedPoint = serializePoint([x, y]);
          this.peaks.add(peak);
        }
      }
    }
  }

  getTrailScore(start: SerializedPoint): number {
    let grid = this.heights;
    let current: Point = deserializePoint(start);
    let score = 0;
    let visited = new Set<SerializedPoint>();
    
    let neighbors: Point[] = [];
    while(this.def.inBounds(current)){
      visited.add(`${current[0]},${current[1]}`);
      neighbors.push(...this.getWalkableNeighbors(current));
      while (neighbors.length > 0) {
        let neighbor = neighbors.pop() as Point;
        if (!visited.has(serializePoint(neighbor))) {
          current = neighbor;
          if ( this.peaks.has(serializePoint(current)) ) {
            score += 1;
          }
          visited.add(serializePoint(current));
        }
      }
    }
    return score;
  }

  getWalkableNeighbors(start: Point): Point[] {
    let neighbors: Point[] = [];
    for (let dir of Object.values(Direction)) {
      let [cx, cy] = start;
      let currentHeight = this.heights[cy][cx];
      const [dx, dy] = dir.toVector();
      let candidate: Point = [cx + dx, cy + dy];
      if (this.def.inBounds(candidate) && this.heights[candidate[1]][candidate[0]] == currentHeight + 1) {
        neighbors.push(candidate);
      }
    }
    return neighbors;
  }


  totalScore(): number {
    return [...this.trails].reduce((total, trail) => total + this.getTrailScore(trail), 0);
  }
}
