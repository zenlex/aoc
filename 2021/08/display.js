const fs = require('fs');
const segsByLen = new Map([[2, 1], [3, 7], [4, 4], [5, [2, 3, 5]], [6, [0, 6, 9]], [7, 8]])

function part1(data) {
  console.log('running part1');
  const keyvals = parse(data);
  const displays = new Map(keyvals);
  const outputs = Array.from(displays.values()).flatMap(val => val);
  const result = outputs.reduce((count, val) => {  
    if([1, 4, 7, 8].includes(segsByLen.get(val.length))){
        return count += 1;
      }
      return count;
    }, 0)
    console.log('RESULT: ', result);
  return result;
}

(async () => {
  if (require.main === module) {
    const data1 = await getData('input1.txt');
    part1(data1);
  }
})();

async function getData(path) {
  return new Promise(resolve => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) console.error(err);
      resolve(data);
    })
  })
};

function parse(str) {
  const lines = str.split('\n').filter(val => val !== '');
  const io = [];
  for (const line of lines) {
    let [key, val] = line.split('|');
    key = key.trim().split(' ');
    val = val.trim().split(' ');
    io.push([key, val]);
  }
  return io;
}
module.exports = { part1, parse, getData }