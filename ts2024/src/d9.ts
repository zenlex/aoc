// import fs from 'fs';
import {readPuzzleInput} from './advent_helpers.js';
import './string.extensions.js';

export function main(file: string): {p1: number, p2: number} {
  const input = readPuzzleInput(file).trim();
  const disk = new Disk(input);
  const p1 = disk.compact().checksum();
  // reinitialize disk for p2
  disk.init(input);
  const p2 = disk.defrag().checksum();
  return {p1, p2}
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
              this.clearFreeSpace(block, size);
            }
            block += size;
          } else {
            this.writeFile(block, size);
            block += size;
          }
          isFreeSpace = !isFreeSpace;
    }
  }

  init(input: string): Disk {
    this.freeSpace = [];
    this.fileMap = new Map();
    this.deserialize(input);
    return this;
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
      this.compactFile(file);

      fileId--;
    }
    return this;
  }

  compactFile(file: Chunk[]): void {
      if(this.freeSpace.length === 0) { return; }
      let lastChunk = file[file.length - 1];

      while (true) {
        let source = this.getEndBlock(lastChunk);
        let target = this.freeSpace[0]?.address;

        if (
          source == undefined 
          || target === undefined 
          || source <= target
        ) { break; }

        const extendableChunk = file.find((c) => this.getEndBlock(c) === target - 1);
        if(extendableChunk) {
          extendableChunk.size++;
        }else{
          const insertionPoint = file.findIndex((c) => c.address > target);
          file.splice(insertionPoint, 0, {address: target, size: 1});
        }
        
        lastChunk.size--;
        if (lastChunk.size === 0) {
          file.pop();
          lastChunk = file[file.length - 1];
        }

          this.freeSpace[0].address++;
          this.freeSpace[0].size--;
        if (this.freeSpace[0].size === 0) {
          this.freeSpace.shift();
        }
      }
  }

  defrag(): Disk {
    let fileId = this.fileMap.size - 1;
    while(fileId >= 0) {
      let file = this.fileMap.get(fileId);
      if (!file) {throw new Error(`File not found - id: ${fileId}`)}
      let fileSize = file[0].size;
      let target = this.freeSpace.filter((c) => c.size >= fileSize && c.address < file[0].address)[0];
      if (!target) {
        fileId--;
        continue;
      }
      this.moveFile(file, target);
      fileId--;
    }

    return this;
  }

  moveFile(file:Chunk[], target: Chunk): void {
      let source = file[0];
      file[0].address = target.address;

      target.address += source.size;
      target.size -= source.size;
      if (target.size === 0){ 
        this.freeSpace = this.freeSpace.filter((c) => c !== target);
      }
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


  clearFreeSpace(address: number, size: number): void {
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
