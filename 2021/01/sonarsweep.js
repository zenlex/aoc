const fs = require('fs');

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
  }
  const dataset = data.split('\n').filter(item => item !== '').map(item => parseInt(item));

  let incCount = 0;
  let sums = [];

  for (let i = 0; i < dataset.length - 2; i++) {
    sums.push(dataset[i] + dataset[i + 1] + dataset[i + 2])
  };
  for (let i = 1; i < sums.length; i++) {
    if (sums[i] > sums[i - 1]) {
      incCount += 1;
    } else {
      console.log(`not an increase at i=${i}. ${dataset[i]} not greater than ${dataset[i - 1]}`)
    }
  }
  console.log(incCount);
})