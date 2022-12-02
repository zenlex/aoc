interface String {
	toChunks(separator?: string): string[],
	toLines(separator?: string): string[],
	chunksAndLines(): string[][],
	toNumericChunks(separator?: string): number[],
	toNumericLines(separator?: string): number[],
	numericChunksAndLines(): number[][],
}

String.prototype.toChunks = function (separator: string = '\n\n'): string[] {
	return this.split(separator);
}

String.prototype.toLines = function (separator: string = '\n'): string[] {
	return this.split(separator);
}

String.prototype.chunksAndLines = function (): string[][] {
	return this.toChunks().map(chunk => chunk.toLines());
}



String.prototype.toNumericChunks = function (separator: string = '\n\n'): number[] {
	return this.split(separator).map(str => parseInt(str));
}

String.prototype.toNumericLines = function (separator: string = '\n'): number[] {
	return this.split(separator).map(str => parseInt(str));
}

String.prototype.numericChunksAndLines = function (): number[][] {
	return this.toChunks().map(chunk => chunk.toNumericLines());
}
