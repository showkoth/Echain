$(document).ready(function() {
    $('#viewUnsold').click(getUnsold);
    $('#assembleDevice').submit(assembleNewDevice);
    $('#viewDevice').submit(viewDevice);
});


const getUnsold = function(event) {
    $.ajax({
        url: 'http://localhost:3002/unsold',
        method: 'GET',
        accepts: "application/json",
        success: function(data) {
            populateUnsoldDevices(data);
        },
        error: function(error) {
            alert(JSON.stringify(error));
        }
    });
}

const populateUnsoldDevices = function(products) {
    let plistString = '<ul id="unsoldDevicesList">Unsold Devices';
    products.forEach(function(product) {
        productInfo = '<li>Price: ' + product.imei + '</li>';
        plistString = plistString + '<li id="' + product.manufacturer + product.modelName + '">' + '<ul>' + product.manufacturer + ' ' + product.modelName + productInfo + '</ul></li>';
    });
    plistString = plistString + '</ul>';

    $('#unsoldDevicesDiv').html(plistString);
}

const appendDevice = function(product) {
    let plist = $('#unsoldDevicesList').html();
    const productInfo = '<li>Price: ' + product.price + '</li>';
    let productString = '<li id="' + product.manufacturer + product.modelName + '">';
    productString = productString + '<ul>' + product.manufacturer + ' ' + product.modelName + productInfo + '</ul></li>';
    $('#unsoldDevicesList').html(plist + productString);
}

const assembleNewDevice = function(event) {
    event.preventDefault();
    // var deviceDetails = ["imei", "modelName", "deviceType", "releaseDate", "simCards", "networkBands", "dimension", "display", "battery", "weight", "ram", "rom", "os", "chipset", "gpu", "camera", "sensors", "otherDescription", "price", "manufacturer"];
    const formData = $('#assembleDevice').serializeArray();
    // const companyString = formData[0].value;
    // const nameString = formData[1].value;
    // const priceString = formData[2].value;
    // var len = formData.length;
    $.ajax({
        url: 'http://localhost:3002/assemble',
        method: 'POST',
        data: JSON.stringify({
            
            imei: formData[0].value,
            assembler: formData[1].value

        }),
        contentType: 'application/json',
        success: function(data) {
            // appendDevice(JSON.parse(data));
            console.log('Executing assembler update');
        },
        error: function(error) {
            console.log(error);
        }
    });
}

const putDevice = function(product) {
    const productInfo = '<li>Description: ' + product.description + '<li>Assembler: ' + product.assembler + '<li>Distributor: ' + product.distributor + '<li>Shipment Status: ' + product.shipmentStatus + '<li>Price: ' + product.price + '</li><li>Current Owner: ' + product.currentOwner + '</li><li>Bought: ' + product.bought + '</li>';
    const productString = '<ul>' + product.manufacturer + ' ' + product.name + productInfo + '</ul>';
    $('#viewproductdetails').html(productString);
}

const viewDevice = function(event) {
    event.preventDefault();

    const formData = $(this).serialize();
    $.ajax({
        url: 'http://localhost:3002/view?' + formData,
        method: 'GET',
        accepts: 'application/json',
        success: function(data) {
            putDevice(JSON.parse(data));
        },
        error: function(error) {
            console.log(error);
        }
    });
}
