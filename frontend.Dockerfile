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
# CMD [ "node", "server.js" ]
CMD [ "npm", "start" ]