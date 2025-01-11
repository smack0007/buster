#!/bin/bash
set -eu
BUSTER_PATH="$(dirname $(realpath "${BASH_SOURCE[0]}"))"

# Calling buster like this will build itself and install node_modules.
BUSTER_VERBOSE=1 ${BUSTER_PATH}/bin/buster

echo "=== clicker ==="
cd "${BUSTER_PATH}/testdata/clicker"
BUSTER_VERBOSE=1 ${BUSTER_PATH}/bin/buster install

echo "=== hello-world ==="
cd "${BUSTER_PATH}/testdata/hello-world"
BUSTER_VERBOSE=1 ${BUSTER_PATH}/bin/buster install
