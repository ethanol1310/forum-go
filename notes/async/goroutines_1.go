package main

import (
	"fmt"
	"runtime"
	"strings"
)

const (
	iterationsNum = 5
	goroutinesNum = 5
)

func doSomework(in int) {
	for j := 0; j < iterationsNum; j++ {
		fmt.Printf(formatWork(in, j))
		runtime.Gosched()
	}
}

func formatWork(in, j int) string {
	return fmt.Sprintln(strings.Repeat("  ", in), "█",
		strings.Repeat("  ", goroutinesNum-in),
		"th", in,
		"iter", j, strings.Repeat("■", j))
}

func main() {
	for i := 0; i < goroutinesNum; i++ {
		go doSomework(i)
	}
	fmt.Scanln()
}
