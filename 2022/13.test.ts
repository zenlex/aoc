import input from './inputs/13'
import sampleInput from './inputs/13-sample'
import { dividerPackets } from './inputs/13-sample'
import './string.extensions';
namespace template {
	type ComparisonItem = number | undefined | (number | undefined)[];

	function main(input: string): { p1: number, p2: number } {
		const runp1 = (): number => {
			const pairs: ComparisonItem[][] = parseInput(input)
			const inOrderIndexes: number[] = [];

			for (const [i, pair] of pairs.entries()) {
				const [left, right] = pair;
				if (isInOrder(left, right) >= 0) {
					// console.log(`***MESSAGES IN ORDER AT PAIR ${i + 1}****`)
					inOrderIndexes.push(i + 1);
				} else {
					// console.log(`***MESSAGES OUT OF ORDER AT PAIR ${i + 1}****`)
				}
			}
			return inOrderIndexes.reduce((sum, val) => sum += val, 0);
		}

		const runp2 = () => {
			const pairs: ComparisonItem[] = parseInput(input).flat()
			const sorted: ComparisonItem[] = pairs.sort((a, b) => -isInOrder(a, b))
			const dividerIndexes: number[] = [];
			for (let i = 0; i < sorted.length; ++i) {
				const row = sorted[i];
				if (!Array.isArray(row)) continue;
				if (row.length !== 1) continue;
				const first = row[0];
				if (!Array.isArray(first)) continue;
				if (first.length !== 1) continue;
				if (first[0] === 2 || first[0] === 6) dividerIndexes.push(i + 1);
			}
			return dividerIndexes[0] * dividerIndexes[1];
		}

		const p1 = runp1();
		const p2 = runp2();
		return { p1, p2 }
	}

	test('example 1', function (): void {
		expect(main(sampleInput).p1).toBe(13);
	});

	test('example 2', function (): void {
		expect(main(sampleInput.concat('\n\n', dividerPackets)).p2).toBe(140);
	});

	test('answers', () => console.log(main(input.concat('\n\n', dividerPackets))));

	function parseInput(input: string): ComparisonItem[][] {
		const pairs = input.toChunks().map(pair => pair.split('\n'));
		const jsoned = pairs.map(pair => pair.map(message => JSON.parse(message)));
		return jsoned;
	}

	function isInOrder(left: ComparisonItem, right: ComparisonItem): number {
		if (typeof left === 'number' && typeof right === 'number') {
			if (left < right) {
				return 1;
			}
			if (left > right) {
				return -1;
			}
		} else if (typeof left === 'number' && Array.isArray(right)) {
			return isInOrder([left], right)
		} else if (Array.isArray(left) && typeof right === 'number') {
			return isInOrder(left, [right]);
		} else {
			if (left === undefined) {
				return 1;
			} else if (right === undefined) {
				return -1;
			}

			if (!Array.isArray(left) || !Array.isArray(right)) throw new Error('invalid input')

			for (let i = 0; i < Math.max(left.length, right.length); ++i) {
				const result = isInOrder(left[i], right[i]);
				if (result !== 0) {
					return result;
				}
			}
			if (left.length < right.length) return 1;
			if (left.length > right.length) return -1;
		}
		return 0;
	}
}
