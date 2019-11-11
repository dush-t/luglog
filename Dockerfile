FROM node:10-alpine

RUN mkdir -p /home/node/luglog/node_modules && chown -R node:node /home/node/luglog

WORKDIR /home/node/luglog

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "node", "src/index.js" ]
