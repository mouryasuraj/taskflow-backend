# Stage 1
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app /app

RUN npm prune --production

EXPOSE 5000

CMD ["npm", "start"]