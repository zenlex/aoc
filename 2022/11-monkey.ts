export interface MonkeyProps {
	id: number;
	items: number[];
	op: (oldWorry: number) => number;
	test: (worry: number) => boolean;
	targets: Map<boolean, number>;
	divisor: number;
}

/**
 * MONKEY BUSINESS
 * * */

export class Monkey {
	id: number;
	divisor: number;
	itemsInvestigated: number = 0;
	#items: number[];
	#inspect: (oldWorry: number) => number;
	#test: (worry: number) => boolean;
	#targets: Map<boolean, number>;

	constructor(options: MonkeyProps) {
		({
			items: this.#items,
			op: this.#inspect,
			test: this.#test,
			targets: this.#targets,
			id: this.id,
			divisor: this.divisor
		} = this.getProps(options))
	}

	takeTurn(monkeys: Monkey[], reliefFactor: number) {
		while (this.#items.length > 0) {
			const item: number | undefined = this.#items.shift();
			if (typeof item !== 'number') throw new Error('invalid item in queue')

			const newWorry: number = Math.floor(this.#inspect(item) / reliefFactor);
			this.itemsInvestigated++;

			const passesTest: boolean = this.#test(newWorry);
			const targetId: number | undefined = this.#targets.get(passesTest);
			if (typeof targetId !== 'number') throw new Error('invalid targetId')
			this.throwTo(monkeys[targetId], newWorry)
		}
	}

	private throwTo(recipient: Monkey, item: number) {
		recipient.catch(item);
	}

	private getProps(options: MonkeyProps) {
		return { ...options }
	}

	private catch(item: number) {
		this.#items.push(item);
	}

	getItems() {
		return this.#items;
	}

	setItems(arr: number[]) {
		this.#items = arr;
	}

	toString() {
		return `Monkey${this.id}: 
	items: ${this.#items}
	targets: ${this.#targets}`
	}
}

export function MonkeyFactory(instructions: string): Monkey {

	const lines = instructions.toLines().map(line => line.trim());
	const { test, divisor } = getTest(lines[3]);

	const props: MonkeyProps = {
		id: getId(lines[0]),
		items: getItems(lines[1]),
		op: getOp(lines[2]),
		targets: getTargets(lines[4], lines[5]),
		test,
		divisor
	}

	function getId(line: string): number {
		const id = parseInt(line.split(' ')[1]);
		return id;
	}

	function getItems(line: string): number[] {
		const itemList = /(?<=: ).*$/.exec(line)?.[0]
		if (
			isEmpty(itemList)
			|| itemList === undefined
		) throw new Error('unable to get Items')

		const items: number[] = itemList.split(',').map(str => parseInt(str));
		return items;
	}

	function getOp(line: string): (old: number) => number {
		const tokens = line.match(/(?<== old )(?<operator>.{1})\s(?<operand>.*$)/)
		const operator = tokens?.groups?.operator;
		const operandString = tokens?.groups?.operand;
		if (!operator || !operandString) throw new Error('cannot parse equation')
		let operand: number = parseInt(operandString)

		let op;
		switch (operator) {
			case '+':
				op = isNaN(operand) ? (old: number) => old + old : (old: number) => old + operand;
				break;
			case '-':
				op = isNaN(operand) ? (old: number) => old - old : (old: number) => old - operand;
				break;
			case '*':
				op = isNaN(operand) ? (old: number) => old * old : (old: number) => old * operand;
				break;
			case '/':
				op = isNaN(operand) ? (old: number) => old / old : (old: number) => old / operand;
				break;
			default:
				throw new Error(`invalid operator ${operator}`)
		}

		return op;
	}

	function getTest(line: string): { test: (val: number) => boolean, divisor: number } {
		const operandString = line.match(/(?<=divisible by )\d*/)?.[0];
		if (!operandString) throw new Error('invalid operandString')
		const operand = parseInt(operandString);
		return {
			test: (worry: number) => worry % operand === 0,
			divisor: operand
		};
	}

	function getTargets(trueLine: string, falseLine: string): Map<boolean, number> {
		const trueTarget = trueLine.match(/(?<=monkey )\d+$/)?.[0]
		const falseTarget = falseLine.match(/(?<=monkey )\d+$/)?.[0]
		if (
			isEmpty(trueTarget)
			|| isEmpty(falseTarget)
			|| trueTarget == undefined
			|| falseTarget == undefined
		) throw new Error('invalid targets')

		const trueId = parseInt(trueTarget);
		const falseId = parseInt(falseTarget);

		return new Map<boolean, number>([[true, trueId], [false, falseId]]);
	}

	function isEmpty(val: any) {
		return val === null || val === undefined || val === ''
	}

	return new Monkey(props)
}
