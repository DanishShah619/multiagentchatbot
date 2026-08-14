FROM node:20-alpine

# Install OS-level dependencies needed by pdf-parse and canvas modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production --frozen-lockfile

COPY . .

# Create temp directory for multer file uploads
RUN mkdir -p /app/temp

EXPOSE 5003
CMD ["node", "index.js"]
