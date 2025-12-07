package main

import (
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

	fmt.Printf("AOC - Go 2025 - Solving day: %d\n\n", *day)
	result := solver(inputForDay(*day))

	fmt.Printf("Solution: %v\n", result)
}
