#!/bin/bash
chmod +x node_modules/.bin/tsc
chmod +x node_modules/.bin/vite
npx tsc && npx vite build