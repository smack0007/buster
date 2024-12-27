source ../common.sh

cd "${BUSTER_TESTDATA}"
buster_expect_error "$(${BUSTER_EXE} check)" "The current directory does not contain a 'tsconfig.json' file. Not sure what to check."

cd "hello-world"
buster_expect_equal "$(${BUSTER_EXE} check)" ""