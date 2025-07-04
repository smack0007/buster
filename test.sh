#!/bin/bash
set -e
BUSTER_PATH="$(dirname $(realpath "${BASH_SOURCE[0]}"))"

BUSTER_COMMAND="${1:-}"

if [[ "${BUSTER_COMMAND}" = "" || "${BUSTER_COMMAND}" = "unit" ]]; then
  echo "=== Unit Tests ==="
  pushd ${BUSTER_PATH}/src > /dev/null
  ${BUSTER_PATH}/bin/buster test "${2:-**/*.test.ts}"
  if [ ! "$?" = "0" ]; then
    exit 1
  fi
  popd > /dev/null
fi

if [[ "${BUSTER_COMMAND}" = "" || "${BUSTER_COMMAND}" = "int" ]]; then
  echo "=== Integration Tests ==="
  pushd ${BUSTER_PATH}/tests > /dev/null
  ${BUSTER_PATH}/bin/buster test "${2:-**/*.test.ts}"
  if [ ! "$?" = "0" ]; then
    exit 1
  fi
  popd > /dev/null
fi