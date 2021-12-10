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

function groupNums(arr) {
  let map = new Map();
  for (const val of arr) {
    if (map.has(val)) {
      map.set(val, map.get(val) + 1);
    } else map.set(val, 1);
  }
  return map;
};

function mapMax(map) {
  const maxfreq = Math.max(...map.values())
  const possibles = Array.from(map.keys).filter(key => map.get(key));
  const maxWt = Math.min(...Array.from(map.keys()).filter(key => map.get(key) === maxfreq))
  return  maxWt;
}