const fs = require('fs');
const { resourceLimits } = require('worker_threads');
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
  console.log('Part 1 RESULT: ', result);
  return result;
}

function part2(data) {
  console.log('running part2');
  const displays = parse(data);
  let sum = 0;
  const outputs = [];
  for (const display of displays.entries()) {
    const input = display[0];
    const output = display[1];
    const legend = getLegend(input);
    const result = getOutput(output, legend);
    sum += result;
  }
  console.log('PART 2 Result:', sum);
  return sum; //stub
}

(async () => {
  if (require.main === module) {
    const data1 = await getData('input1.txt');
    part1(data1);
    part2(data1);
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
  const result = new Map();

  if (!strarr) {
    for (let i = 0; i < 10; i++) {
      result.set(i, null);
    }
    return result;
  }

  for (let i = 0; i < strarr.length; i++) {
    const str = strarr[i];

    switch (str.length) {
      case 2:
        result.set(1, str);
        break;
      case 3:
        result.set(7, str);
        break;
      case 4:
        result.set(4, str);
        break;
      case 5:
        for (const digit of segsByLen.get(5)) {
          if (!result.get(digit)) {
            result.set(digit, [str]);
          } else {
            let arr = result.get(digit);
            arr.push(str);
            result.set(digit, arr);
          }
        }
        break;
      case 6:
        for (const digit of segsByLen.get(6)) {
          if (!result.get(digit)) {
            result.set(digit, [str]);
          } else {
            let arr = result.get(digit);
            arr.push(str);
            result.set(digit, arr);
          }
        }
        break;
      case 7:
        result.set(8, str);
        break;
      default:
        console.log('invalid str length passed to getLegend')
    }
  }

  // 9 condition - includes all '4' segments
  let setVal = result.get(9).filter(str => strIncludes(str, result.get(4)));
  result.set(9, setVal[0]);

  // 3 condition - includes both '1' segments
  setVal = result.get(3).filter(str => strIncludes(str, result.get(1)));
  result.set(3, setVal[0]);

  //2 condition - 9 array does not include all segments
  setVal = result.get(2).filter(str => !strIncludes(result.get(9), str))
  result.set(2, setVal[0]);

  //5 condition - not 2 or 3
  setVal = result.get(5).filter(str =>
    (!isAnagram(str, result.get(2)) && !isAnagram(str, result.get(3))))
  result.set(5, setVal[0])

  // 6 condition - does not include both '1' segments
  setVal = result.get(6).filter(str => !strIncludes(str, result.get(1)));
  result.set(6, setVal[0]);
  // 0 condition - not 6 or 9
  setVal = result.get(0).filter(str => (!isAnagram(str, result.get(6)) && !isAnagram(str, result.get(9))));

  result.set(0, setVal[0]);
  return result;
}

function getOutput(strarr, legend) {
  const digits = [];
  for (const str of strarr) {
    for (const [key, val] of legend.entries()) {
      if (isAnagram(val, str)) {
        digits.push(key);
        break;
      }
    }
  }
  return parseInt(digits.join(''));
}

function subLetters(str1, str2) {
  str1let = str1.split('');
  str2let = str2.split('');
  return str1let.filter(letter =>
    !str2let.includes(letter)).join();
}

function strIncludes(str1, str2) {
  return str2.split('').every(letter => str1.split('').includes(letter));
};

module.exports = { part1, part2, parse, getData, isAnagram, getLegend, getOutput, subLetters }