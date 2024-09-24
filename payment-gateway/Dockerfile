FROM node:22-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 5560

CMD ["yarn", "start:prod"]
