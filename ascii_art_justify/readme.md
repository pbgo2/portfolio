1) To print string eg. "hello" as Ascii-Art
	go run . "hello" standard --align=right (other formats allow: left/center/justify)

2) Work the best if run in pure terminal window (not vsc) if drag right bottom corner could adjust terminal window size to your preference.

3) After run it the program waiting to resize and adopt terminal window size, if you want close it and submit different string to be 
	print as ascii-art  ,program need close by Ctrl-C. Clear terminal after (command clear) also advised.

4) If you squize too much and terminal window became too small to be able print ascii-art without glich it will print message 
	"Not enough space for ascii-art". 

5) String:	"a -> A b -> B c -> C" shadow --align=right  what is assesed by audit will not be print because is too long for terminal
	line capacity ("Not enough space for ascii-art"). To print it as ascii-art need be change slighty
	into:	"a->A b->B c->C" shadow --align=right

6) If you struggle to run code - go.mod file could be issue-remove it and try run again.
