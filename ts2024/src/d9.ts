import fs from 'fs';
import {readPuzzleInput} from './advent_helpers.js';
import './string.extensions.js';

export function main(file: string): {p1: number, p2: number} {
  const input = readPuzzleInput(file);
  const disk = new Disk(input);
  return {p1: disk.compact().checksum(), p2: p2()}
}

function p2(): number {
  return 0;
}

class Disk {
  fileMap: Map<number, number[]> = new Map();
  freeSpace: number[] = [];
  constructor(input: string) {
    this.deserialize(input);
  } 

  deserialize(input: string) {
    let block = 0;
    let isFreeSpace = false;
    for (const marker of input.split('')) {
          const size = parseInt(marker);
          if(isFreeSpace) {
            this.writeFreeSpace(block, size);
            block += size;
          } else {
            this.writeFile(block, size);
            block += size;
          }
          isFreeSpace = !isFreeSpace;
    }
  }

  compact(): Disk {
    let fileId = this.fileMap.size - 1;
    while(this.freeSpace.length > 0 && fileId >= 0) {
      let file = this.fileMap.get(fileId);
      if (!file) {
        throw new Error('File not found - id: ' + fileId);
      }

      while (this.freeSpace[0] < file[file.length - 1]) {
        let target = this.freeSpace.shift();
        if (target === undefined) {
          break;
        }

        let source = file.pop();
        if (source === undefined) {
          break;
        }

        file.unshift(target);
        this.freeSpace.push(source);
      }

      fileId--;
    }
    return this;
  }

  checksum(): number {
    let checksum = 0;
    for (const [id, blocks] of this.fileMap) {
      checksum += blocks.reduce((sum, block) => sum + block * id, 0);
    }
    return checksum;
  }

  writeFreeSpace(startBlock: number, size: number): void {
    const end = startBlock + size;
    for (let i = startBlock; i < end; i++) {
      this.freeSpace.push(i);
    }
  }

  writeFile(startBlock: number, size: number): void {
    const fileId = this.fileMap.size;
    if(!this.fileMap.has(fileId)) {
      this.fileMap.set(fileId, []);
    }
    let storage = this.fileMap.get(fileId);
    for (let i = startBlock; i < startBlock + size; i++) {
      storage?.push(i)
    }
  }
}
