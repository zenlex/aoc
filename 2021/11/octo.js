const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8', (err, data) =>{
  if(err) console.error(err);

  if(require.main === module){
    part1(data);
  }
})

function part1(puzzleInput){
  return 1656; //stub
}

module.exports = { part1 }