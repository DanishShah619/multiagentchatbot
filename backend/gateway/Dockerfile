FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files and install production dependencies
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy application source
COPY . .

EXPOSE 5000
CMD ["node", "index.js"]
