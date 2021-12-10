const { calcTotalDist, mapAllDists } = require('./whale2.js');
const sampleArr = [16,1,2,0,4,2,7,1,2,14]
test('calc total distance([1, 2, 3], 1) = 4',() => {
  expect(calcTotalDist([1, 2, 3], 1)).toEqual(4);
})

test('calc total distance(Example Array, 5) = 168',() => {
  expect(calcTotalDist(sampleArr, 5)).toEqual(168);
})
test('calc total distance(example arr, 2) = 206',() => {
  expect(calcTotalDist(sampleArr, 2)).toEqual(206);
})

test('calc min from list - expect 168', () => {
  const dists = mapAllDists(sampleArr);
  expect(Math.min(...dists.values())).toEqual(168);
})