package solvers

import (
	"aoc2025/inputs"
	"testing"
)

func TestD3Ex1(t *testing.T) {
	input := inputs.ExampleForDay(3, 1)

	p1, p2 := SolveD3(input)

	if p1 != 357 {
		t.Fatalf("p1 should be 357 but is %d", p1)
	}

	if p2 != 0 {
	}
}
