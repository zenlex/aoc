package main

import (
	"aoc2025/inputs"
	"aoc2025/solvers"
	"fmt"
)
import "flag"

func main() {
	day := flag.Int("day", 1, "Integer Day to run")

	flag.Parse()

	if *day < 1 || *day > 12 {
		panic("day out of range (int 1-12 allowed)")
	}

	solver, ok := solvers.Get(*day)
	if !ok {
		fmt.Printf("day %d not found\n", *day)
	}

	fmt.Printf("AOC - Go 2025 - Solving day: %d\n", *day)
	p1, p2 := solver(inputs.InputForDay(*day))

	fmt.Printf("Part 1: %v\n", p1)
	fmt.Printf("Part 2: %v\n", p2)
}
