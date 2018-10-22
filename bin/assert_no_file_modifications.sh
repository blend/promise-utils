#!/bin/bash

status=`git status | grep modified`

if [[ ! -z $status ]]; then
    echo "Failing because files have been modified by tests"
    echo "$status"
    exit 1
fi
