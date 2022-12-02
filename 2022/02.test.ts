import input from './inputs/02'
import sampleInput from './inputs/02-sample'
import './string.extensions'

namespace daytwo {
	function main(input: string): { p1: number, p2: number } {
		const rounds = input.toLines();
		const p1 = rounds.reduce((sum, round) => {
			return sum + scoreRound(round, p1Translator);
		}, 0)
		const p2 = rounds.reduce((sum, round) => {
			return sum + scoreRound(round, p2Translator);
		}, 0)
		return { p1, p2 }
	}

	interface Translator { [choice: string]: string };

	const p1Translator: Translator = {
		A: 'rock',
		B: 'paper',
		C: 'scissors',
		X: 'rock',
		Y: 'paper',
		Z: 'scissors'
	}

	const p2Translator: Translator = {
		X: 'lose',
		Y: 'draw',
		Z: 'win',
	}

	const choiceScores: { [choice: string]: number } = {
		'rock': 1,
		'paper': 2,
		'scissors': 3
	};

	const resultScores: { [round: string]: number } = {
		'lose': 0,
		'draw': 3,
		'win': 6,
	};

	const roundResults: { [round: string]: string } = {
		'rock,rock': 'draw',
		'rock,paper': 'win',
		'rock,scissors': 'lose',
		'paper,paper': 'draw',
		'paper,scissors': 'win',
		'paper,rock': 'lose',
		'scissors,scissors': 'draw',
		'scissors,rock': 'win',
		'scissors,paper': 'lose',
	}


	function scoreRound(round: string, translator: Translator): number {
		const p1choice = p1Translator[round.substring(0, 1)];
		const p2choice: string = translator[round.substring(2)]
		if (translator == p1Translator) {
			const result = roundResults[`${p1choice},${p2choice}`]
			return choiceScores[p1choice] + resultScores[result];
		}
		if (translator == p2Translator) {
			const thisRound: string[] = Object.entries(roundResults)
				.filter(([choices, result]) => result === p2choice && choices.split(',')[0] === p1choice)
				.flat();
			const [plays, result] = thisRound;
			const p2play = plays.split(',')[1];
			return choiceScores[p2play] + resultScores[result];
		}
		throw new Error('invalid translator')
	}

	test('example 1', function (): void {
		expect(main(sampleInput).p1).toBe(15);
	});

	test('example 2', function (): void {
		expect(main(sampleInput).p2).toBe(12);
	});

	afterAll(() => console.log(`answers:${JSON.stringify(main(input), null, 2)}`));
}
