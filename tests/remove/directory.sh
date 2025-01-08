source ../common.sh

buster_expect_status_0 "$(${BUSTER_EXE} add --dir ${BUSTER_TESTDATA}/hello-world is-number)"
buster_expect_status_0 "$(${BUSTER_EXE} remove --dir ${BUSTER_TESTDATA}/hello-world is-number)"

git restore "${BUSTER_TESTDATA}/hello-world/package.json"
rm "${BUSTER_TESTDATA}/hello-world/pnpm-lock.yaml"