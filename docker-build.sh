#!/bin/bash
set -e
. "$(dirname $(realpath "${BASH_SOURCE[0]}"))/buster.env"

cd ${BUSTER_PATH}

./build.sh

docker build \
  -t ${BUSTER_CONTAINER_NAME}:latest \
	-t ${BUSTER_CONTAINER_NAME}:${BUSTER_VERSION} \
  .