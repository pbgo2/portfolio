#first test case
clear
echo 'go run main.go "banana" --color red'
echo $'\nOutput From Program:\n'
go run main.go "banana" --color red
echo $'\n\n\033[31mexpected output:\033[0m\n'
echo "Usage: go run . [STRING] [OPTION]"
echo $'EX: go run . something --color=<color>\n\n'
read -n 1 -r -s -p $'Press enter to continue...\n'
#second test case
clear
echo 'go run main.go "hello" --color red'
echo $'\n\n\n\033[31mOutput From Program:\033[0m\n'
go run main.go "hello world" --color=red
echo $'\n\n\033[31mexpected output:\n'
echo $'\033[31m _              _   _                                           _       _  '
echo $'\033[31m| |            | | | |                                         | |     | | '
echo $'\033[31m| |__     ___  | | | |   ___         __      __   ___    _ __  | |   __| | '
echo $'\033[31m|  _ \   / _ \ | | | |  / _ \        \ \ /\ / /  / _ \  | \'__| | |  / _` | '
echo $'\033[31m| | | | |  __/ | | | | | (_) |        \ V  V /  | (_) | | |    | | | (_| | '
echo $'\033[31m|_| |_|  \___| |_| |_|  \___/          \_/\_/    \___/  |_|    |_|  \__,_| '
echo $'\033[31m                                                                           '
echo $'\033[31m                                                                           \033[0m'
read -n 1 -r -s -p $'Press enter to continue...\n'
#third test case
clear
echo 'go run main.go "1 + 1 = 2" --color green'
echo $'\n\n\n\033[32mOutput From Program:\033[0m\n'
go run main.go "1 + 1 = 2" --color=green
echo $'\n\n\033[32mexpected output:\n'                                                         
echo $'\033[32m _           _           _         ______         ____   '
echo $'\033[32m/ |        _| |_        / |       |______|       |___ \  '
echo $'\033[32m| |       |_   _|       | |        ______          __) | '
echo $'\033[32m| |         |_|         | |       |______|        / __/  '
echo $'\033[32m|_|                     |_|                      |_____| '
echo $'\033[32m                                                         '
echo $'\033[32m                                                                             \033[0m'
read -n 1 -r -s -p $'Press enter to continue...\n'
#fourth test case
clear
echo 'go run main.go "(%&) ??" --color yellow'
echo $'\n\n\n\033[33mOutput From Program:\033[0m\n'
go run main.go "(%&) ??" --color=yellow
echo $'\n\n\033[33mexpected output:\n'                                                         
echo $'\033[33m  __  _   __          __          ___    ___   '
echo $'\033[33m / / (_) / /   ___    \ \        |__ \  |__ \  '
echo $'\033[33m| |     / /   ( _ )    | |          ) |    ) | '
echo $'\033[33m| |    / /    / _ \/\  | |         / /    / /  '
echo $'\033[33m| |   / / _  | (_>  <  | |        |_|    |_|   '
echo $'\033[33m| |  /_/ (_)  \___/\/  | |        (_)    (_)   '
echo $'\033[33m \_\                  /_/                      '                                           
echo $'\033[33m                                                                             \033[0m'
read -n 1 -r -s -p $'Press enter to continue...\n'
#"\033[38;2;255;175;0m"
#fifth test case
#clear
#echo 'go run main.go "HeY GuYs" --color orange'
#echo $'\n\n\n\033[38mOutput From Program:\033[0m\n'
#go run main.go "HeY GuYs" --color=orange
#echo $'\n\n\033[38mexpected output:\n'                                                         
#echo $'\033[38m _    _         __     __         _____          __     __       '
#echo $'\033[38m| |  | |        \ \   / /        / ____|         \ \   / /       '
#echo $'\033[38m| |__| |   ___   \ \_/ /        | |  __   _   _   \ \_/ /   ___  '
#echo $'\033[38m|  __  |  / _ \   \   /         | | |_ | | | | |   \   /   / __| '
#echo $'\033[38m| |  | | |  __/    | |          | |__| | | |_| |    | |    \__ \ '
#echo $'\033[38m|_|  |_|  \___|    |_|           \_____|  \__,_|    |_|    |___/ '                                                                                                                            
#echo $'\033[38m                                                                 '       \033[0m'
#read -n 1 -r -s -p $'Press enter to continue...\n'
#six test case
#clear
#echo 'go run main.go "RGB" --color blue<3-3>'
#echo $'\n\n\n\033[34mOutput From Program:\033[0m\n'
#go run main.go "RGB" --color=blue<3-3>
#echo $'\n\n\033[34mexpected output:\n'                                                         
#echo $'\033[34m _____     _____   ____   '
#echo $'\033[34m|  __ \   / ____| |  _ \  '
#echo $'\033[34m| |__) | | |  __  | |_) | '
#echo $'\033[34m|  _  /  | | |_ | |  _ <  '
#echo $'\033[34m| | \ \  | |__| | | |_) | '
#echo $'\033[34m|_|  \_\  \_____| |____/  '                                                                                                                                                                                           
#echo $'\033[34m                                                                   \033[0m'
#read -n 1 -r -s -p $'Press enter to continue...\n'