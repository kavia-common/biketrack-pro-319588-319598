#!/bin/bash
cd /home/kavia/workspace/code-generation/biketrack-pro-319588-319598/web_mobile_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

