package solvers

import (
	"aoc2025/inputs"
	"testing"
)

func TestD7Ex1(t *testing.T) {
	input := inputs.ExampleForDay(7, 1)

	p1, p2 := SolveD7(input)

	p1Expected := 21
	if p1 != p1Expected {
		t.Fatalf("p1 expected %d, got %d", p1Expected, p1)
	}

	p2Expected := 0
	if p2 != p2Expected {
		t.Fatalf("p1 expected %d, got %d", p2Expected, p2)
	}
}

func TestD7(t *testing.T) {
	input := inputs.InputForDay(7)

	p1, p2 := SolveD7(input)

	p1Expected := 1581
	if p1 != p1Expected {
		t.Fatalf("p1 expected %d, got %d", p1Expected, p1)
	}

	p2Expected := 0
	if p2 != p2Expected {
		t.Fatalf("p1 expected %d, got %d", p2Expected, p2)
	}
}
