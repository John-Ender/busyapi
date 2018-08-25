FROM node:8

RUN apt-get update && apt-get upgrade -y

WORKDIR /usr/src

COPY . .

RUN npm install --production

EXPOSE 3000

CMD npm start