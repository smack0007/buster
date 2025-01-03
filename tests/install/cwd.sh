source ../common.sh

cd "${BUSTER_TESTDATA}/clicker"
buster_expect_status_0 "$(${BUSTER_EXE} install)"

cd "${BUSTER_TESTDATA}/hello-world"
buster_expect_status_0 "$(${BUSTER_EXE} install)"