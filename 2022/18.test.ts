import input from './inputs/01'
import sampleInput from './inputs/01-sample'
import './string.extensions';
namespace template {
	function main(input: string): { p1: number, p2: number } {
		let p2 = 0;

		const runp1 = (): number => {
			const coords: number[][] = input.toLines().map(line => line.split(',').map(val => parseInt(val)))
			//TODO: maybe the thing to do here is create an array representing each cube by an int of exposed sides initialized to all 6's. Then walk the coords
        return 10
		}
		let p1 = runp1();
		return { p1, p2 }
	}

	test.skip('small example', function (): void {
		expect(main(`1,1,1\n2,1,1`).p1).toBe(10);
	});

	test.skip('example 1', function (): void {
		expect(main(sampleInput).p1).toBe(0);
	});

	test.skip('example 2', function (): void {
		expect(main(sampleInput).p2).toBe(0);
	});

	test.skip('answers', () => console.log(JSON.stringify(main(input), null, 2)));
}
