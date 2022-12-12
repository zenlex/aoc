export function getLCM(divisors: number[]): number {
	const isDivisor = (cand: number, div: number): boolean => {
		return cand % div === 0;
	}

	let candidate = Math.max(...divisors);
	let incr = candidate;
	while (!(divisors.every(divisor => isDivisor(candidate, divisor)) && candidate < Number.MAX_SAFE_INTEGER)) {
		candidate += incr;
	}
	return candidate;
}
