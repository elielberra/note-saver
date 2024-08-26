FROM node

WORKDIR /app

COPY package.json /app

RUN npm install

# COPY server.key /app
# COPY server.crt /app

EXPOSE 3333

CMD ["npm", "run", "dev"]
