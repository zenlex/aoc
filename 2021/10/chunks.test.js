const { part1, part2, isPair, parseLine, autoComplete } = require('./chunks');
const fs = require('fs');
const path = require('path');

let sample = `[({(<(())[]>[[{[]{<()<>>
  [(()[<>])]({[<{<<[]>>(
  {([(<{}[<>[]}>{[]{[(<()>
  (((({<>}<{<{<>}{[]{[]{}
  [[<[([]))<([[{}[[()]]]
  [{[{({}]{}}([{[{{{}}([]
  {<[[]]>}<{[{[{[]{()[[[]
  [<(<(<(<{}))><([]([]()
  <{([([[(<>()){}]>(<<{{
  <{([{{}}[<[[[<>{}]]]>[]]`;


describe('main puzzle runs', () => {
  it('part1(sample) should return 26397', () => {
    expect(part1(sample)).toEqual(26397);
  })
  
  it('part2(sample) should return 288957', () => {
    expect(part2(sample)).toEqual(288957);
  })
})

test('isPair confirms a char is mirror to another', () => {
  expect(isPair('(',')')).toEqual(true);
  expect(isPair('(', '}')).toEqual(false);
})

test('parseline("[]<>{()}") should return null', () => {
  expect(parseLine("[]<>{()}")).toEqual(null);
})

test('parseLine([<>(]) should return ]', () => {
  expect(parseLine("[<>(]")).toEqual(']');
})

test('autoComplete("([({}){<") should return [4, 3, 2, 1]', () => {
  expect(autoComplete('([({}){<')).toEqual([4,3, 2, 1]);
} )