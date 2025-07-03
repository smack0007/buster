#!/bin/bash
set -e
. "$(dirname $(realpath "${BASH_SOURCE[0]}"))/buster.env"

cd ${BUSTER_REPO_PATH}
docker build \
  -t ${BUSTER_CONTAINER_NAME}:latest \
  .