package main

import (
	"fmt"
)

func main() {
	ch1 := make(chan int, 1)
	ch2 := make(chan int) // ch2 := make(chan int, 1)
	// ch1 <- 1 -- write to ch1
	select {
	case val := <-ch1: // -- read from ch1
		fmt.Println("ch1 val", val)
	case ch2 <- 1: // -- write to ch2
		fmt.Println("put val to ch2")
		// default:
		// 	fmt.Println("default case")
	}
}
