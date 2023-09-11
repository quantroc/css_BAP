FROM node:14

RUN apt-get update || : && apt install -y python2.7 python-pip

WORKDIR /home/node/app

# Copy your application files to the container
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g gulp-cli

COPY . .

ENV HOST 0.0.0.0

ENTRYPOINT ["npm", "run", "dev"]