const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'input.txt')

fs.readFile(file, 'utf-8', (err, data) => {
  if (err) console.error(err);

  if (require.main === module) {
    part1(data);
    part2(data);
  }
})

function part1(puzzleInput) {
  const cavemap = createGraph(puzzleInput.trim().split('\n'));
  const paths = getAllPaths('start', 'end', [], [], cavemap);
  console.log('part 1 result: ', paths.length)
  return paths.length; //stub
}
function part2(puzzleInput) {
  const cavemap = createGraph(puzzleInput.trim().split('\n'));
  const paths = getAllPaths('start', 'end', [], [], cavemap, 2);
  console.log('part 2 result: ', paths.length)
  return paths.length; //stub
}

function createNode(line, map) {
  const newNode = {};
  const [start, end] = line.split('-');
  newNode.name = start;
  newNode.connections = [end];
  newNode.checked = false;
  newNode.large = start.toUpperCase() === start ? true : false;
  map.set(newNode.name, newNode);
}

function createGraph(lines) {
  const cavemap = new Map()
  for (const line of lines) {
    const [start, dest] = line.split('-');
    if (cavemap.has(start)) { //cave already on map, add connections if unique
      const node = cavemap.get(start);
      if (!node.connections.includes(dest)) {
        node.connections.push(dest);
        cavemap.set(start, node);
      };
    } else createNode(line, cavemap);
    if (cavemap.has(dest)) {
      const node = cavemap.get(dest);
      if (!node.connections.includes(start)) {
        node.connections.push(start);
        cavemap.set(dest, node);
      }
    } else {
      const backtrack = `${dest}-${start}`;
      createNode(backtrack, cavemap);
    }
  }
  return cavemap;
}
const paths = [];

function getAllPaths(start, end, paths = [], currPath = [], map, smallLimit = 1) {
  end = map.get(end);
  let currNode = map.get(start);
  currPath.push(currNode.name);
  currNode.checked = currNode.checked + 1;

  if (currNode === end) {
    let repeats = 0;
    for (let i = 0; i < currPath.length; i++) {
      if (currPath[i].toUpperCase() === currPath[i]) continue;
      if (currPath.indexOf(currPath[i], i + 1) > 0) {
        repeats += 1;
      }
    }
    if (repeats < 2) {
      paths.push([...currPath]);
    }

  } else {
    const adjs = currNode.connections;
    for (const name of adjs) {
      const node = map.get(name);
      if (node.checked < smallLimit || node.large) {
        getAllPaths(node.name, 'end', paths, currPath, map, smallLimit)
      }
    }
  }
  currPath.pop();
  currNode.checked = currNode.checked - 1;
  return paths;
}


module.exports = { part1, part2, createNode, createGraph, getAllPaths }