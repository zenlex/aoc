package solvers

import (
	"aoc2025/inputs"
	"testing"
)

func TestD1p1example1(t *testing.T) {
	input := inputs.ExampleForDay(1, 1)

	p1, _ := SolveD1(input)

	if p1 != 3 {
		t.Fatalf("p1 should be 3, but got %d", p1)
	}
}
