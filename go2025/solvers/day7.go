package solvers

func SolveD7(input string) (int, int) {
	p1 := 0
	p2 := 0

	grid, rows, cols := grid(input)

	start := -1
	for i, r := range grid[0] {
		if r == 'S' {
			start = i
		}
	}
	if start == -1 {
		panic("start not found")
	}

	paths := make([][]int, rows)
	for i := 0; i < rows; i++ {
		paths[i] = make([]int, cols)
	}
	paths[0][start] = 1

	for row := 1; row < rows; row++ {
		for col := range cols {
			if paths[row-1][col] == 0 {
				continue
			}
			if grid[row][col] == '^' {
				p1++
				if col > 0 {
					paths[row][col-1] += paths[row-1][col]
				}
				if col+1 < cols {
					paths[row][col+1] += paths[row-1][col]
				}
			} else {
				paths[row][col] += paths[row-1][col]
			}
		}
	}

	for col := range cols {
		p2 += paths[rows-1][col]
	}

	return p1, p2
}

func init() {
	Register(7, SolveD7)
}
