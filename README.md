# echain
A decentralized supply chain traceability system for electronics market using HL fabric v2.1.1

Dependencies:

• Hyperledger Fabric v2.1.1

• Node v10.19.0 or higher

• npm v6.14.4 or greater

• Java 8

• Docker 19.03.12 or greater

• Docker Compose v1.25.0 or greater

• git, curl

• Ubuntu 20.04

• VS code IDE


1. Install the dependencies

2. Download fabric binaries 

curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.1.1 1.4.7

3. Download this project

cd fabric-samples

git clone <this repo>
  
cd echain
  
4. Download node.js modules

cd chaincodecurl -sSL https://bit.ly/2ysbOFE | bash -s

npm install

cd ..

cd backend-manufacturer

npm install

cd backend-....

5. Start the network

cd fabric-samples/test-network

./network.sh up createChannel -ca -s couchdb

6. Install the chaincode

./deployCC_echain.sh

7. Run node.js servers

cd fabric-samples/echain/backend-manufacturer

node app.js
.
.
.
.
8. Run the front-end application

cd fabric-samples/echain/frontend-manufacturer

open index.html with any browser
.
.
.
.

9. Interact with the network

All done! Now go chill!


