const fs = require('fs');

let ship = { powcons: 0, epsilon: 0, gamma: 0, life: 0, oxygen: 0, coscrub: 0 };

function calcPower() {
  ship.powcons = ship.epsilon * ship.gamma;
  console.log(`Current Power Consumption: ${ship.powcons}`)
  return ship.powcons;
}

function calcLife() {
  ship.life = ship.oxygen * ship.coscrub;
  console.log(`Current Life Support: ${ship.life}`)
  return ship.life;
}

fs.readFile('input.txt', 'utf-8', (err, data) => {
  if (err) {
    console.err(err)
  }

  // transform input data into array of lines - each line 5 bits
  const lines = data.split('\n').filter(item => item !== '');
  
  const bits = lines[0].length;
  // transform lines into columns
  function getColumns(rows){
    const cols = [];
    for (let i = 0; i < bits; i++) {
      cols[i] = [];
      rows.forEach(code => cols[i].push(parseInt(code[i])));
    }
    return cols;
  }

  const columns = getColumns(lines);

  function calcBitMask(cols, lcb) {
    const rows = cols[0].length;
    let bitMask = cols.map(col => {
      const ones = col.filter(bit => bit);
      if (lcb) {
        return (ones.length >= (rows / 2) ? 0 : 1)
      }
      return (ones.length >= (rows / 2) ? 1 : 0)
    })
    return bitMask;
  }
  // calculate most common bit in column array (gamma rate)
  const gammaBits = calcBitMask(columns).join('');
  ship.gamma = parseInt(gammaBits, 2);

  // calculate least common bit in column array (epsilon rate)
  const epsilonBits = calcBitMask(columns, true).join('');
  ship.epsilon = parseInt(epsilonBits, 2)

  // calculate o2 gen
  function calcOx() {
    let oxBits = lines.slice();

    for (let i = 0; i < columns.length; i++) {
      let bitMask = calcBitMask(getColumns(oxBits)).join('');

      oxBits = oxBits.filter(code => code[i] === bitMask[i]);

      if (oxBits.length === 1) {
        console.log(`Ship oxygen calculated at: ${parseInt(oxBits[0], 2)}`)
        return parseInt(oxBits[0], 2);
      }
    }
  };

  // calculate co2 scrub rate
  function calcCoScrub() {
    let coBits = lines.slice()
    
    for (let i = 0; i < columns.length; i++) {
      let bitMask = calcBitMask(getColumns(coBits), true).join('');

      coBits = coBits.filter(code => code[i] === bitMask[i]);

      if (coBits.length === 1) {
        console.log(`Co2 Scrubber calculated at: ${parseInt(coBits[0], 2)}`)
        return parseInt(coBits[0], 2);
      }
    }
  }


  // ship status update
  ship.oxygen = calcOx();
  ship.coscrub = calcCoScrub();
  calcPower();
  calcLife();

})