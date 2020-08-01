# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /workspace

# add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

ENV PORT 8081

# install app dependencies
COPY . .

# COPY package-lock.json ./
RUN npm install

# build app bundle chunks
RUN npx webpack --config webpack.config.js

# start app
CMD node server.js