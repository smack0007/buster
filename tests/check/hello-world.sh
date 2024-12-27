source ../common.sh

buster_expect_equal "$(${BUSTER_EXE} check -p ${BUSTER_TESTDATA}/hello-world/tsconfig.json)" ""