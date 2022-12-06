import input from './inputs/06'
import sampleInput from './inputs/06-sample'
import './string.extensions';
namespace daysix {
	function main(input: string) {
		const p1 = findFirstUniqueWindow(input, 4);
		const p2 = findFirstUniqueWindow(input, 14);
		return { p1, p2 }
	}

	function findFirstUniqueWindow(input: string, size: number) {

		const initChars: string[] = input.substring(0, size).split('');
		const chars: { [char: string]: number } = {};
		for (const char of initChars) {
			chars[char] = (chars[char] ?? 0) + 1;
		};
		let left = 0;
		let right = size - 1;
		let leadingChar = size;
		while (true) {
			if (Object.keys(chars).length == size || right >= input.length) {
				break;
			} else {
				++leadingChar;
				--chars[input[left]];
				if (chars[input[left]] < 1) {
					delete chars[input[left]]
				}
				++left;
				++right;
				chars[input[right]] = (chars[input[right]] ?? 0) + 1;
			}
		}
		return leadingChar;
	}


	test('example 1', function (): void {
		expect(findFirstUniqueWindow(sampleInput, 4)).toBe(7);
	});

	test('example 2', function (): void {
		expect(findFirstUniqueWindow('mjqjpqmgbljsphdztnvjfqwrcgsmlb', 14)).toBe(19);
		expect(findFirstUniqueWindow('bvwbjplbgvbhsrlpgdmjqwftvncz', 14)).toBe(23);
		expect(findFirstUniqueWindow('nppdvjthqldpwncqszvftbrmjlhg', 14)).toBe(23);
		expect(findFirstUniqueWindow('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 14)).toBe(29);
		expect(findFirstUniqueWindow('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 14)).toBe(26);
	});

	afterAll(() => console.log(JSON.stringify(main(input), null, 2)));
}
