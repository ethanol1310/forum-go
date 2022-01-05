# Setup Environment

## Windows

### Setup WSL

- `explorer.exe .`

### Install terminus

### Install Go in WSL

**Install from Ubuntu Repository**

```
sudo apt update
sudo apt install golang-go
```

**Install a Binary Release**

```
wget https://dl.google.com/go/go1.15.3.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.15.3.linux-amd64.tar.gz
```

[Installation guide](https://golang.org/doc/install)

`~/.bash_profile`

```
export GOPATH="$HOME/Go" # or any directory to put your Go code
export PATH="$PATH:/usr/local/go/bin:$GOPATH/bin"
```

### Configure VS Code

**Install Remote - WSL**

**Enter Remote Dev Environment**

**Setup the Go Extension**

- Change `settings.json` in settings VS Code
- GOPATH and GOROOT

```
{
    "terminal.integrated.shell.linux": "/usr/bin/zsh",
    "go.gopath": "/home/ethanol1310/Coding/Go",
    "go.goroot": "/usr/local/go",
    "go.formatTool": "goformat",
    "go.autocompleteUnimportedPackages": true,
    "[go]": {
        "editor.formatOnSave": true,
        "editor.codeActionsOnSave": {
            "source.organizeImports": true
        }
    }
}
```



## Ubuntu

### Install Go

```
sudo apt-get update
sudo apt-get -y upgrade
```



```
wget https://dl.google.com/go/go1.16.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.16.linux-amd64.tar.gz
```

### Set up environment

`~/.bash_profile` - `~/.profile` 

```
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH
```

### Update current shell session

```
source ~/.profile
go version
```




## Mac OS

# Workspace and Package

Workspaces:

- Hierarchy of directories
- Common organization is good for sharing
- Three subdirectories:
  - src - contains source code files
  - pkg - contains packages (libraries)
  - bin - contains executables
- One workspace for many projects
- Workspace directory defined by GOPATH environment variable
  - C:\Users\yourname\go

Package:

- Group of related source files
- Each package can be imported by other packages
- Enables software reuse
- There must be one package called main
- Building the main package generated an executable program
- Main package needs a main() function
- main() is where code execution starts



# Basics

## Hello World

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello World")
}
```

- Run: `go run helloworld.go`
- Format: `gofwt -w helloworld.go`

## Variable 

### Number

```go
var num0 int // default value
var num1 int = 1 // initialization value
var num2 = 2 // type skip
num := 30 // short variable declaration, only new variables

var weight, height int = 10, 20 // variable declaration
weight, height = 11, 21
weight, age := 12, 22 // at least one variable is new
```



```go
var i int = 10 // 32/64 platform dependent type
var autoInt = -10 // auto selected int
// int8, int16, int32, int64
var bigInt int64 = 1<<32 - 1

// platform dependent type
var unsignedInt uint = 100500

// uint8, uint16, uint32, uint64
var unsignedBigInt uint64 = 1<<64 - 1

// float32, float64
var pi float32 = 3.141
var e = 2.718
goldenRatio := 1.618

// bool
var b bool // false default
var isOk bool = true
var success = true
cond := true

// complex64, complex128
var c complex128 = -1.1 + 7.12i
c2 := -1.1 + 7.12i
```

### String

**string is immutable**, that is you cannot modify the content of a text again after creating a text; more deeply, a string is a fixed-length array of bytes.

1. Explanatory string: quotes. The relevant escape characters will be replaced.
2. Native string: **backquotes** (note: not single quotation marks) and supports line breaks.



```go
var str string
var hello string = "Xin chào\n\t"
var world string = "The gioi\n\t"

var helloWorld = "Xin chào thế giới\n\t"
hi := "你好，世界"

// Single quote for byte
var rawBinary byte = '\x27'

// rune (uint32) for UTF-8 character
var someChinese rune = '茶'

// concatenation
helloWorld = "Xin chào"
andGoodMorning = helloWorld + " buổi sáng!"

// string is immutable
// cannot assign to helloWorld[0]
// get strings length
byteLen := len(helloWorld)
symbols := utf8.RuneCountInString(helloWorld)

// get substring in bytes, not character
hello = helloWorld[:12]
H := helloWorld[0]

// convert to slice byte and back
byteString := []byte(helloWorld)
helloWorld = string(byteString)
```

### Const

```go
const pi = 3.131

const (
	hello = "Xin chào"
  e = 2.718
)

