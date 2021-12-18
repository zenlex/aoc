const { part1, part2, parse, getData, isAnagram, getLegend, getOutput, subLetters } = require('./display.js');
const path = require('path');

test(
  'getData should return string', async () => {
    const data = await getData(path.join(__dirname, 'example.txt'));
    expect(typeof data).toBe('string');
  }
)

test(`parse(str) should return map of input => output signals`, () => {
  const testee = `be cfbegad cbdgef | fdgacbe cefdb
  be cfbegad cbdgef | fdgacbe cefdb`;

  const result = new Map([[["be", "cfbegad", "cbdgef"], ["fdgacbe", "cefdb"]], [["be", "cfbegad", "cbdgef"], ["fdgacbe", "cefdb"]]]);

  expect(parse(testee)).toEqual(result);
})

test(`isAnagram(abc, cba returns true)`, () => {
  expect(isAnagram('abc', 'cba')).toEqual(true);
})


test('getOutput(["ab", "ab", "ba", "ab"], Map{ 1 => "ab"}) to return 1111', () => {
  const testee = getOutput(["ab", "ab", "ba", "ab"], new Map([[1, 'ab']]));
  expect(testee).toEqual(1111)
})

test('subLetters(abc, ca) should return b', () => {
  expect(subLetters('abc', 'ca')).toEqual('b');
})

describe('get Legend should decipher a map of 10 strings to keys 0-9', () => {

  it('getLegend() should return 10 digits as keys with null vals', () => {
    const testee = getLegend();
    for (let i = 0; i < testee.size; i++) {
      expect(testee.get(i)).toEqual(null);
    }
  })

  it('getLegend(test text) should return map of 10 strings', () => {
    const testText = 'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab';
    const vals = testText.split(' ');
    const tester = new Map([[8, 'acedgfb'], [5, 'cdfbe'], [2, 'gcdfa'], [3, 'fbcad'], [7, 'dab'], [9, 'cefabd'], [6, 'cdfgeb'], [4, 'eafb'], [0, 'cagedb'], [1, 'ab']])
    const testee = getLegend(vals);
    expect(testee).toEqual(tester);
  })
})

describe('Main Puzzle Functions', () => {

  test('part1(example text) should equal 26', async () => {
    const exampleTxt = await getData(path.join(__dirname, 'example.txt'));
    expect(part1(exampleTxt)).toEqual(26);
  });

  test('part2(p2small) should equal 61229', async () => {
    const p2small = await getData(path.join(__dirname, 'example.txt'));
    expect(part2(p2small)).toEqual(61229);
  });

})