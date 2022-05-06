FROM debian:buster
#FROM node:8.11-slim

LABEL about="Forum"
LABEL version="1.0"
LABEL description="Create Forum"


WORKDIR ~/forum
ENV workdirectory ~/forum

COPY main/main .
COPY main/posts.db .
#RUN mkdir templates
COPY main/template/*.* template/
