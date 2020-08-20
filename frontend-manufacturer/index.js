$(document).ready(function() {
    $('#viewUnsold').click(getUnsold);
    $('#releaseDevice').submit(releaseDevice);
    $('#viewDevice').submit(viewDevice);
});

const getUnsold = function(event) {
    $.ajax({
        url: 'http://localhost:3000/unsold',
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
        productInfo = '<li>Price: ' + product.price + '</li>';
        plistString = plistString + '<li id="' + product.manufacturer + product.name + '">' + '<ul>' + product.manufacturer + ' ' + product.name + productInfo + '</ul></li>';
    });
    plistString = plistString + '</ul>';

    $('#unsoldDevicesDiv').html(plistString);
}

const appendDevice = function(product) {
    let plist = $('#unsoldDevicesList').html();
    const productInfo = '<li>Price: ' + product.price + '</li>';
    let productString = '<li id="' + product.manufacturer + product.name + '">';
    productString = productString + '<ul>' + product.manufacturer + ' ' + product.name + productInfo + '</ul></li>';
    $('#unsoldDevicesList').html(plist + productString);
}

const releaseDevice = function(event) {
    event.preventDefault();

    const formData = $('#releaseDevice').serializeArray();
    const imeiString = formData[0].value;
    const manufacturerString = formData[1].value;
    const nameString = formData[2].value;
    const priceString = formData[3].value;
    const descriptionString = formData[4].value;
    $.ajax({
        url: 'http://localhost:3000/release',
        method: 'POST',
        data: JSON.stringify({
            imei: imeiString,
            manufacturer: manufacturerString,
            name: nameString,
            price: priceString,
            description: descriptionString
        }),
        contentType: 'application/json',
        success: function(data) {
            appendDevice(JSON.parse(data));
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
        url: 'http://localhost:3000/view?' + formData,
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
