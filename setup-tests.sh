#!/bin/sh
# Setup script for running tests
set -e

# Install dependencies
npm install

# Run tests
npm test
