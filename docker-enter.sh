#!/bin/bash
set -e
. "$(dirname $(realpath "${BASH_SOURCE[0]}"))/buster.env"

DOCKER_FLAGS="--rm -v $(realpath $1):/app ${DOCKER_FLAGS}"

if [[ ! "${DOCKER_FLAGS}" == *" -w "* ]]; then
  DOCKER_FLAGS="${DOCKER_FLAGS} -w /app"
fi

if [[ ! "${CI}" = "1" ]]; then 
  DOCKER_FLAGS="${DOCKER_FLAGS} -it"
fi

cd ${BUSTER_REPO_PATH}
echo ${DOCKER_FLAGS}
docker run ${DOCKER_FLAGS} ${BUSTER_CONTAINER_NAME}:${BUSTER_CONTAINER_TAG}