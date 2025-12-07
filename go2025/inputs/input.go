package inputs

import (
	"embed"
	"fmt"
)

//go:embed *.txt
var inputFs embed.FS

func InputForDay(day int) string {
	path := fmt.Sprintf("day%02d.txt", day)
	data, err := inputFs.ReadFile(path)
	if err != nil {
		panic(err)
	}

	return string(data)
}

func ExampleForDay(day int, example int) string {
	path := fmt.Sprintf("day%02d-ex%d.txt", day, example)
	data, err := inputFs.ReadFile(path)
	if err != nil {
		panic(err)
	}

	return string(data)
}
