package main

import (
	"bufio"
	"errors"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"unsafe"
)

type Size struct {
	Width  int
	Height int
}
type winsize struct {
	rows uint16
	cols uint16
	x    uint16
	y    uint16
}
type SizeListener struct {
	Change <-chan Size

	done chan struct{}
}

const ioctlReadTermios = syscall.TCGETS

var (
	adjust_gap      int
	term_len        int
	term_height     int
	artlen          int
	isTerminal      = IsTerminal
	unixSyscall     = syscall.Syscall
	ErrNotATerminal = errors.New("given file is not a terminal")
)

// IsTerminal return true if the file descriptor is terminal.
func IsTerminal(fd uintptr) bool {
	var termios syscall.Termios
	_, _, err := syscall.Syscall6(syscall.SYS_IOCTL, fd, ioctlReadTermios, uintptr(unsafe.Pointer(&termios)), 0, 0, 0)
	return err == 0
}
func GetSize() (s Size, err error) {
	return FgetSize(os.Stdout)
}

// FgetSize gets the terminal size of a given os.File. Returns the NotATerminal error, if it is not a terminal.
func FgetSize(fp *os.File) (s Size, err error) {
	if fp == nil || !isTerminal(fp.Fd()) {
		err = ErrNotATerminal
		return
	}
	s, err = getTerminalSize(fp)
	return
}

// Close implements the io.Closer interface that stops listening to terminal
// size changes.
func (sc *SizeListener) Close() (err error) {
	if sc.done != nil {
		close(sc.done)
		sc.done = nil
		sc.Change = nil
	}

	return
}

// NewSizeListener creates a new size change listener
func NewSizeListener() (sc *SizeListener, err error) {
	sc = &SizeListener{}

	sizechan := make(chan Size, 1)
	sc.Change = sizechan
	sc.done = make(chan struct{})

	err = getTerminalSizeChanges(sizechan, sc.done)
	if err != nil {
		close(sizechan)
		close(sc.done)
		sc = &SizeListener{}
		return
	}

	return
}

// func printSize(s Size) {
// 	fmt.Println("Current size is", s.Width, "by", s.Height)
// }

func getTerminalSize(fp *os.File) (s Size, err error) {
	ws := winsize{}

	_, _, errno := unixSyscall(
		syscall.SYS_IOCTL,
		fp.Fd(),
		uintptr(syscall.TIOCGWINSZ),
		uintptr(unsafe.Pointer(&ws)))

	if errno != 0 {
		err = errno
		return
	}
	s = Size{
		Width:  int(ws.cols),
		Height: int(ws.rows),
	}
	return
}

func getTerminalSizeChanges(sc chan Size, done chan struct{}) error {
	ch := make(chan os.Signal, 1)

	sig := syscall.SIGWINCH

	signal.Notify(ch, sig)
	go func() {
		for {
			select {
			case <-ch:
				var err error
				s, err := getTerminalSize(os.Stdout)
				if err == nil {
					sc <- s
				}
			case <-done:
				signal.Reset(sig)
				close(ch)
				return
			}
		}
	}()

	return nil
}

func ReadLines(path string) ([]string, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var lines []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	return lines, scanner.Err()
}

func SplitLines(s string) [][]byte {
	var count int

	for i := 0; i < len(s); i++ {
		if s[i] == '\\' && s[i+1] == 'n' {
			count++
		}
	}
	splitString := []byte(s)
	splitLines := make([][]byte, count+1)

	j := 0

	for i := 0; i < len(splitLines); i++ {
		for j < len(splitString) {
			if j > 0 && splitString[j] == 'n' && splitString[j-1] == '\\' {
				j++
				splitLines[i] = splitLines[i][:len(splitLines[i])-1]
				break
			}
			splitLines[i] = append(splitLines[i], splitString[j])
			j++
		}
	}
	return splitLines
}

