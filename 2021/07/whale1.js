const fs = require('fs');
const { format } = require('path');

fs.readFile('input.txt', 'utf-8', (err, data) => {
  if (err) console.error(err);
  const posArr = data.split(',')
    .filter(x => x !== '')
    .map(x => parseInt(x));

  const dists = mapAllDists(posArr)
  console.log(dists);

  console.log('min value is:', Math.min(...dists.values()))
})

function mapAllDists(arr){
  const dists = new Map();
  for(const pos of arr){
    const result = calcTotalDist(arr, pos);
    dists.set(pos, result)
  }
  return dists;
}

function calcTotalDist(arr, dest){
  return arr.reduce((acc, val) => acc + Math.abs(val - dest), 0)
}
