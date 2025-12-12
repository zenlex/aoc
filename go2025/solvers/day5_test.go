package solvers

import (
	"aoc2025/inputs"
	"testing"
)

func TestD5Ex1(t *testing.T) {
	input := inputs.ExampleForDay(5, 1)
	p1, _ := SolveD5(input)

	p1Expected := 3
	if p1 != p1Expected {
		t.Fatalf("p1 should be %v, got %v", p1Expected, p1)
	}
}

func TestD5(t *testing.T) {
	input := inputs.InputForDay(5)
	p1, _ := SolveD5(input)

	p1Expected := 735
	if p1 != p1Expected {
		t.Fatalf("p1 should be %v, got %v", p1Expected, p1)
	}
}
