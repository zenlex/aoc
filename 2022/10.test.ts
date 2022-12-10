import input from './inputs/10'
import sampleInput from './inputs/10-sample'
import './string.extensions';
namespace dayten {
	function main(input: string): { p1: number, p2: string } {
		let x = 1;
		let currentCycle = 0;
		const signalStrengths: number[] = [];
		const instructions = input.toLines();
		const crt: string[][] = [];
		let currentCRTrow: string[] = [];

		const isSpriteVisible = () => {
			return [x - 1, x, x + 1].includes(currentCycle % 40 - 1);
		}

		const printCRT = (): void => {
			currentCRTrow.push(isSpriteVisible() ? '#' : '.')
		}

		const isRowEnd = (): boolean => {
			return currentCycle % 40 == 0
		}

		const cycle = (count: number = 1) => {
			while (count > 0) {
				++currentCycle;
				printCRT();

				if ((currentCycle - 20) % 40 === 0) {
					recordSignalStrength(signalStrengths);
				}

				if (isRowEnd()) {
					crt.push(currentCRTrow)
					currentCRTrow = [];
				}

				--count;
			}
		}

		function recordSignalStrength(storage: number[]) {
			signalStrengths.push(currentCycle * x)
		}

		function executeInstruction(instruction: string, stepFn: Function) {
			if (instruction.startsWith('noop')) {
				cycle();
			} else {
				const [op, arg] = instruction.split(' ');
				cycle(2);
				x += parseInt(arg);
			}
		}

		const lastInstruction = instructions.length;
		for (let i = 0; i < lastInstruction; ++i) {
			executeInstruction(instructions[i], cycle);
		}

		const p1 = signalStrengths.reduce((sum, val) => sum += val, 0)
		const p2 = crt.map(row => row.join('')).join(`\n`);

		return { p1, p2 }
	}

	test('example 1', function (): void {
		expect(main(sampleInput).p1).toBe(13140);
	});

	test('example 2', function (): void {
		const crtOutput = main(sampleInput).p2;
		console.log(crtOutput)
		expect(typeof crtOutput).toBe('string');
	});

	test('p1 answers', () => console.log(JSON.stringify(main(input).p1, null, 2)));
	test('p2 answers', () => console.log(main(input).p2));
}
