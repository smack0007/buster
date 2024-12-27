source ../common.sh

buster_expect_error "$(${BUSTER_EXE} check ${BUSTER_TESTDATA}/hello-world/src/main.ts)"