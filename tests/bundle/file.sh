source ../common.sh

buster_expect_file "$(${BUSTER_EXE} bundle ${BUSTER_TESTDATA}/hello-world/src/main.ts -o ${BUSTER_TMP}/bundle.js)" "${BUSTER_TMP}/bundle.js"