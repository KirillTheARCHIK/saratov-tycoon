# saratov-tycoon

service mongod start

pm2 start ./node_modules/react-scripts/scripts/start.js --name "saratov-tycoon-front"

pm2 start ./src/index.js --name "saratov-tycoon-back"

npm install --prefer-offline --no-audit --progress=false

"cors": "^2.8.5",
"crypto-js": "^4.2.0",
"dotenv": "^16.4.7",
"micromq": "^3.0.2",
"mongodb": "^6.12.0",
"leaflet": "^1.9.4"
