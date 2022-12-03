import input from './inputs/01'
import sampleInput from './inputs/01-sample'
import './string.extensions';
namespace template {
	function main(input: string): { p1: number, p2: number } {
		let p1 = 0;
		let p2 = 0;
		return { p1, p2 }
	}

	test('example 1', function (): void {
		expect(main(sampleInput).p1).toBe(0);
	});

	test.skip('example 2', function (): void {
		expect(main(sampleInput).p2).toBe(0);
	});

	// afterAll(() => console.log(JSON.stringify(main(input), null, 2)));
}
