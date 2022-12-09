import input from './inputs/09'
import sampleInput from './inputs/09-sample'
import sampleInput2 from './inputs/09-sample2'
import './string.extensions';
namespace daynine {
	function main(input: string): { p1: number, p2: number } {
		let p2 = 0;
		let p1 = 0;

		interface Point {
			x: number
			y: number
		}

		class Rope {
			head: Point
			tail: Point
			intermediateKnots: Point[] | null
			history: Set<string> | null

			constructor(numPoints: number, history?: Set<string> | null) {
				if (numPoints < 2) throw new Error('need at least 2 knots!')

				const defaultOrigin: Point = { x: 0, y: 0 };
				this.head = { ...defaultOrigin };
				this.tail = { ...defaultOrigin };

				if (numPoints > 2) {
					this.intermediateKnots = [];
					for (let i = numPoints - 2; i > 0; --i) {
						this.intermediateKnots[i] = { ...defaultOrigin };
					}
				} else {
					this.intermediateKnots = null;
				}

				this.history = history ?? null;
				if (this.history) {
					this.history.add(this.tailToString())
				}
			}

			moveHead(instruction: string) {
				const [dir, mag] = instruction.split(' ');
				let distance = parseInt(mag);
				while (distance > 0) {
					switch (dir) {
						case 'R':
							this.head.x++;
							break;
						case 'D':
							this.head.y++;
							break;
						case 'U':
							this.head.y--;
							break;
						case 'L':
							this.head.x--;
							break;
						default:
							throw new Error(`invalid direction ${dir}`)
					}
					this.moveTrailingKnots();
					--distance;
				}
			}

			moveKnot(currKnot: Point, anchorKnot: Point = this.head) {
				if (this.isTouching(currKnot, anchorKnot)) {
					return;
				}

				// move knot
				currKnot.x += Math.sign(anchorKnot.x - currKnot.x);
				currKnot.y += Math.sign(anchorKnot.y - currKnot.y);
			}

			moveTrailingKnots(): void {
				if (this.intermediateKnots) {
					const last = this.intermediateKnots.length - 1

					for (let knotIndex = 0; knotIndex <= last; ++knotIndex) {
						const currKnot = this.intermediateKnots[knotIndex];
						const prevKnot = knotIndex == 1 ? this.head : this.intermediateKnots[knotIndex - 1];
						this.moveKnot(currKnot, prevKnot)
					}

					this.moveKnot(this.tail, this.intermediateKnots[last])
				} else {
					this.moveKnot(this.tail);
				}

				if (this.history != null) {
					this.history.add(this.tailToString())
				}
			}

			isTouching(knotA: Point = this.head, knotB: Point = this.tail): boolean {
				return (
					Math.abs(knotA.x - knotB.x) < 2
					&& Math.abs(knotA.y - knotB.y) < 2
				)
			}

			tailToString(): string {
				return `${this.tail.x},${this.tail.y}`
			}
		}

		const moves = input.toLines();

		const runP1 = (): number => {
			// use set of ('x,y') to store visited nodes
			const p1Visited: Set<string> = new Set();
			const p1rope = new Rope(2, p1Visited)

			moves.forEach(move => p1rope.moveHead(move));

			return p1Visited.size;
		}

		const runP2 = (): number => {
			const p2visited: Set<string> = new Set();
			const p2Rope = new Rope(10, p2visited)

			moves.forEach(move => p2Rope.moveHead(move));

			return p2visited.size;
		}

		p1 = runP1();
		p2 = runP2();
		return { p1, p2 }
	}

	test('example 1', function (): void {
		expect(main(sampleInput).p1).toBe(13);
	});

	test('example 2', function (): void {
		expect(main(sampleInput).p2).toBe(1);
	});

	test('example 2 extended', function (): void {
		expect(main(sampleInput2).p2).toBe(36);
	});

	test('answers', () => console.log(JSON.stringify(main(input), null, 2)));
}
