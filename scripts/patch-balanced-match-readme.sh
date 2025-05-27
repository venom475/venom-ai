#!/bin/bash
# This script patches the balanced-match README.md to disable Liquid processing by adding YAML front matter

README_PATH="backend/node_modules/balanced-match/README.md"

if [ -f "$README_PATH" ]; then
  # Check if YAML front matter already exists
  if ! head -n 1 "$README_PATH" | grep -q "^---$"; then
    echo "Patching $README_PATH to add YAML front matter to disable Liquid processing..."
    sed -i '1i\
---\
# This file is excluded from Jekyll processing to avoid Liquid syntax errors\
---\
' "$README_PATH"
    echo "Patch applied successfully."
  else
    echo "YAML front matter already present in $README_PATH. No changes made."
  fi
else
  echo "File $README_PATH not found."
fi
