FROM node:8

WORKDIR /usr/src/app

ADD . /usr/src/app
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]
# ENTRYPOINT [ "/bin/bash" ]