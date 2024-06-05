FROM     node:20 as base
COPY     . /app/

FROM     base as test

FROM     base as builder
WORKDIR  /app
RUN      npm install && npm run build && mkdir /pkg && mv dist package.json package-lock.json /pkg/



FROM     base
RUN      useradd -m -U -d /app -s /bin/bash app
WORKDIR  /app
COPY     --chown=app:app --from=builder /pkg /app/ 
RUN      npm install
USER     app
CMD      ["node", "dist/main", "2>&1"]