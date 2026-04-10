include $(dir $(realpath $(lastword $(MAKEFILE_LIST))))/buster.env
BUSTER_PATH := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

# Determine the shared library extension based on the platform
ifeq ($(shell uname -s),Linux)
  SHARED_LIB_EXT = .so
else ifeq ($(shell uname -s),Darwin)
  SHARED_LIB_EXT = .dylib
else
  $(error Unsupported operating system)
endif

NODE_EXE := ./ext/node/bin/node
NODE_OPTIONS := --strip-types --import ./src/preload.ts

ext:
	./scripts/download-ext.sh

ext/webview/libwebview$(SHARED_LIB_EXT):
	mkdir ./tmp
	git clone --branch $(BUSTER_WEBVIEW_VERSION) --depth 1 git@github.com:webview/webview.git ./tmp/webview
	cd ./tmp/webview && \
		cmake -G "Ninja Multi-Config" -B build -DWEBVIEW_BUILD_AMALGAMATION=0 -DWEBVIEW_BUILD_EXAMPLES=0 -DWEBVIEW_BUILD_DOCS=0 -DWEBVIEW_BUILD_TESTS=0 -DWEBVIEW_BUILD_SHARED_LIBRARY=1 -S . && \
		cmake --build build --config Release
	mkdir -p ./ext/webview && mv ./tmp/webview/build/core/Release/libwebview.$(BUSTER_WEBVIEW_VERSION)$(SHARED_LIB_EXT) ./ext/webview/libwebview$(SHARED_LIB_EXT)
	rm -rf ./tmp

build: ext

.PHONY: test
test:
	BUSTER_PATH="$(BUSTER_PATH)" $(NODE_EXE) $(NODE_OPTIONS) --test './lib/**/*.test.ts'
	BUSTER_PATH="$(BUSTER_PATH)" $(NODE_EXE) $(NODE_OPTIONS) --test './tests/**/*.test.ts'