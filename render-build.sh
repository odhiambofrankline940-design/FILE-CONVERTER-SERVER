#!/usr/bin/env bash
# Exit on error
set -o errexit

# Update system packages and install ffmpeg + libreoffice
apt-get update && apt-get install -y ffmpeg libreoffice

# Install Node.js dependencies
npm install
