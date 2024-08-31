FROM node

WORKDIR /app

COPY package.json /app

RUN npm install

COPY ./ssl-certs /app/ssl-certs

EXPOSE 3333

CMD ["npm", "run", "dev"]
