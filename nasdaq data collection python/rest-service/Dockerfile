FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY server.js ./
COPY nvidia_eod_2024.json ./

RUN npm install

EXPOSE 5000

CMD ["node", "server.js"]