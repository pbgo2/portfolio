package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"strings"
)

// Refs https://levelup.gitconnected.com/learn-and-use-templates-in-go-aa6146b01a38
// https://golangbyexample.com/400-http-status-response-golang/
// Refs https://levelup.gitconnected.com/learn-and-use-templates-in-go-aa6146b01a38
// https://golangbyexample.com/400-http-status-response-golang/
// https://www.alexedwards.net/blog/serving-static-sites-with-go
//http://www.alternatestack.com/development/app-development/simple-http-server-with-templated-response-in-go/
//https://medium.com/rungo/beginners-guide-to-serving-files-using-http-servers-in-go-4e542e628eac
//https://medium.com/rungo/creating-a-simple-hello-world-http-server-in-go-31c7fd70466e

var fileToOpen string //= "standard.txt" // file name with new fonts (banner) to be apply ,have to be present in working folder

var (
	err1           error
	len1           int
	lenoutputAscii int
	asciiSlice     [][]string
	tempAscii      []string
	outputAscii    [8]string
	asciiString    string = ""
	split_string   []string
	// delimiter      string = "\\n"
)

var tpl *template.Template

type aart struct {
	TexttoConvert  string
	TexttoConvert1 string
}

func init() { // Must is a helper that wraps a function returning (*Template, error) and panics if the error is non-nil.
	tpl = template.Must(template.ParseGlob("templates/*"))
}

////////////////////////////////PArsing input to Output Ascii Art/////////////////////////////////////////////////////
func ParseInput(inputString string) { // Populate slice to hold converted string, return slice with converted string
	for k := 0; k <= lenoutputAscii-1; k++ {
		outputAscii[k] = ""
	}
	for _, inputRune := range inputString {
		for asciiIndex, asciiRune := range asciiString {
			if inputRune == asciiRune {
				for asciiSliceIndex := 0; asciiSliceIndex < len(asciiSlice[asciiIndex]); asciiSliceIndex++ {
					outputAscii[asciiSliceIndex] += asciiSlice[asciiIndex][asciiSliceIndex]
				}
			}
		}
	}
}

///////////////////////////////////////////////End////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////PREPARE SET UP TO ASCII ART CONVERSION//////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
func ProcesInput(inputString string) { // Receives String to process and splits into seperate words if several words
	count := 0
	lenoutputAscii = len(outputAscii)
	split_string = strings.Split(inputString, "\\n")
	lenght := len(split_string)

	for i := 32; i <= 126; i++ {
		asciiString += string(rune(i))
	}

	file, err := os.Open(fileToOpen)
	if err != nil {
		fmt.Printf("Resources (banner) not found - 404 \n")
		os.Exit(1)
		return
	}
	// Scan Banner file selected by user and read contents into an slice
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		if scanner.Text() == "" && count != 0 {
			asciiSlice = append(asciiSlice, tempAscii)
			tempAscii = nil
			len1 = len(asciiSlice)
		} else if count != 0 {
			tempAscii = append(tempAscii, scanner.Text())
		}
		count = 1
	}
	asciiSlice = append(asciiSlice, tempAscii)

	if lenght > 1 {
		for i := 0; i <= lenght-1; i++ {
			ParseInput(split_string[i]) // Send each word in string if more than one word to process
			for k := 0; k <= lenoutputAscii-1; k++ {
				outputAscii[k] = ""
			}
		}
	} else {
		ParseInput(inputString)
	}
	file.Close()
	tempAscii = nil
	for k := 0; k <= len1-1; k++ {
		asciiSlice[k] = nil
	}
}

////////////////////////////////////////////////////END///////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////PARSING--PROCESSING POST ,FORM RETRIVING INPUTS FROM USER///////////////////////////
////////////////////////////////////////////MAINTAIN 400 & 404 ///////////////////////////////////////////////////////
/* Go's terminology calls Marshal and Unmarshal convert a string into JSON and vice versa. Encoding and decoding convert
   a stream into JSON and vice versa. */

