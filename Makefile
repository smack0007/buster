BUSTER_PATH := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

NODE_EXE := ./ext/node/bin/node
NODE_OPTIONS := --strip-types --import ./src/preload.ts

.PHONY: test
test:
	BUSTER_PATH="$(BUSTER_PATH)" $(NODE_EXE) $(NODE_OPTIONS) --test './tests/**/*.test.ts'