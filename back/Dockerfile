FROM node:latest

ENV TZ=Europe/Moscow

WORKDIR /app
COPY package.json /app/
RUN yarn --no-package-lock
COPY . /app/
COPY .docker.env /app/.env

CMD ["yarn", "run", "start"]
EXPOSE 3000