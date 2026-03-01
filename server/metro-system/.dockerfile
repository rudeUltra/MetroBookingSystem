FROM node:20-alpine AS builder
WORKDIR /app

# These files are now in the "current" directory because of the Root Directory setting
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist

# Final sanity check: Render uses 10000 by default, 
# but we force it to 3000 to match our EXPOSE and NestJS main.ts
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/main"]