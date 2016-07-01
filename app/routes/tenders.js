'use strict';
/**
 * Implementation of /tenders endpoints.
 * Provides read-only methods for listing tenders
 * for the authenticated user.
 *
 * @module routes/tenders
 */
const co = require('bluebird').coroutine;
const tenders = require('services/tenders');

module.exports = function(router) {
  /**
   * GET /tenders
   *
   * Fetches a list of tenders from the
   * database associated with the authenticated
   * user.
   */
  router.get('/tenders', (ctx, next) => co(function * () {
    ctx.body = yield tenders.getAllFor(ctx.state.user);
    return next();
  })());

  /**
   * GET /tenders/:id
   *
   * Fetches one tender, given its identifier,
   * from the list of tenders associated to the
   * authenticated user.
   */
  router.get('/tenders/:id', (ctx, next) => co(function * () {
    ctx.body = yield tenders.getOneFor(ctx.params.id, ctx.state.user);
    return next();
  })());
};
