#!/bin/sh
set -eu
BUSTER_PATH="$(dirname $(realpath "${BASH_SOURCE[0]}"))"
${BUSTER_PATH}/bin/buster lint .