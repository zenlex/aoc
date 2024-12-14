import {test, expect} from 'vitest'
import {main} from '../d6';

test('d6p1', function () {
  expect(main('d6-ex1.txt').p1).toBe(41)
})
