#!/bin/sh
set -e
BUSTER_PATH="$(dirname $(realpath "${BASH_SOURCE[0]}"))"
BUSTER_VERSION="$(cat ${BUSTER_PATH}/package.json | grep "version" | cut -d ":" -f 2 | tr -d '", ')"

BUSTER_NEW_VERSION=${1:-}
if [ "${BUSTER_NEW_VERSION}" = "" ]; then
  echo "Please provide a version number."
  exit 1
fi

sed -i "s/\"version\": \"${BUSTER_VERSION}\"/\"version\": \"${BUSTER_NEW_VERSION}\"/" "${BUSTER_PATH}/package.json"

# rm -rf "${BUSTER_PATH}/.github"
# rm -rf "${BUSTER_PATH}/.vscode"
# rm -rf "${BUSTER_PATH}/ext"
# rm -rf "${BUSTER_PATH}/node_modules"
# rm -rf "${BUSTER_PATH}/src"
# rm -rf "${BUSTER_PATH}/testdata"
# rm -rf "${BUSTER_PATH}/tests"
# rm "${BUSTER_PATH}/.oxlintrc.json"
# rm "${BUSTER_PATH}/.prettierrc.json"
# rm "${BUSTER_PATH}/node_modules.version"
# rm "${BUSTER_PATH}/todo.txt"
# rm "${BUSTER_PATH}/tsconfig.json"
# rm "${BUSTER_PATH}/*.sh"