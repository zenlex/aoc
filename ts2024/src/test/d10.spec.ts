import {test, expect} from 'vitest'
import {main} from '../d10.js';

test('small example', function () {
  const input = 
    `0123
    1234
    8765
    9876`.trim().replaceAll(' ', '');
  expect(main(input, true).p1).toBe(1);
});

// test.skip('d10p1', function () {
//   expect(main('d10-ex1.txt').p1).toBe();
//   expect(main('d10.txt').p1).toBe();
// });

// test.skip('d10p2', function () {
//   expect(main('d10-ex1.txt').p2).toBe();
//   expect(main('d10.txt').p2).toBe();
// });
