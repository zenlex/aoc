import {test, expect} from 'vitest'
import {main} from '../d8';

test('d8p1', function () {
  expect(main('d8-ex1.txt').p1).toBe(14);
  expect(main('d8.txt').p1).toBe(273);
});

test('d8p2', function () {
  expect(main('d8-ex1.txt').p2).toBe(34);
  expect(main('d8.txt').p2).toBe(1017);
});
