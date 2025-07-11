#!/bin/bash
set -e
. "$(dirname $(realpath "${BASH_SOURCE[0]}"))/buster.env"

DOCKER_FLAGS="--rm -v ${BUSTER_REPO_PATH}:/app -v /app/ext -v /app/node_modules ${DOCKER_FLAGS}"

if [[ ! "${DOCKER_FLAGS}" == *" -w "* ]]; then
  DOCKER_FLAGS="${DOCKER_FLAGS} -w /app"
fi

if [[ ! "${CI}" = "1" ]]; then 
  DOCKER_FLAGS="${DOCKER_FLAGS} -it"
fi

DOCKER_INIT_CMD="ln -s /usr/local/buster/ext/* /app/ext/ && ln -s /usr/local/buster/node_modules/* /app/node_modules/ && ln -s /usr/local/buster/node_modules/.bin /app/node_modules/.bin && ln -s /usr/local/buster/node_modules/.pnpm /app/node_modules/.pnpm"
DOCKER_CMD=${1:-/bin/bash}

cd ${BUSTER_REPO_PATH}
docker run ${DOCKER_FLAGS} ${BUSTER_CONTAINER_NAME}:${BUSTER_CONTAINER_TAG} /bin/bash -c "${DOCKER_INIT_CMD} && ${DOCKER_CMD}"