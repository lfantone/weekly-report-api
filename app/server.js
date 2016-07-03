'use strict';
/**
 * Configures a Koa app and exports a node `http` server.
 *
 * @module server
 */
const Koa = require('koa');
const middlewares = require('mu-koan');
const router = require('mu-koan-router');
const server = require('mu-koan-server');
const joi = require('middlewares/joi-validation-error');
const config = require('config').get();

// Create Koa app instance
let app = new Koa();

// Declare default middlewares like
// error handling, JWT support and body parsing.
// See https://www.npmjs.com/package/mu-koan
middlewares.bootstrap(app, config);

// Configure additional "global" middlewares
app.use(joi());

// Setup routes using controllers found
// on ./routes directory
router.declareRoutes(app, config.koa.routes);

// Create http server and export it
module.exports = server.createServer(app, config);
