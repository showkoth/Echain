'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

let ccp;
let wallet;

async function initialize() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '../..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('distributor');
        if (!identity) {
            console.log('An identity for the user "distributor" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
    } catch (error) {
        console.error(`Failed to initialize: ${error}`);
        process.exit(1);
    }
}

async function viewUnsold() {
    try {
        // create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'distributor', discovery: { enabled: true, asLocalhost: true } });

        // get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // get the contract from the network.
        const contract = network.getContract('echain');

        // evaluate the specified transaction.
        //const result = await contract.submitTransaction('releaseDevice', 'tplink', 'router', '100', 'tplink', false);
        const result = await contract.evaluateTransaction('viewUnsoldDevices');
        //const result = await contract.evaluateTransaction('viewDevice', 'tplink', 'router');
        console.log(`Transaction has been evaluated. Result is: ${result.toString()}`);

        await gateway.disconnect();

        return result;
    } catch (error) {
        console.error(`viewUnsold: Failed to evaluate transaction: ${error}`);
        return error;
    }
}

async function viewDevice(imei) {
    try {
        // create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'distributor', discovery: { enabled: true, asLocalhost: true } });

        // get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // get the contract from the network.
        const contract = network.getContract('echain');

        // evaluate the specified transaction.
        const result = await contract.evaluateTransaction('viewDevice', imei);
        console.log(`Transaction has been evaluated. Result is: ${result.toString()}`);

        await gateway.disconnect();

        return result;
    } catch (error) {
        console.error(`viewDevice: Failed to evaluate transaction: ${error}`);
        return error
    }
}

async function distributeDevice(imei, distributor) {
    try {
        // create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'distributor', discovery: { enabled: true, asLocalhost: true } });

        // get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // get the contract from the network.
        const contract = network.getContract('echain');

        // evaluate the specified transaction.
        var shipmentStatus = 'Device is now at distributor end'
        const result = await contract.submitTransaction('distributeDevice', imei, distributor);
        console.log(`Transaction has been evaluated. Result is: ${result.toString()}`);

        await gateway.disconnect();

        return result;
    } catch (error) {
        console.error(`releaseDevice: Failed to evaluate transaction: ${error}`);
        return error;
    }
}

exports.initialize = initialize;
exports.viewUnsold = viewUnsold;
exports.viewDevice = viewDevice;
exports.distributeDevice = distributeDevice;
