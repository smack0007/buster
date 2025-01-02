#!/bin/bash
set -eu
BUSTER_PATH="$(dirname $(realpath "${BASH_SOURCE[0]}"))"
BUSTER_VERBOSE=1 ${BUSTER_PATH}/bin/buster