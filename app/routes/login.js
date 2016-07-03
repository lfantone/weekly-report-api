'use strict';
/**
 * Login form validation and processing. Used to
 * obtain an authorization JWT from username and
 * password credentials.
 *
 * @module routes/login
 */

const Joi = require('joi');
const validate = require('koa-joi-schema');
const co = require('bluebird').coroutine;
const authenticator = require('services/authenticator');
const users = require('services/users');

const validator = validate('request.body')(Joi.object().keys({
  username: Joi.string().trim().required(),
  password: Joi.string().trim()
    .min(5, 'utf-8').max(72, 'utf-8').empty('').required()
}));

module.exports = function(router) {
  /**
   * POST /login
   *
   * Validates username and password and fetches an existing
   * user matching those credentials. If a user is found, a JWT
   * is provided in the response as:
   *   { "success": true, "token": <jwt> } (HTTP 200).
   */
  router.post('/login', validator, (ctx, next) => co(function * () {
    try {
      // Fetch user from given credentials
      var user = yield users.login(ctx.request.body.username,
        ctx.request.body.password, ctx.request.ip);

      // Generate JWT from user data
      var jwt = yield authenticator.sign(user);
      ctx.status = 200;
      ctx.body = {
        success: true,
        token: jwt
      };
    } catch (err) {
      ctx.status = 401;
      ctx.body = {
        status: 401,
        success: false,
        message: err.message
      };
    }
    return next();
  })());
};
