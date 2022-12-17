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
		// console.log(paths);
		const { width, height }: { width: number, height: number } = getBounds(paths);

		const grid: (XYTuple | string)[][] = mapPaths(paths);

		return dropSand(500, 0, grid);
	}

	function runp2(input: string): number {
		return 0;
	}

	test('example 1', function (): void {
		expect(main(sampleInput).p1).toBe(24);
	});

	test.skip('example 2', function (): void {
		expect(main(sampleInput).p2).toBe(0);
	});

	test.skip('answers', () => console.log(JSON.stringify(main(input), null, 2)));

	function mapPaths(paths: XYTuple[][]): (XYTuple | string)[][] {
		const { width, height, minX } = getBounds(paths);
		console.log({ width, height, minX })
		const grid: (XYTuple | string)[][] = Array(height)
			.fill(null)
			.map(_ => Array(width - minX).fill('.'));

		//TODO this isn't right - I'm only drawing the vertexes instead of looking at the next point and filling in the whole line. 
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
				console.log(`drew rock at ${newX}, ${newY}; offset${minX}`);
			}
		})

		console.log(grid.map(line => line.join('')).join('\n'));
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

	function dropSand(startX: number, startY: number, grid: (XYTuple | string)[][]) {
		let grains = 0;

		let isAbyss = false;
		let testGrains = 0;
		while (!isAbyss) {
			grains++
			let currGrain: XYTuple = { x: startX, y: startY }
			//TODO this needs to update grid so either grid needs to be elevated state or moveGrain needs to be passed the grid and return it which then updates here. Elevated state seems better. 

			isAbyss = moveGrain(currGrain);
		}
		return grains;

		function moveGrain(grain: XYTuple): boolean {
			let foundAbyss = false;
			let moved = false;
			// TODO solve the state issue above then implement this and you should get the answer. 
			//move as far as you can. 
			let { x, y } = grain;
			if (grid[y] === undefined || grid[x] === undefined) {
				foundAbyss = true;
				moved = false;
				return foundAbyss
			}
			if (grid[y + 1]?.[x] === '.') {
				grid[y][x] = '.';
				grid[y + 1][x] = { x, y: y + 1 };
				y = y + 1;
			} else if (grid[y + 1]?.[x - 1] === '.') {
				grid[y][x] = '.';
				grid[y + 1][x - 1] = { x: x - 1, y: y - 1 };
				y = y + 1;
				x = x - 1;
			} else if (grid[y + 1]?.[x + 1] === '.') {
				grid[y][x] = '.';
				grid[y + 1][x + 1] = { x: x + 1, y: y + 1 }
				y = y + 1;
				x = x + 1;
			}
			//if moved a grain;
			foundAbyss = true;
			return foundAbyss
		}
	}




} // end namespace
