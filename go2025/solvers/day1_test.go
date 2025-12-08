package solvers

import (
	"aoc2025/inputs"
	"testing"
)

func TestD1example1(t *testing.T) {
	input := inputs.ExampleForDay(1, 1)

	p1, p2 := SolveD1(input)

	if p1 != 3 {
		t.Fatalf("p1 should be 3, but got %d", p1)
	}

	if p2 != 6 {
		t.Fatalf("p2 should be 6, but got %d", p2)
	}
}

func TestD1(t *testing.T) {
	input := inputs.InputForDay(1)
	p1, p2 := SolveD1(input)
	if p1 != 1064 {
		t.Fatalf("p1 should be 1064, but got %d", p1)
	}

	if p2 != 6122 {
		t.Fatalf("p2 should be 6122, but got %d", p2)
	}
}