const (
	zero = iota
  _ // empty variable, skip iota
  two // 2
  three // 3
)

const (
	_ = iota // skip the first value
  KB uint64 = 1 << (10 * iota) // 1 << (10 * 1)
  MB	// 1 << (10 * 2)
)

const (
	year = 2017
  yearTyped int = 2017
)

func main() {
  var month int16 = 13
  fmt.Println(month + year)
  
  // month + yearTyped (mismatched types int32 and int)
}
```

### Pointers

```go
package main

import "fmt"

func main() {
  a := 2
  b := &a
  *b = 3
  c := &a
  
  d := new(int)
  *d = 12
  *c = *d 
  *d = 13
  
  c = d
  *c = 14
}
```

```go
package main

import (
  "fmt"
  "strings"
)

type Person struct {
  firstName string
  lastName string
}

func upPerson (p *Person) {
  p.firstName = strings.ToUpper(p.firstName)
  p.lastName = strings.ToUpper(p.lastName)
}

func main() {
  // 1-struct as a value type
  var pers1 Person
  pers1.firstName = "Chris"
  pers1.lastName = "WoodWard"
  upPerson(&pers1)
  
  // 2-struct as a pointer
  pers2 := new(Person)
  pers2.firstName = "Chris"
  pers2.lastName = "WoordWard"
  (*pers2).lastName = "Woodward"
  upPerson(pers2)
  
  // 3-struct as a literal
  pers3 := &Person{"Chris", "WoodWard"}
  upPerson(pers3)
}
```



## Array

```go
var a1 [3]int // [0, 0, 0]

const size = 2
var a2 [2 * size]bool

// size determination when declaring
// In an array literal, if an ellipsis ‘‘...’’ appears in place of the length, the array length is determined by the number of initializers. The definition of q can be simplified to
q := [...]int{1, 2, 3}
fmt.Printf("%T\n", q) // "[3]int"
a3 := [...]int{1, 2, 3}
```

```go
q:= [...] int{99:-1} // 100 elements, last is -1, remain is 0
```

```go
package main

import "fmt"

func main() {
  myArray := [3][4]int{{1,2,3,4}, {1,2,3,4}, {4,5,6,7}}
  
  fmt.Println(len(myArray))
  fmt.Println(len(myArray[1]))
  fmt.Println(myArray)
}
```



## Slice

It looks like an array type without a size.

A slice has three components: a pointer, a length, and a capacity.

```go
var buf0 []int
buf1 := []int{}
buf2 := []int{42}
buf3 := make([]int, 0)
buf4 := make([]int, 5)
buf5 := make([]int, 5, 10)

var buf []int // len=0, cap=0
println(buf) // [0/0]0x0
buf = append(buf, 9, 10) // len=2, cap=2
println(buf) // [2/2]0xc0000140b0
buf = append(buf, 12) // len=3, cap=4
println(buf) // [3/4]0xc00001c100

otherBuf := make([]int, 3)     // [0,0,0]
buf = append(buf, otherBuf...) // len=6, cap=8
```



```go
package main

import "fmt"

func main() {
  buf := []int{1, 2, 3, 4, 5}
  
  // same memory 
  sl1 := buf[1:4]
  sl2 := buf[:2]
  sl3 := buf[2:]
  
  newBuf := buf[:]
  newBuf[0] = 9 // buf = [9, 2, 3, 4, 5] same memory
  
  // newBuf points to other memory
  newBuf = append(newBuf, 6)
  
  // buf = [9, 2, 3, 4, 5] did not change
  // newBuf = [1, 2, 3, 4, 5, 6] changed
  newBuf[0] = 1
  fmt.Println("buf", buf)
  fmt.Println("newBuf", newBuf)
  
  // copy slice - wrong len
  var emptyBuf []int
  copied := copy(emptyBuf, buf) // copied = 0
  
  // correctly
  copiedBuf := make([]int, len(buf), len(buf))
  copy(copiedBuf, buf)
  
  ints := []int{1, 2, 3, 4}
  copy(ints[1:3], []int{5, 6}) // ints = [1, 5, 6, 4]
}
```

## Map

A map is a reference to a hash table, and a map type is written map[K]V.

- K type of key
- V type of value

```go
var user map[string]string = map[string]string {
  "name": "Vasily",
  "lastName": "Romanov",
}

// Immediately with the desired capacity
profile := make(map[string][string], 10)

