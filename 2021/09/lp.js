// TODO: Part 2 - I think you just recursively call getAdj in some fashion until you hit 9s or an edge in each direction. 

const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8', (err, data) => {
  if (err) console.error(err);
  if (require.main === module) {
    part1(data);
  }
})
const grid = {
  rows: null,
  cols: null
};

function part1(input) {
  const gridlines = getGrid(input, grid); //set rows and cols and return array of lines
  const lows = getLows(input, grid.rows, grid.cols);
  const risks = getRisks(lows);
  const result = risks.reduce((sum, val) => sum + val);
  console.log('p1 Result: ', result);
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
    if (getAdj(i, sg, grid).every(val => val > sg[i])){
      lows.push(sg[i]);
    }

  }
  return lows;
}

const getAdj = (index, sg, grid) => {
  const cols = grid.cols;
  const rows = grid.rows;
  const adjs = {};
  adjs.up = index < cols ? null : sg[index - cols];
  adjs.right = (index + 1) % cols === 0  ? null : sg[index + 1];
  adjs.down = index >= (rows - 1) * cols ? null : sg[index + cols];
  adjs.left = index % cols === 0? null : sg[index - 1];
  return Object.values(adjs).filter(val => val !== null);
}

function getRisks(lowsArr){
  return lowsArr.map(val => val + 1);
}
module.exports = { part1, getGrid, getLows, getAdj, getRisks }