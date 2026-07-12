FROM node:18-slim

RUN apt-get update -y \
  && apt-get install -y openssl ca-certificates \
  && update-ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate
RUN yarn build

ENV NODE_ENV=production

USER node

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
