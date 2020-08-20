'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3002;

const admin = require('./enrollAdmin.js');
const user = require('./registerUser.js');
const query = require('./query.js');

async function init() {
    app.use(cors())
    app.use(express.json());

    await connect();

    app.get('/', (req, res) => res.send('Hello World!'));

    app.get('/unsold', (req, res) => unsoldRoute(req, res));

    app.get('/view', (req, res) => viewDeviceRoute(req, res));

    app.post('/assemble', (req, res) => assembleDeviceRoute(req, res));

    app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
}

async function connect() {
    await admin.enroll();
    await user.register();
}

async function unsoldRoute(req, res) {
    try {
        await query.initialize();
        const result = await query.viewUnsold();
	res.setHeader('Content-Type', 'application/json');
        res.status(200).send(result);
    } catch (error) {
        console.error(`error on unsoldRoute: ${error}`);
    }
}

async function viewDeviceRoute(req, res) {
    try {
        await query.initialize();
        const result = await query.viewDevice(req.query.imei);
        res.status(200).send(result);
    } catch (error) {
        console.error(`error on viewDeviceRoute: ${error}`);
    }
}

async function assembleDeviceRoute(req, res) {
    try {
        await query.initialize();
        const result = await query.assembleDevice(req.body.imei, req.body.assembler);
        res.status(200).send(result);
    } catch (error) {
        console.error(`error on releaseDeviceRoute: ${error}`);
    }
}

init();
