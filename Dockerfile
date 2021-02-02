FROM node:14.15-alpine 

WORKDIR /app 

COPY package.json .
RUN yarn
COPY . .
EXPOSE 5000

CMD ["yarn", "start:dev"]