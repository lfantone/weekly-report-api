'use strict';
/**
 * Configured MSSQL connection to geobras database.
 * Exported connection is not connected.
 *
 * @module services/mssql
 */
const _ = require('lodash');
const sql = require('mssql');
const Promise = require('bluebird');
const log = require('logger');
const config = require('config').get('mssql');

const CONNECTION_STRING = `mssql://${config.server}/${config.database}`;
const SHUTDOWN_SIGNALS = ['SIGINT', 'SIGTERM'];
sql.Promise = Promise;

let connection = new sql.Connection(config);
let connector = {
  acquire() {
    return Promise.try(() => {
      if (this.connected) {
        return this;
      } else {
        return this.connect()
          .then(() => {
            log.info(`Connected to ${CONNECTION_STRING}`);
            return this;
          });
      }
    });
  }
};

connection.on('error', (err) =>
  log.error(`Connection to ${CONNECTION_STRING} errored`, err));

// Listen for TERM (e.g. kill) and INT (e.g. Ctrl+C) signals
// and close connection.
SHUTDOWN_SIGNALS.forEach((sig) => {
  process.once(sig, () => connection.close(function() {
    log.warn(`Closed connection to ${CONNECTION_STRING}`);
  }));
});

module.exports = _.extend(Object.create(connection), connector);
