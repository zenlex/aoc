const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

if (require.main === module) {
  part1(input);
  part2(input);
}


function part1(puzzleInput) {
  const riskNodes = puzzleInput.split('\n').map(val => val.split('').map(str => parseInt(str)));
  const cols = riskNodes[0].length;



  let result = getSafestPath(cols, riskNodes, 0, riskNodes.length - 1);

  console.log('part1 Result:', result);
  return result;
}

function part2(puzzleInput) {
  return true;
}

function getSafestPath(riskNodes, start, end) {
// TODO - this doesn't return the right value. Debug and figure out why. Going to have to implement a heap for p2 I think...

  const minDistance = (dists, visited) => {
    let min = Number.MAX_VALUE;
    let min_index = -1;

    for (let v= 0; v < riskNodes.length; v++){
      if (visited[v] === false && dists[v] <= min){
        min = dists[v];
        min_index = v;
      }
    }
  }

  let dists = new Array(riskNodes.length).fill(Number.MAX_VALUE);
  dists[start] = 0;

  let visited = new Array(riskNodes.length).fill(false);

  for (let count = 0; count < riskNodes.length - 1; count++) {
    let u = minDistance(dists, visited);
    if (u === end) break;

    visited[u] = true;

    for (let v = 0; v < riskNodes.length; v++) {
      if (!visited[v] && riskNodes[u][v] != 0
        && dists[u] != Number.MAX_VALUE
        && dists[u] + riskNodes[u][v] < dists[v]) {
        dists[v] = dists[u] + riskNodes[u][v];
      }

    }
  }
  const lowestRisk = dists.reduce((total, curr) => curr === Infinity ? total : total + curr, 0);
  return lowestRisk;
}




module.exports = { part1, part2 }