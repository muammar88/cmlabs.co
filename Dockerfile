FROM node:20.18
#FROM node:20.18-alpine


WORKDIR /apps

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon secara global
RUN npm install -g nodemon

# Install dockerize
RUN apt-get update && apt-get install -y wget
RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz
RUN tar -C /usr/local/bin -xzf dockerize-linux-amd64-v0.6.1.tar.gz

# Salin kode server
COPY . .

EXPOSE 3001

# Jalankan dengan dockerize untuk menunggu mysql, lalu nodemon untuk auto-restart pada perubahan file
# CMD ["dockerize", "-wait", "tcp://mysql:3306", "-timeout", "60s", "npm", "start"]
CMD ["sh", "-c", "dockerize -wait tcp://mysql:3306 -timeout 60s && npm start"]
