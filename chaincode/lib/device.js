'use strict';

/**
 * The Device model.
 */
class Device {

    constructor(imei, manufacturer, name, price, description, bought, assembler, distributor, retailer) {
        this.imei = imei;
        this.manufacturer = manufacturer;
        this.name = name;
        this.price = price;
        this.description = description;
        // parse the boolean value from a string.
        if (bought === 'true' || bought === true) {
            this.bought = true;
        } else {
            this.bought = false;
        }
        this.shipmentStatus = 'Device is at manufacturer end'
        this.currentOwner = manufacturer;
        var today = function(){
            var sp = "/";
            today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //As January is 0.
            var yyyy = today.getFullYear();
            if(dd<10) dd='0'+dd;
            if(mm<10) mm='0'+mm;
            return (dd+sp+mm+sp+yyyy);
        };
        this.mfgDate = today;
        this.assembler = assembler;
        this.distributor = distributor;
        this.retailer = retailer;

    }

    
    setAssembler(assembler){
        this.assembler = assembler;
    }

    getAssembler(){
        return this.assembler;
    }

    setDistributor(distributor){
        this.distributor = distributor;
    }

    getDistributor(){
        return this.distributor;
    }

    setRetailer(retailer){
        this.retailer = retailer;
    }

    setShipmentStatus(shipmentStatus){
        this.shipmentStatus = shipmentStatus;
    }

    getShipmentStatus(){
        return this.shipmentStatus;
    }

    setOwner(newOwner){
        this.currentOwner = newOwner;
    }

    getPrice() {
        return this.price;
    }

    setPrice(price) {
        this.price = price;
    }

    getDescription() {
        return this.description;
    }

    setDescription(description) {
        this.description = description;
    }

    getIsBought() {
        return this.bought;
    }

    setIsBought() {
        this.bought = true;
    }

    static deserialize(data) {
        return new Device(data.imei, data.manufacturer, data.name, data.price, data.description, data.bought, data.assembler, data.distributor, data.retailer, data.shipmentStatus, data.currentOwner, data.mfgDate);
    }
}

module.exports = Device;