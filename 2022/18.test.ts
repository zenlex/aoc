import input from './inputs/01'
import sampleInput from './inputs/01-sample'
import './string.extensions';
namespace template {
	function main(input: string): { p1: number, p2: number } {
		let p2 = 0;

		const runp1 = (): number => {
			const coords: number[][] = input.toLines().map(line => line.split(',').map(val => parseInt(val)))
			const clearSides: number = coords.reduce((total, coord) => {
				const xCoveredLeft: boolean = coords.filter(cand => cand[1] === coord[1] && cand[2] === coord[2] && cand[0] - coord[0] === 1).length > 0;
				const xCoveredRight: boolean = coords.filter(cand => cand[1] === coord[1] && cand[2] === coord[2] && cand[0] - coord[0] === -1).length > 0;
				const yCoveredLeft: boolean = coords.filter(cand => cand[0] === coord[0] && cand[2] === coord[2] && cand[1] - coord[1] === 1).length > 0;
				const yCoveredRight: boolean = coords.filter(cand => cand[0] === coord[0] && cand[2] === coord[2] && cand[1] - coord[1] === -1).length > 0;
				const zCoveredLeft: boolean = coords.filter(cand => cand[0] === coord[0] && cand[1] === coord[1] && cand[2] - coord[2] === 1).length > 0;
				const zCoveredRight: boolean = coords.filter(cand => cand[0] === coord[0] && cand[1] === coord[1] && cand[2] - coord[2] === -1).length > 0;
				return total += [xCoveredLeft, xCoveredRight, yCoveredLeft, yCoveredRight, zCoveredLeft, zCoveredRight].filter(isCovered => isCovered).length;
			}, 0)

			return clearSides;
		}
		let p1 = runp1();
		return { p1, p2 }
	}

	test('small example', function (): void {
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
