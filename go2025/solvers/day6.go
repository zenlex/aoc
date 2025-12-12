package solvers

import (
	"fmt"
	"strconv"
	"strings"
)

type Problem struct {
	Operator string
	Operands []int
}

func (p Problem) Calculate() int {
	fmt.Printf("Calculating %v for %+v operands...\n", p.Operator, p.Operands)
	val := 0
	if p.Operator == "*" {
		val = 1
	}

	for _, n := range p.Operands {
		if p.Operator == "*" {
			val *= n
		} else {
			val += n
		}
	}

	fmt.Println(val)
	return val
}

func SolveD6(input string) (int, int) {
	p1 := 0
	p2 := 0

	lines := strings.Split(strings.TrimSpace(input), "\n")

	p1Problems := parseProblemsP1(lines)
	fmt.Printf("P1 Problems :%v\n", p1Problems)

	for _, problem := range p1Problems {
		p1 += problem.Calculate()
	}

	return p1, p2
}

func parseProblemsP1(lines []string) []Problem {
	problems := make([]Problem, len(strings.Fields(lines[0])))
	fmt.Println("Filling problems")

	for _, line := range lines {
		values := strings.Fields(line)
		for i, v := range values {
			problem := &problems[i]
			if v == "*" || v == "+" {
				problem.Operator = v
			} else {
				n, _ := strconv.Atoi(v)
				problem.Operands = append(problem.Operands, n)
			}

		}
	}
}

func init() {
	Register(6, SolveD6)
}
