/* eslint-disable no-console */
const logger = require('winston');
const http = require('http');
const app = require('./app');
const port = app.get('port');


const wsPort = process.env.wsport || 4038

const socketServer = http.createServer().listen(wsPort);
app.setup(socketServer);
const server = http.createServer(app).listen(port);




//const server = app.listen(port);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
);
