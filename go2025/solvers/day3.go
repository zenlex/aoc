package solvers

import (
	"strings"
)

func SolveD3(input string) (int, int) {
	p1joltage := 0
	lines := strings.Split(input, "\n")
	for _, line := range lines {
		p1joltage += getMaxJoltage(line)
	}

	return p1joltage, 0
}

func getMaxJoltage(line string) int {
	clean := strings.TrimSpace(line)
	if clean == "" {
		return 0
	}
	digits := make([]int, 0, len(clean))
	for _, r := range clean {
		if r >= '0' && r <= '9' {
			digits = append(digits, int(r-'0'))
		}
	}
	maxDigit := 0
	maxIndex := 0
	for i, digit := range digits[:len(digits)-1] {
		if digit > maxDigit {
			maxDigit = digit
			maxIndex = i
		}
	}

	secondDigit := digits[maxIndex+1]

	for _, digit := range digits[maxIndex+2:] {
		if digit > secondDigit {
			secondDigit = digit
		}
	}

	maxJoltage := (maxDigit * 10) + secondDigit

	return maxJoltage
}

func init() {
	Register(3, SolveD3)
}
