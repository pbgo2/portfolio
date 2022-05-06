cd main
go build main.go
cd ~
docker image build -t 'forum:latest' ~/forum
docker container run --label forum-container -it -d --name forum -p 8080:80 forum
docker network create --gateway 172.0.0.1 --subnet 172.0.0.0/16 my_local
docker network connect my_local forum
#docker exec -it ascii-art-web /bin/bash
docker exec -it forum ./main