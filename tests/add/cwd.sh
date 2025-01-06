source ../common.sh

cd "${BUSTER_TESTDATA}/hello-world"
buster_expect_status_0 "$(${BUSTER_EXE} add is-number)"

git restore ./package.json