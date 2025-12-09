package solvers

import (
	"fmt"
	"log"
	"strconv"
	"strings"
)

func SolveD2(input string) (int, int) {
	p2 := 0
	ranges := strings.Split(input, ",")
	var invalidIds []int

	for _, r := range ranges {
		invalidIds = append(invalidIds, getInvalidIds(r)...)
	}

	p1 := 0
	for _, id := range invalidIds {
		p1 += id
	}

	return p1, p2
}

func getInvalidIds(input string) []int {
	var invalidIds []int
	parts := strings.Split(input, "-")
	start := strings.TrimSpace(parts[0])
	end := strings.TrimSpace(parts[1])
	startInt, err := strconv.Atoi(start)
	if err != nil {
		log.Fatal(err)
	}

	endInt, err := strconv.Atoi(end)
	if err != nil {
		log.Fatal(err)
	}

	// find all invalid ids between start and end by string changes
	candidate := startInt
	for candidate <= endInt {
		if isInvalid(candidate) {
			invalidIds = append(invalidIds, candidate)
			fmt.Printf("Invalid ID found: %d\n", candidate)
		}
		candidate += 1
	}

	return invalidIds
}

func isInvalid(id int) bool {
	idString := strconv.Itoa(id)
	length := len(idString)
	if length < 2 || length%2 != 0 {
		return false
	}

	middle := length / 2
	left := 0
	right := middle
	for left < middle && right < length {
		if idString[left] != idString[right] {
			return false
		}
		left++
		right++
	}
	return true
}

func init() {
	Register(2, SolveD2)
}
