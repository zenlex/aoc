package solvers

import (
	"strings"
)

func SolveD3(input string) (int, int) {
	p1 := 0
	p2 := 0
	lines := strings.FieldsFunc(input, func(r rune) bool {
		return r == '\n' || r == ' '
	})
	for _, line := range lines {
		p1 += maxJoltage(line, 2)
		p2 += maxJoltage(line, 12)
	}

	return p1, p2
}

func maxJoltage(line string, cells int) int {
	digits := lineToDigits(line)
	if len(digits) == 0 || cells <= 0 {
		return 0
	}

	var joltageCells []int
	start := 0

	for len(joltageCells) < cells && start < len(digits) {
		end := len(digits) - (cells - len(joltageCells)) + 1
		if end > len(digits) {
			end = len(digits)
		}
		maxIndex, maxValue := maxCell(digits[start:end])
		joltageCells = append(joltageCells, maxValue)
		start += maxIndex + 1
	}

	maxJoltage := 0
	for _, digit := range joltageCells {
		maxJoltage = maxJoltage*10 + digit
	}

	return maxJoltage
}

func lineToDigits(line string) []int {
	digits := make([]int, 0, len(line))
	for _, r := range line {
		if r >= '0' && r <= '9' {
			digits = append(digits, int(r-'0'))
		}
	}
	return digits
}

func maxCell(digits []int) (int, int) {
	maxDigit := 0
	maxIndex := 0
	for i, digit := range digits {
		if digit > maxDigit {
			maxDigit = digit
			maxIndex = i
		}
	}
	return maxIndex, maxDigit
}

func init() {
	Register(3, SolveD3)
}
