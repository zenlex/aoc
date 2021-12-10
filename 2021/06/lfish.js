const fs = require('fs');
const path = require('path');
const numDays = 256;

function run(n){
  fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8', (err, data) => {
  if (err) console.error(err);
  const result = p1(data, n);
  console.log(result);
})
}

if(require.main === module) run(numDays);

function p1(data, numDays) {
  const dataset = parseInput(data);
  // initialize fish state
  const fish = new Map();
  for (const key of range(9)) {
    fish.set(key, 0);
  }
  (seed => {
    for (const val of seed) {
      fish.set(val, fish.get(val) + 1)
    }
  })(dataset);

  runDays(numDays, fish);
  const result = calc(fish);
  // console.log(fish);
  // console.log(result);
  return result;
} // end p1

/*--------------------------
  FUNCTION DEFS
--------------------------*/

function parseInput(txt){
  return txt.split(',').filter(val => val != '').map((val) => parseInt(val));
 }


function runDay(fishmap) {
  const spawners = fishmap.get(0);
  for (let i = 0; i <= 8; i++) {
    const tmp = fishmap.get(i + 1) || 0;
    fishmap.set(i, tmp);
  }
  if (spawners) {

    fishmap.set(6, fishmap.get(6) + spawners);
    fishmap.set(8, spawners);
  }
}

function runDays(n, data) {
  let day = 1;
  while (n > 0) {
    runDay(data)
    n--
    day++
  }

}

function calc(datamap) {
  results = Array.from(datamap.values())
  sum = results.reduce((a, b) => a + b);
  return sum;
}

function range(n){return [...Array(n).keys()]}

module.exports = {calc, p1};