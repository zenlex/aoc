const {calc, p1} = require('./lfish.js');

test('calc [0, 1, 2, 3] to equal 6', () => {
  const testmap = new Map([[0,0], [1, 1], [2, 2], [3,3]]);
  expect(calc(testmap)).toEqual(6);
  }
);

// sample set
test('p1 sample set d18 = 26', () => {
  expect(p1('3,4,3,1,2', 18)).toEqual(26);
});

test('p1 sample set d80 = 5934', () => {
  expect(p1('3,4,3,1,2', 80)).toEqual(5934);
});