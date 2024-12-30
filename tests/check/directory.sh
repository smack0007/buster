source ../common.sh

buster_expect_equal "$(${BUSTER_EXE} check ${BUSTER_TESTDATA}/hello-world)" ""