import input from '/inputs/02'
import sampleInput from '/inputs/02-sample'

namespace daytwo {
	function main(input: string): void {
		console.log('lessgo day2');
	}

	test('example 1', function (): void {
		expect(true).toBe(true);
	});

	test('example 2', function (): void {
		expect(false).toBe(false);
	});

	afterAll(() => main(input));
}
