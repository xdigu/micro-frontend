FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3002

ENV CHOKIDAR_USEPOLLING=1

CMD ["npm", "start", "--", "--poll", "1000", "--host", "0.0.0.0"]
