FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

# Use Vite dev server for hot-reload during development
CMD ["npm", "run", "dev"]
