const { part1, parse, getData } = require('./display.js');
const path = require('path');
test(
  'getData should return string', async () => {
    const data = await getData(path.join(__dirname, 'example.txt'));
    expect(typeof data).toBe('string');
  }
)
test(
  'part1(example text) should equal 26', async () => {
    const exampleTxt = await getData(path.join(__dirname, 'example.txt'));
    console.log(exampleTxt);
    expect(part1(exampleTxt)).toEqual(26);
  });

test(`parse(str) should return key/val pairs of arrays split at |`, () => {
  const testee = `be cfbegad cbdgef | fdgacbe cefdb
  be cfbegad cbdgef | fdgacbe cefdb`;
  const result = [[['be', 'cfbegad', 'cbdgef'], ['fdgacbe', 'cefdb']],
  [['be', 'cfbegad', 'cbdgef'], ['fdgacbe', 'cefdb']]
  ];
  expect(parse(testee)).toEqual(result);
})