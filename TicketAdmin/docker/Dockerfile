FROM nginx:1.12-alpine

MAINTAINER aohan.yang

COPY default.conf /etc/nginx/conf.d/

WORKDIR /usr/share/nginx/html/

COPY dist/. ./
