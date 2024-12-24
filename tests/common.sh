set -eu
BUSTER_PATH="$(realpath $(dirname $(realpath "${BASH_SOURCE[0]}"))/..)"
BUSTER_EXE=${BUSTER_PATH}/bin/buster
BUSTER_TESTDATA=${BUSTER_PATH}/testdata
BUSTER_TMP=${BUSTER_PATH}/tmp

if [ -d "${BUSTER_TMP}" ]; then
  rm -rf ${BUSTER_TMP}
fi

buster_expect_equal() {
  if [ ! "$1" = "$2" ]; then
    echo "'$1' != '$2'"
    exit 1
  fi
}
