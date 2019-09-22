FROM node:10.15.3-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm -g install yarn
RUN cd /usr/src/app

COPY . /usr/src/app
RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]