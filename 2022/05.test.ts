import input from './inputs/05'
import sampleInput from './inputs/05-sample'
import './string.extensions';
import _ from 'lodash';
namespace day5 {
	function main(input: string): { p1: string, p2: string } {
		let p1 = ``;
		let p2 = ``;

		const [crateRowStrings, moves]: string[][] = input.toChunks().map(chunk => chunk.toLines());

		const crane1 = new Crane(9000);
		const crane2 = new Crane(9001);
		crane1.indexCrates(crateRowStrings);
		crane2.setMap(cloneMap(crane1.getMap()));

		moves.forEach(move => {
			crane1.moveCrates(move)
			crane2.moveCrates(move)
		});

		p1 = crane1.getTopCrates()
		p2 = crane2.getTopCrates()

		return { p1, p2 }
	}

	test('example 1', function (): void {
		expect(main(sampleInput).p1).toBe(`CMZ`);
	});

	test('example 2', function (): void {
		expect(main(sampleInput).p2).toBe(`MCD`);
	});

	afterAll(() => console.log(JSON.stringify(main(input), null, 2)));
}

class Crane {
	type: number;
	#crateMap: Map<number, string[]> | null;

	constructor(type: number, crateMap?: Map<number, string[]>) {
		this.type = type;
		this.#crateMap = crateMap ?? null;
	}

	setMap(newMap: Map<number, string[]>) {
		this.#crateMap = newMap;
	}

	getMap(): Map<number, string[]> {
		if (!this.#crateMap) {
			throw new Error('no crate map found')
		}
		return this.#crateMap
	}

	moveCrates(instructions: string) {
		const matches = instructions.match(/move (?<qty>\d+)\sfrom\s(?<source>\d+)\sto\s(?<target>\d+)$/)
		let qty, source, target;
		if (matches?.groups) {
			qty = parseInt(matches.groups.qty);
			source = parseInt(matches.groups.source);
			target = parseInt(matches.groups.target);
		}

		if (!qty || !source || !target) {
			throw new Error('invalid instruction')
		}

		while (qty > 0) {
			const capacity = this.type === 9001 ? qty : 1;
			const cratesMoved: number = this.moveCrate(source, target, capacity);
			qty -= cratesMoved;
		}
	}

	moveCrate(source: number, target: number, qty: number = 1) {
		if (!this.#crateMap) {
			throw new Error('no crate map')
		}
		const sourceStack = this.#crateMap.get(source);
		if (!sourceStack) {
			throw new Error('no source stack');
		}
		const cratesToMove = sourceStack.splice(-qty);
		if (!cratesToMove) {
			throw new Error('No crate to move!')
		}
		const targetStack = this.#crateMap?.get(target);
		if (!targetStack) {
			throw new Error('no target stack')
		}
		targetStack.push(...cratesToMove)
		this.#crateMap.set(source, sourceStack);
		this.#crateMap.set(target, targetStack);
		return qty;
	}

	indexCrates(rows: string[]) {
		const crateRows = rows.map(row => row.split(''));
		const indexRow = crateRows.splice(rows.length - 1).flat();
		const crateMap = new Map();
		const lastIndex = indexRow.length - 1;
		for (let i = lastIndex; i >= 0; --i) {
			const columnNumber = parseInt(indexRow[i])
			if (!isNaN(columnNumber)) {
				const cratesBottomToTop = [];
				for (let j = crateRows.length - 1; j >= 0; --j) {
					const val = crateRows[j][i];
					if (/\w/.test(val)) {
						cratesBottomToTop.push(crateRows[j][i])
					}
				}
				crateMap.set(columnNumber, cratesBottomToTop);
			}
		}
		this.#crateMap = crateMap;
	}

	getTopCrates(): string {
		if (!this.#crateMap) return '';
		const topCrates = [];
		for (let i = 1; i <= this.#crateMap.size; ++i) {
			const stack = this.#crateMap.get(i)
			if (!stack) continue;
			topCrates.push(stack.pop())
		}
		return topCrates.join('')
	}
}

function cloneMap<K, V>(source: Map<K, V>): Map<K, V> {
	return new Map(JSON.parse(JSON.stringify([...source])));
}
