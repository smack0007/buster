#!/bin/bash
set -e
BUSTER_PATH="$(dirname $(realpath "${BASH_SOURCE[0]}"))"

# Calling buster like this will install everything.
BUSTER_VERBOSE=1 ${BUSTER_PATH}/bin/buster --version

echo "=== clicker ==="
cd "${BUSTER_PATH}/testdata/clicker"
BUSTER_VERBOSE=1 ${BUSTER_PATH}/bin/buster install

echo "=== ffi ==="
cd "${BUSTER_PATH}/testdata/ffi"
BUSTER_VERBOSE=1 ${BUSTER_PATH}/bin/buster install

echo "=== hello-world ==="
cd "${BUSTER_PATH}/testdata/hello-world"
BUSTER_VERBOSE=1 ${BUSTER_PATH}/bin/buster install
