# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /workspace

ENV PORT 8081

# install app dependencies
COPY . ./

RUN npm install
RUN npx webpack --config webpack.config.js

# start app
CMD node server.js