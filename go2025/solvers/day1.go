package solvers

func solveD1() (int, error) {
	result := 42
	return result, nil
}

func init() {
	Register(1, solveD1)
}
