'use strict';
/**
 * An example mu-koan app with minimal setup.
 *
 * Run it with `node app.js [--koa.port=3000 --koa.hostname=localhost]`
 */
const path = require('path');
require('app-module-path').addPath(path.join(__dirname, 'app'));
const config = require('config');
const log = require('logger');
const server = require('server');

// Starts Koa server
server.listen(config.get('koa:port'), config.get('koa:hostname'), () => {
  var addr = server.address();
  log.info('✔ Koa server listening on %s:%s [%s]', addr.address,
    addr.port, config.get('environment'));
});

module.exports = server;
