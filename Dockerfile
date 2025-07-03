FROM debian:bookworm-slim
LABEL maintainer="Zachary Snow <zachary.snow+docker@gmail.com>"

WORKDIR /usr/local/buster
COPY ./bin ./bin
COPY ./lib ./lib
COPY ./src ./src
COPY ./buster.env ./buster.env
COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml

ENV PATH="$PATH:/usr/local/buster/bin"

RUN set -eux; \
			arch="$(dpkg --print-architecture)"; arch="${arch##*-}"; \
    apt-get update && apt-get upgrade -qqy && apt-get install --no-install-recommends -y ca-certificates wget && \
		ls -la /usr/local/buster && \
		BUSTER_VERBOSE=1 /usr/local/buster/bin/buster --version