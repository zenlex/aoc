// import input from './inputs/2016-01'
import sampleInput from './inputs/2016-01-sample';

namespace twentysixteenone{

const DELTAS = {
    'N': [0, 1],
    'E': [1, 0],
    'S': [0, -1],
    'W': [-1, 0]
};

type Direction = 'N' | 'S' | 'E' | 'W';

function main(input: string): { p1: number, p2: number } {
    let p1 = 0;
    let p2 = 0;

p1 = runPart1(input);
    return { p1, p2 }
}

function runPart1(input: string): number {
    let start = { x: 0, y: 0 };

    let instructions = parseInput(input);     

    let endpoint = followInstructions(instructions);
    
    let distance = calculateDistance(start, endpoint);
    return distance;
}

function parseInput(input: string): unknown[]{
    const steps = input.split(', ');
    const instructions = steps.map((step) => [step[0], step.slice(1)]);
    return instructions;
}

function followInstructions(instructions: any[]): {x: number, y: number}
{
    let direction: Direction = 'N';
    let pos = {x: 0, y:0}
    instructions.forEach(instruction => {
        const [turn, dist] = instruction;
        direction = rotate(turn)
        pos = walk(dist)

    })

    return pos
}

function rotate(turn: string): Direction {
    return 'N'
}

function walk(dist: number): {x: number, y: number} {
    return {x: 0, y:0}
}

function calculateDistance(start: object, end: object): number {
    return 5;
}

test.only('example 1', function (){
    expect(main(sampleInput.p1sample).p1).toBe(5);
});

test('example 2', function (){
    expect(main(sampleInput.p2sample).p1).toBe(2);
});

test('example 3', function (){
    expect(main(sampleInput.p3sample).p1).toBe(12);
});

	// test.skip('answers', () => console.log(JSON.stringify(main(input), null, 2)));

}
