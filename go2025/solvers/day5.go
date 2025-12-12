package solvers

import (
	"regexp"
	"sort"
	"strconv"
	"strings"
)

func SolveD5(input string) (int, int) {
	p1 := 0

	/**
	Intuition:
		split input at \n\n to get ranges and ids
		create array of ranges
		for each input check if in each range, break on first
		keep counter of matches
	*/

	blankline := regexp.MustCompile(`\r?\n\r?\n+`)
	chunks := blankline.Split(strings.TrimSpace(input), -1)
	if len(chunks) != 2 {
		panic("invalid input")
	}
	ranges := ranges(chunks[0])
	inputs := strings.Fields(chunks[1])

	for _, idStr := range inputs {
		id, err := strconv.Atoi(idStr)
		if err != nil {
			panic(err)
		}
		for _, r := range ranges {
			if id >= r.Start && id <= r.End {
				p1++
				break
			}
		}
	}

	p2 := countTotalIds(ranges)

	return p1, p2
}

type Range struct {
	Start, End int
}

func ranges(input string) []Range {
	lines := strings.Fields(input)
	var ranges []Range

	for _, line := range lines {
		parts := strings.Split(line, "-")
		if len(parts) != 2 {
			panic("bad range" + line)
		}
		start, err := strconv.Atoi(parts[0])
		if err != nil {
			panic(err)
		}
		end, err := strconv.Atoi(parts[1])
		if err != nil {
			panic(err)
		}
		ranges = append(ranges, Range{Start: start, End: end})
	}
	return ranges
}

func countTotalIds(ranges []Range) int {
	/**
	Intuition:
		-consolidate overlapping ranges
		-add up max - min + 1 for each consolidated range
	*/

	sort.Slice(ranges, func(i, j int) bool {
		return ranges[i].Start < ranges[j].Start
	})

	consolidated := make([]Range, 0, len(ranges))
	consolidated = append(consolidated, ranges[0])

	for _, r := range ranges[1:] {
		last := &consolidated[len(consolidated)-1]
		if r.Start > last.End {
			consolidated = append(consolidated, r)
		} else {
			last.End = max(r.End, last.End)
		}
	}

	totalIds := 0
	for _, r := range consolidated {
		totalIds += r.End - r.Start + 1
	}

	return totalIds
}

func init() {
	Register(5, SolveD5)
}
