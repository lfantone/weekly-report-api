'use strict';
/**
 * Bundles configuration within a singleton object.
 * Uses peer dependency `nconf` to support command line parameters,
 * environment variables and external files or stores.
 *
 * @module lib/config
 */
const path = require('path');
const pck = require(path.join('..', '..', 'package'));
const nconf = require('nconf');

const DEFAULT_ENVIRONMENT = 'development';

nconf
  .env('_')
  .argv()
  .file({
    file: path.join(__dirname, 'properties.json')
  })
  .defaults({
    koa: {
      routes: {
        root: path.join(__dirname, '..', 'routes')
      }
    },
    logger: {
      label: pck.name
    },
    jwt: {
      unless: {
        path: [/\/status$/, /\/login$/]
      }
    },
    environment: process.env.NODE_ENV || DEFAULT_ENVIRONMENT
  });

module.exports = nconf;
