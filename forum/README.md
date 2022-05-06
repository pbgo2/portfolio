# forum

This project consists in creating a web forum that allows :
* communication between users.
* associating categories to posts.
* liking and disliking posts and comments.
* filtering posts.

## Front-end
* HTML
* CSS

## Back-end
* Golang
* SQLite
* Docker

## Usage
        $ cd ~
        $ cd forum
        $ cd main
        $ go run main.go
        
* and open http://localhost:8080 in your browser

## Usage Docker-assuming folder forum is in your home directory
        $ cd ~
        $ cd forum

* when you run first time: run.sh or prune.sh execute:

        chmod +x run.sh
        chmod +x prune.sh

* after 
        
        $ ./run.sh

* type address in your browser: 172.0.0.2:8080/

        $ ./prune.sh

## Special note about docker
* If you use docker on your home laptop/desktop and need prompt 

        $ sudo docker
        
* this inconvience must be remove to maintain proper execute ./run.sh 
* To skip sudo do below:

        $ sudo groupadd docker
        $ sudo usermod -aG docker $USER ($USER - your user name)
        $ sudo chown root:docker /var/run/docker.sock
        $ sudo chown -R root:docker /var/run/docker

* Finally logout from system and logon back due this change became effective