// amount of elements
mapLength := len(user)

fmt.Println("%d %v+\n", mapLength, profile)

// Check key
_, mNameExist := user["middleName"]
fmt.Println("mNameExist", mNameExist)

// remove key
delete(user, "lastName")
fmt.Printf("%#v\n", user)
```

## Summary data types

1. Bool: a byte - true or false
2. int/uint (signed and unsigned): 32-bit or 64-bit depending on the platform.
3. intx/uintx: x represents any number of digits, for example int3 - int type 3 bits
4. Byte: 8 bit, one byte, equivalent to uint8, without sign bit.
5. floatx: float32 decimal is accurate to 7 digits
6. float64: double - accurate to 15 digits.
7. complex64/128: complex type
8. uintptr: the type to save the pointer also changes with the platform, because the length of the pointer changes with the platform.
9. Other types of values: array, struct, string
10. Reference type: slice, map, channel - And it can be rebuilt and copied to another place, or something else can happen to it -> race condition.
11. Interface type: interface
12. Function type: func

# Control

```go
package main

import "fmt"

func main() {
  boolVal := true
  if boolVal {
    fmt.Println("boolVal is true")
  }
  
  // map
  mapVal := map[string][string]("name": "rvasily")
  if keyValue, keyExist := mapVal["name"]; keyExist {
    fmt.Println("name=", keyValue)
  }
  
  if _, keyExist := mapVal["name"]; keyExist {
    fmt.Println("key 'name' exist")
  }
  
  // multiple else
  cond := 1
  if cond == 1 {
    fmt.Println("cond is 1")
  } else if cond == 2 {
    fmt.Println("cond is 2 ")
  }
  
  // switch no 1 variable 
  var val1, val2 = 2, 2
  switch {
    case val1 > 1 || val < l1:
    	fmt.Println("first block")
  	case val2 > 10:
    	fmt.Println("second block")
  }
}
```

# Loop

```go
// while(true) OR for(;;;)
for {
  fmt.Println("loop iteration")
  break
}

// loop with condition - while(isRun)
isRun := true
for isRun {
  fmt.Println("loop iteration with condition")
  isRun = false
}

// condition and initialization
for i := 0, i < 2; i++ {
  fmt.Println("loop iteration"m i)
  if i == 1 {
    continue
  }
}

// slice operation
sl := []int{1, 2, 3}
idx := 0
for idx < len(sl) {
  fmt.Println("while-style loop, idx:", idx, "value", sl[idx])
  idx++
}

for i := 0; i < len(sl); i++ {
  fmt.Println("c-style loop", i, sl[i])
}
for idx := range sl {
  fmt.Println("range slice by index", sl[idx])
}
for idx, val := range sl {
  fmt.Println("range slice by idx-value", idx, val)
}

// map operation
profile := map[int]string{1: "Vasily", 2: "Romanov"}

for key := range profile {
  fmt.Println("range map by key", key)
}

for key, val := range profile {
  fmt.Println("range map by key-val", key, val)
}

for _, val := range profile {
  fmt.Println("range map by val", val)
}

str := "Xin chào!"
for pos, char := range str {
  fmt.Printf("%#U at pos %d\n", char, pos)
}

// loop with condition and initialization block
for i := 0; i < 2; i++ {
  fmt.Println("loop iteration", i)
  if i == 1 {
    continue
  }
}
```

# Function

## Functions

### Indefinite params

```go
func f(args ...Type) (int, int, int) {
	// do 
}
```



### Single

``` go
// Single parameter
func singleIn(in int) int {
	return in
}

// multiple parameter
func multIn(a, b int, c int) int {
  return a + b + c
}

// param for return
func namedReturn() (out int) {
    out = 2
    return
}

// not a fixed number of parameters
func sum(in ...int) (result int) {
    fmt.Printf("in := %#v\n", in)
    for _,val := range in {
        result += val
    }
    return
}
```

### Multiple

```go
func multipleReturn(in int) (int, error) {
    if in > 2 {
        return 0, fmt.Errorf("some error happened")
    }
    return in, nil
}

func multipleNamedReturn(ok bool) (rez int, err error) {
    rez = 1
    if ok {
        err = fmt.Errorf("some error happened")
        // return 3, fmt.Error("some error happened")
        return
    }
    rez = 2
    return
}
```

## Callback

A callback is executable code that is passed as an argument to other code.

```go
func (in string) {
    fmt.Println("anon func out:", in)
}("nobody")

