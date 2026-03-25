#!/bin/bash
set -eu
source "$(dirname $(realpath "${BASH_SOURCE[0]}"))/../buster.env"

mkdir -p ${BUSTER_TMP_PATH} && cd ${BUSTER_TMP_PATH}

# TODO: If ext exists maybe we shouldn't continue.
mkdir -p "${BUSTER_EXT_PATH}"

buster_download() {
  echo "Downloading ${1}..."
  wget "${1}"
}

NODE_IDENTIFIER="node-${BUSTER_NODE_VERSION}-${BUSTER_PLATFORM}"
NODE_DOWNLOAD_URL=https://nodejs.org/dist/${BUSTER_NODE_VERSION}/${NODE_IDENTIFIER}.tar.gz

if ! buster_download "${NODE_DOWNLOAD_URL}"; then
  echo "Failed to download node from \"${NODE_DOWNLOAD_URL}\""
  exit
fi
tar xzf ${NODE_IDENTIFIER}.tar.gz
rm ${NODE_IDENTIFIER}.tar.gz
mv ${NODE_IDENTIFIER} node
mv node ${BUSTER_NODE_PATH}

rm -rf "${BUSTER_TMP_PATH}"