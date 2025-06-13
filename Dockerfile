FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 52577

CMD ["npm", "run", "dev", "--", "--host"]