FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3003

ENV HOSTNAME=0.0.0.0

CMD ["npm", "run", "dev"]
