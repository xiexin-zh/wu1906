FROM node:12.14.1-slim

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json ./
RUN npm i --registry=https://registry.npm.taobao.org

# Copying source files
COPY . .

# Building app
RUN npm run build

# Running the app
# CMD [ "npm", "start" ]
npm i serve -g --registry=https://registry.npm.taobao.org
serve ./dist -l 8000

EXPOSE 8000
