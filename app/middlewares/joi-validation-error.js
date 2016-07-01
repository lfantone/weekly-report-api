'use strict';
/**
 * Sets status HTTP 400 for errors propagated
 * from Joi schema validations
 *
 * @module middlewares/joi-validation-error
 */
const co = require('bluebird').coroutine;

module.exports = function validationError() {
  return (ctx, next) => co(function * () {
    try {
      yield next();
    } catch (e) {
      if (e.isJoi) {
        e.isJoi = undefined;
        e.status = 400;
        e.success = false;
      }
      throw e;
    }
  })();
};
