#!/bin/bash

# Define the source and destination branches/remotes
SOURCE_REMOTE="origin"
SOURCE_BRANCH="dev"
DEST_LOCAL_BRANCH="proxy-dev"

echo "--- Fetching latest changes from $SOURCE_REMOTE/$SOURCE_BRANCH ---"
git fetch $SOURCE_REMOTE

echo "--- Switching to $DEST_LOCAL_BRANCH ---"
git checkout $DEST_LOCAL_BRANCH

echo "--- Merging updates from $SOURCE_REMOTE/$SOURCE_BRANCH ---"
git merge $SOURCE_REMOTE/$SOURCE_BRANCH

if [ $? -eq 0 ]; then
    echo "--- Merge successful. Ready to resolve conflicts or push ---"
else
    echo "--- Conflicts detected. Please resolve conflicts manually before pushing. ---"
fi
