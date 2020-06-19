FROM node:12.16.0
WORKDIR /usr/app

# This is because docker-compose doesn't wait for postgres to be ready
RUN git clone https://github.com/vishnubob/wait-for-it.git

COPY package*.json ./
RUN npm install

COPY . .


CMD ["mocha", "test/*.test.js", "--exit"]