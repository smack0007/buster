#!/bin/bash

echo "node --disable-warning=ExperimentalWarning --experimental-transform-types ./testdata/hello-world"
/usr/bin/time -f "%M" ./ext/node-v22.13.1-linux-x64/bin/node --disable-warning=ExperimentalWarning --experimental-transform-types ./testdata/hello-world

echo "buster run ./testdata/hello-world"
/usr/bin/time -f "%M" buster run ./testdata/hello-world