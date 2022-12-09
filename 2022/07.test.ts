import { get, min } from 'lodash';
import input from './inputs/07'
import sampleInput from './inputs/07-sample'
import './string.extensions';

namespace template {
	interface Node {
		name: string
		size: number
		children: Node[] | null
		parent: Node | null
	}

	const initNode = (options?: Partial<Node>): Node => {
		const defaults = {
			size: 0,
			children: null,
			parent: null,
			name: ''
		}

		return {
			...defaults,
			...options
		}
	}

	let lineIndex = 0;
	const minSpaceRequired = 30000000;
	const diskCapacity = 70000000;
	const homeDir = initNode({ name: '/', children: [] })
	let tree: Node[] | null = null;
	let currentDirectory: Node | null = homeDir;
	let lines = [];

	function main(input: string): { p1: number, p2: number } {
		let p1 = 0;
		let p2 = 0;

		// break input into lines
		lines = input.toLines();

		// init tree
		parseLines(lines);
		tree = calcDirSizes(homeDir);

		//p1
		let dirsToDelete = getDirsToDelete(100000);
		p1 = dirsToDelete.reduce((sum, dir) => sum + dir.size, 0)

		//p2
		let freeSpace: number = calcuateFreeSpace();
		console.log({ freeSpace })
		const spaceNeeded = minSpaceRequired - freeSpace;
		console.log(`space needed: ${spaceNeeded}`)
		dirsToDelete = getDirsToDelete(spaceNeeded, 'min');
		console.log(dirsToDelete.map(dir => `name: ${dir.name}, size: ${dir.size}`));
		p2 = Math.min(...dirsToDelete.map(dir => dir.size));


		return { p1, p2 }
	}

	function parseLines(lines: string[]) {

		const inputLength = lines.length;
		for (lineIndex = 0; lineIndex < inputLength;) {
			let line = lines[lineIndex]
			if (line.startsWith('$')) {
				executeCommand(line);
			}
		}

		function addChildren() {
			if (!currentDirectory || currentDirectory.children === null) {
				throw new Error('invalid directory')
			}
			let currentLine = lines[lineIndex];
			while (lineIndex < lines.length) {
				if (currentLine.startsWith('\$') || !currentLine) {
					break;
				}
				const [arg1, name] = currentLine.split(' ')
				let intSize;
				if (arg1 === 'dir') {
					intSize = 0;
					const newNode = initNode({ size: intSize, name, parent: currentDirectory, children: [] })
					currentDirectory.children.push(newNode);
				} else {
					intSize = parseInt(arg1);
					const newNode = initNode({ size: intSize, name, parent: currentDirectory })
					currentDirectory.children.push(newNode)
				}
				lineIndex++;
				currentLine = lines[lineIndex]
			}
		}

		function executeCommand(line: string): void {
			const [_, cmd, arg] = line.split(' ')
			switch (cmd) {
				case 'cd':
					lineIndex++;
					if (!arg) throw new Error('no argument')
					if (arg === '..') {
						if (!currentDirectory?.parent) {
							throw new Error('no parent directory - invalid ..');
						}
						currentDirectory = currentDirectory.parent;
					} else {
						let targetDir = currentDirectory?.children?.find(child => child.name === arg)
						if (!targetDir) {
							if (arg == '/') {
								targetDir = homeDir;
							} else {
								throw new Error('invalid target directory')
							}
						}
						currentDirectory = targetDir
					}
					break;
				case 'ls':
					lineIndex++
					addChildren()
					break;
				default:
					throw new Error(`invalid command: ${JSON.stringify({ cmd, arg })} `,)
			}
		}
	}

	function calcDirSizes(homeNode: Node): Node[] {
		const stack: Node[] = [];
		const getSize = (node: Node): number => {
			if (node.children) {
				node.children.forEach(child => {
					if (child.size > 0 && !child.children) {
						node.size += child.size
					} else {
						node.size += getSize(child);
					}
				})
				stack.push(node);
			}
			return node.size;
		}
		getSize(homeNode);

		return stack;
	}

	const getDirsToDelete = (threshold: number, type: 'max' | 'min' = 'max'): Node[] => {
		if (!tree) throw new Error('no tree to parse')

		return tree.filter(node => {
			if (type === 'max') {
				return node.size < threshold;
			} else if (type === 'min') {
				return node.size >= threshold;
			} else {
				throw new Error('invalid threshold type')
			}
		});
	}

	const calcuateFreeSpace = (): number => {
		return diskCapacity - homeDir.size
	}

	test.skip('example 1', function (): void {
		expect(main(sampleInput).p1).toBe(95437);
	});

	test.skip('example 2', function (): void {
		expect(main(sampleInput).p2).toBe(24933642);
	});

	test('answers', () => console.log(JSON.stringify(main(input), null, 2))
	);

}
