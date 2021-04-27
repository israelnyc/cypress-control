const socket = require('socket.io-client')(
    `http://localhost:${process.env['CYPRESS_CONTROL_PORT']}`
);

module.exports.socket = socket;
