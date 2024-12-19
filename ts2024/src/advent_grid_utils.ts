export function getLCM(divisors: number[]): number {
	const isDivisor = (cand: number, div: number): boolean => {
		return cand % div === 0;
	}

	let candidate = Math.max(...divisors);
	let incr = candidate;
	while (!(divisors.every(divisor => isDivisor(candidate, divisor)) && candidate < Number.MAX_SAFE_INTEGER)) {
		candidate += incr;
	}
	return candidate;
}

export type Point = [number, number]
export type SerializedPoint = `${number},${number}`;

export function deserializePoint(coords: SerializedPoint): Point {
  return coords.split(',').map(n => parseInt(n)) as Point
}

export function serializePoint(point: Point): SerializedPoint {
  return `${point[0]},${point[1]}`;
}

export class GridDef {
  height!: number;
  width!: number;

  constructor(data: any[][]) {
    this.height = data.length
    this.width = data[0]?.length ?? 0
  }

  inBounds(coords:Point): boolean {
    return coords[1] >= 0 
      && coords[1] < this.height 
      && coords[0] >= 0 
      && coords[0] < this.width
  }
}

export type Grid = any[][]

export const Direction = {
  North: {value: 'N', toVector: () => [0, -1]},
  East: {value: 'E', toVector: () => [1,0]},
  South: {value: 'S', toVector: () => [0,1]},
  West: {value: 'W', toVector: () => [-1,0]}
} as const;

export type Direction = typeof Direction[keyof typeof Direction]

export class Position{
  point!: Point
  orientaion!: Direction

  constructor(point: Point, orientation: Direction){
    this.point = point;
    this.orientaion = orientation;
  }

  toString(): SerializedPosition {
    return this.point.toString() + this.orientaion.value;
  }
}

export type SerializedPosition = String;
