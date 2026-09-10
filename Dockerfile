FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
COPY docs ./docs
EXPOSE 5000
CMD ["node", "src/server.js"]
