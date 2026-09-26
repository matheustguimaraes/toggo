FROM node:18

WORKDIR /react_app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 5000

CMD ["yarn", "dev"]
