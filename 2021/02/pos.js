const fs = require('fs');

let pos = {h:0, d:0, aim:0};

fs.readFile('input.txt', 'utf-8', (err, data) => {
  if(err){
    console.error(err);
  }

  // format data
  const lines = data.split('\n').filter((item) => item !== '')
  const path = lines.map((move) => {
    let newMove = move.split(' ');
    newMove[1] = parseInt(newMove[1]);
    return newMove;
  });

  //calculate final position
  for (const move of path){
    switch(move[0]){
      case 'forward':
        pos.h += move[1];
        pos.d += move[1] * pos.aim;
        break;
      case 'down':
        pos.aim += move[1];
        break;
      case 'up':
        pos.aim -= move[1];
        break;
      default:
        console.error('invalid command - switch failed');
    }
  }
  console.log(pos);
  console.log(`product = ${pos.d * pos.h}`)
})

