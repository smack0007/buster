MAKEFILE_PATH := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

NODE_EXE := ./ext/node/bin/node
NODE_OPTIONS := --strip-types

.PHONY: test
test:
	$(NODE_EXE) $(NODE_OPTIONS) --test './tests/**/*.ts'