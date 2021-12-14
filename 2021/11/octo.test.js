const {part1} = require('./octo');

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

describe('main running tests', () => {
  it('part1(sample1) should return 1656', () => {
    expect(part1(sample1)).toEqual(1656);
  })
})