// assign an anonymouse function to a variable and in
printer := func(in string) {
    fmt.Println("printer outs:", in)
}

// define the function type
type strFuncType func(string)

worker := func(callback strFuncType) {
    callback("as callback")
}
worker(printer)
```

## Function returns closure

A closure is a function that is evaluated in an environment containing one or more bound variables. When called, the function can access these variables.

```go
prefixer := func(prefix string) strFuncType {
    return func(in string) {
        fmt.Printf("[%s] %s\n", prefix, in)
    }
}
successLogger := prefixer("SUCCESS")
successLogger("expected behaviour")
```

## Defer

- There will be some work executed after the function ends. 
- Count for example function or close some resource E.g: network connection, file descriptor
- Arguments of deferred functions are evaluated when the defer block is declared, not when the function is called.
- Defer -> stack - FILO

```go
package main

import "fmt"

func getSomeVars() string {
	fmt.Println("getSomeVars execution")
	return "getSomeVars result"
}

func main() {
	defer fmt.Println("After work")
	/*
		defer func() {
			fmt.Println(getSomeVars())
		}()
	*/
	defer fmt.Println(getSomeVars())
	fmt.Println("Some userful work")
}
// Some userful work
// getSomeVars execution
// getSomeVars result
// After work
```

- Output

```bash
ethanol1310@DESKTOP-ASTNVIL:~/Go/src/golearn/functions$ go run defer.go
Some userful work
getSomeVars execution
getSomeVars result
After work
```

## Panic

- Panic is a service function which stops the execution of the program, that is, the entire program crashes.
- Never use panic and panic recovery as an emulation of a try-catch block.

We have a recover function which returns us the result, the error thrown by the panic - **bad practice**.

# Structure and methods

## Structure

```go
type Person struct {
  Id	int
  Name	string
  Address	string
}

type Account struct {
  Id	int
  Cleaner func(string)	string
  Owner	Person
  Person
}
```

## Methods

The method of the Go language is actually `(receiver)` a function that acts on the receiver, and the receiver is a variable of some **non-built-in type** - special type of function.

The receiver type may be any type, not only the type of structure. The method can have any type, or even a function of the type, maybe `int, bool, string`. **But the receiver cannot be an interface type.**

### Functional relationship

The function takes a variable as a parameter: **Function1(recv)** 

Method is called on the variable: **recv.Method1()**

Receiver must have an explicit name, and this name must be used in the method. Receiver_type is called the receiver basic type, and this type must be declared in the same package as the method.

Go lang does not allow adding methods to simple built-in types, so the methods defined below are illegal.

```go
func (a int) Add (b int) { // Illegal
	fmt.Print(a + b)
}

// Legal
type myInt int

func Add(a, b int) {
  fmt.Print(a + b)
}

func (a myInt) Add (b myInt) {
  fmt.Print(a + b)
}
```



```go
func (p *Person) SetName(name string) {
  p.Name = name
}

type MySlice []int

func (sl *MySlice) Add(val int) {
  *sl = append(*sl, val)
}

func (sl *MySlice) Count() int {
  return len(*sl)
}
```

# Interfaces

In the actual programming of the Go language, almost all data structures are developed around the interface, which is the core of all data structures in the Go language.

The interface in Go language is a collection of methods (method set), which specifies the behavior of the object: **if any data type can do these things, then it can be used here**. To see whether a type implements an interface, it depends on wheter this type implements all the methods defined in ther interface.

An interface type specifies a set of methods that a concrete type must possess to be considered an instance of that interface.

- Polymorphism: dynamically binding
- Only call methods of the interface. Need to convert to use.

```go
// Declare interface
type interface_name interface {
  method_name1 [return_type]
  method_name2 [return_type]
}

// Struct
type struct_name struct {
  // variables
}

// Method
func (struct_name_variable struct_name) method_name1() [return_type] {
  // do
}
...
```



```go
package main

import (
	"fmt"
)

type Payer interface {
  Pay(int) error
}

// Wallet
type Wallet struct {
  Cash int
}

func (w *Wallet) Pay(amount int) error {
  if w.Cash < amount {
    return fmt.Errorf("Not enought")
  }
  w.Cash -= amount
  return nil
}

// Apple pay
// Google pay

func Buy(p Payer) {
  err := p.Pay(10)
  if err != nil {
    panic(err)
  }
  fmt.Println("Success.")
}

