'use strict';
/**
 * Configures a Koa app and exports a node `http` server.
 *
 * @module server
 */
const Koa = require('koa');
const logger = require('logger');

module.exports = require('mu-koan')(new Koa(), { logger });
