FROM node:20-alpine

RUN apk add --no-cache openssl libc6-compat


WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN ./node_modules/.bin/prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
