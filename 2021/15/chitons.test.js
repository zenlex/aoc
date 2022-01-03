const { part1, part2 } = require('./chitons');

const sample = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;


describe('main puzzle runs get samples correct', () => {
  it('expects part1 to return 40 with sample input', () => {
    expect(part1(sample)).toEqual(40);
  });
  it('expects part2 to return true', () => {
    expect(part2()).toEqual(true);
  });
})

