source ../common.sh

buster_expect_status_0 "$(${BUSTER_EXE} install --dir ${BUSTER_TESTDATA}/clicker)"
rm "${BUSTER_TESTDATA}/clicker/pnpm-lock.yaml"

buster_expect_status_0 "$(${BUSTER_EXE} install --dir ${BUSTER_TESTDATA}/hello-world)"
rm "${BUSTER_TESTDATA}/hello-world/pnpm-lock.yaml"