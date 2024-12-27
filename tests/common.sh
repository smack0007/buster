set -eu
BUSTER_PATH="$(realpath $(dirname $(realpath "${BASH_SOURCE[0]}"))/..)"
BUSTER_EXE=${BUSTER_PATH}/bin/buster
BUSTER_TESTDATA=${BUSTER_PATH}/testdata
BUSTER_TMP=${BUSTER_PATH}/tmp

BUSTER_GREEN=`tput setaf 2`
BUSTER_RED=`tput setaf 1`
BUSTER_RESET=`tput sgr0`

BUSTER_ERROR_PREFIX="${BUSTER_RED}error${BUSTER_RESET}: "

if [ -d "${BUSTER_TMP}" ]; then
  rm -rf ${BUSTER_TMP}
fi

buster_logAssertFailed() {
  echo -e "${BUSTER_RED}assert${BUSTER_RESET}: ${1}"
}

buster_expect_equal() {
  local actual="$1"
  local expected="$2"
  
  if [ ! "${actual}" = "${expected}" ]; then
    buster_logAssertFailed "expected '${actual}' to equal '${expected}'"
    exit 1
  fi
}

buster_expect_error() {
  local actual="$1"
  local expected="${2:-}"

  if [ ! "${actual:0:${#BUSTER_ERROR_PREFIX}}" = "${BUSTER_ERROR_PREFIX}" ]; then
    buster_logAssertFailed "expected '${actual}' to be an error"
    exit 1
  fi
  
  if [ ! "${expected}" == "" ]; then
    buster_expect_equal "${actual:${#BUSTER_ERROR_PREFIX}}" "$expected"
  fi
}
