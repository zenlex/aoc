package solvers

import (
	"log"
	"strconv"
	"strings"
)

func SolveD1(input string) (int, int) {
	position := 50
	zerosAtEnd := 0
	totalZeros := 0

	for _, line := range strings.Split(input, "\n") {
		line = strings.TrimSpace(line)
		if len(line) == 0 {
			continue
		}

		dir := 1
		if line[0] == 'L' {
			dir = -1
		}

		dist, err := strconv.Atoi(line[1:])
		if err != nil {
			log.Fatalf("Invalid number in instruction %q: %s", line, err)
		}

		delta := dist * dir
		finalPos := ((position + delta % 100) +100) % 100
		if finalPos == 0 {
			zerosAtEnd++
		}

		totalZeros += countZeroCrossings(position, delta)
		position = finalPos
	}

	return zerosAtEnd, totalZeros
}

func countZeroCrossings(position, delta int) int {
	if delta == 0 {return 0}

	dir := 1
	steps := delta
	if delta < 0 {
		dir = -1
		steps = -delta
	}

	var kFirst int
	if dir == 1 {
		kFirst = 100 - position
	}else {
		kFirst = position
	}

	if kFirst == 0 {kFirst = 100}

	if steps < kFirst {
		return 0
	}

	return 1 + (steps - kFirst) / 100
}

func init() {
	Register(1, SolveD1)
}
