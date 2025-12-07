package main

import (
	"fmt"
	"os"
)

func inputForDay(day int) string {
	path := fmt.Sprintf("inputs/day%02d.txt", day)
	data, err := os.ReadFile(path)
	if err != nil {
		panic(err)
	}

	return string(data)
}
