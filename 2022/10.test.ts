import input from './inputs/10'
import sampleInput from './inputs/10-sample'
import './string.extensions';
import chalk from 'chalk'
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

		const illuminatePixel = (): void => {
			currentCRTrow.push(isSpriteVisible() ? chalk.green('#') : chalk.red('.'))
		}

		const isRowEnd = (): boolean => {
			return currentCycle % 40 == 0
		}

		const cycle = (count: number = 1) => {
			while (count > 0) {
				++currentCycle;
				illuminatePixel();

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

		const recordSignalStrength = (storage: number[]) => {
			signalStrengths.push(currentCycle * x)
		}

		const executeInstruction = (instruction: string, stepFn: Function) => {
			if (instruction.startsWith('noop')) {
				cycle();
			} else {
				const [op, arg] = instruction.split(' ');
				cycle(2);
				x += parseInt(arg);
			}
		}

		const runInstructions = () => {
			const lastInstruction = instructions.length;
			for (let i = 0; i < lastInstruction; ++i) {
				executeInstruction(instructions[i], cycle);
			}
		}

		const sumArray = (arr: number[]) => {
			return arr.reduce((sum, val) => sum += val, 0)
		}

		const formatCRTforConsole = () => {
			return crt
				.map(row => row.join(' '))
				.join(`\n`);
		}

		runInstructions();

		const p1 = sumArray(signalStrengths)
		const p2 = formatCRTforConsole()

		return { p1, p2 }
	}

	test('example 1', function (): void {
		expect(main(sampleInput).p1).toBe(13140);
	});

	test('example 2', function (): void {
		const crtOutput = main(sampleInput).p2;
		expect(typeof crtOutput).toBe('string');
	});

	test('p1 answers', () => console.log(JSON.stringify(main(input).p1, null, 2)));
	test('p2 answers', () => console.log(main(input).p2));
}
