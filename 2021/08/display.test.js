const { part1, part2, parse, getData, isAnagram, getLegend, getOutput } = require('./display.js');
const path = require('path');
const { abort } = require('process');
test(
  'getData should return string', async () => {
    const data = await getData(path.join(__dirname, 'example.txt'));
    expect(typeof data).toBe('string');
  }
)

test(`parse(str) should return map of input => output signals`, () => {
  const testee = `be cfbegad cbdgef | fdgacbe cefdb
  be cfbegad cbdgef | fdgacbe cefdb`;
  const result =  new Map ([[["be", "cfbegad", "cbdgef"], ["fdgacbe", "cefdb"]], [["be", "cfbegad", "cbdgef"],["fdgacbe", "cefdb"]]])
  expect(parse(testee)).toEqual(result);
})

test(`isAnagram(abc, cba returns true)`, () => {
  expect(isAnagram('abc', 'cba')).toEqual(true);
})

test('getLegend() should return 10 digits as keys with null vals', ()=>{
  const testee = getLegend();
  for(let i = 0; i < testee.size; i++){
    expect(testee.get(i)).toEqual(null);
  }
})

test('getOutput(["ab", "ab", "ba", "ab"], Map{"ab" => 1}) to return 1111', () => {
  const testee = getOutput(["ab", "ab", "ba", "ab"], new Map([['ab', 1]]));
  expect(testee).toEqual(1111)
})

describe('Main Puzzle Functions', () => {

  test('part1(example text) should equal 26', async () => {
    const exampleTxt = await getData(path.join(__dirname, 'example.txt'));
    expect(part1(exampleTxt)).toEqual(26);
  });

  test('part2(p2small) should equal 5353', async () => {
    const p2small = await getData(path.join(__dirname, 'example.txt'));
    expect(part2(p2small)).toEqual(5353);
  });

})