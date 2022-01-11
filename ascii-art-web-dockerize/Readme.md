TO RUN IT: go to project directory ascii-art-web-dockerize:
./run.sh  (if you struggle to run scripts modify permision rules :
			chmod 750 run.sh ;
			chmod 750 prune.sh)



type address in FireFox:
172.0.0.2:8080/



after finish purge docker's items:
./prune.sh





Description
		Ascii-art-web consists in creating and running a server, in which it will be possible to use a web GUI (graphical user
		interface) version of project, ascii-art.
Authors in alphabetical order
		JayP,PeterB(C),PPJD
Implementation details: algorithm
		Usage of server is realised by two main functions:
		(1)process(w http.ResponseWriter, r *http.Request) and
		(2)processPostHandler(w http.ResponseWriter, r *http.Request)
		
		(1) GET /: Sends HTML response, the main page. After it the postform.html document is open and serve to client to fill
		inputs
		(2) Allows response input to be send by POST method  to server due further processing it.
		
		Others two functions made are present : 
		(b)ProcesInput takes user inputs: strings to be convert and baner with ascii art
		alphabet. Check it against file with banner resource exist, if not message 404 (Not resources found) is show to client.
		(b) Split input string into single words if multiple words are request to be process,scan selected baner(file contains art
		fonts) and read content load into slice realize by string slice data type. These stuff-single word input and slice are
		passing to function: 
		(a)ParseInput to ascii-art by populate slice to hold converted string.The structure of banner file with art fonts inside
		corresponding to standard ascii character table 32-126. Each font in banner has same 8 lines height. Durimg each cycle 
		of main loop every single character(rune) of input given by client to convert is comparise with current ascii standart
		table character. 
		If equal then ,subloop cycling through outputAscii[8]string slice and fill it with corresponding data retrieved
		from banner at particular position calculate base on standard ascii character decimal number and height offset.
		Filled outputAscii[8]string is proceed  to (2) and send back to by server to client.
		Finally requested Ascii-Art is printed on webpage made from client's input string and choosen baner.
		
		(3)ServerStatus function due to Running server is monitoring against errors (400,404,500).Current status is available
		to client at http://localhost:8080/status
		Response Code 200-StatusOK ,if are not issues currently present.
		
