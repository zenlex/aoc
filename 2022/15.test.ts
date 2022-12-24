import input from './inputs/15'
import sampleInput from './inputs/15-sample'
import './string.extensions';
namespace template {
	function main(input: string, row: number): { p1: number, p2: number } {
		let p1 = runp1(input, row);
		let p2 = 0;
		return { p1, p2 }
	}

	test('example 1', function (): void {
		expect(main(sampleInput, 10).p1).toBe(26);
	});

	test.skip('example 2', function (): void {
		expect(main(sampleInput, 0).p2).toBe(0);
	});

	test.skip('answers', () => console.log(JSON.stringify(main(input, 2000000), null, 2)));

	function runp1(input: string, row: number): number {
		// map beacon coverage
		const coverageGrid: string[][] = mapCoverage(input);

		logGrid(coverageGrid);
		return coverageGrid[row].filter(point => (point === '#' || point === 'B' || point === 'S')).length
	}

	type Coord = [number, number];

	function mapCoverage(input: string): string[][] {
		const lines = input.toLines();
		const coords: Coord[][] = lines.map((line, index) => {
			const matches: any = line.matchAll(/((?<=x=)(?<x>-?\d+), y=(?<y>\d+))/g)
			const points: any = [];
			for (const match of matches) {
				// console.log(match, index);
				const { x, y } = match.groups;
				points.push([x, y]);
			}
			return points;
		});
		// console.log(coords);

		const { minX, maxX, minY, maxY, xOffset, yOffset } = getBounds(coords);
		console.log({ minX, maxX, minY, maxY, xOffset, yOffset })
		const width = maxX + xOffset + 1;
		const height = maxY + yOffset + 1;

		console.log({ width, height })
		// populate grid of '.'
		const coverageMap: string[][] = Array(height).fill(null).map(row => Array(width).fill('.'))
		// coverageMap[10] = coverageMap[10].map(val => '#');// dummy output for test path verification
		// logGrid(coverageMap);

		const markCoverage = (start: Coord, dist: number): void => {
			let [x, y] = start;
			//TODO = write an algorithm that just populates the full distance out in x each direction then decreases with by 2 for each row it moves up or down from center. Continue until y distance = full distance
		}

		// process each line for origin and closest beacon xy pairs
		for (const row of coords) {
			const [sensorPos, closestBeacon] = row;
			const [sensX, sensY] = sensorPos;
			const [beaconX, beaconY] = closestBeacon;
			console.log(sensorPos, closestBeacon)
			console.log(xOffset, yOffset)
			coverageMap[Number(sensY) + Number(yOffset)][Number(sensX) + Number(xOffset)] = 'S';
			coverageMap[Number(beaconY) + Number(yOffset)][Number(beaconX) + Number(xOffset)] = 'B';

			const manhattanDist = Math.abs(sensX - beaconX) + Math.abs(sensY - beaconY);
			// markCoverage(sensorPos, manhattanDist);
			markCoverage([8 + xOffset, 7 + yOffset], 9);

		}
		// logGrid(coverageMap);
		// walk out in taxicab format (bfs type neighbor queue?) marking all squares closer than beacon

		return coverageMap
	}


	function getBounds(coords: Coord[][]) {
		//TODO I think we also need to figure out how we're padding/establishing origin to allow for the coverage that extendds outside of the grid of sensors (should be able to just calculatate max manhattan distance and padd grid on all 4 sides with that amount)
		return coords.reduce((bounds, beaconData) => {
			// TODO - modify this - I think we need to calculate the sensor grid only, then the max manhattan distance from any one sensor to its beacon and then pad the grid by that amount and calibrate offset/origin
			const [sensor, beacon] = beaconData;
			const [x, y] = sensor;
			const [bX, bY] = beacon;
			const dist = Math.abs(x - bX) + Math.abs(y - bY);
			bounds.minY = Math.min(bounds.minY, y, bY)
			bounds.maxY = Math.max(bounds.maxY, y, bY)
			bounds.minX = Math.min(bounds.minX, x, bX)
			bounds.maxX = Math.max(bounds.maxX, x, bX)
			if (x < 0) {
				bounds.xOffset = Math.max(bounds.xOffset, Math.abs(x))
			}
			if (y < 0) {
				bounds.yOffset = Math.max(bounds.yOffset, Math.abs(y))
			}
			if (bX < 0) {
				bounds.xOffset = Math.max(bounds.xOffset, Math.abs(bX))
			}
			if (bY < 0) {
				bounds.yOffset = Math.max(bounds.yOffset, Math.abs(bY))
			}
			console.log(sensor, beacon, bounds);
			return bounds;
		}, { minX: 0, minY: 0, maxX: -Infinity, maxY: -Infinity, xOffset: 0, yOffset: 0 });
	}

	function logGrid(grid: string[][]) {
		console.log(grid.map((line, i) => line.join('') + i).join('\n'));
	}

} // end namespace

		// const markCoverage = (start: Coord, dist: number): void => {
		// 	//TODO - debug - it seems like we're getting stuck in an infinite loop/recursion issue which makes me think I'm not populating/checking visited correctly - we're just filling in the whole grid. Look at how you're not revisiting nodes and then get this to walk in single steps.
		// 	const visited: Set<string> = new Set();

		// 	const getNeighbors = (x: number, y: number): Coord[] => {
		// 		const lastRow = coverageMap.length - 1;
		// 		const lastCol = coverageMap[0].length - 1;
		// 		let candidates: Coord[] = [];
		// 		if (x > 0) candidates.push([x - 1, y]);
		// 		if (x < lastCol) candidates.push([x + 1, y]);
		// 		if (y > 0) candidates.push([x, y - 1]);
		// 		if (y < lastRow) candidates.push([x, y + 1]);
		// 		return candidates.filter(([x, y]) => !visited.has(`${x},${y}`));
		// 	}

		// 	let q: Coord[] = [];

		// 	const processNode = (node: Coord, distance: number): void => {
		// 		if (distance < 1) return;
		// 		let [x, y] = node;

		// 		if (['B', 'S'].indexOf(coverageMap[y][x]) === -1) {
		// 			coverageMap[y][x] = '#';
		// 		}
		// 		const neighbors = getNeighbors(x, y);
		// 		// console.log(neighbors);
		// 		neighbors.forEach(neighbor => {
		// 			let [nX, nY] = neighbor;
		// 			if (['B', 'S'].indexOf(coverageMap[nY][nX]) === -1) {
		// 				coverageMap[nY][nX] = '#';
		// 			}
		// 			q.push(neighbor);
		// 		})
		// 		visited.add(`${x},${y}`)
		// 		// logGrid(coverageMap);
		// 		while (q.length > 0) {
		// 			const currNode: Coord | undefined = q.shift();
		// 			if (currNode) {
		// 				processNode(currNode, distance - 1);
		// 			}
		// 		}
		// 	}
		// 	processNode(start, dist)
		// }
