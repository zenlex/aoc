const { part1, getGridSize, foldDots, parseInput } = require('./fold');

const sample = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;

describe('main tests - part1', () => {
  const {dots, folds} = parseInput(sample);
  it('part1(sample) returns 17 after first fold', () => {
    const foldedDots = foldDots(dots, [folds[0]])
    const testee = Array.from(foldedDots.values()).reduce((total, yvals) => yvals.size + total, 0)
    expect(testee).toEqual(17);
  })
  it('part1(sample) returns 16 after second fold', () => {
    const foldedDots = foldDots(dots, folds);
    const testee = Array.from(foldedDots.values()).reduce((total, yvals) => yvals.size + total, 0)
    expect(testee).toEqual(16);
  })
})

test('getGridSize(dots) should return [11, 15]', () => {
  const {dots} = parseInput(sample);
  expect(getGridSize(dots)).toEqual([11, 15]);
})

// describe('foldDot should reflect dot coordinates across axis', () => {
//   const dots = parseInput(sample);
//   const foldedDots = 
//   it('fold([3,9],null , 7) should return [3, 5]', () => {
//     let testDot = {x:3, y:9};
//     let testee = fold(testDot, null, 7);
//     expect(testee).toEqual({x:3, y:5});
//   })
//   it('fold([2,7], 1, null) should return [0,7]', () => {
//     let testDot = {x:2, y:7};
//     let testee = fold(testDot, 1, null);
//     expect(testee).toEqual({x:0, y:7})

//   })

// })