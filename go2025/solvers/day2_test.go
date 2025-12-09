package solvers

import (
	"aoc2025/inputs"
	"testing"
)

func TestD2Example1(t *testing.T) {
	input := inputs.ExampleForDay(2, 1)

	p1, _ := SolveD2(input)

	if p1 != 1227775554 {
		t.Fatalf("p1 should be 1227775554, but got %d", p1)
	}
}
