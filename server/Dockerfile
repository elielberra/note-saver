FROM node:20.14-alpine

WORKDIR /app

COPY package.json /app

RUN npm install --legacy-peer-deps

EXPOSE 3333

CMD ["npm", "run", "dev"]
