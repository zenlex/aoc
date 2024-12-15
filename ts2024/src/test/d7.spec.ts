import {test, expect} from 'vitest'
import {main} from '../d7';

test('d7p1', function () {
  expect(main('d7-ex1.txt').p1).toBe(3749);
  expect(main('d7.txt').p1).toBe(932137732557);
});

test('d7p2', function () {
  expect(main('d7-ex1.txt').p2).toBe(11387);
  // expect(main('d7.txt').p1).toBe(932137732557);
});
