const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8', (err, data) => {
  if (err) console.error(err);
  const posArr = data.split(',')
    .filter(x => x !== '')
    .map(x => parseInt(x));

  const dists = mapAllDists(posArr)
  const result = Math.min(...dists.values())
  // console.log(result);
  return result;
})

function mapAllDists(arr){
  const dists = new Map();
  const maxPos = Math.max(...arr);
  for(let i = 0; i <= maxPos; i++){
    dists.set(i, calcTotalDist(arr, i))
  }
  return dists;
}

function calcTotalDist(arr, dest){
  return arr.reduce((acc, val) => {
    const dist = Math.abs(val - dest);
    const fuel = dist  * (1 + dist) / 2;
    return acc + fuel;
  }, 0)
  
}

module.exports = {calcTotalDist, mapAllDists}