const fs = require('fs');
const { isRegExp } = require('util/types');

fs.readFile('input.txt', 'utf-8', (err, data) => {
  if (err) console.error(err);
  
  const lines = data.split('\n').filter(line => line != '').map(item =>
    item.split(' -> ')
    .map(point => point.split(',')
    .map(val => parseInt(val))
    )
    );
  console.log(lines);
  // create array from 0,0 to max x and max y to track interactions
  const xs = [];
  const ys = [];
  const vents = [];

  for (let line of lines) {
    xs.push(line[0][0], line[1][0])
    ys.push(line[0][1], line[1][1])
  }
  const cols = Math.max(...xs) + 1;
  const rows = Math.max(...ys) + 1;
  for (let i = 0; i < cols * rows; i++){
    vents.push(0);
  }

  //for each line in lines traverse the state array increasing value at each point
  for (let line of lines) {
    let x0 = line[0][0];
    let x1 = line[1][0];
    let y0 = line[0][1];
    let y1 = line[1][1];
    
    if(x0 === x1){ // vertical line
      const min = Math.min(y0, y1) * cols + x0;
      const max = Math.max(y0, y1) * cols + x0;
      for(let i = min; i <= max; i += cols){
        console.log(`drawing a vertical line from ${min} to ${max}`)
        vents[i] += 1;
      }     
    } 
    if(y0 === y1){ // horizontal line
      const offset = y0 * cols;
      const min = Math.min(x0, x1) + offset;
      const max = Math.max(x0, x1) + offset;
      for(let i = min; i <= max; i++){
        console.log(`drawing horizontal line from ${min} to ${max}`)
        vents[i] += 1;
      }
    }
    //ignore diagonal line
    
  }
  console.log(vents);
  
  //count number of values >= 2
  console.log('points >= 2: ', vents.filter(val => val >= 2).length);
})