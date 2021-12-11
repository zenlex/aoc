const fs = require('fs');
const segsByLen = new Map([[2, 1], [3, 7], [4, 4], [5, [2, 3, 5]], [6, [0, 6, 9]], [7, 8]])

function part1(data) {
  console.log('running part1');
  const displays = parse(data);
  const outputs = Array.from(displays.values()).flatMap(val => val);
  const result = outputs.reduce((count, val) => {
    if ([1, 4, 7, 8].includes(segsByLen.get(val.length))) {
      return count += 1;
    }
    return count;
  }, 0)
  console.log('RESULT: ', result);
  return result;
}

function part2(data) {
  console.log('running part2');
  const displays = parse(data);
  const outputs = [];
  for (const display of displays.entries()) {
    const input = display[0];
    const output = display[1];
    const legend = getLegend(input);
    const result = getOutput(output, legend); 
  }
  return 5353; //stub
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
  return new Map(io);
}

function isAnagram(str1, str2) {
  if (str1.length !== str2.length) return false;
  const sorted1 = str1.split('').sort().join();
  const sorted2 = str2.split('').sort().join();
  return sorted1 === sorted2;
}

function getLegend(strarr) {
  result = new Map();
  if (!strarr) {
    for (let i = 0; i < 10; i++) {
      result.set(i, null);
    }
  }

  // TODO: Logic here should take the ioPair and sort which set of letters = which digit and set the values in keyvals to [digit, letter] pairs. 
  return result;

}

function getOutput(strarr, legend) {
  const digits = [];
  for(const str of strarr){
    for(const key of legend.keys()){
      if(isAnagram(key, str)){
        digits.push(legend[key]);
        break;
      }
    }
  }
  return 1111;
}
module.exports = { part1, part2, parse, getData, isAnagram, getLegend, getOutput }