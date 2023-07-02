# saratov-tycoon
service mongod start

pm2 start ./node_modules/react-scripts/scripts/start.js --name "saratov-tycoon-front"

pm2 start ./src/index.js --name "saratov-tycoon-back"

npm install --prefer-offline --no-audit --progress=false
