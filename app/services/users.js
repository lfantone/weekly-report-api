'use strict';
/**
 * Manages user login and credentials.
 *
 * @module services/users
 */
const sql = require('mssql');
const connection = require('./mssql-connection');

const ID_SITE = 3;
const ID_ROL = 7;

module.exports = {
  login
};

/**
 * Fetches a user from the database
 * given its credentials.
 * @param  {String} username The username of the user
 * @param  {String} password The matching password
 * @param  {String} ip Client's IP address
 * @return {Promise}
 */
function login(username, password, ip) {
  return connection.acquire()
    .then((conn) => new sql.Request(conn)
      .input('idsite', sql.Int, ID_SITE)
      .input('usuario', sql.VarChar(50), username)
      .input('clavevarchar', sql.VarChar(50), password)
      .input('idrol', sql.Int, ID_ROL)
      .execute('login')
      .then((result) => {
        if (result.length && result[0].length) {
          return registerLogin(result[0][0], ip);
        } else {
          throw new Error('Invalid username or password');
        }
      }));
}

function registerLogin(user, ip) {
  return connection.acquire()
    .then((conn) => new sql.Request(conn)
      .input('idsite', sql.Int, ID_SITE)
      .input('log', sql.VarChar(50), `Acceso: ${user.usuario}`)
      .input('http', sql.Text, `Remote_ADDR: ${ip}`)
      .input('idusuariom', sql.Int, user.id)
      .execute('login_registro')
      .then(() => user));
}
