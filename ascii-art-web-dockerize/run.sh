go build main.go
cd ~
docker image build -t 'ascii-art-web-dockerize:latest' ~/ascii-art-web-dockerize
docker container run --label ascii-art-container -it -d --name ascii-art-web -p 8080:80 ascii-art-web-dockerize
docker network create --gateway 172.0.0.1 --subnet 172.0.0.0/16 my_local
docker network connect my_local ascii-art-web
#docker exec -it ascii-art-web /bin/bash
docker exec -it ascii-art-web ./main