import fs from 'fs';
import {readPuzzleInput} from './advent_helpers.js';
import './string.extensions.js';

export function main(file: string): {p1: number, p2: number} {
  const input = readPuzzleInput(file);
  const disk = new Disk(input.trim());
  return {p1: disk.compact().checksum(), p2: disk.defrag().checksum()}
}

interface Chunk {
  address: number;
  size: number;
}

interface File {
  id: number;
  blocks: Chunk[];
}

class Disk {
  fileMap: Map<number, Chunk[]> = new Map();
  freeSpace: Chunk[] = [];
  constructor(input: string) {
    this.deserialize(input);
  } 

  deserialize(input: string) {
    let block = 0;
    let isFreeSpace = false;
    for (const marker of input.split('')) {
          const size = parseInt(marker);
          if(isFreeSpace) {
            if (size > 0){
              this.writeFreeSpace(block, size);
            }
            block += size;
          } else {
            this.writeFile(block, size);
            block += size;
          }
          isFreeSpace = !isFreeSpace;
    }
  }

  getEndBlock(chunk: Chunk): number {
    return chunk.address + chunk.size -1;
  }

  compact(): Disk {
    let fileId = this.fileMap.size - 1;
    while(fileId >= 0 && this.freeSpace.length > 0) {
      let file = this.fileMap.get(fileId);
      if (!file) {
        throw new Error('File not found - id: ' + fileId);
      }

      while (this.freeSpace[0].address < this.getEndBlock(file[file.length - 1])) {
        let target = this.freeSpace[0].address;
        if (target === undefined) {
          break;
        }

        let source = this.getEndBlock(file[file.length - 1]);
        if (source === undefined) {
          break;
        }

        const writableChunk = file.find((c) => this.getEndBlock(c) === target - 1);
        if(writableChunk) {
          writableChunk.size++;
        }else{
          const insertionPoint = file.findIndex((c) => c.address > target);
          file.splice(insertionPoint, 0, {address: target, size: 1});
        }
        
        file[file.length - 1].size--;
        if (file[file.length - 1].size === 0) {
          file.pop();
        }

          this.freeSpace[0].address++;
          this.freeSpace[0].size--;
        if (this.freeSpace[0].size === 0) {
          this.freeSpace.shift();
        }
      }

      fileId--;
    }
    return this;
  }

  defrag(): Disk {
    let fileId = this.fileMap.size - 1;
    while(fileId >= 0) {
      let file = this.fileMap.get(fileId);
      if (!file) {throw new Error(`File not found - id: ${fileId}`)}
      let size = file.length;
      //TODO - simplify this with a refactor for p1 - don't store individual blocks, store them all as {start, size}
      fileId--;
    }

    return this;
  }

  checksum(): number {
    let checksum = 0;
    for (const [id, chunks] of this.fileMap) {
      checksum += chunks.reduce((sum, block) => sum + this.#getBlockChecksum(block, id), 0);
    }
    return checksum;
  }

  #getBlockChecksum(chunk: Chunk, id: number): number {
    let current = chunk.address;
    let end = current + chunk.size;
    let checksum = 0;
    while (current < end) {
      checksum += current * id;
      current++;
    }
    return checksum;
  }


  writeFreeSpace(address: number, size: number): void {
      this.freeSpace.push({address, size});
  }

  writeFile(address: number, size: number): void {
    const fileId = this.fileMap.size;
    if(!this.fileMap.has(fileId)) {
      this.fileMap.set(fileId, []);
    }
    let storage = this.fileMap.get(fileId);
    storage?.push({address, size});
  }
}
