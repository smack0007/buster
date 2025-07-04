#!/bin/bash
set -e
. "$(dirname $(realpath "${BASH_SOURCE[0]}"))/buster.env"

DOCKER_FLAGS="--rm -v $(realpath ${BUSTER_REPO_PATH}):/app ${DOCKER_FLAGS}"

if [[ ! "${DOCKER_FLAGS}" == *" -w "* ]]; then
  DOCKER_FLAGS="${DOCKER_FLAGS} -w /app"
fi

if [[ ! "${CI}" = "1" ]]; then 
  DOCKER_FLAGS="${DOCKER_FLAGS} -it"
fi

DOCKER_CMD=${1:-/bin/bash}

cd ${BUSTER_REPO_PATH}
docker run ${DOCKER_FLAGS} ${BUSTER_CONTAINER_NAME} ${DOCKER_CMD}