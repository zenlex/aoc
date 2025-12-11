package solvers

import (
	"aoc2025/inputs"
	"testing"
)

func TestD4Ex1(t *testing.T) {
	input := inputs.ExampleForDay(4, 1)

	p1, p2 := SolveD4(input)

	expectedp1 := 13
	if p1 != expectedp1 {
		t.Errorf("SolveD4 returned %d, expected %d", p1, expectedp1)
	}

	expectedp2 := 43

	if p2 != expectedp2 {
		t.Errorf("SolveD4 returned %d, expected %d", p2, expectedp2)
	}
}

func TestD4(t *testing.T) {
	input := inputs.InputForDay(4)

	p1, p2 := SolveD4(input)

	expectedp1 := 1508
	if p1 != expectedp1 {
		t.Errorf("SolveD4 returned %d, expected %d", p1, expectedp1)
	}

	expectedp2 := 8538

	if p2 != expectedp2 {
		t.Errorf("SolveD4 returned %d, expected %d", p2, expectedp1)
	}
}
