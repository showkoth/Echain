'use strict';

// Fabric smart contract class
const { Contract } = require('fabric-contract-api');

// The Device model
const Device = require('./device.js');

/**
 * The e-chain smart contract
 */
class EChainContract extends Contract {

    /**
     * Initialize the ledger with a few products to start with.
     * @param {Context} ctx the transaction context.
     */
    async initLedger(ctx) {
        const products = [
            {
                imei: '111',
                manufacturer: 'Oppo',
                name: 'A 5',
                price: '1000',
                description: 'Smart Phone Android',
                bought: false
            },
            {
                imei: '222',
                manufacturer: 'Xiaomi',
                name: 'Mi 10',
                price: '500',
                description: 'Smart Phone Android',
                bought: false
            }
        ];

        for (let i = 0; i < products.length; i++) {
            await this.releaseDevice(ctx, products[i].imei, products[i].manufacturer, products[i].name, products[i].price, 
                products[i].description, products[i].bought);
        }

        return products;
    }

    /**
     * Release a new product into the store.
     * @param {Context} ctx The transaction context
     * @param {String} imei The imei for this product.
     * @param {String} manufacturer The manufacturer information.
     * @param {String} name The name of this product.
     * @param {String} price The product price
     * @param {String} description The description of the product.
     * @param {Boolean} bought Whether this product has been bought yet.
     */
    async releaseDevice(ctx, imei, manufacturer, name, price, description, bought, assembler, distributor, retailer) {
        // Create a composite key 'PROD{imei}' for this product.
        let key = ctx.stub.createCompositeKey('PROD', [imei]);
        // Create a new product object with the input data.
        const product = new Device(imei, manufacturer, name, price, description, bought, assembler, distributor, retailer);

        // Save the product in the datastore.
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(product)));

        return product;
    }

    /**
     * Buy a product from the store. The product must exist in the store first
     * and be unbought.
     * @param {String} ctx The transaction context.
     * @param {String} imei The product imei.
     * @param {String} newOwner The new description for the product.
     */
    async buyDevice(ctx, imei, newOwner) {
        // Retrieve the product from the store based on its imei and name.
        const key = ctx.stub.createCompositeKey('PROD', [imei]);
        const productAsBytes = await ctx.stub.getState(key);
        
        // Check whether the corresponding document in the data store exists.
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        // Deserialize the document into a product object.
        const product = Device.deserialize(JSON.parse(productAsBytes.toString()));

        // Check whether the product has already been bought.
        if (product.getIsBought()) {
            throw new Error(`${key} is not available for purchase`);
        }

        // Update the product in the data store.
        product.setOwner(newOwner);
        product.setIsBought();
        product.setShipmentStatus("Device is at consumer end");
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(product)));

        return product;
    }

    /**
     * Assembler receives the product and updates the status.
     * @param {String} ctx The transaction context.
     * @param {String} imei The product imei.
     * @param {String} assembler The assembler info related to the device.
     */
    async assembleDevice(ctx, imei, assembler) {
        // Retrieve the product from the store based on its imei.
        const key = ctx.stub.createCompositeKey('PROD', [imei]);
        const productAsBytes = await ctx.stub.getState(key);
        
        // Check whether the corresponding document in the data store exists.
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        // Deserialize the document into a product object.
        const product = Device.deserialize(JSON.parse(productAsBytes.toString()));

        // Update the product in the data store.
        product.setAssembler(assembler);
        // product.setDistributor(product.getDistributor());
        product.setShipmentStatus("Device is at assembler end");
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(product)));

        return product;
    }


     /**
     * Distributor receives the device and updates the status
     * @param {String} ctx The transaction context.
     * @param {String} imei The product imei.
     * @param {String} distributor The distributor info related to the device.
     */
    async distributeDevice(ctx, imei, distributor) {
        // Retrieve the product from the store based on its imei.
        const key = ctx.stub.createCompositeKey('PROD', [imei]);
        const productAsBytes = await ctx.stub.getState(key);
        
        // Check whether the corresponding document in the data store exists.
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        // Deserialize the document into a product object.
        const product = Device.deserialize(JSON.parse(productAsBytes.toString()));

        // Update the product in the data store.
        product.setDistributor(distributor);
        // product.setAssembler(product.getAssembler());
        product.setShipmentStatus("Device is at distributor end");
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(product)));

        return product;
    }


     /**
     * Distributor receives the device and updates the status
     * @param {String} ctx The transaction context.
     * @param {String} imei The product imei.
     * @param {String} retailer The retailer info related to the device.
     */
    async retailDevice(ctx, imei, retailer) {
        // Retrieve the product from the store based on its imei.
        const key = ctx.stub.createCompositeKey('PROD', [imei]);
        const productAsBytes = await ctx.stub.getState(key);
        
        // Check whether the corresponding document in the data store exists.
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        // Deserialize the document into a product object.
        const product = Device.deserialize(JSON.parse(productAsBytes.toString()));

        // Update the product in the data store.
        product.setRetailer(retailer);
        product.setShipmentStatus("Device is at retailer end");
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(product)));

        return product;
    }    


    /**
     * Retrieve information about a product.
     * @param {String} ctx The transaction context.
     * @param {String} imei The product imei.
     */
    async viewDevice(ctx, imei) {
        // Retrieve the product document from the data store based on its imei.
        const key = ctx.stub.createCompositeKey('PROD', [imei]);
        const productAsBytes = await ctx.stub.getState(key);
        
        // Check whether the product exists.
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        // Return the product information.
        return productAsBytes.toString();
    }

    /**
     * View all unsold products in the store.
     * @param {String} ctx The transaction context.
     */
    async viewUnsoldDevices(ctx) {
        // Retrieve all products stored in the data store.
        const results = [];
        for await (const result of ctx.stub.getStateByPartialCompositeKey('PROD', [])) {
            const strValue = Buffer.from(result.value).toString('utf8');            
            try {
                let product = Device.deserialize(JSON.parse(strValue));

                // Only include those products that haven't been bought yet.
                if (!product.getIsBought()) {
                    results.push(product);
                }
            } catch (error) {
                throw error;
            }
        }

        return results;
    }


}

module.exports = EChainContract;