#!/bin/sh
BUSTER_PATH="$(dirname $(realpath "${BASH_SOURCE[0]}"))"
${BUSTER_PATH}/bin/buster check -p ${BUSTER_PATH}/tsconfig.json