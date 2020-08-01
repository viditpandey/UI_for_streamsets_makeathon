# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /workspace

# add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH
ENV PORT 8081

# install app dependencies
COPY package.json ./
COPY webpack.config.js ./
COPY app ./
# COPY package-lock.json ./
# RUN npm install webpack webpack-cli
RUN npm install
RUN npx webpack --config webpack.config.js

# add app
COPY node_modules ./
COPY server.js ./
COPY dist ./

# start app
CMD node server.js