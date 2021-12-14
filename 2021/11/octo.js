const fs = require('fs');
const path = require('path');

//TODO - WRITE TESTS AGAINST THE SAMPLE INPUT....YOU"RE CLOSE>>>>JUST TEST / DEBUG IT

// define grid
const rows = 10;
const cols = 10;

fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8', (err, data) => {
  if (err) console.error(err);

  if (require.main === module) {
    part1(data);
    part2(data);
  }
})

let energies;

let flashCount = 0;

const increaseAll = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    arr[i] += 1;
  }
  return arr;
}
const resetFlashers = (arr) => {
  for (let i = 0; i < arr.length; i++)
    if (arr[i] < 0) {
      arr[i] = 0;
    }
  return arr;
}

function part1(puzzleInput) {
  energies = puzzleInput
    .split('')
    .map(val => parseInt(val))
    .filter(val => !isNaN(val));

  function step(numSteps) {
    while (numSteps > 0) {
      energies = increaseAll(energies);

      for (let i = 0; i < rows * cols; i++) {
        energies = flash(i, energies, cols);
      }

      energies = resetFlashers(energies);
      numSteps--;
    }
  }
  step(100);
  console.log('part1 result: ', flashCount)
  return flashCount;
}

function part2(puzzleInput) {
  energies = puzzleInput
    .split('')
    .map(val => parseInt(val))
    .filter(val => !isNaN(val));
  let stepsTaken = 0;
  let allFlash = false;
  function step() {
    while (!allFlash) {
      energies = increaseAll(energies);

      for (let i = 0; i < rows * cols; i++) {
        energies = flash(i, energies, cols);
      }

      energies = resetFlashers(energies);
      if(stepsTaken > 10000) break;
      allFlash = energies.every(val => val === 0);
      stepsTaken ++;
    }
  }
  step();
  console.log('part2 result: ', stepsTaken)
  return stepsTaken;
}

function flash(octopus, arr, cols) {
  let energy = arr[octopus];
  if (energy > 9) {
    flashCount += 1;
    arr[octopus] = ~energy;
    const adjOcts = getAdjacent(octopus, rows, cols);
    for (const index of adjOcts) {
      if (arr[index] >= 0) {
        arr[index] += 1
        arr = flash(index, arr, cols)
      }
    }
  }
  return arr;
}


function getAdjacent(octopus, rows, cols) {
  const adjacents = [];
  
  const rightEdge = (i) => (i + 1) % cols === 0;
  const leftEdge = (i) => i % cols === 0;
  const topEdge = (i) => i < cols;
  const bottomEdge = (i) => i >= (rows - 1) * cols;

  //top
  if (!topEdge(octopus)) {
    adjacents.push(octopus - cols);
  }
  //top right
  if (!topEdge(octopus) && !rightEdge(octopus)) {
    adjacents.push(octopus - cols + 1)
  }
  //right
  if (!rightEdge(octopus)) {
    adjacents.push(octopus + 1);
  }
  //bottom right
  if (!rightEdge(octopus)
    && !bottomEdge(octopus)) {
    adjacents.push(octopus + cols + 1)
  }
  //bottom
  if (!bottomEdge(octopus)) {
    adjacents.push(octopus + cols)
  }
  //bottom left
  if (!leftEdge(octopus) && !bottomEdge(octopus)) {
    adjacents.push(octopus + cols - 1)
  }
  //left
  if (!leftEdge(octopus)) {
    adjacents.push(octopus - 1)
  }

  //top left
  if (!leftEdge(octopus) && !topEdge(octopus)) {
    adjacents.push(octopus - cols - 1)
  }

  return adjacents;
}


module.exports = { part1, part2, increaseAll, resetFlashers, flash, getAdjacent }