import input from './inputs/01'
import sampleInput from './inputs/01-sample'
import './string.extensions'
namespace dayone {
	function main(input: string): { top: number, top3: number } {
		const totals: number[] = input
			.numericChunksAndLines()
			.map(elf => elf.reduce((sum, val) => sum + val, 0))
			.sort((a: number, b: number) => b - a)

		const top = totals[0];
		const top3 = totals.slice(0, 3).reduce((sum, val) => sum + val, 0);
		return { top, top3 }
	}


	test('example 1', function (): void {
		expect(main(sampleInput).top).toBe(24000);
	});

	test('example 2', function (): void {
		expect(main(sampleInput).top3).toBe(45000);
	});

	afterAll(() => console.log(`answer1: ${main(input).top} answer2: ${main(input).top3}`));

}
