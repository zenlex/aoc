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

function part2(input) {
  // TODO: take low points array from p1
  // call the recursive getBasin() for each low point and collect results in an array of arrays
  // compare sizes and multiply the length of 3 longest
  return 1134 //stub;
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

const getBasinSize = (index, grid) => {
  // TODO: This function takes a given low point and recursively chases out orthagonally collecting points until it hits a 9....how do you not double count - you pnly have to watch indexes and don't double dip!! Should return total count of spaces(indexes) in a basin.

  return 3 //stub - basin one in the sample
}

function getRisks(lowsArr){
  return lowsArr.map(val => val + 1);
}
module.exports = { part1, getGrid, getLows, getAdj, getRisks, getBasinSize, part2 }