package main

import (
	"aoc2025/solvers"
	"fmt"
)
import "flag"

func main() {
	dayPtr := flag.Int("day", 1, "Integer Day to run")

	flag.Parse()

	if *dayPtr < 1 || *dayPtr > 12 {
		panic("day out of range (int 1-12 allowed)")
	}

	solver, ok := solvers.Get(*dayPtr)
	if !ok {
		fmt.Printf("day %d not found\n", *dayPtr)
	}

	fmt.Printf("AOC - Go 2025 - Solving day: %d\n\n", *dayPtr)
	result, err := solver()
	if err != nil {
		panic(err)
	}

	fmt.Printf("Solution: %v\n", result)
}
