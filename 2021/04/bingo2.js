const fs = require('fs');
let win = false;
let winners = [];
const brows = 5;
const bcols = 5;

fs.readFile('input.txt', 'utf-8', (err, data) => {
  if (err) console.error(err);

  // split off bingo calls from boards
  const lines = data.split('\n\n');
  const calls = lines[0].split(',')
  console.log(calls);

  // split up boards
  const boards = lines.slice(1).map(rawboard => {
    const board = []
    const bl = rawboard.split('\n');
    const blSplit = bl.map(bl => bl.split(' ').filter(val => val !== ''));
    for (const line of blSplit) {
      board.push(...line)
    }
    return board;
  });

  // copy boards array to track markers
  const markers = []
  for (let i = 0; i < boards.length; i++){
    markers[i] = boards[i].slice();
  }
  function calcWin(board, call){
    let sum = board.filter(val => val !== 'x').reduce((a, b) => parseInt(a) + parseInt(b));
    let result = sum * call;
    console.log(`calcWin Results: 
    sum: ${sum}, 
    call: ${call}, 
    product: ${result}`)
    return result;
  }

  // iterate through calls marking boards
  function markBoards(num) {
    for (let i = 0; i < boards.length; i++) {
      if(winners.includes(i)) continue;
      let index = boards[i].indexOf(num)
      if (index >= 0) {
        markers[i][index] = 'x'
        if(checkWin(i, index)){
          winners.push(i);
          console.log(`winner found on call ${num}!
            It's board #${i}
            winners:`)
          if (winners.length == boards.length){
            calcWin(markers[winners[winners.length-1]], num);
            break;
          }
        } 
      }

    }
  }

  function checkWin(bnum, start) {
    const row = Math.floor(start / bcols);
    const col = start % brows;

    //check row
    const testRow = markers[bnum].slice(row * bcols, (row + 1) * bcols).every(val => val === 'x');
    if (testRow) return true;

    //check columns
    const testCol = markers[bnum]
      .filter((val, index) => {
        return (index % bcols === col && val === 'x')
      })
    if (testCol.length === 5) return true;

    return false;
  }

  for (let i = 0; i < calls.length; i++) {
    if (win) break;

    markBoards(calls[i]);
  }
})




// at each mark of a number, check that row and column for any unmarked spaces/win condition

// on win condition calculate score

