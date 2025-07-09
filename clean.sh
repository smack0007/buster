#!/bin/bash
set -e
BUSTER_PATH="$(dirname $(realpath "${BASH_SOURCE[0]}"))"

# TODO: Clean ext folder and add option to only clean node_modules or ext based on arg.
rm -rf ${BUSTER_PATH}/testdata/clicker/node_modules
rm -rf ${BUSTER_PATH}/testdata/ffi/node_modules
rm -rf ${BUSTER_PATH}/testdata/hello-world/node_modules
rm -rf ${BUSTER_PATH}/node_modules