func main() {
  myWallet := &Wallet(Cash: 100)
  Buy(myWallet)
}
```



## Interface value

Interfaces can have value in Go

```go
type Namer interface {
  Method1(param list) return_type
}

var ai Namer // ai = nil is the zero value state of the interface.
```

1. Assign the object instance to the interface
2. Assign one interface to another interface

## Empty interface

Typically, if you see a function or a method that expects an empty interface, then you can typically pass anything into this function/method.

By defining a function that takes in an `interface{}`, we essentially give ourselves the flexibility to pass in anything we want. It’s a Go programmers way of saying, this function takes in something, but I don’t necessarily care about its type.

Empty interfaces are a very useful thing when we you need to make completely generic functions that work with anything.

```go
package main

import "fmt"

func main() {
  slice := make([]interface{}, 10)
  map1 := make(map[string]string)
  map2 := make(map[string]int)
  map2["TaskID"] = 1
  map1["Command"] = "ping"
  map3 := make(map[string]map[string]string)
  map3["mapvalue"] = map1
  slice[0] = map1
  slice[1] = map2
  slice[2] = map3
}
```



```go
func Buy(in interface{}) {
  var p Payer
  var ok bool
  if p, ok = in.(Payer); !ok {
    return
  }
}
```

## Embed interface

```go
type Payer interface {
  Pay(int) error
}

type Ringer interface {
  Ring(string) error
}

type NFCPhone interface {
  Payer 
  Ringer
}
```

# Concurrent programming

An application is a process running on a machine, a process is an independent execution body running in its own memory address space.

A process consists of one or more operating system threads.

**These threads** are actually execution bodies that share the same memory address space and work together.

A concurrent program can use multiple threads to exectute tasks on a processor or core, but only tasks that are exectuted simultaneously on multiple processing cores or processors in the same program at a certain poin in time are truly parallel.

Parallelism is the ability to increase speed by using multiple processors. So concurrent programs can be parallel or not.

```go
package main

import "fmt"

func loop() {
  for i := 0; i < 10; i++ {
    fmt.Printf("%d", i)
  }
}

func main() {
  go loop()
  loop()
}
```

```
0 1 2 3 4 5 6 7 8 9
```

The main function had already exited.

## Unbuffered channel

How to make goroutine tell the main thread that I have finished executing? Use a channel to tell the main thread.

The unbuffered channel will suspend the current goroutine when fetching and storing messages. unless the other end is ready. If the channel is not used to block the main thread, the main thread will run out prematurely, and the loop thread will not have a chance to execute.

What needs to be emphasized in this level is that an unbuffered channel will never store data, and is only responsible for the circulation of data. Reflected in:

1. To fetch data from an unbffered channel, there must be a data stream coming in, otherwise the current line is blocked.
2. Data flows into the unbuffered channel, if there is no other goroutine to take this data, then the current line is blocked.

## Actor model vs CSP model

| Actor Model                                                  | CSP Model                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Communicate directly                                         | Communicate through Channel                                  |
| The autonomy and controllability are better.<br />Actor model can choose which incoming message to process according to its own state. | Loosly coupled through Channel. <br />The sender does not know which receiver consumes the messege.<br /> The receiver does not know which sender sent the message. |
| Actor theoretically needs an unlimited size mailbox as a message buffer. | **In order not to block the process** in Go. The programmer must **check different incoming messages** to **foresee and ensure the correct order**.<br />CSP - Channel does not need to buffer messages. |
| Sending and receiving of the message does not need to be carried out at the same time. | The message sender of the CSP model can only send a message when the receiver is ready to receive the message. |
| Sender can send the message before the receiver is ready to receive. | Only send a message when the receiver is ready.              |



# Goroutines

## Go schedules

```go
package main

import (
	"fmt"
  "runtime"
  "strings"
  "time"
)

const (
	iterationsNum = 7
  goroutinesNum = 5
)

func doSomework(int int) {
  for j := 0; j < iterationsNum; j++ {
    fmt.Printf(formatWork(int, j))
    runtime.Gosched()
  }
}

func formatWork(in, j int) string {
  return fmt.Sprintln(strings.Repeat(" ", in), "█",
         strings.Repeat(" ", goroutinesNum - in)),
  "th", in, "iter", j, strings.Repeat("■", j))
}

