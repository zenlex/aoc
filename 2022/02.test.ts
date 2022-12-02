import input from './inputs/02'
import sampleInput from './inputs/02-sample'
import './string.extensions'

namespace daytwo {
	function main(input: string): { p1: number, p2: number } {
		const rounds = input.toLines();
		const p1 = rounds.reduce((sum, round) => {
			return sum + scoreRound(round, 'p1');
		}, 0)
		const p2 = rounds.reduce((sum, round) => {
			return sum + scoreRound(round, 'p2');
		}, 0)
		return { p1, p2 }
	}

	type Translator = 'p1' | 'p2'
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

	function scoreRound(round: string, translator: Translator): number {
		if (translator == 'p1') {
			return choiceScores[round.substring(2)] + resultScores[round];
		}
		if (translator == 'p2') {
			const desiredResult = resultMap[round.substring(2)]
			const opponentChoice = round.substring(0, 1);
			return desiredResult.score + choiceScores[getChoice(opponentChoice, desiredResult.result)]
		}
		return 0;
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
		expect(main(sampleInput).p1).toBe(15);
	});

	test('example 2', function (): void {
		expect(main(sampleInput).p2).toBe(12);
	});

	afterAll(() => console.log(`answers:${main(input)}`));
}
