#!/bin/bash
BUSTER_PATH="$(dirname $(realpath "${BASH_SOURCE[0]}"))"

BUSTER_COMMAND="${1:-}"

if [[ "${BUSTER_COMMAND}" = "" || "${BUSTER_COMMAND}" = "unit" ]]; then
  echo "=== Unit Tests ==="
  pushd ${BUSTER_PATH} > /dev/null
  ${BUSTER_PATH}/bin/buster test "${2:-*}"
  if [ ! "$?" = "0" ]; then
    exit 1
  fi
  popd > /dev/null
fi

if [[ "${BUSTER_COMMAND}" = "" || "${BUSTER_COMMAND}" = "int" ]]; then
  echo "=== Integration Tests ==="
  BUSTER_TESTS_RESULT=0

  pushd ${BUSTER_PATH}/tests > /dev/null
  for directory in ${2:-*}/ ; do
    pushd $directory > /dev/null
    echo $directory
    for file in *.sh ; do
      BUSTER_TEST_OUTPUT="$(/bin/bash "$file")"
      if [ $? -eq 0 ]; then
        echo "  ✔ $file"
      else
        echo "  ✖ $file"
        echo "    ${BUSTER_TEST_OUTPUT}"
        BUSTER_TESTS_RESULT=1
      fi
    done
    popd > /dev/null
  done
  popd > /dev/null

  exit ${BUSTER_TESTS_RESULT}
fi