func main() {
  for i := 0; i < goroutinesNum; i++ {
    go doSomework(i)
  }
  fmt.Scanln()
}
```

## Channel

`out chan int`: read and write to the channel.

`out chan<- int`: only write/send to the channel.

`out <-chan int`: only read/receive from the channel.

```go
ch := make(chan bool) // Create unbuffered channel
ch <- x // a send statement -- write
x = <-ch // a receive expression in an assignment statement -- read
<-ch // a receive statement; result is discarded
x, ok = <-ch

make(chan int, 100) // Create buffered channel
```



```go
func main() {
  ch1 := make(chan int, 0)
  
  go func(in chan int) {
    val := <- in
    fmt.Println("GO: get from chan", val)
    fmt.Println("GO: after read from chan")
  }(ch1)
  
  ch1 <- 42
  // ch1 <- 100500 DEADLOCK
  fmt.Println("MAIN: after put to chan")
}
```



```go
go func(out chan <- int) {
  for i := 0; i <= 4; i++ {
    fmt.Println("before", i)
    out <- i
    fmt.Println("after", i)
  }
  close(out) // DEADLOCK 
  fmt.Println("generator finish")
}
```

### Channel buffer introduction



```go
package main

import "fmt"

func main() {
  messages := make(chan string)
  
  go func() { message <- "ping "}()
  
  msg := <-message
  fmt.Println(msg)
}
```

Channel: transfer the "ping" message from a goroutine to the main goroutine, and realize the communication between threads (to be precise, between goroutines). 

## Deadlock and memory leak

**Deadlock:** When you trying to read or write data from the channel but the channel does not have value. So, it blocks the current execution of the goroutine and passes the control to other goroutines, but if there is no other goroutine is available or other goroutines are sleeping due to this situation program will crash. This phenomenon is known as deadlock.

**Memory leak:** Deadlock + other goroutine continue to work.

## Select

- Poll channel: we can't do it sequentially or at least in a loop, because then they will be blocked, if not already.

```go
func main() {
  ch1 := make(chan int, 1)
  ch2 := make(chan int)
  // ch1 <- 1
  select {
  case val := <- ch1:
    fmt.Println("ch1 val", val)
  case ch2 <- 1:
    fmt.Println("put val to ch2")
  default: // all channel are blocked
    fmt.Println("default case")
  }
  // in := <-ch2
}
```

**Deadlock if no default case:**

- channel ch1 does not have value.
- channel ch2 - main goroutine send data, but no other goroutine receive data.

**Loop**: only one operation is performed inside select at a time.

```go
func main() {
  ch1 := make(chan int, 2)
  ch1 <- 1
  ch1 <- 2
  ch2 := make(chan int, 2)
  ch2 <- 3
  
  LOOP:
  for {
    select {
    case v1:= <-ch1:
      fmt.Println("ch1 val", ch1)
    case v2:= <-ch2:
      fmt.Println("ch2 val", ch2)
    default:
      break LOOP
    }
  }
}
```



**Cancel channel**: Within one select, we can not only read from different channels, but also write. And this opens up the possibility for us to complete some external channels, external functions, using the so-called cancellation channel.

```go
package main

import (
	"fmt"
)

func main() {
  cancelCh := make(chan struct{})
  dataCh := make(chan int)
  
  go func(cancelCh chan struct{}, dataCh chan int) {
    val := 0
    for {
      select {
      case <-cancelCh:
        return
      case dataCh <- val:
        val++
      }
    }
  }(cancelCh, dataCh)
  
  for curVal := range dataCh {
    fmt.Println("read", curVal)
    if curVal > 3 {
      fmt.Println("send cancel")
      cancelCh <- struct{}{}
      break
    }
  }
}
```

# Tools for multiprocessor programming

### Timeout (timer)

**Sometimes we need to wait for a fixed amount of time to complete an operation, for example,a user can wait a few seconds while we count something, indefinitely.** 

A timer is a single event in the future. A timer can make the process wait a sepecified time.. When creating the timer, you set the time to wait.

To make a timer expire after 3 seconds, you can use `time.NewTimer(3 * time.Second)`. If you only want to wait, use `time.Sleep(3)` instead.

If you want to repeat an event, use `tickers`.

```go
package main

import (
	"fmt"
  "time"
)

func longSQLQuery() chan bool {
  ch := make(chan bool, 1)
  go func() {
    time.Sleep(2 * time.Second)
    ch <- true
  }()
  return ch
}

