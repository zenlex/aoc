package solvers

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func SolveD1(input string) (int, int) {
	_, debug := os.LookupEnv("DEBUG")
	current := 50
	zeros := 0

	instructions := strings.Split(input, "\n")

	for _, instruction := range instructions {
		instruction := []rune(instruction)
		if len(instruction) == 0 {
			continue
		}
		direction := string(instruction[0])
		amountStr := strings.TrimSpace(string(instruction[1:]))
		amount, _ := strconv.Atoi(amountStr)

		if debug {
			fmt.Printf("direction:%s amount:%v\n", direction, amount)
		}
		amount = amount % 100

		switch direction {
		case "L":
			current = current - amount
			if debug {
				fmt.Printf("instruction: %s, result:%d\n", string(instruction), current)
			}
		case "R":
			current = current + amount
			if debug {
				fmt.Printf("instruction: %s, result:%d\n", string(instruction), current)
			}
		}

		for current < 0 {
			current += 100
		}

		for current > 99 {
			current -= 100
		}

		if current == 0 {
			zeros++
		}
	}

	return zeros, 0
}

func init() {
	Register(1, SolveD1)
}
