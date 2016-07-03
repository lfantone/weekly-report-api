'use strict';
/**
 * Implementation of /reports endpoints.
 * Allows saving/creating new reports belonging
 * to the authenticated user.
 *
 * @module routes/reports
 */
const co = require('bluebird').coroutine;
const reports = require('services/reports');

module.exports = function(router) {
  /**
   * POST /reports
   *
   * Creates a new report.
   */
  router.post('/reports', (ctx, next) => co(function * () {
    ctx.body = yield reports.save(ctx.request.body, ctx.state.user);
    return next();
  })());
};
