FROM node:10-alpine as builder

COPY ./package.json ./

RUN npm i && mkdir /ng-app && mv ./node_modules ./ng-app

WORKDIR /ng-app

COPY . ./
RUN $(npm bin)/ng build --prod --output-path=dist

####

FROM ati/nginx-1.16.1
WORKDIR /usr/share/nginx/html

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /ng-app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]