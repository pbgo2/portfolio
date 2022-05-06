docker stop --time 2 forum
docker system prune --force
docker system prune --volumes --force
docker image prune -a --force
rm main/main