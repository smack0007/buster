source ../common.sh

buster_expect_equal "$(${BUSTER_EXE} run ${BUSTER_TESTDATA}/hello-world/src/main.ts)" "Hello World!"