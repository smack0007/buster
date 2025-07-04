#!/bin/bash
set -e
BUSTER_PATH="$(dirname $(realpath "${BASH_SOURCE[0]}"))"
cd ${BUSTER_PATH}/testdata/clicker
${BUSTER_PATH}/bin/buster script serve