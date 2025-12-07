package solvers

type Solver func(input string) int

var registry = map[int]Solver{}

func Register(day int, fn Solver) {
	registry[day] = fn
}

func Get(day int) (Solver, bool) {
	fn, ok := registry[day]
	return fn, ok
}
