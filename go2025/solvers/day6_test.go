package solvers

import (
	"aoc2025/inputs"
	"fmt"
	"testing"
)

func TestD6Ex1(t *testing.T) {
	fmt.Println("Testing D6 Ex1")
	input := inputs.ExampleForDay(6, 1)
	p1, p2 := SolveD6(input)

	p1Expected := 4277556
	if p1 != p1Expected {
		t.Errorf("p1 expected %d, got %d", p1Expected, p1)
	}

	p2Expected := 3263827
	if p2 != p2Expected {
		t.Errorf("p2 expected %d, got %d", p2Expected, p2)
	}
}

func TestD6(t *testing.T) {
	fmt.Println("Testing D6")
	input := inputs.InputForDay(6)
	p1, p2 := SolveD6(input)

	p1Expected := 5667835681547
	if p1 != p1Expected {
		t.Errorf("p1 expected %d, got %d", p1Expected, p1)
	}

	p2Expected := 9434900032651
	if p2 != p2Expected {
		t.Errorf("p2 expected %d, got %d", p2Expected, p2)
	}
}
