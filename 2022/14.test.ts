import { floor } from 'lodash';
import input from './inputs/14'
import sampleInput from './inputs/14-sample'
import './string.extensions';
namespace template {
	type XYTuple = { x: number, y: number };

	function main(input: string): { p1: number, p2: number } {
		let p1 = runp1(input);
		let p2 = runp2(input);
		return { p1, p2 }
	}

	function runp1(input: string): number {
		const paths: XYTuple[][] = input
			.toLines()
			.map((line: string) => {
				const coords: XYTuple[] = line
					.split(' -> ')
					.map(str => str.split(','))
					.map(([x, y]) => ({ x: parseInt(x), y: parseInt(y) }))
				return coords;
			})

		const { width, height, minX } = getBounds(paths);

		const grid: (XYTuple | string)[][] = mapRock(paths);

		return dropSand(500 - minX, 0, grid);
	}

	function runp2(input: string): number {
		const paths: XYTuple[][] = input
			.toLines()
			.map((line: string) => {
				const coords: XYTuple[] = line
					.split(' -> ')
					.map(str => str.split(','))
					.map(([x, y]) => ({ x: parseInt(x), y: parseInt(y) }))
				return coords;
			});

		const { width, height, minX } = getBounds(paths);

		const addFloor = (grid: (XYTuple | string)[][], xPadding = 10): (XYTuple | string)[][] => {
			const paddedGrid = grid.map((row, index) => {
				return [...Array(xPadding).fill('.'), ...row, ...Array(xPadding).fill('.')]
			});
			const width = paddedGrid[0].length;
			const paddingRows = Array(2).fill(null).map(_ => Array(width).fill('.'))
			const floorRow = [[]].map(row => Array(width).fill('#'));
			const gridWithFloor = paddedGrid.concat(paddingRows, floorRow)
			return gridWithFloor;
		};

		const X_PADDING = height;
		const p2grid: (XYTuple | string)[][] = addFloor(mapRock(paths), X_PADDING);

		return dropSand(500 - minX + X_PADDING, 0, p2grid, true)
	}

	test('example 1', function (): void {
		expect(main(sampleInput).p1).toBe(24);
	});

	test('example 2', function (): void {
		expect(main(sampleInput).p2).toBe(93);
	});

	test('answers', () => console.log(JSON.stringify(main(input), null, 2)));

	function mapRock(paths: XYTuple[][]): (XYTuple | string)[][] {
		const { width, height, minX } = getBounds(paths);
		const grid: (XYTuple | string)[][] = Array(height)
			.fill(null)
			.map(_ => Array(width - minX).fill('.'));

		paths.forEach(path => {
			for (let i = 0; i < path.length - 1; ++i) {
				let currPoint = path[i];
				let nextPoint = path[i + 1]
				let newX = currPoint.x - minX;
				let newY = currPoint.y
				if (currPoint.x === nextPoint.x) {
					let min = Math.min(currPoint.y, nextPoint.y);
					let max = Math.max(currPoint.y, nextPoint.y);
					for (let j = min; j <= max; j++) {
						newY = j;
						grid[newY][newX] = '#'
					}
				} else if (currPoint.y === nextPoint.y) {
					let min = Math.min(currPoint.x, nextPoint.x);
					let max = Math.max(currPoint.x, nextPoint.x);
					for (let j = min; j <= max; j++) {
						newX = j - minX;
						grid[newY][newX] = '#'
					}
				}
			}
		})

		return grid;
	}

	function getBounds(paths: XYTuple[][]): { width: number, height: number, minX: number } {

		const { maxX, maxY, minX } = paths.reduce((bounds, path) => {
			path.forEach(point => {
				bounds.maxX = Math.max(bounds.maxX, point.x)
				bounds.maxY = Math.max(bounds.maxY, point.y)
				bounds.minX = Math.min(bounds.minX, point.x)
			})
			return bounds
		}, { maxX: 0, maxY: 0, minX: Infinity })

		return { width: maxX + 1, height: maxY + 1, minX }
	}

	function dropSand(startX: number, startY: number, grid: (XYTuple | string)[][], hasFloor: boolean = false): number {
		let grains = 0;

		let isDone = false;
		while (!isDone) {
			grains++
			let currGrain: XYTuple = { x: startX, y: startY }
			isDone = moveGrain(currGrain);
		}
		return hasFloor ? grains : grains - 1;

		function moveGrain(grain: XYTuple): boolean {
			let moved = false;

			let { x, y } = grain;
			const lastRow = grid.length - 1;

			const updateGrain = (newX: number, newY: number): void => {
				grid[y][x] = '.'
				grid[newY][newX] = 'o'
				x = newX;
				y = newY;
			}

			let newY;
			let newX;

			const isAbyss = (x: number, y: number): boolean => {
				const isAbyss = x < 0 || (y == lastRow && grid[y][x] !== '#') || grid[y][x] === undefined
				return isAbyss
			}

			do {
				// can we go down
				newY = y + 1;
				if (newY >= lastRow - 1 && hasFloor) {
					return false;
				}
				newX = x;
				if (isAbyss(newX, newY) && !hasFloor) return true;
				if (grid[newY][x] === '.') {
					updateGrain(newX, newY);
					moved = true;
				} else { //can we go diag left
					newX = x - 1;
					if (isAbyss(newX, newY) && !hasFloor) return true;
					if (grid[newY][newX] === '.') {
						updateGrain(newX, newY)
						moved = true;
					} else { //can we go diag right
						newX = x + 1;
						if (grid[newY][newX] === undefined) return true;
						if (grid[newY][newX] === '.') {
							updateGrain(newX, newY)
							moved = true;
						} else {
							grid[y][x] = 'o'
							moved = false;
							if (x === startX && y === startY) return true;
						}
					}
				}
			} while (moved)
			return false;
		}
	}

	function logGrid(grid: (XYTuple | string)[][]) {
		console.log(grid.map(line => line.join('')).join('\n'));
	}

} // end namespace