func main() {
  timer := time.NewTimer(1 * time.Second) // send to channel time 1 * time.Second
  select {
  case <-timer.C:
    fmt.Println("timer.C timeout happend")
  case <-time.After(time.Minute):
    fmt.Println("time.After timeout happend")
  case result := <-longSQLQuery():
    if !timer.Stop() {
      <-timer.C
    }
    fmt.Println("operation result:", result)
  }
}
```

**Syntax:** `time.NewTimer(time.Second)`

One reason a timer may be useful is that you can cancel the timer before it fires. The timer has a channel, and if we use the select multiplexer, we can put a case to read from that channel, and as soon as the right time comes, an event will appear and it will work.

- The line `<-timer.C` blocks the timers channel `C`. It unblocks when the timer has expired.
- The line `<-time.After(time.Minute)` wait for 1 minute and then sends the current time on the returned channel.
- The line `!timer.Stop()` stop timer.

### Repeat (ticker)

#### NewTicker

Now let's look at how to work with periodic events, that is, recurring events witha certain intershaft while you are doing something at that time.

`ticker.Stop(): must be stopped, otherwise it will flow`

It should be used when youdefinitely do not plan to stop it. For example, to collect some monitoring from your program, which starts, for example, every minute, collects metrics and sends them somewhere.

```go
package main

import (
	"fmt"
  "time"
)

func main() {
  ticker := time.NewTicker(time.Second)
  i := 0
  for tickTime := range ticker.C {
    i++
    fmt.Println("step", i, "time", tickTime)
    if i >= 5 {
      // must be stopped, otherwise it will flow
      ticker.Stop()
      break
    }
  }
}
```

#### Tick (short alias)

- Cannot be stopped or collected by the garbage collector
- Use if should work forever

```go
c := time.Tick(time.Second)
i = 0
for tickTime := range c {
  i++
  fmt.Println("step", i, "time", tickTime)
  if i >= 5 {
    break
  }
}
```

### AfterFunc

`time.AfterFunc` waits for a specified duration and then calls the function in its goroutine.

If you run this code, you will see that we first wait five seconds, then the function works and displays a greeting. But in the same example, you can very quickly interrupt the function by pressing any key while waiting, since the timer will be called. Stop. As a result, the function will never be called.

```go
func sayHello() {
  fmt.Println("Hello")
}

func main() {
  timer := timer.AfterFunc(1 * timer.Second, sayHello)
  
  fmt.Scanln()
  timer.Stop()
  fmt.Scanln()
}
```

### Context package

Context is very widely used in Go. you'll encounter it almost everywhere, and one of its main purposes is to cancel asynchronous operations.

`ctx.Done()`, in which something appeared after the launch of the finish function, then we will finish the work.

- Create the context, context which has just an undo function.
- Context is always passed **into the first parameter** in almost all functions

```go
func worker(ctx context.Context, workerNum int, out chan<- int) {
  waitTime := time.Duration(rand.Intn(100) + 10) * time.Milisecond
  fmt.Println(workerNum, "sleep", waitTime)
  select {
    case <-ctx.Done();
    	return
  case <-time.After(waitTime):
    fmt.Println("worker", workerNum, "done")
    out <- workerNum
  }
}

func main() {
  ctx, finish := context.WithCancel(context.Background())
  result := make(chan int, 1)
  
  for i := 0; i<=10; i++ {
    go worker(ctx, i, result)
  }
  
  foundBy := <-result
  fmt.Println("result found by", foundBy)
  finish()
  time.Sleep(time.Second)
}
```



```go
func worker(ctx context.Context, workerNum int, out chan<- int) {
  waitTime := time.Duration(rand.Intn(100) + 10) * time.Milisecond
  fmt.Println(workerNum, "sleep", waitTime)
  select {
    case <-ctx.Done();
    	return
  case <-time.After(waitTime):
    fmt.Println("worker", workerNum, "done")
    out <- workerNum
  }
}

func main() {
  workTime := 50 * time.Milisecond
  ctx, _ = context.WithTimeout(context.Background(), workTime)
  // ctx, finish := context.WithCancel(context.Background())
  result := make(chan int, 1)
  
  for i := 0; i<=10; i++ {
    go worker(ctx, i, result)
  }
  totalFound := 0
  
  LOOP:
  for {
    select {
      case <-ctx.Done():
      break LOOP
    case foundBy := <- result:
      totalFound++
      fmt.Println("result found by", foundBy)
    }
  }
  fmt.Println("totalFound", totalFound)
  time.Sleep(time.Second)
}
```

# Parallelization

## Receiving data asynchronously

```go
package main

