const fs = require('fs');

let ship = { powcons: 0, epsilon: 0, gamma: 0, };

function calcPower() {
  ship.powcons = ship.epsilon * ship.gamma;
  console.log(`Current Power Consumption: ${ship.powcons}`)
  return ship.powcons;
}

fs.readFile('input.txt', 'utf-8', (err, data) => {
  if (err) {
    console.err(err)
  }

  // transform input data into array of lines - each line 5 bits
  const lines = data.split('\n').filter(item => item !== '');
  const rows = lines.length;
  const bits = lines[0].length;
  console.log(`${rows} rows of codes found`);
  // transform lines into columns
  const columns = [];
  for (let i = 0; i < bits; i++) {
    columns[i] = [];
    lines.forEach(code => columns[i].push(parseInt(code[i])));
  }
  // calculate most common bit in column array (gama rate)
  const gammaBits = columns.map(col => {
    return col.filter(bit => bit).length > (rows / 2)
      ? 1 : 0
  }).join('');
  ship.gamma = parseInt(gammaBits, 2);

  //calculate epsilon rate as opposite of gamma rate
  const epsilonBits = gammaBits.split('').map(bit => parseInt(bit) ? 0 : 1).join('')
  ship.epsilon = parseInt(epsilonBits, 2)
  //convert epsilon and gamma rates to decimal, multiply, and return answer
  calcPower();

})