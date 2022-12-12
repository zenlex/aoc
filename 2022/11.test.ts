import input from './inputs/11'
import sampleInput from './inputs/11-sample'
import './string.extensions';
import { Monkey, MonkeyFactory } from './11-monkey';
import { getLCM } from './advent_utils'

namespace template {
	function main(input: string): { p1: number, p2: number } {
		let p1 = 0;
		let p2 = 0;

		function runP1(): number {
			const p1monkeys: Monkey[] = parseInput(input);
			let round = 0;
			const NUM_ROUNDS = 20;
			while (round < NUM_ROUNDS) {
				p1monkeys.forEach(monkey => {
					monkey.takeTurn(p1monkeys, 3);
				})
				round++
			}

			const sorted = p1monkeys.map(monkey => monkey.itemsInvestigated).sort((a, b) => b - a)
			return sorted[0] * sorted[1]
		}

		function runP2(): number {
			const p2monkeys: Monkey[] = parseInput(input)
			const divisors = p2monkeys.map(monkey => monkey.divisor);
			const MAXDIVISOR: number = getLCM(divisors);
			const NUM_ROUNDS = 10000;

			let round = 0;
			while (round < NUM_ROUNDS) {
				p2monkeys.forEach(monkey => {
					clampWorry(monkey, MAXDIVISOR);
					monkey.takeTurn(p2monkeys, 1);
				})
				round++
			}

			function clampWorry(monkey: Monkey, clampValue: number) {
				monkey.setItems(monkey
					.getItems()
					.map(item => item % clampValue)
				)
			}

			const sorted = p2monkeys.map(monkey => monkey.itemsInvestigated).sort((a, b) => b - a)
			return sorted[0] * sorted[1]
		}

		p1 = runP1();
		p2 = runP2();
		return { p1, p2 }
	}

	test('example 1', function (): void {
		expect(main(sampleInput).p1).toBe(10605);
	});

	test('example 2', function (): void {
		expect(main(sampleInput).p2).toBe(2713310158);
	});

	test('answers', () => console.log(JSON.stringify(main(input), null, 2)));

	function parseInput(input: string): Monkey[] {
		const monkeys: Monkey[] = [];
		const monkeyChunks = input.toChunks();
		monkeyChunks.forEach(chunk => {
			monkeys.push(MonkeyFactory(chunk));
		})
		return monkeys;
	}

} // end namespace
