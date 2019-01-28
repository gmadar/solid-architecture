FROM mhart/alpine-node:10.10.0
RUN apk add --no-cache curl bash vim
EXPOSE 7001

COPY ./app /app

WORKDIR /app

RUN yarn install

HEALTHCHECK --interval=5s --timeout=60s --retries=10 CMD curl -f http://localhost:7001/api/health || exit 1
