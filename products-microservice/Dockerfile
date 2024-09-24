FROM node:22-alpine3.19

WORKDIR /app

COPY package*.json ./
COPY entrypoint.sh ./

RUN yarn install

COPY . .

COPY .env /app/.env

RUN chmod +x /app
RUN chmod +x /app/entrypoint.sh

RUN npx prisma generate --schema=/app/src/database/prisma/schema.prisma 

RUN yarn build

EXPOSE 4500

ENTRYPOINT [ "/app/entrypoint.sh", "yarn", "start:prod" ]