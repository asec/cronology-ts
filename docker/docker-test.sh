#!/bin/sh
echo "Node version: ${NODE_VERSION}"
cd /app && node ./dist/api cli-env-set dev && npm run test