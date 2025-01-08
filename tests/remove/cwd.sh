source ../common.sh

cd "${BUSTER_TESTDATA}/hello-world"
buster_expect_status_0 "$(${BUSTER_EXE} add is-number)"
buster_expect_status_0 "$(${BUSTER_EXE} remove is-number)"

git restore ./package.json
rm ./pnpm-lock.yaml