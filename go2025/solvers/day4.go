package solvers

import (
	"strings"
)

func SolveD4(input string) (int, int) {
	p1 := 0
	p2 := 0

	grid, rows, cols := grid(input)

	scores := scoreGrid(grid)
	isFirstPass := true
	rollsRemovedThisPass := 0
	for rollsRemovedThisPass > 0 || isFirstPass {
		rollsRemovedThisPass = 0
		for i := 0; i < rows; i++ {
			for j := 0; j < cols; j++ {
				score := scores[i][j]
				if score < 4 && score != -1 {
					if isFirstPass {
						p1++
					}
					p2++
					grid[i][j] = '.'
					rollsRemovedThisPass++
				}
			}
		}
		isFirstPass = false
		scores = scoreGrid(grid)
		//fmt.Printf("grid: %v \n---\n scores: %v\n", grid, rows)
	}

	return p1, p2
}

func scoreGrid(grid [][]rune) [][]int {
	rows := len(grid)
	cols := len(grid[0])
	scores := make([][]int, rows)
	for i := range scores {
		scores[i] = make([]int, cols)
	}
	for i := 0; i < rows; i++ {
		for j := 0; j < cols; j++ {
			scores[i][j] = countAccessibleRolls(grid, i, j)
		}
	}
	return scores
}

func countAccessibleRolls(grid [][]rune, row, col int) int {
	if grid[row][col] != '@' {
		return -1
	}

	directions := [][]int{
		{1, 0},
		{1, 1},
		{1, -1},
		{0, 1},
		{0, -1},
		{-1, 0},
		{-1, 1},
		{-1, -1},
	}

	rows := len(grid)
	cols := len(grid)

	count := 0
	for _, direction := range directions {
		target := []int{row + direction[0], col + direction[1]}
		if inBounds(target, rows, cols) {
			if grid[target[0]][target[1]] == '@' {
				count++
			}
		}
	}
	return count
}

func inBounds(target []int, rows int, cols int) bool {
	return target[0] < rows && target[1] < cols && target[0] >= 0 && target[1] >= 0
}

func grid(input string) ([][]rune, int, int) {
	lines := strings.FieldsFunc(input, func(r rune) bool { return r == '\n' || r == '\r' })
	grid := make([][]rune, len(lines))
	rows := len(lines)
	for i, line := range lines {
		grid[i] = make([]rune, len(line))
		for j, v := range line {
			grid[i][j] = v
		}
	}
	cols := len(grid[0])
	return grid, rows, cols
}

func init() {
	Register(4, SolveD4)
}
