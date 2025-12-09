package solvers

import (
	"log"
	"strconv"
	"strings"
)

func SolveD2(input string) (int, int) {
	ranges := strings.Split(input, ",")
	var invalidIds []int
	var invalidIdsP2 []int

	for _, r := range ranges {
		invalidP1, invalidP2 := getInvalidIds(r)
		invalidIds = append(invalidIds, invalidP1...)
		invalidIdsP2 = append(invalidIdsP2, invalidP2...)
	}

	p1 := 0
	for _, id := range invalidIds {
		p1 += id
	}

	p2 := 0
	for _, id := range invalidIdsP2 {
		p2 += id
	}

	return p1, p2
}

func getInvalidIds(input string) ([]int, []int) {
	var invalidIds []int
	var invalidIdsP2 []int
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
		}
		if isInvalidP2(candidate) {
			invalidIdsP2 = append(invalidIdsP2, candidate)
		}
		candidate += 1
	}

	return invalidIds, invalidIdsP2
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

func isInvalidP2(id int) bool {
	idString := strconv.Itoa(id)
	doubled := idString + idString
	trimmed := doubled[1 : len(doubled)-1]
	if strings.Contains(trimmed, idString) {
		return true
	}
	return false
}

func init() {
	Register(2, SolveD2)
}
