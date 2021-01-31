FROM node:lts-alpine

WORKDIR /app

CMD ["npm", "run", "start:dev"]