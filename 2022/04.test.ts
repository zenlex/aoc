import input from './inputs/04'
import sampleInput from './inputs/04-sample'
import './string.extensions';
namespace dayfour {
	function main(input: string): { p1: number, p2: number } {

		const pairs: string[][] = input
			.toLines()
			.map(pair => pair.split(','));

		const [p1, p2]: [number, number] = pairs.reduce(
			(answers, pair) => {
				const elf1 = new SectionRange(pair[0]);
				const elf2 = new SectionRange(pair[1]);
				if (elf1.fullyContains(elf2)
					|| elf2.fullyContains(elf1)) {
					++answers[0];
					++answers[1];
				} else if (
					elf1.overlaps(elf2)
				) {
					++answers[1];
				}
				return answers;
			}, [0, 0]);

		return { p1, p2 }
	}

	class SectionRange {
		min: number
		max: number

		constructor(input: string) {
			/* input string will look like '2-4'*/
			const [min, max] = input
				.split('-')
				.map(val => parseInt(val));
			this.min = min;
			this.max = max;
		}

		fullyContains(inputRange: SectionRange) {
			return this.min <= inputRange.min
				&& this.max >= inputRange.max;
		}

		overlaps(inputRange: SectionRange) {
			const [left, right] =
				this.min < inputRange.min
					? [this, inputRange]
					: [inputRange, this];

			return !(left.max < right.min);
		}
	}

	test('example 1', function (): void {
		expect(main(sampleInput).p1).toBe(2);
	});

	test('example 2', function (): void {
		expect(main(sampleInput).p2).toBe(4);
	});

	afterAll(() => console.log(JSON.stringify(main(input), null, 2)));
}
