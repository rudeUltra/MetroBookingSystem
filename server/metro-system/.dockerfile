# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

# Copy only production files
COPY package*.json ./
RUN npm install --omit=dev

# Copy built code from the builder stage
COPY --from=builder /app/dist ./dist

# Render uses port 10000 by default, but Nest usually uses 3000. 
# We'll make it flexible.
EXPOSE 3000

CMD ["node", "dist/main"]