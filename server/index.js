const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

require('./service/database').setup();

require('./service/socket').setup(io);
require('./service/middleware')(app);
require('./service/router')(app);
require('./service/auth')(app);
require('./service/api')(app,io);

module.exports = server;
