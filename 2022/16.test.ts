import input from './inputs/01'
import sampleInput from './inputs/01-sample'
import './string.extensions';
namespace template {
	function main(input: string): { p1: number, p2: number } {
		let p1 = 0;
		let p2 = 0;
		return { p1, p2 }
	}

	//TODO: build map of the rooms/valves as a graph then traverse each path to max of 30 minutes checking if release is greater than current Max....seems like either a DP or backtracking type problem...
	test('example 1', function (): void {
		expect(main(sampleInput).p1).toBe(1651);
	});

	test.skip('example 2', function (): void {
		expect(main(sampleInput).p2).toBe(0);
	});

	test.skip('answers', () => console.log(JSON.stringify(main(input), null, 2)));
}
