#!/bin/bash
set -e
BUSTER_PATH="$(dirname $(realpath "${BASH_SOURCE[0]}"))"
${BUSTER_PATH}/bin/buster check .