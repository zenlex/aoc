package solvers

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func floorDiv(x int, y int) int {
	q := x / y
	if x < 0 && x%y != 0 {
		q--
	}
	return q
}
