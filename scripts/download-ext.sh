#!/bin/bash
set -eu
source "$(dirname $(realpath "${BASH_SOURCE[0]}"))/../buster.env"

if [ -d "${BUSTER_TMP_PATH}" ]; then
  rm -rf "${BUSTER_TMP_PATH}"
fi
mkdir -p ${BUSTER_TMP_PATH} && cd ${BUSTER_TMP_PATH}

if [ -d "${BUSTER_EXT_PATH}" ]; then
  echo "Exiting becuase ext already exists."
  exit 1
fi

mkdir -p "${BUSTER_EXT_PATH}"

buster_download() {
  echo "Downloading ${1}..."
  wget "${1}"
}

NODE_IDENTIFIER="node-v${BUSTER_NODE_VERSION}-${BUSTER_PLATFORM}"
NODE_DOWNLOAD_URL=https://nodejs.org/dist/v${BUSTER_NODE_VERSION}/${NODE_IDENTIFIER}.tar.gz

if ! buster_download "${NODE_DOWNLOAD_URL}"; then
  echo "Failed to download node from \"${NODE_DOWNLOAD_URL}\""
  exit
fi
tar xzf ${NODE_IDENTIFIER}.tar.gz
rm ${NODE_IDENTIFIER}.tar.gz
mv ${NODE_IDENTIFIER} node
mv node ${BUSTER_NODE_PATH}

NPM_EXE="${BUSTER_NODE_PATH}/bin/npm"
NPM_OPTIONS="--no-save --ignore-scripts"

${NPM_EXE} ${NPM_OPTIONS} i \
  @types/node@${BUSTER_TYPES_NODE_VERSION} \
  esbuild@${BUSTER_ESBUILD_VERSION} \
  typescript@${BUSTER_TYPESCRIPT_VERSION}

mv ./node_modules/@types "${BUSTER_TYPES_PATH}"
mv ./node_modules/esbuild "${BUSTER_ESBUILD_PATH}"
mv ./node_modules/typescript "${BUSTER_TYPESCRIPT_PATH}"

# Move undici-types into @types/node
mkdir -p "${BUSTER_TYPES_PATH}/node/node_modules" && mv ./node_modules/undici-types "${BUSTER_TYPES_PATH}/node/node_modules"

cd "${BUSTER_PATH}" && rm -rf "${BUSTER_TMP_PATH}"
