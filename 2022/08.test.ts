import input from './inputs/08'
import sampleInput from './inputs/08-sample'
import './string.extensions';
namespace dayeight {
	function main(input: string): { p1: number, p2: number } {
		let p1 = 0;
		let p2 = 0;

		type Delta = {
			[dir: string]: number[]
		}
		const deltas: Delta = {
			'left': [0, -1],
			'right': [0, 1],
			'up': [-1, 0],
			'down': [1, 0]
		}

		// INITIALIZE TREE GRID
		const rows = input.toLines();
		const treeGrid = rows.map(row => row.split('').map(val => parseInt(val)))
		const gridWidth = treeGrid[0].length;
		const gridHeight = treeGrid.length;

		/**
		 * PART ONE
		 * walk through interior trees
		 * from each tree radiate out in each of the 4 directions
		 * if encounter tree of same or greater height stop
		 * if make it to an edge flip visibility to true and break
		 */
		const runP1 = (): number => {
			const visibilities = Array(gridHeight).fill(null).map(row => Array(gridWidth).fill(false))
			markEdgesAsVisible(visibilities);

			function markEdgesAsVisible(grid: boolean[][]): void {
				for (let [index, row] of grid.entries()) {
					if (index == 0 || index == gridHeight - 1) {
						grid[index] = row.map(cell => true)
					} else {
						row[0] = true;
						row[gridWidth - 1] = true;
					}
				}
			}

			for (let row = 1; row < gridHeight - 1; ++row) {
				for (let col = 1; col < gridWidth - 1; ++col) {
					let treeVisible = visibilities[row][col];
					if (treeVisible) continue;
					if (
						checkVisibility('left', [row, col])
						|| checkVisibility('right', [row, col])
						|| checkVisibility('up', [row, col])
						|| checkVisibility('down', [row, col])
					) {
						visibilities[row][col] = true;
						continue;
					}
				}
			}

			function checkVisibility(direction: string, coords: number[]): boolean {
				const [startRow, startCol] = coords;

				let [row, col] = [startRow, startCol];

				const [deltaRow, deltaCol] = deltas[direction]
				let heightThreshold = treeGrid[row][col]
				while (!isEdge(row, col)) {
					row += deltaRow;
					col += deltaCol;
					const currentTreeHeight = treeGrid[row][col];
					if (currentTreeHeight >= heightThreshold) {
						return false;
					}
				}
				return true;

			}
			return visibilities.reduce(
				(total, row) => total += row.filter(tree => tree).length,
				0);
		}

		/**
		 * walk through interior trees
		 * from each tree radiate out in each of the 4 directions
		 * accumulate number of trees visited
		 * if encounter tree of same or greater height or edge stop
		 * multiply score for 4 directions together	
		 */
		const runP2 = (): number => {
			let maxScore = 0;
			for (let row = 1; row < gridHeight - 1; ++row) {
				for (let col = 1; col < gridWidth - 1; ++col) {
					const currentScore = getScore([row, col], treeGrid);
					if (currentScore > maxScore) {
						maxScore = currentScore;
					}
				}
			}
			return maxScore;

			function getScore(coords: number[], treeGrid: number[][]): number {
				let [row, col] = coords;
				const [startRow, startCol] = [row, col];
				const startHeight = treeGrid[startRow][startCol];
				let score = 1;

				for (const direction in deltas) {
					// reinitialize for each loop
					let [row, col] = [startRow, startCol];
					let currentHeight = startHeight;
					let treesVisible = 0;

					// iterate in the current direction
					const [deltaRow, deltaCol] = deltas[direction];

					do {
						row += deltaRow;
						col += deltaCol;
						treesVisible += 1;
						currentHeight = treeGrid[row][col];
					} while (currentHeight < startHeight && !isEdge(row, col))

					// multiply current direction score by total
					score *= treesVisible;
				}

				return score;
			}
		}


		function isEdge(row: number, col: number): boolean {
			return (
				row === 0
				|| row === gridWidth - 1
				|| col === 0
				|| col === gridHeight - 1
			);
		}

		p1 = runP1()
		p2 = runP2()

		return { p1, p2 }
	}

	test('example 1', function (): void {
		expect(main(sampleInput).p1).toBe(21);
	});

	test('example 2', function (): void {
		expect(main(sampleInput).p2).toBe(8);
	});

	afterAll(() => console.log(JSON.stringify(main(input), null, 2)));

}
