const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

if(require.main === module){
  part1(input);
  part2(input);
}
console.log(input);


function part1(puzzleInput){
  return 40; //stub
}

function part2(puzzleInput){
  return true;
}

module.exports = {part1, part2}