import {test, expect} from 'vitest'
import {main} from '../d9.js';

test('d9p1', function () {
  expect(main('d9-ex1.txt').p1).toBe(1928);
  expect(main('d9.txt').p1).toBe(6461289671426);
});

test('d9p2', function () {
  expect(main('d9-ex1.txt').p2).toBe(2858);
  expect(main('d9.txt').p2).toBe(6488291456470);
});
