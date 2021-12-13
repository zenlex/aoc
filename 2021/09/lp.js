// TODO: Part 2 - I think you just recursively call getAdj in some fashion until you hit 9s or an edge in each direction. 

const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8', (err, data) => {
  if (err) console.error(err);
  if (require.main === module) {
    part1(data);
    part2(data);
  }
})
const grid = {
  rows: null,
  cols: null,
  lowIndexes: new Set()
};

function part1(input) {
  const gridlines = getGrid(input, grid); //set rows and cols and return array of lines
  const lows = getLows(input, grid.rows, grid.cols);
  const risks = getRisks(lows);
  const result = risks.reduce((sum, val) => sum + val);
  console.log('p1 Result: ', result);
  return result;
}

function part2(input) {
  const basinSizes = new Map();
  getLows(input, grid.rows, grid.cols);
  const startPoints = grid.lowIndexes;
  for (const start of startPoints) {
    basinSizes.set(start, getBasinSize(start, input));
  }

  let result = Array.from(basinSizes.values())
    .sort((a, b) => a - b)
    .slice(-3)
    .reduce((sum, val) => sum * val, 1);
  console.log('p2 Result: ', result);
  return result;
}

function getGrid(str, grid) {
  const lines = str.split('\n').filter(line => line !== '');
  grid.cols = lines[0].split('').length;
  grid.rows = lines.length;
  console.log(`Rows:${grid.rows}, Cols: ${grid.cols}`);
  return lines;
}

function getLows(str, rows, cols) {

  const sg = str.split('')
    .map(char => parseInt(char))
    .filter(val => !isNaN(val));

  const lows = [];
  for (let i = 0; i < rows * cols; i++) {
    if (getAdj(i, sg, grid).every(val => val > sg[i])) {
      lows.push(sg[i]);
      grid.lowIndexes.add(i);
    }

  }
  return lows;
}

const getAdj = (index, sg, grid) => {
  const cols = grid.cols;
  const rows = grid.rows;
  const adjs = {};
  adjs.up = index < cols ? null : sg[index - cols];
  adjs.right = (index + 1) % cols === 0 ? null : sg[index + 1];
  adjs.down = index >= (rows - 1) * cols ? null : sg[index + cols];
  adjs.left = index % cols === 0 ? null : sg[index - 1];
  return Object.values(adjs).filter(val => val !== null);
}

const getBasinSize = (index, inputStr) => {
  const searchGrid = inputStr.split('')
    .map(char => parseInt(char))
    .filter(val => !isNaN(val));

  let pos = index;
  let counted = new Map([[pos, false]]);
  const cols = grid.cols;
  const rows = grid.rows;

  const isTopEdge = (pos) => pos < cols;
  const isRightEdge = (pos) => (pos + 1) % cols === 0
  const isBottomEdge = (pos) => pos >= (rows - 1) * cols
  const isLeftEdge = (pos) => pos % cols === 0
  const isCounted = (pos) => counted.has(pos);

  const rippleSearch = (pos) => {
    counted.set(pos, true);
    if (!isTopEdge(pos)) {
      if (searchGrid[pos - cols] !== 9
        && !isCounted(pos - cols)) {
        counted.set(pos - cols, false);
      }
    }
    if (!isRightEdge(pos)) {
      if (searchGrid[pos + 1] !== 9
        && !isCounted(pos + 1)) {
        counted.set(pos + 1, false);
      }
    }
    if (!isBottomEdge(pos)) {
      if (searchGrid[pos + cols] !== 9
        && !isCounted(pos + cols)) {
        counted.set(pos + cols, false);
      }
    }
    if (!isLeftEdge(pos)) {
      if (searchGrid[pos - 1] !== 9
        && !isCounted(pos - 1)) {
        counted.set(pos - 1, false);
      }
    }
  }

  for (const [pos, searched] of counted) {
    if (!searched)
    rippleSearch(pos);
  }

  return counted.size;
}


function getRisks(lowsArr) {
  return lowsArr.map(val => val + 1);
}
module.exports = { part1, getGrid, getLows, getAdj, getRisks, getBasinSize, part2, }