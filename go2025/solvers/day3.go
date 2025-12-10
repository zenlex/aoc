package solvers

import (
	"strings"
)

func SolveD3(input string) (int, int) {
	p1joltage := 0
	p2joltage := 0
	lines := strings.Split(input, "\n")
	for _, line := range lines {
		maxP1Joltage := getMaxJoltage(line, 2)
		p1joltage += maxP1Joltage
		maxP2joltage := getMaxJoltage(line, 12)
		p2joltage += maxP2joltage
	}

	return p1joltage, p2joltage
}

func getMaxJoltage(line string, cells int) int {
	digits := lineToDigits(line)
	if digits == nil {
		return 0
	}

	joltageCells := make([]int, cells)
	insertionIndex := 0
	startIndex := 0
	endIndex := len(digits) - cells
	candidates := digits[:endIndex+1]
	remainingCells := cells

	for remainingCells > 0 {
		candidates = digits[startIndex : endIndex+1]
		maxIndex, maxValue := getMaxCell(candidates)
		joltageCells[insertionIndex] = maxValue
		insertionIndex++
		startIndex += maxIndex + 1
		remainingCells--
		endIndex++
	}

	maxJoltage := 0
	for _, digit := range joltageCells {
		maxJoltage = maxJoltage*10 + digit
	}

	return maxJoltage
}

func lineToDigits(line string) []int {
	clean := strings.TrimSpace(line)
	if clean == "" {
		return nil
	}
	digits := make([]int, 0, len(clean))
	for _, r := range clean {
		if r >= '0' && r <= '9' {
			digits = append(digits, int(r-'0'))
		}
	}
	return digits
}

func getMaxCell(digits []int) (int, int) {
	maxDigit := digits[0]
	maxIndex := 0
	for i, digit := range digits[1:] {
		if digit > maxDigit {
			maxDigit = digit
			maxIndex = i + 1
		}
	}
	return maxIndex, maxDigit
}

func init() {
	Register(3, SolveD3)
}
