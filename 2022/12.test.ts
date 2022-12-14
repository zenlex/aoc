import input from './inputs/12'
import sampleInput from './inputs/12-sample'
import './string.extensions';
namespace template {
	function main(input: string): { p1: number, p2: number } {
		let p1 = 0;
		let p2 = 0;

		type Node = {
			shortest: number;
			height: number;
			isStart: boolean;
			isEnd: boolean;
			row: number;
			col: number;
			visited: boolean;
		}

		const makeNode = (row: number, col: number, height: string): Node => {
			const calcHeight = (height: string): number => {
				let char = height === 'S' ? 'a' : (height === 'E' ? 'z' : height);
				return char.charCodeAt(0) - 'a'.charCodeAt(0);
			}

			const isStart = height === 'S'
			const isEnd = height === 'E';
			const calculatedHeight = calcHeight(height);

			return {
				shortest: Infinity,
				height: calculatedHeight,
				isStart,
				isEnd,
				row,
				col,
				visited: false
			}
		}

		let startRow: number = 0;
		let startCol: number = 0;
		let lastRow: number = 0;
		let lastCol: number = 0;
		let endRow: number = 0;
		let endCol: number = 0;
		let startNode;

		// init node grid
		const initNodeGrid = (input: string): Node[][] => {
			const grid: string[][] = input.alphaGrid()
			lastRow = grid.length - 1;
			lastCol = grid[0].length - 1;
			const nodeGrid: Node[][] = Array(grid.length).fill(null).map(row => Array(grid[0].length))

			for (let row = 0; row <= lastRow; ++row) {
				for (let col = 0; col <= lastCol; ++col) {
					const newNode = makeNode(row, col, grid[row][col]);
					if (newNode.isStart) {
						startRow = row;
						startCol = col;
						newNode.shortest = 0;
						startNode = newNode;
					}
					if (newNode.isEnd) {
						endRow = row;
						endCol = col;
					}
					nodeGrid[row][col] = newNode;
				}
			}

			return nodeGrid;
		}

		const nodes = initNodeGrid(input);

		const getNeighbors = (currNode: Node, nodes: Node[][], filter: 'p1' | 'p2' = 'p1'): Node[] => {
			const p1HeightFilter = (node: Node): boolean => node.height <= currNode.height + 1
			const p2HeightFilter = (node: Node): boolean => node.height >= currNode.height - 1
			const nodeFilter = filter === 'p1' ? p1HeightFilter : p2HeightFilter
			const { row: r, col: c } = currNode;
			const neighbors = [];
			if (r >= 1) neighbors.push(nodes[r - 1][c])
			if (c >= 1) neighbors.push(nodes[r][c - 1])
			if (r < lastRow) neighbors.push(nodes[r + 1][c])
			if (c < lastCol) neighbors.push(nodes[r][c + 1])
			const filtered = neighbors.filter(nodeFilter);
			const sorted = filtered.sort((a, b) => a.shortest - b.shortest)
			return sorted;
		}

		let q: Node[] = [];
		const getShortestPath = (startNode: Node): number => {
			// const unvisited = [...nodes.map((row: Node[]) => [...row])]
			// const visited = [];
			const endNode = nodes[endRow][endCol];
			let currNode = startNode;
			let neighbors = getNeighbors(currNode, nodes);
			neighbors.forEach(neighbor => {
				neighbor.shortest = Math.min(currNode.shortest + 1, neighbor.shortest)
				q.push(neighbor);
			})
			currNode.visited = true;
			while (q.length > 0) {
				const nextNode = q.shift()
				// console.log(`nextNode: ${nextNode?.row},${nextNode?.col}`)
				if (nextNode && !nextNode.visited) getShortestPath(nextNode);
			}
			return endNode.shortest
		}

		if (!startNode) throw new Error('no startNode')
		p1 = getShortestPath(startNode)

		const runp2 = (): number => {
			//reset nodes:
			for (let nodeRow of nodes) {
				nodeRow.forEach(node => {
					node.visited = false;
					node.shortest = node.isEnd ? 0 : Infinity;
				})
			}

			//bfs from end to all a's
			const candidates: number[] = [];
			const p2q: Node[] = [];

			const getShortestPaths2 = (endNode: Node): void => {
				let currNode = endNode;
				let neighbors = getNeighbors(currNode, nodes, 'p2');
				neighbors.forEach(neighbor => {
					neighbor.shortest = Math.min(currNode.shortest + 1, neighbor.shortest)
					if (neighbor.height == 0) {
						candidates.push(neighbor.shortest)
					} else {
						p2q.push(neighbor);
					}
				})
				currNode.visited = true;
				while (p2q.length > 0) {
					const nextNode = p2q.shift()
					if (nextNode && !nextNode.visited) getShortestPaths2(nextNode);
				}
			}
			const endNode = nodes[endRow][endCol];
			getShortestPaths2(endNode);

			return Math.min(...candidates)
		}
		p2 = runp2();
		return { p1, p2 }
	}

	test('example 1', function (): void {
		expect(main(sampleInput).p1).toBe(31);
	});

	test('example 2', function (): void {
		expect(main(sampleInput).p2).toBe(29);
	});

	test('answers', () => console.log('answers:', main(input)));
}
