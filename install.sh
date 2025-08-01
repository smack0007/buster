#!/bin/bash
set -e

buster_debug() {
	[ "${BUSTER_VERBOSE}" = "1" ] && echo "$1"
	true
}

buster_error() {
	echo "error: $1" 1>&2
}

buster_download() {
  wget -q "$1" -O "$2"
}

buster_message() {
	echo "$1"
}

BUSTER_INSTALL_PATH="${HOME}/.buster"

if [ -d "${BUSTER_INSTALL_PATH}" ]; then
	buster_error "buster seems to be already installed at "${BUSTER_INSTALL_PATH}". Either remove the existing installation or upgrade it."
	exit 1
fi

if ! command -v wget >/dev/null || ! command -v jq >/dev/null; then
	buster_error "wget and jq are required to install buster."
	exit 1
fi

BUSTER_TAGS_JSON="$(wget -qO- https://api.github.com/repos/smack0007/buster/tags)"

BUSTER_LATEST_VERSION="$(
	echo "${BUSTER_TAGS_JSON}" |
	jq -r '.[].name' |
	sort |
	tail -n1
)"

buster_debug "Latest version of buster is ${BUSTER_LATEST_VERSION}"

BUSTER_LATEST_VERSION_URL="$(
	echo "${BUSTER_TAGS_JSON}" |
	jq -r ".[] | select(.name==\"${BUSTER_LATEST_VERSION}\").tarball_url"
)"

BUSTER_DOWNLOAD_PATH=$(mktemp -d)

buster_debug "Downloading ${BUSTER_LATEST_VERSION_URL} in ${BUSTER_DOWNLOAD_PATH}..."
cd "${BUSTER_DOWNLOAD_PATH}"
buster_download "${BUSTER_LATEST_VERSION_URL}" "buster.tar.gz"
tar xzf buster.tar.gz

BUSTER_DIRECTORY_NAME="$(
	find . -maxdepth 1 -type d |
	grep "buster"
)"

buster_debug "Moving ${BUSTER_DIRECTORY_NAME} to "${BUSTER_INSTALL_PATH}"..."
mv "${BUSTER_DIRECTORY_NAME}" "${BUSTER_INSTALL_PATH}"

buster_debug "Invoking buster for the first time..."
"${BUSTER_INSTALL_PATH}/bin/buster" --version

buster_message "Please ensure that "${BUSTER_INSTALL_PATH}/bin" is included in your \$PATH variable after starting a new session."
[ -f "${HOME}/.bashrc" ] && echo "PATH=\$PATH:${BUSTER_INSTALL_PATH}/bin" > ~/.bashrc && buster_message "=> updated \"${HOME}/.bashrc\""
[ -f "${HOME}/.zshrc" ] && echo "PATH=\$PATH:${BUSTER_INSTALL_PATH}/bin" > ~/.zshrc && buster_message "=> updated \"${HOME}/.zshrc\""

buster_message "To add buster to the current session run:"
buster_message "export PATH=\$PATH:${BUSTER_INSTALL_PATH}/bin"
