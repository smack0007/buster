source ../common.sh

cd ${BUSTER_TESTDATA}/hello-world
buster_expect_equal "$(${BUSTER_EXE} script run bob)" "Hello bob!"
buster_expect_equal "$(${BUSTER_EXE} script run:bob)" "Hello Bob!"
buster_expect_equal "$(${BUSTER_EXE} script run:bob joe)" "Hello Bob joe!"