func Artlencalc(args string, args2 string) int {
	splitLines := SplitLines(args)
	lines, err := ReadLines(args2 + ".txt")
	if err != nil {
		log.Fatalf("ReadLines: %s", err)
	}
	charMap := make(map[int][]string)

	start := 32

	for i := 0; i < len(lines); i++ {
		if len(charMap[start]) == 9 {
			start++
		}
		charMap[start] = append(charMap[start], lines[i])
	}
	artlen = 0
	for j, val := range splitLines {
		for i := 1; i < 9; i++ {
			for k := 0; k < len(val); k++ {
				if i == 1 {
					artlen = artlen + len(charMap[int(splitLines[j][k])][i])
				}
			}
		}
	}
	return artlen
}

func PrintAsciiArt(args string, args2 string) {

	/*The else clause above tells the program to do nothing if
	the argument is an empty string with the rest of the program
	only running if the arg is not an empty string*/
	/* The func splitlines splits the string of the arg into
	a slice of slices split whenever there is a new line*/

	splitLines := SplitLines(args)
	lines, err := ReadLines(args2 + ".txt")
	if err != nil {
		log.Fatalf("ReadLines: %s", err)
	}
	/*The line below uses the make method to make a map
	and uses a start point of 32 to match up the ascii values
	of each character to the ascii version of the character*/
	charMap := make(map[int][]string)

	start := 32

	for i := 0; i < len(lines); i++ {
		// Tells it to add to start every 9 to match the chars
		if len(charMap[start]) == 9 {
			start++
		}
		charMap[start] = append(charMap[start], lines[i])
	}
	/*The j below refers to the index of each slice within a
	created by splitlines, represented by val. The k represents
	the length of each individual slice. The i iterates up to 9
	to match the height of each character.*/
	for j, val := range splitLines {
		for i := 1; i < 9; i++ {
			for k := 0; k < len(val); k++ {
				fmt.Print(charMap[int(splitLines[j][k])][i])
			}
			fmt.Println()
		}
	}
}

func AlignRight(args string, args2 string, term_len int, term_height int) {
	artlen = Artlencalc(args, args2)
	adjust_gap = term_len - artlen
	if adjust_gap < 0 || term_height < 9 {
		fmt.Print("Not enough space for ascii-art \n")
	} else {
		s := ""
		adjust_gap = adjust_gap / 6

		if adjust_gap > 0 {
			for i := 0; i < adjust_gap; i++ {
				s = s + " "
			}
			args = s + args
			PrintAsciiArt(args, args2)
		} else {
			PrintAsciiArt(args, args2)
		}
	}
}

func AlignCenter(args string, args2 string, term_len int, term_height int) {
	artlen = Artlencalc(args, args2)
	adjust_gap = term_len - artlen
	if adjust_gap < 0 || term_height < 9 {
		fmt.Print("Not enough space for ascii-art \n")
	} else {
		s := ""
		s1 := ""
		adjust_gap = adjust_gap / 6

		adjust_gap_1 := adjust_gap / 2
		adjust_gap_2 := adjust_gap - adjust_gap_1

		if adjust_gap_1 > 0 {
			for i := 0; i < adjust_gap_1; i++ {
				s = s + " "
			}
			args = s + args
		}
		if adjust_gap_2 > 0 {
			for i := 0; i < adjust_gap_2; i++ {
				s1 = s1 + " "
			}
			args = args + s1
		}
		PrintAsciiArt(args, args2)
	}
}

func AlignLeft(args string, args2 string, term_len int, term_height int) {
	artlen = Artlencalc(args, args2)
	adjust_gap = term_len - artlen
	if adjust_gap < 0 || term_height < 9 {
		fmt.Print("Not enough space for ascii-art \n")
	} else {
		PrintAsciiArt(args, args2)
	}
}

