FROM node:16

# RUN mkdir -p /admin_console/node_modules && chown -R node:node /admin_console

# Change app directory
WORKDIR /admin_console

# Install app dependencies
COPY ./admin_console/package*.json ./

RUN npm install

# Bundle app source
COPY ./admin_console .

# EXPOSE 6600
# CMD [ "node", "server.js" ]
CMD [ "npm", "start" ]