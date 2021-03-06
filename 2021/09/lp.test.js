const { part1, part2, getGrid, getLows, getAdj, getRisks, getBasinSize, } = require('./lp.js');

const fs = require('fs');
const path = require('path');


const sample1 = `2199943210
3987894921
9856789892
8767896789
9899965678`;

describe('main puzzle runs', () => {

  it('part1(sample1) equals 15', () => {
    expect(part1(sample1)).toEqual(15);
  });

  it('part2(sample1) equals 1134', () => {
    expect(part2(sample1)).toEqual(1134);
  })

  
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
  const grid = { rows: 5, cols: 10 };
  const sg = sample1.split('')
    .map(char => parseInt(char))
    .filter(val => !isNaN(val));
  it('getAdj(1) should return [9, 9, 2]', () => {
    expect(getAdj(1, sg, grid)).toEqual([9, 9, 2]);
  })
  it('getAdj(23) should return [7, 7, 7, 5]', () => {
    expect(getAdj(23, sg, grid)).toEqual([7, 7, 7, 5]);
  })
  it('getLows(sample1, rows, cols) returns [1,0,5,5]', () => {
    expect(getLows(sample1, grid.rows, grid.cols)).toEqual([1, 0, 5, 5]);
  })

  describe('get basin sizes', () => {
    it('getBasinSize(1) should return size 3', () => {
      expect(getBasinSize(1, sample1)).toEqual(3);
    })
    it('getBasinSize(9) should return size 9', () => {
      expect(getBasinSize(9, sample1)).toEqual(9);
    })
    it('getBasinSize(22) should return size 14', () => {
      expect(getBasinSize(22, sample1)).toEqual(14);
    })
    it('getBasinSize(46) should return size 9', () => {
      expect(getBasinSize(46, sample1)).toEqual(9);
    })
  })
})

test('getRisks([1,0,5,5] should return [2, 1, 6, 6]', () => {
  expect(getRisks([1, 0, 5, 5])).toEqual([2, 1, 6, 6]);
})

