import './string.extensions.js'
import { GridDef, Point, SerializedPoint, deserializePoint, serializePoint } from './advent_grid_utils.js';
import {readPuzzleInput, unionSets} from './advent_helpers.js';

type AntennaArray = Map<String, Set<SerializedPoint>>;

export function main(file: string): {p1: number, p2: number} {
  const input = readPuzzleInput(file);
  const [grid, antennas] = parseGrid(input);
  return {p1: p1(antennas, grid), p2: p2(antennas, grid)}
}

function p1(antennas:AntennaArray, grid:GridDef): number {
  const allAntinodes = getAllAntinodeLocations(antennas, grid);
  return [...allAntinodes]
    .map((coords) => deserializePoint(coords))
    .filter(point => grid.inBounds(point))
    .length;
}

function p2(antennas: AntennaArray, grid: GridDef): number {
  const allAntinodes = getAllAntinodeLocations(antennas, grid, true);
  return [...allAntinodes]
    .map((coords) => deserializePoint(coords)).length;
}

function getAllAntinodeLocations(antennas:AntennaArray, grid:GridDef, intermediates = false): Set<SerializedPoint> {
  let antinodeLocations = new Set<SerializedPoint>();
  for (const frequency of antennas.keys()) {
    const locations = antennas.get(frequency);
    if (! locations || locations.size < 2) {
      continue;
    }

    const antinodes = getAntinodes(locations, grid, intermediates);
    antinodeLocations = unionSets([antinodeLocations,antinodes]);
  }

  return antinodeLocations;
}

function parseGrid(input: string): [GridDef, AntennaArray] {
  const gridData = input.alphaGrid();
  const antennas:AntennaArray = new Map();
  gridData.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell != '.') {
        const serializedPoint = serializePoint([x,y]);
        if (!antennas.has(cell)) {
          antennas.set(cell, new Set());
        } 
          antennas.get(cell)?.add(serializedPoint);
      }
    });
  });

  const grid:GridDef = new GridDef(gridData);
  return [grid, antennas];
}

function getAntinodes(locations:Set<SerializedPoint>, grid: GridDef, intermediates = false): Set<SerializedPoint> {
  let antinodes = new Set<SerializedPoint>();
  for (const location of locations) {
    for (const otherLocation of locations) {
      if (location != otherLocation) {
        antinodes = unionSets([
          antinodes,
          calculateAntinodes({c1: location, c2: otherLocation, grid, intermediates})
        ]);
    };
  }
}
  return antinodes;
}

type AntennaPair = {c1: SerializedPoint, c2: SerializedPoint, grid: GridDef, intermediates: boolean};

function calculateAntinodes({c1, c2, grid, intermediates}: AntennaPair): Set<SerializedPoint> {
  const [x1,y1] = deserializePoint(c1);
  const [x2,y2] = deserializePoint(c2);
  const dY = y2 - y1;
  const dX = x2 - x1;
  let antinodes = new Set<SerializedPoint>();
  if(intermediates){
    for (const point of intermediatePoints(x1, y1, dX, dY, grid)) {
      antinodes.add(serializePoint(point));
    }
    for (const point of intermediatePoints(x1, y1, -dX, -dY, grid)) {
      antinodes.add(serializePoint(point));
    }
  }else{
    antinodes.add(serializePoint([x1 - dX, y1 - dY]));
    antinodes.add(serializePoint([x2 + dX,y2 + dY]));
  }
  return antinodes;
}

function* intermediatePoints(x: number, y: number, dX: number, dY: number, grid:GridDef){
  let [x1, y1] = [x, y];
  while (grid.inBounds([x1, y1])) {
    yield [x1, y1] as Point;
    x1 += dX;
    y1 += dY;
  }
}
