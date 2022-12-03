import input from './inputs/03'
import sampleInput from './inputs/03-sample'
import './string.extensions'

namespace daythree {
	function main(input: string): { p1: number, p2: number } {
		const ruckSacks = input.toLines()
		const p1total = ruckSacks.reduce((sum: number, ruckSack: string) => {
			const compartment1 = ruckSack
				.substring(0, ruckSack.length / 2)
				.split('');
			const compartment2 = ruckSack
				.substring(ruckSack.length / 2)
				.split('');
			const duplicatedItems = compartment1.filter(item => compartment2.includes(item))
			sum += getPriority(duplicatedItems[0]);
			return sum;
		}, 0)

		let p2total = 0;
		for (let i = 0; i < ruckSacks.length; i += 3) {
			const group = [
				ruckSacks[i].split(''),
				ruckSacks[i + 1].split(''),
				ruckSacks[i + 2].split('')
			];
			const badge = group[0]
				.filter(item => [group[1], group[2]].every(group => group.includes(item)))[0]
			p2total += getPriority(badge);
		}


		return { p1: p1total, p2: p2total };
	}

	function getPriority(item: string): number {
		if (!(typeof item === 'string')) {
			console.log(item)
		}
		let priority;
		if (item.toUpperCase() === item) {
			priority = item.charCodeAt(0) - 'A'.charCodeAt(0) + 27
		} else {
			priority = item.charCodeAt(0) - 'a'.charCodeAt(0) + 1
		}
		return priority
	}

	test('example 1', function (): void {
		expect(main(sampleInput).p1).toBe(157);
	});

	test('example 2', function (): void {
		expect(main(sampleInput).p2).toBe(70);
	});

	test('getPriority', function () {
		expect(getPriority('a')).toBe(1)
		expect(getPriority('z')).toBe(26)
		expect(getPriority('A')).toBe(27);
	});

	afterAll(() => console.log(JSON.stringify({ p1: main(input) }, null, 2)));
}
