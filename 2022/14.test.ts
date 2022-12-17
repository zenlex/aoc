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
		const { width, height } = getBounds(paths);
		const grid: (XYTuple | string)[][] = Array(height).fill(null).map(_ => Array(width).fill('.'));

		paths.forEach(path => {
			path.forEach(({ x, y }) => {
				grid[y][x] = '#';
			})
		})

		return grid;
	}

	function getBounds(paths: XYTuple[][]): { width: number, height: number } {

		const [maxX, maxY]: [number, number] = paths.reduce((maxes, path) => {
			path.forEach(point => {
				maxes[0] = Math.max(maxes[0], point.x)
				maxes[1] = Math.max(maxes[1], point.y)
			})
			return maxes
		}, [0, 0])

		return { width: maxX + 1, height: maxY + 1 }
	}

	function dropSand(startX: number, startY: number, grid: (XYTuple | string)[][]) {
		let grains = 0;

		let isAbyss = false;
		let testGrains = 0;
		while (!isAbyss) {
			grains++
			let currGrain: XYTuple = { x: startX, y: startY }
			//TODO this needs to update grid so either grid needs to be elevated state or moveGrain needs to be passed the grid and return it which then updates here. Elevated state seems better. 
			const { foundAbyss, moved } = moveGrain(currGrain);
			isAbyss = foundAbyss;
		}
		return grains;

		function moveGrain(grain: XYTuple) {
			let foundAbyss = false;
			let moved = false;
			// TODO solve the state issue above then implement this and you should get the answer. 
			//move as far as you can. 
			//if moved a grain;
			foundAbyss = true;
			return { foundAbyss, moved }
		}
	}




} // end namespace