import (
	"fmt"
  "time"
)

func getComments() chan string {
  result := make(chan string, 1)
  go func(out chan<- string) {
    time.Sleep(2 * time.Second)
    fmt.Println("async operation ready")
    out <- "32 comments"
  }
  return result
}

func getPage() {
  resultCh := getComments()
  time.Sleep(1 * time.Second)
  fmt.Println("get rekated articles")
  
  commentsData := <-resultCh
  fmt.Println("main goroutines", commentsData)
}

func main() {
  for i:=0; i<3; i++ {
    getPage()
  }
}
```

## Pool of workers

Memory leak or deadlock if you do not suddenly close the channel.

```go
func startWorker(workerNum int, in <-chan string) {
  for input := range in {
    fmt.Printf(formatWork(workerNum, input))
    runtime.Gosched()
  }
}

func main() {
  runtime.GOMAXPROCS(0)
  workerInput := make(chan string, 2)
  for i := 0; i < goroutinesNum; i++ {
    go startWorker(i, workerInput)
  }
  
  months := []string{"1", "2"}
  
  for _, monthName := range months {
    workerInput <- monthName
  }
  
  close(workerInput)
  time.Sleep(time.Milisecond)
}
```

## sync.Waitgroup - waiting for shutdown

```go
package main

import (
	"fmt"
  "runtime"
  "strings"
  "sync"
  "time"
)

const (
	iterationsNum = 7
	goroutinesNum = 5
)

func startWorker(in int, wg *sync.WaitGroup()) {
  defer wg.Done()
  for j := 0; j < iterationsNum; j++ {
    fmt.Printf(formatWork(in, j))
    runtime.GoSched()
  }
}

func main() {
  wg := &sync.WaitGroup{}
  for i := 0; i < iterationsNum; i++ {
    wg.Add(1)
    go startWorker(i, wg)
  }
  time.Sleep(time.Milisecond)
  wg.Wait()
}
```

## Resource limit

We create a buffered channel - a channel with a quota. It will be the main tool for solving the task. 

The buffer size is equal to our limit. 

```go
const (
	iterationsNum = 7
  goroutinesNum = 5
  quotaLimit = 2
)

func startWorker(in int, wg *sync.WaitGroup, quotaCh chan struct{}) {
  quotaCh <- struct{}{}
  defer wg.Done()
  for j := 0; j < iterationsNum; j++ {
    fmt.Printf(formatWork(in, j))
    
    // return quota back every 2 iterations
    if j % 2 == 0 {
      <-quotaCh
      quota<- struct{}{}
    }
    runtime.Gosched()
  }
  <-quotaCh
}

func main() {
  wg := &sync.WaitGroup()
  quotaCh := make(chan struct{}, quotaLimit)
  for i := 0; i < goroutinesNum; i++ {
    wg.Add(1)
    go startWorker(i, wg, quotaCh)
  }
  time.Sleep(time.Milisecond)
  wg.Wait()
}
```



# Race state

## Data race

```go
func main() {
  counters := map[int]int{}
  for i := 0; i < 5; i++ {
    go func (counters map[int]int, th int) {
      for j := 0; j < 5; i++ {
        counters[th*10+j]++
      }
    } (counters, i)
  }
}
```

## Mutex

We disassembled mutex as a means of avoiding a race, when we are working with one variable from different system threads.

First mutex: read - write

Second mutex: read- read

```go
package main

import (
	"fmt"
  "sync"
)

func main() {
  var counters = map[int]int{}
  mu := &sync.Mutex{}
  for i := 0; i < 5; i++ {
    go func(counters map[int]int, th int, mu *sync.Mutex) {
      for j := 0; j < 5; j++ {
        mu.Lock()
        counters[th*10+j]++
        mu.Unlock()
      }
    }(counters, i, mu)
  }
  fmt.Scanln()
  mu.Lock()
  fmt.Println("counters result", counters)
  mu.Unlock()
}
```

## Atomic



```go
package main

import (
	"fmt"
  "sync/atomic"
  "time"
)

var totalOperations int32

func inc() {
  atomic.AddInt32(&totalOperations, 1)
}

func main() {
  for i:=0; i < 1000; i++ {
    go inc()
  }
  time.Sleep(2 * time.Milisecond)
  fmt.Println("total operation = ", totalOperations)
}
```



