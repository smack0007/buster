source ../common.sh

buster_expect_equal "$(${BUSTER_EXE} run ${BUSTER_TESTDATA}/hello-world)" "Hello World!"