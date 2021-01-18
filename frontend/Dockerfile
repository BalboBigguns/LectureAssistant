FROM node:14.1-alpine AS base
WORKDIR /opt/web
COPY /app/package.json /app/package-lock.json ./
RUN npm install
ENV PATH="./node_modules/.bin:$PATH"

FROM base AS dev
WORKDIR /opt/web/app
CMD ["npm", "start"]


FROM base AS builder
COPY /app ./
ENV REACT_APP_API_URL "http://35.156.46.170:5000"
RUN npm run build

FROM nginx:1.17-alpine AS prod
RUN apk --no-cache add curl
RUN curl -L https://github.com/a8m/envsubst/releases/download/v1.1.0/envsubst-`uname -s`-`uname -m` -o envsubst && \
    chmod +x envsubst && \
    mv envsubst /usr/local/bin
COPY ./nginx.config /etc/nginx/nginx.template
CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
COPY --from=builder /opt/web/build /usr/share/nginx/html

