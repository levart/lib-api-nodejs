FROM node:8.10.0

RUN npm install --global npm@5.7.1 && \
    npm install --global typescript

ENV HOME=/home/app

COPY package.json package-lock.json tsconfig.json $HOME/twizo-lib-nodejs/

WORKDIR $HOME/twizo-lib-nodejs
RUN npm install
CMD [ "npm", "test" ]
