package solvers

func SolveD7(input string) (int, int) {
	p1 := 0
	p2 := 0

	grid, rows, _ := grid(input)

	start := -1
	for i, r := range grid[0] {
		if r == 'S' {
			start = i
		}
	}
	if start == -1 {
		panic("start not found")
	}

	beams := make([]map[int]struct{}, rows)
	for i := 0; i < rows; i++ {
		beams[i] = make(map[int]struct{})
	}

	beams[0][start] = struct{}{}

	for row := 1; row < rows; row++ {
		for beam := range beams[row-1] {
			if grid[row][beam] == '^' {
				p1++
				if beam > 0 {
					beams[row][beam-1] = struct{}{}
				}
				if beam+1 < len(grid[row]) {
					beams[row][beam+1] = struct{}{}
				}
			} else {
				beams[row][beam] = struct{}{}
			}
		}
	}

	return p1, p2
}

func init() {
	Register(7, SolveD7)
}
