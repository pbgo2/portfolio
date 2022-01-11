docker stop --time 2 ascii-art-web
docker system prune --force
docker system prune --volumes --force
docker image prune -a --force