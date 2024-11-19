#! /bin/bash

#if ! find test2/ -mindepth 1 | read; then
#  echo "No test2 found"
#  exit 0
#fi

#if ! find test2/ -mindepth 1 | read; then
#  mkdir -p test2/
#  echo "made test2/"
#fi


DIRECTORY="test2"

if [ -d "$DIRECTORY" ]; then
    echo "Directory '$DIRECTORY' exists."
else
    echo "Directory '$DIRECTORY' does not exist."
fi
