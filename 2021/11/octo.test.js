const { part1, part2, increaseAll, resetFlashers, flash, getAdjacent } = require('./octo');

const sample1 =
  `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;

const rows = 10;
const cols = 10;

describe('main puzzle solutions', () => {
  it('part1(sample1) should return 1656', () => {
    expect(part1(sample1)).toEqual(1656);
  })
  it('part2(sample1) should return 195', () => {
    expect(part2(sample1)).toEqual(195);
  })
})

test('increaseEnergy([1,2,3,4,5] should return [2,3,4,5,6]', () => {
  const testee = [1, 2, 3, 4, 5];
  const result = [2, 3, 4, 5, 6];
  expect(increaseAll(testee)).toEqual(result);
})

test('resetFlashers([-10, 2, 4, -10, 6] should return [0, 2, 4, 0, 6]', () => {
  const testee = [-10, 2, 4, -10, 6];
  const result = [0, 2, 4, 0, 6];
  expect(resetFlashers(testee)).toEqual(result);
})

test('flash(4, [1, 1, 1, 1, 10, 1, 1, 1, 1] should flash once', () => {
  const cols = 3;
  const testee = [1, 1, 1,
    1, 10, 1,
    1, 1, 1];
  const result = [2, 2, 2,
    2, -11, 2,
    2, 2, 2
  ]

  expect(flash(4, testee, cols)).toEqual(result);
})

test('getAdjacent(4, 3, 3) returns surrounding indexes', () => {
  expect(getAdjacent(4, 3, 3)).toEqual([1, 2, 5, 8, 7, 6, 3, 0]);
})
/**
 * Pseudo testing
 * step(index) 
 *  - use to iterate over all indexes
 * increase(index)
 *  - increases non-negative value at each index by 1.
 *  - 
 *  flash(index)
 *  - calls 'flash(octopus)' for every octopus > 9(recursively)
 *  - flags that octopus as flashed by using bitwise NOT (~)
 *  - adds one to flash count
 *  - calls increase on all adjacent non-negative indexes
 * 
 * getAdjacent(index)
 * -returns array of adjacent indexes not out of bounds
 */