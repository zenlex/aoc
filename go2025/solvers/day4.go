package solvers

import (
	"strings"
)

var directions = [8]struct{ dRow, dCol int }{
	{1, 0},
	{1, 1},
	{1, -1},
	{0, 1},
	{0, -1},
	{-1, 0},
	{-1, 1},
	{-1, -1},
}

func SolveD4(input string) (int, int) {
	p1 := 0
	p2 := 0

	grid, rows, cols := grid(input)

	scores := scoreGrid(grid, rows, cols)
	isFirstPass := true
	rollsRemovedThisPass := 0
	for {
		rollsRemovedThisPass = 0
		for i := 0; i < rows; i++ {
			for j := 0; j < cols; j++ {
				score := scores[i][j]
				if score >= 4 || score == -1 {
					continue
				}
				if isFirstPass {
					p1++
				}
				p2++
				grid[i][j] = '.'
				rollsRemovedThisPass++
			}
		}
		if isFirstPass {
			isFirstPass = false
		}
		if rollsRemovedThisPass == 0 {
			break
		}
		scores = scoreGrid(grid, rows, cols)
	}

	return p1, p2
}

func scoreGrid(grid [][]rune, rows, cols int) [][]int {
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

	rows := len(grid)
	cols := len(grid[0])

	count := 0
	for _, d := range directions {
		nr, nc := row+d.dRow, col+d.dCol
		if inBounds(nr, nc, rows, cols) && grid[nr][nc] == '@' {
			count++
		}
	}
	return count
}

func inBounds(r, c, rows int, cols int) bool {
	return r < rows && c < cols && r >= 0 && c >= 0
}

func grid(input string) ([][]rune, int, int) {
	lines := strings.FieldsFunc(input, func(r rune) bool { return r == '\n' || r == '\r' })
	if len(lines) == 0 {
		return nil, 0, 0
	}

	grid := make([][]rune, len(lines))
	rows := len(lines)
	for i, line := range lines {
		grid[i] = []rune(line)
	}
	cols := len(grid[0])
	return grid, rows, cols
}

func init() {
	Register(4, SolveD4)
}
