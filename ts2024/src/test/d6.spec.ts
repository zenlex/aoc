import {test, expect} from 'vitest'
import {main} from '../d6';

test('d6p1', function () {
  expect(main('d6-ex1.txt').p1).toBe(41);
  expect(main('d6.txt').p1).toBe(5318);
})

test('d6p2', function () {
  expect(main('d6-ex1.txt').p2).toBe(6);
  expect(main('d6.txt').p2).toBe(1831);
})
