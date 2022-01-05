package main

import "fmt"

func main() {
	ch := make(chan int, 1)
	ch <- 1
	ch <- 2
	fmt.Println("Received:", <-ch)
	fmt.Println("Received:", <-ch)
}
