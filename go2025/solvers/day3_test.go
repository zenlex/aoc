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

	if p2 != 3121910778619 {
		t.Fatalf("p2 should be 3121910778619 but is %d", p2)
	}
}

func TestD3(t *testing.T) {
	input := inputs.InputForDay(3)

	p1, p2 := SolveD3(input)

	if p1 != 16812 {
		t.Fatalf("p1 should be 16812 but is %d", p1)
	}

	if p2 != 0 {
	}
}
