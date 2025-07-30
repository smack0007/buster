#!/bin/bash
set -e
. "$(dirname $(realpath "${BASH_SOURCE[0]}"))/buster.env"

cd ${BUSTER_PATH}

./build.sh

BUSTER_VERSION="$(cat ${BUSTER_PATH}/package.json | grep "version" | cut -d ":" -f 2 | tr -d '", ')"
BUSTER_RELEASE_PATH=$(mktemp -d)

cd ${BUSTER_RELEASE_PATH}

# BUSTER_NEW_VERSION=${1:-}
# if [ "${BUSTER_NEW_VERSION}" = "" ]; then
#   echo "Please provide a version number."
#   exit 1
# fi

# sed -i "s/\"version\": \"${BUSTER_VERSION}\"/\"version\": \"${BUSTER_NEW_VERSION}\"/" "${BUSTER_PATH}/package.json"

git clone ${BUSTER_PATH} . --branch=releases
cp -r ${BUSTER_PATH}/bin         ./bin
cp -r ${BUSTER_PATH}/dist        ./dist
cp -r ${BUSTER_PATH}/templates   ./templates
cp ${BUSTER_PATH}/buster.env     ./buster.env
cp ${BUSTER_PATH}/package.json   ./package.json
cp ${BUSTER_PATH}/pnpm-lock.yaml ./pnpm-lock.yaml
git add -A && git commit -m "v${BUSTER_VERSION}" && git push 

# Now the release commit has been pushed back to the current repo
cd ${BUSTER_RELEASE_PATH}
git push 
# TODO: Figure out how to push the tag
# git tag -a v${BUSTER_VERSION} -m "$(date +%Y-%m-%d)"
# git push origin tag 
