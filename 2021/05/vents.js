const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (err, data) => {
  if (err) console.error(err);

  const lines = data.split('\n').filter(line => line != '').map(item =>
    item.split(' -> ')
      .map(point => point.split(',')
        .map(val => parseInt(val))
      )
  );
  
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
  for (let i = 0; i < cols * rows; i++) {
    vents.push(0);
  }

  // traverse the array for each line in dataset
  for (let line of lines) {
    let x0 = line[0][0];
    let x1 = line[1][0];
    let y0 = line[0][1];
    let y1 = line[1][1];

    const [begin, end] = x0 < x1 ? [[x0, y0], [x1, y1]] : [[x1, y1], [x0, y0]] 
    let start = begin[1] * cols + begin[0];
    let stop = end[1] * cols + end[0];
    let offset;
    if(x0 === x1){
      offset = start < stop ? cols : -cols
    }else if(y0 === y1){
      offset = start < stop ? 1 : -1 
    }else {
      offset = start < stop ? cols + 1 : -cols + 1;
    } 

    if(start < stop){
      for (let i = start; i <= stop; i += offset) {
        vents[i] += 1;
      }
    }
    if(stop < start){
      for (let i = start; i >= stop; i += offset) {
        vents[i] += 1;
      }
    }

  }

  //log result
  console.log('points >= 2: ', vents.filter(val => val > 1).length);
})