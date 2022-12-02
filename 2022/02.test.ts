import input from './inputs/02'
import sampleInput from './inputs/02-sample'
import './string.extensions'

namespace daytwo {
	function main(input: string): number {
		const rounds = input.toLines();
		return rounds.reduce((sum, round) => {
			return sum + scoreRound(round);
		}, 0)
	}

	function main2(input: string): number {
		const rounds = input.toLines();
		return rounds.reduce((sum, round) => {
			return sum + scoreRound2(round);
		}, 0)
	}
	interface StringToNum {
		[choice: string]: number
	}

	interface StringToResult {
		[choice: string]: { result: 'lose' | 'win' | 'draw', score: number }
	}

	const choiceScores: StringToNum = {
		X: 1,
		Y: 2,
		Z: 3
	};

	const resultScores: StringToNum = {
		'A X': 3,
		'A Y': 6,
		'A Z': 0,
		'B X': 0,
		'B Y': 3,
		'B Z': 6,
		'C X': 6,
		'C Y': 0,
		'C Z': 3
	};

	const resultMap: StringToResult = {
		X: { result: 'lose', score: 0 },
		Y: { result: 'draw', score: 3 },
		Z: { result: 'win', score: 6 }
	}

	function scoreRound(round: string): number {
		return choiceScores[round.substring(2)] + resultScores[round];
	}

	function scoreRound2(round: string): number {
		const desiredResult = resultMap[round.substring(2)]
		const opponentChoice = round.substring(0, 1);
		return desiredResult.score + choiceScores[getChoice(opponentChoice, desiredResult.result)]
	}

	function getChoice(opp: string, result: string): string {
		const choices: { [goal: string]: string } = {
			'A,win': 'Y',
			'A,draw': 'X',
			'A,lose': 'Z',
			'B,win': 'Z',
			'B,draw': 'Y',
			'B,lose': 'X',
			'C,win': 'X',
			'C,draw': 'Z',
			'C,lose': 'Y'
		}
		return choices[opp + ',' + result];
	}

	test('example 1', function (): void {
		expect(main(sampleInput)).toBe(15);
	});

	test('example 2', function (): void {
		expect(main2(sampleInput)).toBe(12);
	});

	afterAll(() => console.log(`answer1:${main(input)}, answer2: ${main2(input)}`));
}
