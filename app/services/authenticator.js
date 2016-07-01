'use strict';
/**
 * Leverages seneca acts to authenticate a user
 * given a generated code.
 *
 * @module services/authenticator
 */
const config = require('config').get('jwt:options');
const Promise = require('bluebird');
const jwt = Promise.promisifyAll(require('jsonwebtoken'));

// Module API
module.exports = {
  sign
};

/**
 * Creates a JWT token containing the given payload.
 *
 * @method sign
 * @param  {Object|String}  payload Data contained in the token.
 * @return {Promise}
 */
function sign(payload) {
  return jwt.signAsync(payload, config.secret, config.options);
}
