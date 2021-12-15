// Main Functions (Parts 1 and 2)
const path = require('path');
const fs = require('fs')
const { part1, part2, createNode, createGraph, getAllPaths } = require('./caves')



const exampletxt = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;

const lgSample = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`;

const xlSample = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`;

describe('Part 1 matches example', () => {
  it('part1(exampletxt) returns 10', () => {
    expect(part1(exampletxt)).toEqual(10);
  })
  it('part1(lgSample) returns 19', () => {
    expect(part1(lgSample)).toEqual(19);
  })
  it('part1(xlSample) returns 226', () => {
    expect(part1(xlSample)).toEqual(226);
  })
})

describe('Part 2 matches examples', () => {
  it('part2(exampletxt) returns 36', () =>{
    expect(part2(exampletxt)).toEqual(36);
  })
  it('part2(lgSample) returns 103', () =>{
    expect(part2(lgSample)).toEqual(103);
  })
  it('part2(xlSample) returns 3509', () =>{
    expect(part2(xlSample)).toEqual(3509);
  })
})

describe('create node', () => {
  const line = 'start-A';
  const testMap = new Map();
  it('takes string pair as input an object map entry', () =>{
    createNode(line, testMap);
    expect(testMap.get('start').name).toEqual('start');
    expect(testMap.get('start').checked).toEqual(false);
    expect(testMap.get('start') instanceof Object).toEqual(true);
    expect(testMap.get('start').connections instanceof Array).toEqual(true);
  });
})

describe('create graph', () => {
  const testee = createGraph(exampletxt.split('\n'));
  it('returns a map', () => {
    expect(testee instanceof Map).toEqual(true);
  })
  it('creates correct number of connections', () => {
    expect(testee.get('A').connections.length).toEqual(4)
  })
})

describe('getAllPaths', () => {
  const cavemap = createGraph(exampletxt.split('\n'))
  const testee = [];
  getAllPaths('start', 'end', testee, [], cavemap);

    it('should return array', () => {
    expect(testee instanceof Array).toEqual(true);
  })
  it('should return array of length 10 for exampletxt', () =>{
    expect(testee.length).toEqual(10);
  })
})


// describe('filterPaths')


/********
 * PSEUDO CODE / TESTING
 * 
 * parse puzzle input into graph as map object. Each key contains an array of caves it points to
 * traverse graph (look up algorithm) to find all paths that get from start to end. 
 *  --I think it's basically this - for each node, sequentially from start, for each connection add to path string, if 'end' push to paths collection, otherwise check next node in chain, if no connections left, backtrack, recurse
 * filter all possible paths for those that don't contain any duplicated small caves
 * return number of paths
 */