func AlignJustify(args string, args2 string, term_len int, term_height int) {
	artlen = Artlencalc(args, args2)
	adjust_gap = term_len - artlen

	if adjust_gap < 0 || term_height < 9 {
		fmt.Print("Not enough space for ascii-art \n")
	}

	if adjust_gap > 0 && term_height > 9 {

		split_string := strings.Split(args, " ")

		len_split := len(split_string)
		adjust_gap = (adjust_gap + ((len_split - 1) * 6)) / 6

		var array [20]string
		s := ""
		j := 0
		k := len_split - 1
		count := 0
		for i := 0; i <= (2*len_split)-2; i++ {
			if i%2 == 0 {
				array[i] = split_string[j]
				j++
			}
			//fmt.Printf("sss %v \n", k)
			if i%2 != 0 {

				if k == 1 {
					for l := 0; l < adjust_gap-((adjust_gap/(len_split-1))*count); l++ {
						s = s + " "
					}
					array[i] = s
					s = ""
				}
				if k > 1 {
					for l := 0; l < adjust_gap/(len_split-1); l++ {
						s = s + " "
					}
					k--
					count++
					array[i] = s
					s = ""
				}
			}
		}

		args = ""
		for i := 0; i <= (2*len_split)-2; i++ {
			args = args + array[i]

		}
		PrintAsciiArt(args, args2)
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
func main() {
	arg := os.Args
	// error handling
	if len(arg) != 4 {
		fmt.Print("Usage: go run . [STRING] [BANNER] [OPTION]\n")
		fmt.Println()
		fmt.Println("EX: go run . something standard --align=right")
		os.Exit(0)
	}
	// defining argument [1] "input string" and [2] "font/banner" [3] "--align=left/right/center/justify"
	args := os.Args[1]
	args2 := os.Args[2]
	args3 := os.Args[3]

	if args3 == "--align=right" {

		s, err := GetSize()
		if err != nil {
			fmt.Println("Getting terminal size failed:", err)
			return
		}
		term_len = s.Width
		term_height = s.Height
		AlignRight(args, args2, term_len, term_height)

		sc, err := NewSizeListener()
		if err != nil {
			fmt.Println("initializing failed:", err)
			return
		}
		defer sc.Close()
		for { //loop due to monitoring current teerminal size. if user change it Width, Height updated
			select {
			case s = <-sc.Change:
				//printSize(s)
				term_len = s.Width
				term_height = s.Height
				AlignRight(args, args2, term_len, term_height)
			}
		}
	}

	if args3 == "--align=center" {

		s, err := GetSize()
		if err != nil {
			fmt.Println("Getting terminal size failed:", err)
			return
		}
		term_len = s.Width
		term_height = s.Height
		AlignCenter(args, args2, term_len, term_height)

		sc, err := NewSizeListener()
		if err != nil {
			fmt.Println("initializing failed:", err)
			return
		}
		defer sc.Close()
		for {
			select {
			case s = <-sc.Change:
				//printSize(s)
				term_len = s.Width
				term_height = s.Height
				AlignCenter(args, args2, term_len, term_height)
			}
		}
	}

	if args3 == "--align=left" {

		s, err := GetSize()
		if err != nil {
			fmt.Println("Getting terminal size failed:", err)
			return
		}
		term_len = s.Width
		term_height = s.Height
		AlignLeft(args, args2, term_len, term_height)

		sc, err := NewSizeListener()
		if err != nil {
			fmt.Println("initializing failed:", err)
			return
		}
		defer sc.Close()
		for {
			select {
			case s = <-sc.Change:
				//printSize(s)
				term_len = s.Width
				term_height = s.Height
				AlignLeft(args, args2, term_len, term_height)
			}
		}
	}

	if args3 == "--align=justify" {

		s, err := GetSize()
		if err != nil {
			fmt.Println("Getting terminal size failed:", err)
			return
		}
		term_len = s.Width
		term_height = s.Height
		AlignJustify(args, args2, term_len, term_height)

		sc, err := NewSizeListener()
		if err != nil {
			fmt.Println("initializing failed:", err)
			return
		}
		defer sc.Close()
		for {
			select {
			case s = <-sc.Change:
				//printSize(s)
				term_len = s.Width
				term_height = s.Height
				AlignJustify(args, args2, term_len, term_height)
			}
		}
	}

}
