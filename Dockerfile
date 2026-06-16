FROM node:22-alpine

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc

EXPOSE 3005
CMD ["node", "dist/index.js"]