func processPostHandler(w http.ResponseWriter, r *http.Request) { // Validate user Input and POST conversion on web
	tt := r.FormValue("Text_to_Convert")
	tt1 := r.FormValue("Text_to_Convert1")
	fileToOpen = r.FormValue("choice")

	file, err := os.Open(fileToOpen)
	if err != nil {
		w.WriteHeader(http.StatusNotFound) // Display http status code
		w.Header().Set("Content-Type", "application/json")
		resp := make(map[string]string) // Create key/value map ie weberror , code
		resp["Resources NotFound"] = "404"
		jsonResp, err := json.Marshal(resp) // Convert to json
		if err != nil {
			log.Fatalf("Error happened in JSON marshal. Err: %s", err)
		}
		w.Write(jsonResp)
		return
	} else {
		file.Close()
	}

	ProcesInput(tt) // Process First text value tt entered and return output slice and assign to s1
	var s1 string = ""
	for k := 0; k <= lenoutputAscii-1; k++ {
		s1 = s1 + outputAscii[k] + "\n"
	}
	ProcesInput(tt1) // Process First text value tt1 entered and return output slice and assign to s2
	var s2 string = ""
	for k := 0; k <= lenoutputAscii-1; k++ {
		s2 = s2 + outputAscii[k] + "\n"
	}
	tpl.ExecuteTemplate(w, "postform.html", aart{s1, s2})
	//	tpl.ExecuteTemplate(w, "asciiweb.css", nil)
}

////////////////////////////////////////////////////END///////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//INTRODUCE GET - METHOD FOLLOWING OPEN POSTFORM -FORM USES TO POST METHOD TO PARSE USER DATA GIVEN AS INPUT ON WEBPAGE
////////////////////////////////////////////HANDLING 400 & 404 ///////////////////////////////////////////////////////
func process(w http.ResponseWriter, r *http.Request) { // Valiadate URL / 400 / 404 Errors
	if r.URL.Path != "/" {
		http.Error(w, "400 bad request.", http.StatusBadRequest)
		return
	}
	switch r.Method {
	case "GET":
		err := tpl.ExecuteTemplate(w, "postform.html", nil)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			w.Header().Set("Content-Type", "application/json")
			resp := make(map[string]string)
			resp["Resources NotFound"] = "404"
			jsonResp, err := json.Marshal(resp) // Convert to json format
			if err != nil {
				log.Fatalf("Error happened in JSON marshal. Err: %s", err)
			}
			w.Write(jsonResp)
		}
		http.HandleFunc("/ascii-art", processPostHandler)
	}
}

////////////////////////////////////////////////////END///////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ALLOWS TO END POINT (CLIENT) ,TYPE IN ADDRESS BAR -http://localhost:8080/status TO CHECK CURRENT SERVER STATUS//////
////////////////////////////////////////////HANDLING 200 & 500 ///////////////////////////////////////////////////////
func ServerStatus(w http.ResponseWriter, r *http.Request) { // validate by client on http://localhost:8080/status  - 200 OK / 500 Error
	_, err1 = http.Get("http://127.0.0.1:8080/ascii-art")
	if err1 == nil {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		resp := make(map[string]string)
		resp["StatusOK"] = "200"
		jsonResp, err := json.Marshal(resp)
		if err != nil {
			log.Fatalf("Error happened in JSON marshal. Err: %s", err)
		}
		w.Write(jsonResp)
		return
	} else {
		w.WriteHeader(http.StatusInternalServerError)
		w.Header().Set("Content-Type", "application/json")
		resp := make(map[string]string)
		resp["StatusInternalServerError"] = "500"
		jsonResp, err := json.Marshal(resp)
		if err != nil {
			log.Fatalf("Error happened in JSON marshal. Err: %s", err)
		}
		w.Write(jsonResp)
		return
	}
}

////////////////////////////////////////////////////END//////////////////////////////////////////////////////////////

func main() {
	fmt.Printf("Starting server at port 8080\n")
	http.Handle("/CSS/", http.StripPrefix("/CSS/", http.FileServer(http.Dir("CSS/"))))
	http.Handle("/html/", http.StripPrefix("/html/", http.FileServer(http.Dir("html/"))))
	http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("images/"))))
	http.HandleFunc("/", process)
	http.HandleFunc("/status", ServerStatus)
	count := 0
	//////////////////////////////DEALING ERROR 200 && 500//////////////////////////////////////////////////////////
	for count < 200 {
		if err1 != nil {
			fmt.Println("StatusInternalServerError", http.StatusInternalServerError)
			break
		} else {
			fmt.Println("StatusOK", http.StatusOK)
		}
		err1 = http.ListenAndServe(":8080", nil)
		count++
	}
}
