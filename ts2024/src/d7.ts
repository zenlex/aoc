import './string.extensions.js';
import fs from 'fs';

export function main(file: string): {p1: number, p2: number} {
  const path = `./inputs/${file}`;
  const input = fs.readFileSync(path, 'utf-8');
  const equations = input.toLines()
    .filter(l => l != '')
    .map(l => new Equation(l));
  return {p1: p1(equations), p2: p2(equations)}
}

function p1(equations: Equation[]): number {
  return equations.filter(e => e.isValid())
    .map(e => e.result)
    .reduce((sum, n) => sum + n, 0);
}

function p2(equations:Equation[]): number {
  return equations.filter(e => e.isValid(['+', '*', '||']))
    .map(e => e.result)
    .reduce((sum, n) => sum + n, 0);
}

class Equation {
  operators: string[] = ['+', '*'];
  operands!: number[];
  result!: number;

  constructor(input: string) {
    const [lh, rh] = input.split(': ');
    this.operands = rh.split(' ').map(n => parseInt(n))
    this.result = parseInt(lh);
  }

  isValid(operators?:string[]): boolean {
    if(operators) {
      this.operators = operators;
    }
    const equation = this;
    function backtrack(index: number, currentResult: number): boolean{
      if (index == equation.operands.length) {
        return currentResult == equation.result;
      }

      if (currentResult > equation.result) {
        return false;
      }

      for (let op of equation.operators) {
        let nextResult;
        if (op == '+') {
          nextResult = currentResult + equation.operands[index];
        } else if (op == '*') {
          nextResult = currentResult * equation.operands[index];
        } else if (op == '||') {
          nextResult = parseInt(currentResult.toString() + equation.operands[index].toString());
        } else {
          throw new Error('Invalid operator');
        }

        if (backtrack(index + 1, nextResult)) {
          return true;
        }

      }
        return false;
    }

    return backtrack(0, 0);
  }
}
