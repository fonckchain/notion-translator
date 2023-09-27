#!/bin/bash

# Uninstall any existing global installation of notion-translator
npm uninstall --location=global notion-translator &&

# Remove any existing notion-translator tarballs
rm -f notion-translator-*.tgz &&

# Create a new tarball of the current notion-translator package
npm pack &&

# Install the new tarball globally
npm install --location=global ./notion-translator-*.tgz
