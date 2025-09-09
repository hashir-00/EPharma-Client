#!/bin/bash

# Toggle Mock Mode Script

ENV_FILE=".env.development"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE not found"
    exit 1
fi

CURRENT_MODE=$(grep "VITE_MOCK_MODE" "$ENV_FILE" | cut -d'=' -f2)

if [ "$CURRENT_MODE" = "true" ]; then
    sed -i 's/VITE_MOCK_MODE=true/VITE_MOCK_MODE=false/' "$ENV_FILE"
    echo "Mock mode disabled (VITE_MOCK_MODE=false)"
else
    sed -i 's/VITE_MOCK_MODE=false/VITE_MOCK_MODE=true/' "$ENV_FILE"
    echo "Mock mode enabled (VITE_MOCK_MODE=true)"
fi

echo "Please restart the development server for changes to take effect."
