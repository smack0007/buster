#!/bin/bash
set -eu
BUSTER_PATH="$(dirname $(realpath "${BASH_SOURCE[0]}"))"

${BUSTER_PATH}/bin/buster run ./node_modules/esbuild/bin/esbuild --bundle --platform=node --format=esm --outfile="dist/cli.js" ./src/cli.ts

if [[ "${CI}" = "1" ]]; then
  rm ./src/cli.ts
fi