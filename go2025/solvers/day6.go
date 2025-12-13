package solvers

import (
	"strconv"
	"strings"
)

type Problem struct {
	Operator string
	Operands []int
}

func (p Problem) Calculate() int {
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

	return val
}

func SolveD6(input string) (int, int) {
	p1 := 0
	p2 := 0

	lines := strings.Split(strings.TrimSpace(input), "\n")

	p1Problems := parseProblemsP1(lines)

	for _, problem := range p1Problems {
		p1 += problem.Calculate()
	}

	p2Problems := parseProblemsP2(lines)
	for _, problem := range p2Problems {
		p2 += problem.Calculate()
	}

	return p1, p2
}

func parseProblemsP1(lines []string) []Problem {
	problems := make([]Problem, len(strings.Fields(lines[0])))

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

	return problems
}

func parseProblemsP2(lines []string) []Problem {
	columns := linesToColumns(lines)
	var problems []Problem
	var current *Problem

	for _, column := range columns {
		cleaned := make([]rune, 0)
		for _, char := range column {
			if char != ' ' {
				cleaned = append(cleaned, char)
			}
		}

		if len(cleaned) == 0 {
			current = nil
			continue
		}

		if current == nil {
			problems = append(problems, Problem{})
			current = &problems[len(problems)-1]
		}

		scanColumn(current, cleaned)
	}

	return problems
}

func scanColumn(problem *Problem, column []rune) {
	n := 0
	for _, char := range column {
		if char == '*' || char == '+' {
			problem.Operator = string(char)
			break
		}
		val := int(char - '0')
		n = n*10 + val
	}

	problem.Operands = append(problem.Operands, n)
}

func linesToColumns(lines []string) [][]rune {
	for i, line := range lines {
		lines[i] = strings.TrimRight(line, " \r")
	}

	numColumns := len(lines[0])
	for _, line := range lines {
		if len(line) > numColumns {
			numColumns = len(line)
		}
	}

	columns := make([][]rune, numColumns)

	for _, line := range lines {
		chars := []rune(line)
		for i, char := range chars {
			columns[i] = append(columns[i], char)
		}
	}

	return columns
}

func init() {
	Register(6, SolveD6)
}
