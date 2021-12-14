const fs = require('fs');
const { SocketAddress } = require('net');
const path = require('path');

fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8', (err, puzzleInput) => {
  if (err) console.error(err);
  if (require.main === module) {
    part1(puzzleInput);
    part2(puzzleInput);
  }
});

const pairs = new Map(
  [
    ['(', ')'],
    ['[', ']'],
    ['{', '}'],
    ['<', '>']
  ]);

const errscores = new Map(
  [
    [')', 3],
    [']', 57],
    ['}', 1197],
    ['>', 25137]
  ]
);

const compscores = new Map(
  [
    [')', 1],
    [']', 2],
    ['}', 3],
    ['>', 4]
  ]
)

function part1(puzzleInput) {
  const lines = puzzleInput.split('\n').filter(line => line !== '');
  let result = 0;

  for (const line of lines) {
    const error = parseLine(line);
    if (error) {
      result += errscores.get(error);
    }
  }
  console.log('part1 result:', result);
  return result;
}

function part2(puzzleInput) {
  const lines = puzzleInput.split('\n').filter(line => line !== '');
  const totals = [];
  
  for (const line of lines) {
    const error = parseLine(line);
    if (!error) {
      const newScores = autoComplete(line);
      const total = newScores.reduce((sum, charscore) => (sum * 5) + charscore, 0);
      totals.push(total);
    }
  } 
  const result = getMedian(totals);
  console.log('part2 result:', result);
  return result;
  // return 288957; //stub
}

const getMedian = (totals) => {
  const sorted = totals.sort((a, b) => a - b);
  const middle = Math.floor(totals.length / 2);
  return sorted[middle];
}

const parseLine = (line) => {

  const chars = line.trim().split('');
  const openers = [];
  let currOpen;

  for (const char of chars) {
    if (pairs.has(char)) {
      openers.push(char) //it's an opener - store it
      continue;
    } else {
      currOpen = openers[openers.length - 1];
      if (isPair(currOpen, char)) {
        openers.pop();
        continue;
      } else { //corrupted
        return char;
      }
    }

  }
  return null;
}

const isPair = (opener, closer) => {
  return pairs.get(opener) === closer;
}

const autoComplete = (line) => {
  const chars = line.trim().split('');
  const openers = [];
  for (const char of chars) {
    if (pairs.has(char)) {
      openers.push(char);
    } else {
      let currOpener = Array.from(pairs.entries()).filter(([key, val]) => {
        if(val === char) return key;
      })[0];
      openers.splice(openers.lastIndexOf(currOpener), 1);
    }
  }
  const closers = openers.map(opener => pairs.get(opener)).reverse();
  const charScores = closers.map(char => compscores.get(char));
  return charScores;
}
module.exports = { part1, part2, isPair, parseLine, autoComplete }