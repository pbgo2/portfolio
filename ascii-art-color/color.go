package main //implements a coloring app that process contents of a string into color

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

var (
	Normal  = "\033[0m" // Turn off all attributes
	Black   = "\033[30m"
	Red     = "\033[31m"
	Green   = "\033[32m"
	Yellow  = "\033[33m"
	Blue    = "\033[34m"
	Magenta = "\033[35m"
	Cyan    = "\033[36m"
	White   = "\033[37m"
)

func addAscii(strarr []string, ascii []string, colorUsed string) []string {
	for i := range ascii {
		strarr[i] += colorUsed + ascii[i]
	}
	return strarr
}

func getNum(input string, seperator rune) int {
	var srune []rune
	stopbool := false
	var n int = 0
	for _, st := range input {
		if st != seperator && !stopbool {
			if st >= '0' && st <= '9' {
				srune = append(srune, st)
			}
		} else {
			stopbool = true
		}
	}
	for _, sr := range srune {
		n = n*10 + int(sr-'0')
	}
	return n
}

func main() {
	var asciiArt, outputSlice [][]string
	var tempAscii, inputSlice []string
	var characters, colorUsed, usedColor string
	var colStart, colStop, colDiff int
	errmsg1 := [...]string{"Usage: go run . [STRING] [OPTION]", "EX: go run . something --color=<color>"}
	if len(os.Args) == 3 {
		inputSlice = strings.Split(os.Args[1], "\\n")
		if os.Args[2][:8] == "--color=" {
			for i, srune := range os.Args[2][8:] {
				if srune >= 'a' && srune <= 'z' || srune >= 'A' && srune <= 'Z' {
					colorUsed += string(srune)
				}
				if srune == '[' {
					colStart = getNum(os.Args[2][i+9:], '-')
				}
				if srune == '-' {
					colStop = getNum(os.Args[2][i+9:], ']')
				}
			}
		} else {
			fmt.Println(errmsg1[0])
			fmt.Println(errmsg1[1])
			os.Exit(0)
		}
	} else {
		fmt.Println(errmsg1[0])
		fmt.Println(errmsg1[1])
		os.Exit(0)
	}
	colorUsed = strings.ToLower(colorUsed)
	switch colorUsed {
	case "red":
		colorUsed = Red
	//	break
	case "black":
		colorUsed = Black
	//	break
	case "green":
		colorUsed = Green
	//	break
	case "yellow":
		colorUsed = Yellow
	//	break
	case "blue":
		colorUsed = Blue
		//break
	case "magenta":
		colorUsed = Magenta
		//break
	case "cyan":
		colorUsed = Cyan
	//	break
	case "white":
		colorUsed = White
	//	break
	case "orange":
		colorUsed = "\033[38;2;255;175;0m" // Orange
	//	break
	default:
		colorUsed = Normal
	}
	for i := 32; i < 127; i++ {
		characters += string(rune(i))
	}
	file, err := os.Open("standard.txt")
	if err != nil {
		panic(err.Error())
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	firstLine := false
	for scanner.Scan() {
		if scanner.Text() == "" && firstLine {
			asciiArt = append(asciiArt, tempAscii)
			tempAscii = nil
		} else if firstLine {
			tempAscii = append(tempAscii, scanner.Text())
		}
		firstLine = true
	}
	asciiArt = append(asciiArt, tempAscii)
	tempAscii = make([]string, 8)
	colnum := false
	if colStart <= 0 && colStop <= 0 {
		usedColor = colorUsed
		colnum = true
	} else {
		usedColor = Normal
	}
	for _, input := range inputSlice {
		if colDiff != 0 {
			colStart = 1
			colStop = colDiff
		}
		for i, srune := range input {
			if colStart-1 == i && colStart > 0 {
				usedColor = colorUsed
				if len(input[i:]) < (colStop - colStart) {
					colDiff = (colStop - colStart) - len(input[i:])
				}
			}
			if colStop == 0 && colStart == i && !colnum {
				usedColor = Normal
				colStart = 0
				colStop = 0
			}
			if colStop == i && colStart <= colStop && !colnum {
				usedColor = Normal
				colStart = 0
				colStop = 0
			}
			for i, char := range characters {
				if srune == char {
					tempAscii = addAscii(tempAscii, asciiArt[i], usedColor)
				}
			}
		}
		outputSlice = append(outputSlice, tempAscii)
		tempAscii = make([]string, 8)
		if colStart != 0 && colStart > len(input) {
			colStart -= len(input)
			colStop -= len(input)
		}
	}
	for _, strSlice := range outputSlice {
		for _, str := range strSlice {
			fmt.Println(str)
		}
	}
}
