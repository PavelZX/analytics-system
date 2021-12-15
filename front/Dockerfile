FROM node:latest as node

WORKDIR /app
COPY package.json /app/
RUN yarn --no-package-lock
COPY . /app/

CMD ["yarn", "run", "start"]
EXPOSE 4200