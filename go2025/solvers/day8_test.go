package solvers

import (
	"aoc2025/inputs"
	"testing"
)

func TestD8Ex1(t *testing.T) {
	input := inputs.ExampleForDay(8, 1)
	QueueDepth = 10
	p1, _ := SolveD8(input)

	p1Expected := 40
	if p1 != p1Expected {
		t.Fatalf("p1 expected %d, got %d", p1Expected, p1)
	}

	QueueDepth = -1
	_, p2 := SolveD8(input)

	p2Expected := 25272
	if p2 != p2Expected {
		t.Fatalf("p2 expected %d, got %d", p2Expected, p2)
	}
}

func TestD8(t *testing.T) {
	input := inputs.InputForDay(8)
	QueueDepth = 1000
	p1, _ := SolveD8(input)

	p1Expected := 122430
	if p1 != p1Expected {
		t.Fatalf("p1 expected %d, got %d", p1Expected, p1)
	}

	QueueDepth = -1
	_, p2 := SolveD8(input)

	p2Expected := 8135565324
	if p2 != p2Expected {
		t.Fatalf("p2 expected %d, got %d", p2Expected, p2)
	}
}
