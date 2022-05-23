FROM node:16

# RUN mkdir -p /frontend/node_modules && chown -R node:node /frontend

# Change app directory
WORKDIR /frontend

# Install app dependencies
COPY ./frontend/package*.json ./

RUN npm install

# Bundle app source
COPY ./frontend .

# EXPOSE 8080

RUN npm config set proxy null
RUN npm config set https-proxy null
RUN npm config set registry http://registry.npmjs.org/

# CMD [ "node", "server.js" ]
CMD [ "npm", "start" ]