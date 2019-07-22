# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /t4_server


# install and cache app dependencies
COPY package.json /t4_server/package.json
COPY . /t4_server
RUN npm install

ENV PATH /t4_server/node_modules/:$PATH
ENV PATH /usr/local/lib/node_modules:$PATH

EXPOSE 8070
CMD [ "npm", "run", "start" ]