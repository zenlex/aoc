const { part1, getGrid, getLows, getAdj, getRisks } = require('./lp.js');

const sample1 = `2199943210
3987894921
9856789892
8767896789
9899965678`;

describe('main puzzle runs', () => {

  it('part1(sample1) equals 15', () => {
    expect(part1(sample1)).toEqual(15);
  });
})

describe('define grid', () => {
  it('getGrid(sample1) returns array of lines and sets row and col vals', () => {
    const grid = {};
    const testee = getGrid(sample1, grid)
    expect(testee.length).toEqual(5);
    expect(Array.isArray(testee)).toEqual(true);
    expect(grid.rows).toEqual(5);
    expect(grid.cols).toEqual(10);
  })
});


describe('collect lowpoint values', () => {
  const grid = {rows: 5, cols: 10};
  const sg = sample1.split('')
  .map(char => parseInt(char))
  .filter(val => !isNaN(val));
  it ('getAdj(1) should return [9, 9, 2]', () => {
    expect(getAdj(1, sg, grid)).toEqual([9, 9, 2]);
  })
  it ('getAdj(23) should return [7, 7, 7, 5]', () => {
    expect(getAdj(23, sg, grid)).toEqual([7, 7, 7, 5]);
  })
  it('getLows(sample1, rows, cols) returns [1,0,5,5]', () => {
    expect(getLows(sample1, grid.rows, grid.cols)).toEqual([1, 0, 5, 5]);
  })
})

test('getRisks([1,0,5,5] should return [2, 1, 6, 6]', () => {
  expect(getRisks([1,0,5,5])).toEqual([2,1,6,6]);
})