#!/bin/bash

BUSTER_PATH="$(dirname $(realpath "${BASH_SOURCE[0]}"))"
source "${BUSTER_PATH}/buster.env"

echo "node ${BUSTER_NODE_OPTIONS} ./testdata/hello-world"
/usr/bin/time -f "%M" ./ext/node-${BUSTER_NODE_VERSION}-linux-x64/bin/node ${BUSTER_NODE_OPTIONS} ./testdata/hello-world

echo "buster run ./testdata/hello-world"
/usr/bin/time -f "%M" buster run ./testdata/hello-world