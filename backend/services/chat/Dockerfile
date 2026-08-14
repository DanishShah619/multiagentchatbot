FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production --frozen-lockfile

COPY . .

EXPOSE 5002
CMD ["node", "index.js"]
